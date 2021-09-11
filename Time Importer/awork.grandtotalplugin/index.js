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


function urlForEndPoint(theEndPoint,pageSize,page)
{
	return "https://api.awork.io/api/v1/" + theEndPoint + "?pageSize=" + pageSize + "&page=" + page;
}


function httpGetJSON(theUrl)
{
	header = {"Authorization":"Bearer " + token};
	string = loadURL("GET",theUrl,header);

	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}


function timedEntries()
{
	var pageSize = 200;
	var page = 1;
	
	if (defaultRate == 0)
	{
		return localize("Set rate");
	}

	var result = [];
	

	do {
		var aEntries = httpGetJSON(urlForEndPoint("timeentries",pageSize,page));
		if (!aEntries)
		{
			return "Check your settings, please";
		}
		if (aEntries["grandtotal_error"])
		{
			return "Check your settings, please";
		}

		for(aIndex in aEntries)
		{
			var aEntry = aEntries[aIndex];
			var aItem = {};
			
			if (!aEntry["isBillable"])
			{
				continue;
			}
			if (aEntry["project"])
			{
				aItem["project"] = aEntry["project"]["name"];
				if (aEntry["project"]["company"])
				{
					aItem["client"] = aEntry["project"]["company"]["name"];
				}
			}
			aItem["user"] = aEntry["user"]["name"];
			if (aEntry["task"])
			{
				aItem["category"] = aEntry["task"]["name"];
			}
			aItem["uid"] = "io.awork." + aEntry["id"];
			aItem["notes"] = aEntry["note"];
			aItem["minutes"] = aEntry["duration"] / 60;
			if (aEntry["user"])
			{
				aItem["user"] = aEntry["user"]["firstName"];
			}
			aItem["cost"] = defaultRate * (aItem["minutes"] / 60);
			if (aEntry["startTimeUtc"])
			{
				aItem["startDate"] = aEntry["startDateUtc"].split("T")[0] + "T" + aEntry["startTimeUtc"] + "Z";
			}
			else
			{
				aItem["startDate"] = aEntry["startDateLocal"];
			}
			result.push(aItem);
		}
		page = page + 1;

	} while (aEntries.length == pageSize && page < 6);
	
	return result;
}
