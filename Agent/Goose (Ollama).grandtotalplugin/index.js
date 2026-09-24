// Agent adapter: a local model in Ollama, driven by Goose (Block's agent CLI).
//
// Ollama itself has no MCP client, so something has to run the agent loop
// around the model. Goose does that with Ollama as a first-class provider
// (it passes the context size to Ollama per request — a long tool list cut
// off by Ollama's small default context is the usual reason tool calls fail
// with local models), speaks streamable HTTP to MCP servers, runs headless
// with JSON lines that stream as the model writes, and is one native binary.
// The runner-up, opencode, only goes through Ollama's OpenAI-compatible
// endpoint and prints a text block when it is finished.
//
//   GOOSE_PATH_ROOT=<run>/goose GOOSE_DISABLE_KEYRING=1 GOOSE_MODE=auto
//   goose run --name grandtotal [--resume] --quiet --output-format stream-json
//             --provider ollama --model <model> --max-turns N
//             --system <instructions> -i -          (prompt on stdin)
//
// - GOOSE_PATH_ROOT points config, data and state at the run's folder, so
//   the user's ~/.config/goose is neither read nor touched. The config there
//   enables one extension — GrandTotal's MCP server, with its header — and
//   nothing else: no `developer` (shell, files), no other built-in. A new
//   session loads exactly the enabled extensions. Not `--no-profile`: that
//   would drop the config and with it the header; the command line cannot
//   carry one.
// - `available_tools` repeats the run's scope; the MCP server hides the
//   write tools of a read-only run anyway.
// - GOOSE_MODE=auto: nobody is there to approve a tool call.
// - The model is the document's `agentModel` (the "Model" field of the Web
//   Access settings, there because Info.plist declares AgentModelPlaceholder),
//   else qwen3 (Goose's default for Ollama, the same value as that key). It
//   has to be pulled in Ollama and able to call tools.
// - A conversation: its sessions live in the SQLite database under
//   GOOSE_PATH_ROOT (<run>/goose/data/sessions), which belongs to this one
//   conversation, so one fixed name is enough. The first question creates the
//   session with `--name grandtotal` (with `--resume` it would fail: "No
//   session found"), every later one adds `--resume`. No stream-json event
//   carries a session id; parseLine() says `session` with the name when the
//   run is complete. A resumed session takes its extensions from the
//   database, not from config.yaml — the token in the header is the
//   conversation's and does not change.
//
// Written from the Goose 1.52 sources (September 2026, crates/goose-cli
// cli.rs and session/mod.rs); parseLine() checked against lines built from
// Goose's event schema, never run against a real Goose and Ollama. A sample
// to start from, not a tested adapter.

/// Goose from the curl installer or from Homebrew's `block-goose-cli` — not
/// the database migration tool that Homebrew also calls `goose`. And an
/// Ollama next to it; without one there is no model to ask.
function detect() {
	var aOllama = which("ollama") || (isExecutable("/Applications/Ollama.app/Contents/Resources/ollama") ? "ollama.app" : null);
	if (!aOllama) {
		return null;
	}
	var aCandidates = [homeDirectory + "/.local/bin/goose"];
	var aFound = which("goose");
	if (aFound) {
		aCandidates.push(aFound);
	}
	aCandidates.push("/opt/homebrew/bin/goose", "/usr/local/bin/goose");
	for (var i = 0; i < aCandidates.length; i++) {
		if (isExecutable(aCandidates[i]) && String(resolvedPath(aCandidates[i])).indexOf("/Cellar/goose/") < 0) {
			return aCandidates[i];
		}
	}
	return null;
}

/// A YAML string: a JSON string is a valid double-quoted YAML scalar.
function yamlString(value) {
	return JSON.stringify(String(value));
}

/// The one session of a conversation, by name (see above).
var SESSION_NAME = "grandtotal";

function command(options) {
	var aModel = options.model || "qwen3";
	var aServer = options.mcpServerName;
	var aConfig = ["GOOSE_PROVIDER: ollama",
	               "GOOSE_MODEL: " + yamlString(aModel),
	               "GOOSE_MODE: auto",
	               "GOOSE_INPUT_LIMIT: 32768",
	               "GOOSE_DISABLE_KEYRING: true",
	               "extensions:",
	               "  " + aServer + ":",
	               "    enabled: true",
	               "    type: streamable_http",
	               "    name: " + aServer,
	               "    uri: " + yamlString(options.mcpURL),
	               "    headers:",
	               "      Authorization: " + yamlString("Bearer " + options.mcpToken),
	               "    timeout: 300",
	               "    available_tools: [" + options.tools.map(yamlString).join(", ") + "]",
	               ""].join("\n");
	var aRoot = options.workingDirectory + "/goose";
	var aArguments = ["run", "--name", SESSION_NAME];
	if (options.sessionId) {
		aArguments.push("--resume");
	}
	aArguments.push("--quiet",
	                "--output-format", "stream-json",
	                "--provider", "ollama", "--model", aModel,
	                "--max-turns", String(options.maxTurns),
	                "--system", options.instructions,
	                "-i", "-");
	return { executable: options.executable,
	         arguments: aArguments,
	         environment: { GOOSE_PATH_ROOT: aRoot,
	                        GOOSE_DISABLE_KEYRING: "1",
	                        GOOSE_MODE: "auto" },
	         files: { "goose/config/config.yaml": aConfig },
	         input: options.prompt };
}

/// `grandtotal__get_records` → `get_records`.
function toolName(name) {
	var aParts = String(name || "").split("__");
	return aParts[aParts.length - 1];
}

/// The assistant's text since the last tool call; it streams in pieces, and
/// the part after the last tool call is the answer.
var gText = "";

function parseLine(line) {
	var aEvent;
	try {
		aEvent = JSON.parse(line);
	} catch (e) {
		return null;
	}
	if (aEvent.type === "message" && aEvent.message && aEvent.message.role === "assistant"
	    && Array.isArray(aEvent.message.content)) {
		var aEvents = [];
		aEvent.message.content.forEach(function (block) {
			if (block.type === "text" && block.text) {
				gText += block.text;
			}
			else if (block.type === "toolRequest") {
				if (gText.trim().length > 0) {
					aEvents.push({ type: "text", text: gText.trim() });
				}
				gText = "";
				var aCall = (block.toolCall && block.toolCall.value) || {};
				aEvents.push({ type: "tool", tool: toolName(aCall.name), detail: JSON.stringify(aCall.arguments || {}) });
			}
		});
		return aEvents;
	}
	if (aEvent.type === "error") {
		return { type: "error", text: typeof aEvent.error === "string" ? aEvent.error : JSON.stringify(aEvent.error) };
	}
	if (aEvent.type === "complete") {
		return [{ type: "session", id: SESSION_NAME }, { type: "result", text: gText.trim() }];
	}
	return null;
}
