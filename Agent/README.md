# Agent Plugins for GrandTotal

An agent plugin powers **Ask GrandTotal**: it connects GrandTotal's Web Access to an AI agent that runs as a command-line program on the Mac. A question typed (or dictated with the keyboard's microphone) in the **Ask GrandTotal** tab of the web app on the phone goes to the Mac; GrandTotal starts the agent CLI headless, and the agent works on the document **only** through GrandTotal's built-in MCP server, with a token that is issued for this one conversation. The plugin is the adapter: it finds the CLI, builds its command line and translates its output into events for the page.

## Key Characteristics

- **Type**: `agent`
- **Where it appears**: the **Ask GrandTotal** popup in the MCP server settings of a document, and the Ask GrandTotal tab of the web app on the phone
- **Not gated on the plugin licence**: agents belong to Web Access, like the web app itself. They need GrandTotal's MCP server — the feature, the server running, and the document's MCP access not set to "none"
- **No records, no document in the script**: the plugin runs in a plain JavaScript context with a handful of globals (below). It never touches data — the agent does, through MCP
- **Built-in adapters**: Claude Code, Codex and Gemini CLI ship with GrandTotal. Their `index.js` headers describe the exact command lines and are the best further reference
- **Sample**: [Goose (Ollama)](Goose%20(Ollama).grandtotalplugin/) — a local model in Ollama, driven by [Goose](https://github.com/block/goose). Written from the Goose sources, not run against a real Goose and Ollama: a starting point, not a tested adapter

## Choosing the Agent

In GrandTotal, open the document's settings → **MCP Server**. The **Ask GrandTotal** row, below the document's access level, is there while the MCP server is on, an agent CLI is installed (or one is chosen) and the document's MCP access is not "none":

- **Ask GrandTotal** popup: "None" (the default), then every agent plugin whose `detect()` finds its CLI. A chosen agent that is no longer installed stays selected, greyed out as "(not installed)".
- **Model**: only for a plugin whose `Info.plist` declares `AgentModelPlaceholder`. The value is passed to `command()` as `options.model`; empty means the plugin's default, shown as placeholder.
- **Test**: runs the chosen agent once, read-only, with a fixed question.

What a run may do is the document's MCP permission combined with the phone's **Allow changes** switch:

| MCP server of the document | Device may change | Run |
| --- | --- | --- |
| Off | any | no agent |
| Read only | any | read-only |
| Full | no | read-only |
| Full | yes | full |

## Conversations

The questions of one device about one document are a **conversation**. It keeps its scoped token, a private folder (0700) that is the CLI's working directory for every run, and the CLI's own session id. It ends when the page starts a new conversation, after 30 minutes without a question, when the agent or the access level changes, when the device is removed, or when GrandTotal quits — then the token is revoked and the folder deleted.

The token only works for this one document, only for the tools of its access level, and only while the conversation lives. A read-only run does not even see `create_records`. In a full run the agent creates drafts only (never `dateSent`), and it may change and delete only the records it created in this conversation. The MCP server enforces all of this itself; the plugin's allow lists are the second lock.

One run per document at a time; a run ends after 5 minutes at the latest.

## Plugin Structure

```
My Agent.grandtotalplugin/
├── Info.plist
└── index.js
```

The folder name is the name in the popup (localizable like any plugin name).

### Info.plist

```xml
<key>CFBundleIdentifier</key>
<string>com.example.agent.myagent</string>   <!-- stored as the document's agent -->
<key>CFBundleVersion</key>
<string>1.0</string>
<key>GrandTotalMinimumVersion</key>
<integer>9</integer>
<key>types</key>
<array>
    <string>agent</string>
</array>
<key>AgentModelPlaceholder</key>                <!-- optional -->
<string>qwen3</string>
```

| Key | Meaning |
| --- | --- |
| `types` | `agent` |
| `CFBundleIdentifier` | What the document's setting names. Use your own — a plugin in your library replaces a built-in one with the same identifier. |
| `AgentModelPlaceholder` | Optional. The plugin takes a model: the settings show a **Model** field, with this value — the model `command()` uses without one — as placeholder. Without the key there is no field. |

No `JSModuleContext`: `index.js` is a classic script, and its top-level functions are the interface.

## The Script Context

A plain JavaScript context — not the one other plugin types get: no `query()`, no records, no HTTP. One context for detection and one per run; the context of a run lives from `command()` through every `parseLine()` of that run, so top-level variables carry state between calls and start fresh with the next run.

| Global | Meaning |
| --- | --- |
| `which(name)` | The first executable `name` on the user's **login shell PATH** (a GUI app does not inherit it), or `null`. Bare command names only. |
| `isExecutable(path)` | A runnable file (`~` expanded; not a directory, not a dangling link). |
| `resolvedPath(path)` | The final target of a symlink chain — Homebrew links commands into its `bin` folder, the formula is in the target. |
| `homeDirectory` | The user's home folder. |
| `log(message)` | Writes to the system log. |

## Functions

### `detect()`

Returns the path of the CLI, or `null` when it is not installed. GrandTotal caches the answer; a miss is asked again after a minute, so a CLI installed meanwhile shows up.

```js
function detect() {
	var aCandidates = [homeDirectory + "/.local/bin/mycli"];
	var aFound = which("mycli");
	if (aFound) {
		aCandidates.push(aFound);
	}
	for (var i = 0; i < aCandidates.length; i++) {
		if (isExecutable(aCandidates[i])) {
			return aCandidates[i];
		}
	}
	return null;
}
```

### `command(options)`

Returns the command of one run:

```js
{
	executable: "/path/to/cli",    // optional, defaults to what detect() found
	arguments: ["run", "--json"],  // required, strings only
	environment: { KEY: "value" }, // optional, added to GrandTotal's environment and the login PATH
	files: { "config/cli.yaml": "…" }, // optional, written 0600 into the run's folder
	input: "…"                     // optional, written to stdin, then closed; without it stdin is empty
}
```

`files` takes relative paths inside the run's folder only (no absolute paths, no `..`).

| Option | Meaning |
| --- | --- |
| `prompt` | The question from the phone. |
| `instructions` | What GrandTotal tells the agent: the document, tools only, answer short in the language of the question, read-only or not. Pass it as the CLI's system prompt or ahead of the prompt. |
| `executable` | What `detect()` found. |
| `mcpServerName` | `"grandtotal"`. |
| `mcpURL` | The MCP server's local HTTP address. |
| `mcpToken` | The conversation's scoped token, sent as `Authorization: Bearer <token>`. |
| `mcpConfigPath` | A ready `mcp.json` in the run's folder (Claude's format, token in the header). |
| `tools` | The tool names of this run's scope — repeat them in the CLI's allow list. |
| `readOnly` | `true` for a read-only run. |
| `maxTurns` | The turn limit to pass to the CLI. |
| `workingDirectory` | The run's folder (0700): the CLI's working directory, holding only `mcp.json` and your `files`. The same folder for every run of a conversation. |
| `model` | The **Model** field of the settings, or `""` — then use your default (the `AgentModelPlaceholder` value). |
| `sessionId` | The id you reported with a `session` event in an earlier run of this conversation, or `null` on its first question — then start a new CLI session, otherwise resume that one. |
| `history` | `[{prompt, answer}]` of the conversation's answered questions, oldest first. For a CLI that cannot resume a session: put them ahead of the prompt. |

