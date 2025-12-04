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
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.timebuzzer.233283908"},
		{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.timebuzzer.233275239"}
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
	header = {Authorization:'APIKey ' + token};
	string = loadURL("GET",theUrl,header);
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

	// Get account info for users
	var account = httpGetJSON("https://my.timebuzzer.com/open-api/account");
	if (!account || !account.users)
	{
		return localize("Error loading account");
	}

	// Create lookup for users by ID
	var usersLookup = {};
	for (var i = 0; i < account.users.length; i++)
	{
		var user = account.users[i];
		var userName = user.firstName;
		if (user.lastName)
		{
			userName += " " + user.lastName;
		}
		usersLookup[user.id] = userName;
	}

	// Get all tiles (projects/clients/tasks)
	var tiles = httpGetJSON("https://my.timebuzzer.com/open-api/tiles");
	if (!tiles)
	{
		return localize("Error loading tiles");
	}

	// Create lookup for tiles by ID
	var tilesLookup = {};
	for (var i = 0; i < tiles.length; i++)
	{
		var tile = tiles[i];
		tilesLookup[tile.id] = tile;
	}

	// Get activities
	var response = httpGetJSON("https://my.timebuzzer.com/open-api/activities?count=5000");

	if (!response)
	{
		return localize("Error loading activities");
	}

	if (response["grandtotal_error"])
	{
		return response["grandtotal_error"];
	}

	if (!response.activities)
	{
		return localize("No activities found");
	}

	var result = [];
	var activities = response.activities;

	for (var i = 0; i < activities.length; i++)
	{
		var activity = activities[i];

		// Skip non-billable activities
		if (activity.billed === true)
		{
			continue;
		}

		var item = {};

		// Calculate duration in minutes
		var startDate = new Date(activity.startDate);
		var endDate = new Date(activity.endDate);
		var durationMs = endDate - startDate;
		var minutes = Math.round(durationMs / 60000);

		// Apply rounding if specified
		if (minutes > 0 && roundTo > 0)
		{
			minutes = Math.ceil(minutes / roundTo) * roundTo;
		}

		item.minutes = minutes;
		item.startDate = activity.startDate;
		item.notes = activity.note || "";
		item.uid = "com.timebuzzer." + activity.id;

		// Map user
		if (activity.userId && usersLookup[activity.userId])
		{
			item.user = usersLookup[activity.userId];
		}

		// Parse tile hierarchy to extract client and project
		var tileNames = [];
		if (activity.tiles && activity.tiles.length > 0)
		{
			// Get all tiles in the hierarchy
			for (var j = 0; j < activity.tiles.length; j++)
			{
				var tileId = activity.tiles[j];
				var tile = tilesLookup[tileId];
				if (tile)
				{
					tileNames.push({
						name: tile.name,
						layer: tile.layer
					});
				}
			}

			// Sort by layer to get proper hierarchy
			tileNames.sort(function(a, b) {
				return a.layer - b.layer;
			});

			// Extract client and project based on hierarchy
			if (tileNames.length >= 2)
			{
				item.client = tileNames[0].name;
				item.project = tileNames[1].name;

				// If there are more levels, use them as category
				if (tileNames.length >= 3)
				{
					item.category = tileNames[2].name;
				}
			}
			else if (tileNames.length == 1)
			{
				item.project = tileNames[0].name;
				item.client = "";
			}
		}

		// Calculate cost
		var rate = defaultRate;
		item.cost = rate * minutes / 60;

		result.push(item);
	}

	return result;
}
