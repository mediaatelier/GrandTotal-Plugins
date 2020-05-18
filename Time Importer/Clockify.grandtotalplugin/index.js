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
	
	header = {"X-Api-Key":token};
	string = loadURL("GET",theUrl,header);
	
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}



function timedEntries()
{
	var aEndDate = new Date();
	var aEndDateString = aEndDate.yyyymmdd();
	var aStartDate = new Date();
	aStartDate.setDate(aEndDate.getDate() - 180);
	var aStartDateString = aStartDate.yyyymmdd();


	var result = [];
	var aArray = httpGetJSON("https://api.clockify.me/api/v1/user");

	if (aArray["grandtotal_error"])
	{
		return aArray["grandtotal_error"];
	}
		
	if (!aArray)
	{
		return "Check your settings, please";
	}
	
	var aUserID = aArray["id"];
	var aWorkspaceID = aArray["activeWorkspace"];
	var aWorkspaceName = aArray["name"];
	
	
	var page = 1;
	var aUserLookup = {};
	
	do 
	{
		var aUsers = httpGetJSON("https://api.clockify.me/api/v1/workspaces/"+aWorkspaceID+"/users?page="+page);

		for(aUserIndex in aUsers)
		{
			aUser = aUsers[aUserIndex];
			aUserID = aUser["id"];
			aUserLookup[aUserID] = aUser;
		}
		page ++;
	}
	while (aUsers.length != 0);



	var page = 1;
	var aClientLookup = {};
	do 
	{
		var aClients = httpGetJSON("https://api.clockify.me/api/v1/workspaces/"+aWorkspaceID+"/clients?page="+page);
		for(aClientIndex in aClients)
		{
			aClient = aClients[aClientIndex];
			aClientID = aClient["id"];
			aClientLookup[aClientID] = aClient;
		}
		page ++;
	}
	while (aClients.length != 0);
	
	
	var page = 1;
	var aProjectLookup = {};
	var aTasksLookup = {};
	do 
	{
		var aProjects = httpGetJSON("https://api.clockify.me/api/v1/workspaces/"+aWorkspaceID+"/projects?page="+page);
		for(aProjectIndex in aProjects)
		{
			aProject = aProjects[aProjectIndex];
			aProjectID = aProject["id"];
			aProjectLookup[aProjectID] = aProject;
			var aTasks = httpGetJSON("https://api.clockify.me/api/v1/workspaces/"+aWorkspaceID+"/projects/"+aProjectID+"/tasks");
	
			for(aTasksIndex in aTasks)
			{
				aTask = aTasks[aTasksIndex];
				aTaskID = aTask["id"];
				aTasksLookup[aTaskID] = aTask;
			}
		}
		page ++;

	}
	while (aProjects.length != 0);
	
	
	
	var aTagsLookup = {};
	var page = 1;
	do 
	{
		var aTags = httpGetJSON("https://api.clockify.me/api/v1/workspaces/"+aWorkspaceID+"/tags?page="+page);
		for(aTagsIndex in aTags)
		{
			aTag = aTags[aTagsIndex];
			aTagID = aTag["id"];
			aTagsLookup[aTagID] = aTag;
		}
		page ++;

	}
	while (aTags.length != 0);
	
	
	
	for (aUserIndex in aUserLookup)
	{
		aUser = aUserLookup[aUserIndex];
		aUserName = aUser["name"];
		aUserID =  aUser["id"];

	
		var page = 1;
		do 
		{
	
			var aEntries = httpGetJSON("https://api.clockify.me/api/v1/workspaces/"+aWorkspaceID+"/user/"+aUserID+"/time-entries/?page="+page);
			for(aEntriesIndex in aEntries)
			{
				aItem = {};
				aEntry = aEntries[aEntriesIndex];
				if (aEntry["billable"] == 0) {
					continue;
				}
				if (!aEntry["timeInterval"]["duration"]) {
					continue;
				}
		
				aEntryID = "me.clockify." + aEntry["id"];
				aNotes = aEntry["description"];
		
		
				aProjectID = aEntry["projectId"];
		
				aProject = aProjectLookup[aProjectID];
				aRate = 0;
				aProjectName = "";
				aClientName = ""

				if (aProject)
				{
					aProjectName = aProject["name"];
					aClientName = aProject["clientName"];
					if (aProject["hourlyRate"]) {
						aRate = aProject["hourlyRate"]["amount"] / 100;
					}
				}
		
				aTask = null;
				aTaskID = aEntry["taskId"];
				if (aTaskID) {
					aTask = aTasksLookup[aTaskID];
					aTaskName = aTask["name"];
				}
				else
				{
					aTaskName = "";
				}
		
				aTagNames = "";
				aTagIDs = aEntry["tagIds"];
				aTagNames = [];
				for (aTagIDsIndex in aTagIDs)
				{
					aTagID = aTagIDs[aTagIDsIndex];
					aTagName = aTagsLookup[aTagID]["name"];
					aTagNames.push(aTagName);
				}
		
				aItem["label"] = aTagNames.join(", ");
				aItem["startDate"] = aEntry["timeInterval"]["start"];
				var aDurations = parseIntegerComponents(aEntry["timeInterval"]["duration"]);
				var aMinutes = 0;
				if (aDurations["H"]) {
					aMinutes += aDurations["H"] * 60;
				}
				if (aDurations["M"]) {
					aMinutes += aDurations["M"];
				}
				if (aDurations["S"]) {
					if (aDurations["S"] > 29)
					{
						aMinutes += 1;
					}
				}
		
				aItem["uid"] = aEntryID;
				aItem["project"] = aProjectName;
				aItem["client"] = aClientName;
				aItem["minutes"] = aMinutes;
				aItem["category"] = aTaskName;
				aItem["cost"] = aRate * aMinutes / 60;
		
				aMinutes = aItem["minutes"];
				if (aMinutes > 0 && roundTo > 0)
				{
					aRate = aItem["cost"] / (aMinutes / 60);
					aMinutes = Math.ceil(aMinutes/roundTo) * roundTo;
					aItem["minutes"] = aMinutes;
					aItem["cost"] =  aMinutes / 60 * aRate;
				}
			
			
				if (aNotes) {
					aItem["notes"] = aNotes;
				}
				aItem["user"] = aUserName;

				result.push(aItem);
			}
			page ++;
		}
		while (aEntries.length != 0 && page < 11);
	
	}
	

	return result;
	
}