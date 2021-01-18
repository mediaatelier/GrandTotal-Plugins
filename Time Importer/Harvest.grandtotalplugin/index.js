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


function urlForEndPoint(theEndPoint)
{
	return "https://api.harvestapp.com/api/v2/" + theEndPoint;
}


function httpGetJSON(theUrl)
{
	header = {"Harvest-Account-ID":accountID,"Authorization":"Bearer " + token,"User-Agent":"GrandTotal"};
	string = loadURL("GET",theUrl,header);

	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}


function timedEntries()
{
	var aEntries = httpGetJSON(urlForEndPoint("time_entries"));
	if (!aEntries)
	{
		return "Check your settings, please";
	}
	if (aEntries["grandtotal_error"])
	{
		return "Check your settings, please";
	}
	var result = [];
	
	do {
	
		var aEntriesArray = aEntries["time_entries"];
		for(aIndex in aEntriesArray)
		{
			var aEntry = aEntriesArray[aIndex];
			var aItem = {};
			
			if (!aEntry["billable"])
			{
				continue;
			}
			if (aEntry["is_running"])
			{
				continue;
			}
			aItem["client"] = aEntry["client"]["name"];
			aItem["project"] = aEntry["project"]["name"];
			aItem["user"] = aEntry["user"]["name"];
			aItem["category"] = aEntry["task"]["name"];
			aItem["uid"] = "com.harvestapp." + aEntry["id"];
			aItem["uid"] = "com.harvestapp." + aEntry["id"];
			aItem["notes"] = aEntry["notes"];
			aItem["minutes"] = aEntry["rounded_hours"] * 60;
			aItem["cost"] = aEntry["billable_rate"] * aEntry["rounded_hours"];
			aItem["startDate"] = aEntry["spent_date"] + "T00:00:00";
			result.push(aItem);
		}
		
		var aNextpage = aEntries["links"]["next"];
		if (aNextpage)
		{
			aEntries = httpGetJSON(aNextpage);
		}
	} while (aNextpage && aEntries.length < 1000);
	
	return result;
}