### `parseLine(line)`

Called for every line the CLI writes to stdout. Returns `null`, one event or an array of events:

| Event | Meaning |
| --- | --- |
| `{type: "text", text}` | Something the agent said on the way. |
| `{type: "tool", tool, detail}` | A tool call: `tool` is the MCP tool's name without prefixes, `detail` its arguments as JSON. |
| `{type: "result", text, cost}` | The final answer (`cost` optional). |
| `{type: "error", text}` | The end without an answer. |
| `{type: "session", id}` | Not shown on the phone. GrandTotal keeps `id` (up to 200 characters) with the conversation and passes it as `options.sessionId` to the next run. Emit it once the CLI's session exists and can be resumed. |

Emit exactly one `result` or `error` at the end. If neither comes, GrandTotal ends the run with the tail of the CLI's stderr as the error — a CLI that is not logged in usually says so there.

```js
function parseLine(line) {
	var aEvent;
	try {
		aEvent = JSON.parse(line);
	} catch (e) {
		return null;
	}
	if (aEvent.type === "tool_call") {
		return { type: "tool", tool: aEvent.name, detail: JSON.stringify(aEvent.arguments || {}) };
	}
	if (aEvent.type === "done") {
		return [{ type: "session", id: aEvent.session }, { type: "result", text: aEvent.text }];
	}
	return null;
}
```

## Rules for an Adapter

- **The MCP server and nothing else.** No shell, no file tools, no web, none of the user's own MCP servers, settings, hooks or project files. Use the CLI's own allow/deny mechanism and repeat `options.tools` there.
- **Pre-approve this one server's tools, refuse the rest.** Nobody is at the Mac to approve a tool call.
- **Never replace the CLI's home or config folder if it holds the login.** Point the CLI at run-local config instead (a file in `files`, an environment variable, a command-line flag).

## Testing

Choose the agent in the MCP server settings (**Ask GrandTotal**) and click **Test**: one read-only run with a fixed question; the answer or the error comes up in an alert. Then ask from the phone. `log()` output and GrandTotal's own messages about the run appear in Console.app.
