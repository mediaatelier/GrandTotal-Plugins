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
	var numberLookup = {};
	var dir = grandtotal.fileManager.homeDirectory + "/Library/Containers/com.tlphn.Telephone/Data/Library/Application\ Support/com.tlphn.Telephone/CallHistories/";
	var files = grandtotal.fileManager.contentsOfDirectory(dir);
	var result = [];
	for (f in files)
	{
		var path = files[f];
		var items = grandtotal.fileManager.contentsOfPlistFile(path);
			
		for (i in items)
		{
			item = items[i];
			var call = {};
			call["startDate"] = item["date"];
			if (numberLookup[item["user"]])
			{
				call["client"] = numberLookup[item["user"]];
			}
			else
			{
				call["client"] = grandtotal.addressBook.findContactByNumber(item["user"]);
				numberLookup[item["user"]] = call["client"];
			}
			aMinutes = item["duration"] / 60;
			call["minutes"] = aMinutes;

			if (aMinutes > 0 && roundTo > 0)
			{
				aMinutes = Math.ceil(aMinutes/roundTo) * roundTo;
				call["minutes"] = aMinutes;
			}
			call["cost"] = defaultRate * call["minutes"] / 60;
			call["uid"] = "com.tlphn.Telephone." + item["date"].getTime();
			if (item["incoming"])
			{
				call["category"] = localize("Incoming Call");
			}
			else
			{
				call["category"] = localize("Outgoing Call");

			}
			result.push(call);
		}

	}
 	return result;
}



