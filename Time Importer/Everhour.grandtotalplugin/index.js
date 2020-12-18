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

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};




function urlForEndPoint(theEndPoint)
{
	return "https://api.everhour.com/" + theEndPoint;
}



timedEntries();

function httpGetJSON(theUrl)
{
	header = {"X-Api-Key":token};
	string = loadURL("GET",theUrl,header);

	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}



function makeISODate(str)
{
	return str.replace(/\s/g, 'T') + "Z";
}


function createLookup(array)
{
	var result = {};
	for(aIndex in array)
	{
		aEntry = array[aIndex];
		aID = aEntry["id"];
		result[aID] = aEntry;
	}
	return result;
}



function timedEntries()
{
	var aEndDate = new Date();
	var aEndDateString = aEndDate.yyyymmdd();
	var aStartDate = new Date();
	aStartDate.setDate(aEndDate.getDate() - 180);
	var aStartDateString = aStartDate.yyyymmdd();
	
	var aClients = httpGetJSON( urlForEndPoint("clients"));
	var aClientsLookup = createLookup(aClients);
	//log (aClientsLookup);
	
	var aProjects = httpGetJSON( urlForEndPoint("projects"));
	var aProjectsLookup = createLookup(aProjects);
	//log (aProjectsLookup);
	
	var aUsers = httpGetJSON( urlForEndPoint("team/users"));
	var aUsersLookup = createLookup(aUsers);
	//log (aUsersLookup);
	
		
	var aEntries = httpGetJSON(urlForEndPoint("team/time") + "?from=" + aStartDateString + "&to=" + aEndDateString);
	if (!aEntries)
	{
		return "Check your settings, please";
	}
	
	
	
	var result = [];
	for(aIndex in aEntries)
	{
		var aEntry = aEntries[aIndex];
		var aID = aEntry["id"];
		var aItem = {};
		aItem["uid"] = "com.everhour." + aID;
		var aUser = aUsersLookup[aEntry["user"]];

		var aRate = 0;
		var aProjects = aEntry["task"]["projects"];
		

		if (aProjects)
		{
			var aProjectID = aProjects[0];
			var aProject = aProjectsLookup[aProjectID];
			if (!aProject["rate"])
			{
				continue; /// not billable
			}
			aItem["project"] = aProject["name"];
			var aClientID = aProject["client"];
			var aClient = aClientsLookup[aClientID];
			aItem["client"] = aClient["name"];
			
			var aRateType = aProject["rate"]["type"];

			if (aRateType == "user_rate")
			{
				aRate = aUser["rate"];
			}
			else if (aRateType == "project_rate")
			{
				aRate = aProject["rate"]["rate"];
			}
		}
		
		aItem["user"] = aUser["name"];
		aItem["startDate"] = aEntry["date"] + "T00:00:00";
		aItem["minutes"] = aEntry["time"] / 60;
		aItem["category"] = aEntry["task"]["name"];
		aItem["cost"] = aRate / 100 * aEntry["time"] / 3600; 
		aItem["notes"] = aEntry["comment"];
		aItem["url"] = "https://app.everhour.com/#/time(view:" + aEntry["task"]["id"] + ")";

		result.push(aItem);
	}
	

	return result;

}
