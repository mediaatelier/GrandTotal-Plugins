/*
	Keep in mind that you can't use browser specific calls. Use following calls
	
	--Loading httpContents--
	loadURL(method,url,headers);
	
	--Logging to the Console--
	log(value);
	
	--Base64--
	base64Encode(string);
	
	Expected result is a JSON representation of an array.
	
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

function urlForEndPoint(theEndPoint, pageSize, page) {
	// Correct base URL is api.awork.com (not .io)
	return "https://api.awork.com/api/v1/" + theEndPoint + "?pageSize=" + pageSize + "&page=" + page;
}

function extractHourlyRateFromTags(tags) {
	if (!tags || !Array.isArray(tags)) {
		return null;
	}

	for (var i = 0; i < tags.length; i++) {
		var tagName = tags[i].name;
		if (!tagName) {
			continue;
		}

		// Match patterns like "100/h", "65.80/h", "76,60/h", "100 / h"
		// Allow optional spaces around the slash, decimal with . or ,
		var match = tagName.match(/^(\d+[.,]?\d*)\s*\/\s*h$/i);
		if (match) {
			// Replace comma with dot for parsing and convert to number
			var rateString = match[1].replace(",", ".");
			var rate = parseFloat(rateString);
			if (!isNaN(rate)) {
				return rate;
			}
		}
	}

	return null;
}

function httpGetJSON(theUrl) {
	header = { Authorization: "Bearer " + token };
	string = loadURL("GET", theUrl, header);

	if (string.length == 0) {
		return { grandtotal_error: "authentication" };
	}

	try {
		var parsed = JSON.parse(string);

		// Check for awork API error format: server_error with code and description
		if (parsed.server_error) {
			var errorCode = parsed.server_error.code;
			var errorDesc = parsed.server_error.description;

			// Handle specific error codes
			if (errorCode == "plan-inactive") {
				return { grandtotal_error: "subscription", details: errorDesc };
			}
			if (errorCode == "unauthorized" || errorCode == "invalid-token" || parsed.http_error == 401) {
				return { grandtotal_error: "authentication", details: errorDesc };
			}
			if (parsed.http_error == 403) {
				return { grandtotal_error: "forbidden", details: errorDesc };
			}

			// Generic API error with description
			return { grandtotal_error: "api", code: errorCode, details: errorDesc };
		}

		// Check for other error response formats
		if (parsed.error || parsed.message || parsed.status >= 400) {
			if (parsed.status == 401 || parsed.status == 403) {
				return { grandtotal_error: "authentication" };
			}
			return { grandtotal_error: "api", details: parsed.message || parsed.error };
		}

		return parsed;
	} catch (e) {
		// If we can't parse JSON, it might be an HTML error page (common with auth failures)
		if (
			string.includes("401") ||
			string.includes("Unauthorized") ||
			string.includes("403") ||
			string.includes("Forbidden")
		) {
			return { grandtotal_error: "authentication" };
		}
		return { grandtotal_error: "parse" };
	}
}

function timedEntries() {
	var pageSize = 1000; // Maximum allowed by API
	var page = 1;

	if (defaultRate == 0) {
		return localize("Set rate");
	}

	var result = [];

	do {
		var aEntries = httpGetJSON(urlForEndPoint("timeentries", pageSize, page));

		if (!aEntries) {
			return "Unable to connect to awork API. Please check your internet connection.";
		}
		if (aEntries["grandtotal_error"]) {
			if (aEntries["grandtotal_error"] == "authentication") {
				var msg = "Authentication failed. Please check your API token in the plugin settings.";
				if (aEntries["details"]) {
					msg += " Error: " + aEntries["details"];
				} else {
					msg += " Your token may be invalid or expired.";
				}
				return msg;
			} else if (aEntries["grandtotal_error"] == "subscription") {
				var msg = "awork subscription error";
				if (aEntries["details"]) {
					msg += ": " + aEntries["details"];
				}
				msg += " Please check your awork account status.";
				return msg;
			} else if (aEntries["grandtotal_error"] == "forbidden") {
				var msg = "Access forbidden";
				if (aEntries["details"]) {
					msg += ": " + aEntries["details"];
				}
				msg += " Your API token may not have the required permissions.";
				return msg;
			} else if (aEntries["grandtotal_error"] == "parse") {
				return "Unable to parse API response. The awork API may have changed or returned an unexpected format.";
			} else if (aEntries["grandtotal_error"] == "api") {
				var msg = "API error";
				if (aEntries["code"]) {
					msg += " (" + aEntries["code"] + ")";
				}
				if (aEntries["details"]) {
					msg += ": " + aEntries["details"];
				}
				return msg;
			}
			return "Error communicating with awork API. Please check your settings.";
		}

		for (aIndex in aEntries) {
			var aEntry = aEntries[aIndex];

			// Skip non-billable entries
			if (aEntry["isBillable"] === false) {
				continue;
			}

			var aItem = {};
			var hourlyRate = defaultRate;

			if (aEntry["project"]) {
				aItem["project"] = aEntry["project"]["name"];
				if (aEntry["project"]["company"]) {
					aItem["client"] = aEntry["project"]["company"]["name"];

					// Check for hourly rate in company tags
					var companyRate = extractHourlyRateFromTags(aEntry["project"]["company"]["tags"]);
					if (companyRate !== null) {
						hourlyRate = companyRate;
					}
				}

				// Project tags can override company rate
				var projectRate = extractHourlyRateFromTags(aEntry["project"]["tags"]);
				if (projectRate !== null) {
					hourlyRate = projectRate;
				}
			}
			if (aEntry["task"]) {
				aItem["category"] = aEntry["task"]["name"];

				// Task tags can override project/company rate
				var taskRate = extractHourlyRateFromTags(aEntry["task"]["tags"]);
				if (taskRate !== null) {
					hourlyRate = taskRate;
				}
			}
			aItem["uid"] = "io.awork." + aEntry["id"];
			aItem["notes"] = aEntry["note"];
			aItem["minutes"] = aEntry["duration"] / 60;
			if (aEntry["user"]) {
				aItem["user"] = aEntry["user"]["firstName"];
				if (aEntry["user"]["lastName"]) {
					aItem["user"] += " " + aEntry["user"]["lastName"];
				}
			}
			aItem["cost"] = hourlyRate * (aItem["minutes"] / 60);
			if (aEntry["startTimeUtc"]) {
				// Combine UTC date and time: extract date from startDateUtc, combine with startTimeUtc
				aItem["startDate"] = aEntry["startDateUtc"].split("T")[0] + "T" + aEntry["startTimeUtc"] + "Z";
			} else {
				aItem["startDate"] = aEntry["startDateLocal"];
			}
			result.push(aItem);
		}
		page = page + 1;
	} while (aEntries.length == pageSize && page < 6);

	return result;
}
