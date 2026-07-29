/*
	Keep in mind that you can't use browser specific calls. Use following calls

	--Loading httpContents--
	loadURL(method,url,headers);

	--Logging to the Console--
	log(value);

	--Base64--
	base64Encode(string);

	Expected result is a JSON string representation of an array.

	[
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.toggle.233283908"},
		{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.toggle.233275239"}
	]

	Make *sure* the uid you provide is not just a plain integer.

	Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

	Returning a string will present it as warning.

	To see how to add global variables (Settings) look at the Info.plist of this sample.

	Keep in mind that for security reasons passwords are stored in the keychain and
	you will have to enter them again after modifying your code.

*/

timedEntries();

function httpGetJSON(theUrl) {
	header = { "X-Api-Key": token };
	string = loadURL("GET", theUrl, header);
	if (string.length == 0) {
		return null;
	}

	try {
		grandtotal.sleep(0.05);
	} catch (error) {}

	try {
		return JSON.parse(string);
	} catch (error) {
		return { "grandtotal_error": "Unexpected response from " + theUrl + ":\n" + string.substring(0, 500) };
	}
}

function httpPostJSON(theUrl, theBody) {
	// theBody must be passed as object — loadURL serializes it as JSON itself;
	// passing a pre-serialized string makes the request fail with HTTP 406
	var aHeader = { "X-Api-Key": token, "Content-Type": "application/json" };
	var aString = loadURL("POST", theUrl, aHeader, theBody);
	if (!aString || aString.length == 0) {
		return null;
	}

	try {
		grandtotal.sleep(0.05);
	} catch (error) {}

	try {
		return JSON.parse(aString);
	} catch (error) {
		return { "grandtotal_error": "Unexpected response from " + theUrl + ":\n" + aString.substring(0, 500) };
	}
}

// Returns a human readable error string for a failed response, null otherwise.
// On HTTP errors loadURL wraps the response as
// {"grandtotal_error":"Error","http_error":406,"server_error":{"message":...},"server_response":...}
function errorText(theParsed) {
	if (!theParsed) {
		return "Clockify returned an empty response. Check your settings, please";
	}
	if (theParsed["grandtotal_error"]) {
		if (theParsed["server_error"] && theParsed["server_error"]["message"]) {
			return "Clockify: " + theParsed["server_error"]["message"];
		}
		if (theParsed["server_response"]) {
			return "Clockify: " + String(theParsed["server_response"]).substring(0, 500);
		}
		return theParsed["grandtotal_error"];
	}
	if (theParsed["message"]) {
		return "Clockify: " + theParsed["message"];
	}
	return null;
}

