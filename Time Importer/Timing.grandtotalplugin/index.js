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
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.toggle.233283908"},
		{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.toggle.233275239"}
	]
	
	Make *sure* the uid you provide is not just a plain integer. Use your domain as prefix.
	
	Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

	Returning a string will present it as warning.	
	
	To see how to add global variables (Settings) look at the Info.plist of this sample.
	
	Keep in mind that for security reasons passwords are stored in the keychain and
	you will have to enter them again after modifying your code.
	
*/


timedEntries();

function timedEntries()
{
	if (defaultRate == 0)
	{
		return localize("Set rate");
	}
	
	if (token)
	{
		return timeEntriesAPI();
	}
	else
	{
		return timeEntriesLocal();
	}
}


function timeEntriesAPI()
{
	var url = "https://web.timingapp.com/api/v1/time-entries?is_running=false&include_project_data=true&include_team_members=true&start_date_min=2010-01-01&start_date_max=2050-01-01";
	counter = 0;
	while (url)
	{
		var response = httpGetJSON(url);
		if (response["message"]) {
			return "Timing API Error: " + response["message"];
		}
		if (response["server_error"]) {
			return "Timing API Error: " + JSON.stringify(response["server_error"]);
		}
		if (response["grandtotal_error"]) {
			return "Timing API Error: " + response["grandtotal_error"];
		}
		var items =  response["data"];
		var meta =  response["meta"];
		var url = meta["links"][2]["url"];
		if (typeof(url) != "string")
		{
			url = null;
		}
		var result = [];
		for (itemToParse of items) 
		{
			if (filterString && !itemToParse["project"]["title_chain"].join(" ▸ ").includes(filterString))
			{
				continue;
			}

			lineitem = transformItem(itemToParse,"https://web.timingapp.com/time-entries/");
			result.push(lineitem);
		}
		counter++;
		if (counter > 3)
		{
			break;
		}
	}
	return result;
}

	
function timeEntriesLocal()
{	
	var path = PluginDirectory + "Script.applescript";
	var script = contentsOfFile(path);
	var dest = NSTemporaryDirectory + "Timing.csv";
	var years = 1;
	if (loadAll)
	{
		years = 5;
	}
	script = script.replace("<destination/>",dest);
	script = script.replace("<years/>",years);
	
 	var error = executeAppleScript(script);
 	if (error["NSAppleScriptErrorMessage"]) 
 	{
 		return error["NSAppleScriptErrorMessage"];
 	}
 	var content = contentsOfCSVFile(dest);
 	var counter = 0;
 	var result = [];
 	for (line of content) 
 	{
 		if (counter > 0)
 		{
 			var project = {};
 			var itemToParse = {};
 			itemToParse["project"] = project;
 			itemToParse["start_date"] = line[2];
 			itemToParse["duration"] = line[1];
 			itemToParse["notes"] = line[6];
 			itemToParse["title"] = line[5];
 			itemToParse["self"] = line[0];
 			var projectPath = line[4];
			project["title_chain"] =  projectPath.split(" ▸ ");
 			if (filterString && !projectPath.includes(filterString))
 			{
 				continue;
 			}
 			var lineitem = transformItem(itemToParse,"timing2://editTask/");
			result.push(lineitem);
 		}
 		counter++
 	}
 	return result;
}


function transformItem(item,urlPrefix)
{
	lineitem = {};
	var rate = defaultRate;
	if (item["project"])
	{
		var parsedComponents = parseComponents(item["project"]["title_chain"]);
		if (parsedComponents["rate"])
		{
			rate = parsedComponents["rate"];
		}
		lineitem["client"] = parsedComponents["client"];
		lineitem["project"] = parsedComponents["project"];
		lineitem["category"] = parsedComponents["category"];
		
	}
	if (item["title"])
	{
		lineitem["category"] = fixString(item["title"]);
	}
	lineitem["user"] = fixString(item["creator_name"]);
	lineitem["startDate"] = item["start_date"];
	lineitem["notes"] = fixString(item["notes"]);
	lineitem["minutes"] = item["duration"] / 60;

	var aMinutes = lineitem["minutes"];
	if (aMinutes > 0 && roundTo > 0)
	{
		aMinutes = Math.ceil(aMinutes/roundTo) * roundTo;
		lineitem["minutes"] = aMinutes;
	}
	lineitem["cost"] = rate * lineitem["minutes"] / 60;
	var uid = item["self"].split("/").pop();
	lineitem["uid"] = "info.eurocomp.Timing.TaskActivity." + uid;
	lineitem["url"] = urlPrefix + uid;
	return lineitem;
}


function fixString(string)
{
	if (typeof(string) == "string") 
	{
		return string;
	}
	return "";
}


function parseComponents(rawComponents)
{
	var result = {};
	var projectComponents = new Array();
	for (index in rawComponents)
	{
		var projectComponent = rawComponents[index];
		// Matches numbers in parentheses with zero or one dot at the end of the string.
		// Group 1 is with parentheses, group 2 without.
		var matches = projectComponent.match(/.+\s(\((\d+[\,\.]?\d*)\))$/);
		
		if (matches)
		{
			rate = matches[2].replace(",",".");
			rate = parseFloat(rate);
			result["rate"] = rate;
			projectComponent = projectComponent.replace(matches[1],"").trim();
		}
		projectComponents.push(projectComponent);
	}
				
	var clientOffset = 0;
	
	// if root is eg. "billable" this folder is ingnored
	if (projectComponents[0] == filterString && projectComponents.length > 2)
	{
		var clientOffset = 1;
	}
	result["category"] = "";
	if (projectComponents.length == 1)
	{
		result["project"] = projectComponents[0];
		result["client"] = localize("Move project '%' in a folder named after your client").replace("%",lineitem["project"]);
	}
	else
	{
		result["client"] = projectComponents[clientOffset];
		result["project"] = projectComponents[clientOffset + 1];
		if (projectComponents.length > clientOffset + 1)
		{
			result["category"] = projectComponents[clientOffset + 2];
		}
	}
	return result;
}


function httpGetJSON(theUrl)
{
	header = {Authorization:'Bearer ' + token};
	string = loadURL("GET",theUrl,header);
	if (string.length == 0)
	{
		return null;
	}
	return result =  JSON.parse(string);
}


