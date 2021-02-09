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
	var path = PluginDirectory + "Script.applescript";
	var script = contentsOfFile(path);
	var dest = NSTemporaryDirectory + "Timing.csv";
	script = script.replace("<destination/>",dest);
 	executeAppleScript(script);
 	var content = contentsOfCSVFile(dest);
 	var counter = 0;
 	var result = [];
 	for (line of content) 
 	{
 		if (counter > 0)
 		{
 			lineitem = {};
 			lineitem["startDate"] = line[2];
 			lineitem["minutes"] = line[1] / 60;
 			var projectPath = line[4];
 			var rawProjectComponents = projectPath.split(" ▸ "); 
 			
 			if (filterString && !projectPath.includes(filterString))
 			{
 				continue;
 			}
 			
 			
 			var rate = defaultRate;
 			var projectComponents = new Array();
 			for (index in rawProjectComponents)
 			{
				var projectComponent = rawProjectComponents[index];
				// Matches numbers in parentheses with zero or one dot at the end of the string.
				// Group 1 is with parentheses, group 2 without.
				var matches = projectComponent.match(/.+\s(\((\d+\.?\d*)\))$/);
				
				if (matches)
				{
					rate = parseFloat(matches[2]);
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
 			
 			if (projectComponents.length == 1)
 			{
 				lineitem["project"] = projectComponents[0];
 			 	lineitem["client"] = localize("Move project '%' in a folder named after your client").replace("%",lineitem["project"]);
 			}
 			else
 			{
 			 	lineitem["client"] = projectComponents[clientOffset];
 				lineitem["project"] = projectComponents[clientOffset + 1];
 			}
 			var aMinutes = lineitem["minutes"];
 			if (aMinutes > 0 && roundTo > 0)
			{
				aMinutes = Math.ceil(aMinutes/roundTo) * roundTo;
				lineitem["minutes"] = aMinutes;
			}
 			lineitem["cost"] = rate * lineitem["minutes"] / 60;
 			lineitem["category"] = line[5];
 			lineitem["notes"] = line[6];
 			lineitem["uid"] = "info.eurocomp.Timing.TaskActivity." + line[0];
 			lineitem["url"] = "timing2://editTask/" + line[6];
			result.push(lineitem);
 		}
 		counter++
 	}
 	return result;
}



