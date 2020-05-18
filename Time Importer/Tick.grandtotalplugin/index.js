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


Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};


timedEntries();


function httpGetJSON(theUrl)
{
	header = {Authorization:'Token token=' + token, 'User-Agent': 'GrandTotal (info@mediaatelier.com)'};
	string = loadURL("GET",theUrl,header);
			
	if (string.length == 0)
	{
		return null;
	}
	var result = null;
	try
	{
		result = JSON.parse(string);
	}
	catch(e)
	{
		result = string;
	}
	return result;
}


function createIDLookUp(theJSON)
{
	var result = {};
	for (aEntry in theJSON)
	{
		var aItemResult = {};
		result[theJSON[aEntry]["id"]] = theJSON[aEntry];
	}
	return result;
}


function urlForEndPoint(theEndPoint)
{
	return "https://www.tickspot.com/" + subscriptionID + "/api/v2/" + theEndPoint;
}


function timedEntries()
{
	var aEndDate = new Date();
	var aEndDateString = aEndDate.yyyymmdd();
	var aStartDate = new Date();
	aStartDate.setDate(aEndDate.getDate() - 364);
	var aStartDateString = aStartDate.yyyymmdd();
	
	var result = [];
	var aProjects = httpGetJSON(urlForEndPoint("projects.json"));
		
	if (typeof aProjects == 'string')
	{
		return aProjects;
	}
	
	if (aProjects["grandtotal_error"]) {
		return aProjects["grandtotal_error"];
	}
	
	var aProjectsLookup =  createIDLookUp(aProjects);
	var aClients = httpGetJSON(urlForEndPoint("clients.json"));
	var aClientsLookup =  createIDLookUp(aClients);
	
	var aUsers = httpGetJSON(urlForEndPoint("users.json"));
	var aUsersLookup =  createIDLookUp(aUsers);

	var aTasks = httpGetJSON(urlForEndPoint("tasks.json"));
	var aTasksLookup =  createIDLookUp(aTasks);
	
	var aEntriesURL =  urlForEndPoint("entries.json") + "?start_date='"+ aStartDateString + "'&end_date='"+ aEndDateString +"'&billable=true";
	var aEntries = httpGetJSON(aEntriesURL);
	
	var aTestdate = new Date()
	var aOffset = aTestdate.getTimezoneOffset() / 60 * -1;
	
	for (aEntry in aEntries)
	{
		var aEntryObject = aEntries[aEntry];
		
		var aItemResult = {};
		aItemResult["startDate"] = aEntryObject["date"] + "T00:00:00+" + aOffset;
		if (aEntryObject["notes"])
		{
			aItemResult["notes"] = aEntryObject["notes"];
		}
		aItemResult["minutes"] = Math.round(aEntryObject["hours"] * 60);
		aItemResult["user"] = aUsersLookup[(aEntryObject["user_id"])]["first_name"];
		var aTaskObject = aTasksLookup[aEntryObject["task_id"]];
		aItemResult["category"] = aTaskObject["name"];
		var aProjectObject = aProjectsLookup[aTaskObject["project_id"]];
		aItemResult["project"] = aProjectObject["name"];
		var aClientObject = aClientsLookup[aProjectObject["client_id"]];
		aItemResult["client"] = aClientObject["name"];
		aItemResult["cost"] = (aItemResult["minutes"] / 60) * rate;
		aItemResult["uid"] = "com.tickspot." + aEntryObject["id"];
		result.push(aItemResult);
	}
	return result;
}
