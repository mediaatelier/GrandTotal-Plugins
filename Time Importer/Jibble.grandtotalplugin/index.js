/*
	Keep in mind that you can't use browser specific calls. Use following calls

	--Loading httpContents--
	String loadURL(method,url,headers);

	--Files--
	BOOL fileExists(path);
	BOOL fileIsDirectory(path);
	String contentsOfFile(path);
	String plistToJSON(String);
	Array of Strings contentsOfDirectory(path);

	NSHomeDirectory variable

	--Logging to the Console--
	log(value);

	--Base64--
	String base64Encode(string);

	Expected result is a JSON string representation of an array.

	[
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.jibble.233283908"},
		{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.jibble.233275239"}
	]

	Make *sure* the uid you provide is not just a plain integer. Use your domain as prefix.

	Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

	Returning a string will present it as warning.

	To see how to add global variables (Settings) look at the Info.plist of this sample.

	Keep in mind that for security reasons passwords are stored in the keychain and
	you will have to enter them again after modifying your code.

*/

timedEntries();

function getAccessToken()
{
	// Authenticate with OAuth to get bearer token
	var tokenUrl = "https://identity.prod.jibble.io/connect/token";
	var body = "grant_type=client_credentials&client_id=" + encodeURIComponent(clientId) + "&client_secret=" + encodeURIComponent(clientSecret);

	var headers = {
		"Accept": "application/json",
		"Content-Type": "application/x-www-form-urlencoded"
	};

	var response = loadURL("POST", tokenUrl, headers, body);
	if (response.length == 0)
	{
		return null;
	}

	var tokenData = JSON.parse(response);
	return tokenData.access_token;
}

function httpGetJSON(theUrl, accessToken)
{
	var headers = {
		"Authorization": "Bearer " + accessToken,
		"Content-Type": "application/json; charset=UTF-8"
	};

	var string = loadURL("GET", theUrl, headers);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}

function timedEntries()
{
	if (!clientId || clientId.length == 0)
	{
		return localize("Client ID required");
	}

	if (!clientSecret || clientSecret.length == 0)
	{
		return localize("Client Secret required");
	}

	// Get OAuth access token
	var accessToken = getAccessToken();
	if (!accessToken)
	{
		return localize("Authentication failed");
	}

	// Calculate date range (last 180 days)
	var endDate = new Date();
	var startDate = new Date();
	startDate.setDate(endDate.getDate() - 180);

	var dateFrom = startDate.toISOString().split('T')[0];
	var dateTo = endDate.toISOString().split('T')[0];

	// Fetch clients from workspace API to map clientId to client name
	var clientsUrl = "https://workspace.prod.jibble.io/v1/Clients?$select=id,name";
	var clientsResponse = httpGetJSON(clientsUrl, accessToken);
	var clientMap = {};

	if (clientsResponse && clientsResponse.value)
	{
		for (var i = 0; i < clientsResponse.value.length; i++)
		{
			var client = clientsResponse.value[i];
			clientMap[client.id] = client.name;
		}
	}

	// Fetch people to get billable rates (cannot use $select with dynamic properties)
	var peopleUrl = "https://workspace.prod.jibble.io/v1/People";
	var peopleResponse = httpGetJSON(peopleUrl, accessToken);
	var rateMap = {};

	if (peopleResponse && peopleResponse.value)
	{
		for (var i = 0; i < peopleResponse.value.length; i++)
		{
			var person = peopleResponse.value[i];
			if (person["IPersonSetting/BillableRate"])
			{
				rateMap[person.id] = person["IPersonSetting/BillableRate"];
			}
		}
	}

	// Build OData query for time entries
	var baseUrl = "https://time-tracking.prod.jibble.io/v1/TimeEntries";
	var expand = "$expand=activity($select=id,name,code),project($select=id,name,code,clientId),person($select=id,groupId,fullName)";
	var filter = "$filter=(belongsToDate ge " + dateFrom + " and belongsToDate le " + dateTo + " and status ne 'Archived')";
	var orderby = "$orderby=time asc";
	var select = "$select=id,type,time,localTime,belongsToDate,personId,projectId,activityId,locationId,note,coordinates,address";
	var top = "$top=1000";

	var url = baseUrl + "?" + expand + "&" + filter + "&" + orderby + "&" + select + "&" + top;

	var response = httpGetJSON(url, accessToken);

	if (!response)
	{
		return localize("Error loading time entries");
	}

	if (response["grandtotal_error"])
	{
		return response["grandtotal_error"];
	}

	// OData returns data in 'value' property
	var timeEntries = response.value;

	if (!timeEntries || timeEntries.length == 0)
	{
		return localize("No time entries found");
	}

	var result = [];

	// Process In/Out pairs to calculate durations
	for (var i = 0; i < timeEntries.length; i++)
	{
		var entry = timeEntries[i];

		// Only process "In" entries
		if (entry.type !== "In")
		{
			continue;
		}

		// Find the corresponding "Out" entry
		var outEntry = null;
		for (var j = i + 1; j < timeEntries.length; j++)
		{
			if (timeEntries[j].type === "Out" && timeEntries[j].personId === entry.personId)
			{
				outEntry = timeEntries[j];
				break;
			}
		}

		// Skip if no matching Out entry
		if (!outEntry)
		{
			continue;
		}

		var item = {};

		// Calculate duration between In and Out
		var inTime = new Date(entry.time);
		var outTime = new Date(outEntry.time);
		var durationMs = outTime - inTime;
		var minutes = Math.round(durationMs / 60000);

		// Skip if negative or zero duration
		if (minutes <= 0)
		{
			continue;
		}

		// Apply rounding if specified
		if (minutes > 0 && roundTo > 0)
		{
			minutes = Math.ceil(minutes / roundTo) * roundTo;
		}

		item.minutes = minutes;
		item.startDate = entry.localTime || entry.time;
		item.notes = entry.note || outEntry.note || "";
		item.uid = "com.jibble." + entry.id;

		// Map person (user)
		if (entry.person)
		{
			item.user = entry.person.fullName;
		}

		// Map project and client
		if (entry.project)
		{
			item.project = entry.project.name;

			// Map client from the project's clientId
			if (entry.project.clientId && clientMap[entry.project.clientId])
			{
				item.client = clientMap[entry.project.clientId];
			}
		}

		// Map activity as category
		if (entry.activity)
		{
			item.category = entry.activity.name;
		}

		// Calculate cost using rate from Jibble
		var rate = rateMap[entry.personId] || 0;
		if (rate > 0)
		{
			item.cost = rate * minutes / 60;
		}

		result.push(item);
	}

	return result;
}
