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
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.myhours.233283908"},
		{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.myhours.233275239"}
	]

	Make *sure* the uid you provide is not just a plain integer. Use your domain as prefix.

	Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

	Returning a string will present it as warning.

	To see how to add global variables (Settings) look at the Info.plist of this sample.

	Keep in mind that for security reasons passwords are stored in the keychain and
	you will have to enter them again after modifying your code.

*/

timedEntries();

function httpGetJSON(theUrl)
{
	header = {Authorization: 'ApiKey ' + token};
	string = loadURL("GET", theUrl, header);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}

function timedEntries()
{
	if (!token || token.length == 0)
	{
		return localize("API Key required");
	}

	if (defaultRate == 0)
	{
		return localize("Set rate");
	}

	// Base URL for My Hours API
	var baseUrl = "https://api2.myhours.com/api";

	// Get current user info
	var user = httpGetJSON(baseUrl + "/Users");
	if (!user)
	{
		return localize("Error loading user");
	}
	var userName = user.name || user.email || "Unknown";

	// Get projects (they include client info already!)
	var projects = httpGetJSON(baseUrl + "/Projects");
	if (!projects)
	{
		return localize("Error loading projects");
	}

	// Create lookup for projects by ID
	var projectsLookup = {};
	if (projects && projects.length > 0)
	{
		for (var i = 0; i < projects.length; i++)
		{
			var project = projects[i];
			projectsLookup[project.id] = project;
		}
	}

	// Get time logs - use date range (last 180 days)
	var endDate = new Date();
	var startDate = new Date();
	startDate.setDate(endDate.getDate() - 180);

	var dateFrom = startDate.toISOString().split('T')[0];
	var dateTo = endDate.toISOString().split('T')[0];

	// Note: My Hours API uses capital D in DateFrom/DateTo and Reports/activity endpoint
	var timeLogs = httpGetJSON(baseUrl + "/Reports/activity?DateFrom=" + dateFrom + "&DateTo=" + dateTo);

	if (!timeLogs)
	{
		return localize("Error loading time logs");
	}

	if (timeLogs["grandtotal_error"])
	{
		return timeLogs["grandtotal_error"];
	}

	if (!timeLogs || timeLogs.length == 0)
	{
		return localize("No time entries found");
	}

	var result = [];

	for (var i = 0; i < timeLogs.length; i++)
	{
		var timeLog = timeLogs[i];

		// Skip if already invoiced
		if (timeLog.invoiced === true)
		{
			continue;
		}

		// Skip if not billable
		if (timeLog.billable !== true)
		{
			continue;
		}

		var item = {};

		// Use billableHours from API (already calculated correctly)
		var hours = timeLog.billableHours || 0;
		var minutes = Math.round(hours * 60);

		// Apply rounding if specified
		if (minutes > 0 && roundTo > 0)
		{
			minutes = Math.ceil(minutes / roundTo) * roundTo;
		}

		item.minutes = minutes;
		item.startDate = timeLog.date;
		item.notes = timeLog.note || "";
		item.uid = "com.myhours." + timeLog.logId;

		// Use userName from the API response
		item.user = timeLog.userName || userName;

		// Project and client are already in the response
		if (timeLog.projectName)
		{
			item.project = timeLog.projectName;
		}

		if (timeLog.clientName)
		{
			item.client = timeLog.clientName;
		}

		// Use task as category if available
		if (timeLog.taskName)
		{
			item.category = timeLog.taskName;
		}

		// Add tags as labels if available
		if (timeLog.tags && timeLog.tags.length > 0)
		{
			item.label = timeLog.tags;
		}

		// Calculate cost
		var rate = defaultRate;
		item.cost = rate * minutes / 60;

		result.push(item);
	}

	return result;
}