function timedEntries() {
	var result = [];
	var aArray = httpGetJSON("https://api.clockify.me/api/v1/user");

	var aUserError = errorText(aArray);
	if (aUserError) {
		return aUserError;
	}

	var aWorkspaceID = aArray["activeWorkspace"];

	var aWorkspaces = httpGetJSON("https://api.clockify.me/api/v1/workspaces/");
	var aWorkspaceName = "";
	var aWorkspaceHourlyRate = 0;

	for (aWorkspaceIndex in aWorkspaces) {
		var aWorkspace = aWorkspaces[aWorkspaceIndex];

		if (aWorkspace["id"] == aWorkspaceID) {
			aWorkspaceName = aWorkspace["name"];
			if (aWorkspace["hourlyRate"]) {
				aWorkspaceHourlyRate = aWorkspace["hourlyRate"]["amount"];
			}
		}
	}

	var aTagsLookup = {};
	var page = 1;
	do {
		var aTags = httpGetJSON(
			"https://api.clockify.me/api/v1/workspaces/" + aWorkspaceID + "/tags?page-size=5000&page=" + page
		);
		for (aTagsIndex in aTags) {
			aTag = aTags[aTagsIndex];
			aTagID = aTag["id"];
			aTagsLookup[aTagID] = aTag;
		}
		page++;
		// aTags may be an error object without length (e.g. rate limit) — only arrays continue the loop
	} while (Array.isArray(aTags) && aTags.length != 0);

	// Rate fallback for free plan workspaces: since 04/2026 the report API
	// omits rate/costRate there entirely, while previously entered project
	// rates are still readable via the v1 endpoints. Projects are loaded
	// lazily (one bulk request) on the first entry without a rate, so paid
	// plans cost no extra request. Tasks stay per-project requests — only
	// fetched when the cascade is still empty (free plan budget: 30 req/h).
	var aProjectLookup = null;

	function projectForID(theProjectID) {
		if (aProjectLookup == null) {
			aProjectLookup = {};
			var aProjectPage = 1;
			do {
				var aProjects = httpGetJSON(
					"https://api.clockify.me/api/v1/workspaces/" +
						aWorkspaceID +
						"/projects?page-size=5000&page=" +
						aProjectPage
				);
				for (var aProjectIndex in aProjects) {
					var aProject = aProjects[aProjectIndex];
					aProjectLookup[aProject["id"]] = aProject;
				}
				aProjectPage++;
				// a partial page is the last one — saves the empty-page request
			} while (Array.isArray(aProjects) && aProjects.length == 5000);
		}
		return aProjectLookup[theProjectID];
	}

	var aTasksLookup = {};
	var aTasksLoadedForProject = {};

	function taskForID(theProjectID, theTaskID) {
		if (!aTasksLoadedForProject[theProjectID]) {
			aTasksLoadedForProject[theProjectID] = true;
			var aTasks = httpGetJSON(
				"https://api.clockify.me/api/v1/workspaces/" +
					aWorkspaceID +
					"/projects/" +
					theProjectID +
					"/tasks?page-size=5000"
			);
			for (var aTasksIndex in aTasks) {
				var aLoadedTask = aTasks[aTasksIndex];
				aTasksLookup[aLoadedTask["id"]] = aLoadedTask;
			}
		}
		return aTasksLookup[theTaskID];
	}

	function rateAmount(theRateDict) {
		if (theRateDict && theRateDict["amount"]) {
			return theRateDict["amount"];
		}
		return 0;
	}

	// Most specific cheap source wins: project member > project > task >
	// workspace member > workspace. Task rates come after project rates
	// (unlike Clockify's own precedence) because they cost one request per
	// project — only worth it when everything cheaper resolved to 0.
	// Returns {rate, costRate} in cents.
	function fallbackRates(theEntry) {
		var aResolved = { rate: 0, costRate: 0 };
		var aProjectID = theEntry["projectId"];
		var aEntryUser = aUserLookup[theEntry["userId"]];

		if (aEntryUser) {
			for (var aMembershipIndex in aEntryUser["memberships"]) {
				var aMembership = aEntryUser["memberships"][aMembershipIndex];
				if (aMembership["targetId"] == aProjectID) {
					aResolved.rate = rateAmount(aMembership["hourlyRate"]);
					aResolved.costRate = rateAmount(aMembership["costRate"]);
				}
				if (aMembership["membershipType"] == "WORKSPACE" && aResolved.costRate == 0) {
					aResolved.costRate = rateAmount(aMembership["costRate"]);
				}
			}
		}

		if (aResolved.rate == 0 && aProjectID) {
			var aProject = projectForID(aProjectID);
			if (aProject) {
				aResolved.rate = rateAmount(aProject["hourlyRate"]);
			}
		}

		if (aResolved.rate == 0 && theEntry["taskId"] && aProjectID) {
			var aTask = taskForID(aProjectID, theEntry["taskId"]);
			if (aTask) {
				aResolved.rate = rateAmount(aTask["hourlyRate"]);
			}
		}

		if (aResolved.rate == 0 && aEntryUser) {
			for (var aMembershipIndex in aEntryUser["memberships"]) {
				var aMembership = aEntryUser["memberships"][aMembershipIndex];
				if (aMembership["membershipType"] == "WORKSPACE") {
					aResolved.rate = rateAmount(aMembership["hourlyRate"]);
				}
			}
		}

		if (aResolved.rate == 0) {
			aResolved.rate = aWorkspaceHourlyRate;
		}

		return aResolved;
	}

	//// Expenses

	var page = 1;
	var aUserLookup = {};

	do {
		var aUsers = httpGetJSON("https://api.clockify.me/api/v1/workspaces/" + aWorkspaceID + "/users?page=" + page);

		for (aUserIndex in aUsers) {
			aUser = aUsers[aUserIndex];
			aUserID = aUser["id"];
			aUserLookup[aUserID] = aUser;
		}
		page++;
	} while (Array.isArray(aUsers) && aUsers.length != 0);

	for (aUserIndex in aUserLookup) {
		aUser = aUserLookup[aUserIndex];
		aUserName = aUser["name"];
		aUserID = aUser["id"];

		var page = 1;
		do {
			var aEntries = httpGetJSON(
				"https://api.clockify.me/api/v1/workspaces/" +
					aWorkspaceID +
					"/expenses/?page=" +
					page +
					"&userId=" +
					aUserID
			);
			for (aEntriesIndex in aEntries) {
				aEntry = aEntries[aEntriesIndex];

				if (aEntry.expenses) {
					for (aExpense of aEntry.expenses) {
						aItem = {};

						if (aExpense.billable == 0) {
							continue;
						}

						aItem.startDate = aExpense.date;
						aItem.uid = "me.clockify." + aExpense.id;
						aItem.notes = aExpense.notes;

						var aProject = aExpense.project;
						if (aProject) {
							aItem.project = aProject.name;
							aItem.client = aProject.clientName;
						}

						var aCategory = aExpense.category;
						if (aCategory) {
							aItem.category = aCategory.name;
						}

						aItem.cost = aExpense.total / 100;
						aItem["user"] = aUserName + " (" + aWorkspaceName + ")";

						result.push(aItem);
					}
				}
			}
			page++;
		} while (Array.isArray(aEntries) && aEntries.length != 0 && page < 3);
	}

	//// Time Entries
	//
	// Fetched via the detailed report, which delivers project, client, task,
	// user and rates inline — no per-project lookups needed. The free plan
	// only accepts report ranges up to 30 days, so the 180 day window is
	// requested in 30 day chunks. Chunk borders may overlap by one entry,
	// hence the dedup via aSeenUIDs.

	var aChunkDays = 30;
	var aChunkCount = 6;
	var aPageSize = 1000;
	var aDayMillis = 24 * 60 * 60 * 1000;
	var aNow = new Date();
	var aSeenUIDs = {};

	for (var aChunkIndex = 0; aChunkIndex < aChunkCount; aChunkIndex++) {
		var aChunkEnd = new Date(aNow.getTime() - aChunkIndex * aChunkDays * aDayMillis);
		var aChunkStart = new Date(aChunkEnd.getTime() - aChunkDays * aDayMillis);

		var page = 1;
		do {
			var aReport = httpPostJSON(
				"https://reports.api.clockify.me/v1/workspaces/" + aWorkspaceID + "/reports/detailed",
				{
					dateRangeStart: aChunkStart.toISOString(),
					dateRangeEnd: aChunkEnd.toISOString(),
					billable: true,
					detailedFilter: { page: page, pageSize: aPageSize },
				}
			);

			var aReportError = errorText(aReport);
			if (aReportError) {
				// With partial results (e.g. rate limit mid-import) keep what we
				// have: notify about the error and return the entries so far.
				// Returning the error string instead would discard them.
				if (result.length > 0) {
					displayUserNotification(
						"Clockify",
						localize("Import incomplete. Only the entries fetched so far were imported.") + "\n" + aReportError
					);
					return result;
				}
				return aReportError;
			}

			var aEntries = aReport["timeentries"];
			if (!aEntries) {
				aEntries = [];
			}

			for (aEntriesIndex in aEntries) {
				aItem = {};
				aEntry = aEntries[aEntriesIndex];

				if (aEntry["billable"] == 0) {
					continue;
				}
				if (!aEntry["timeInterval"]) {
					continue;
				}

				// duration is in seconds; 0 is a valid value (instant entries),
				// only running timers (null) are skipped
				var aSeconds = aEntry["timeInterval"]["duration"];
				if (aSeconds == null || aSeconds < 0) {
					continue;
				}

				aEntryID = "me.clockify." + aEntry["_id"];
				if (aSeenUIDs[aEntryID]) {
					continue;
				}
				aSeenUIDs[aEntryID] = true;

				var aMinutes = Math.ceil(aSeconds / 60);
				var aRate = 0;
				var aCostRate = aEntry["costRate"] ? aEntry["costRate"] : 0;
				if (aEntry["rate"] != null) {
					aRate = aEntry["rate"] / 100;
				} else {
					// Free plan report: no rate field at all — resolve from
					// project/membership/workspace rates instead.
					var aResolved = fallbackRates(aEntry);
					aRate = aResolved.rate / 100;
					if (aCostRate == 0) {
						aCostRate = aResolved.costRate;
					}
				}

				aTagNames = [];
				aTagIDs = aEntry["tagIds"];
				for (aTagIDsIndex in aTagIDs) {
					aTagID = aTagIDs[aTagIDsIndex];
					if (aTagsLookup[aTagID]) {
						aTagNames.push(aTagsLookup[aTagID]["name"]);
					}
				}

				aItem["label"] = aTagNames.join(", ");
				aItem["startDate"] = aEntry["timeInterval"]["start"];
				aItem["uid"] = aEntryID;
				aItem["project"] = aEntry["projectName"] ? aEntry["projectName"] : "";
				aItem["client"] = aEntry["clientName"] ? aEntry["clientName"] : "";
				aItem["minutes"] = aMinutes;
				aItem["category"] = aEntry["taskName"] ? aEntry["taskName"] : "";
				aItem["cost"] = (aRate * aMinutes) / 60;
				aItem["costPrice"] = aCostRate / 100;

				if (aMinutes > 0 && roundTo > 0) {
					aRate = aItem["cost"] / (aMinutes / 60);
					aMinutes = Math.ceil(aMinutes / roundTo) * roundTo;
					aItem["minutes"] = aMinutes;
					aItem["cost"] = (aMinutes / 60) * aRate;
				}

				if (aEntry["description"]) {
					aItem["notes"] = aEntry["description"];
				}
				aItem["user"] = aEntry["userName"] + " (" + aWorkspaceName + ")";

				result.push(aItem);
			}
			page++;
		} while (aEntries.length == aPageSize && page < 20);
	}

	return result;
}
