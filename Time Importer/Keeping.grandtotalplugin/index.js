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



timedEntries();

function httpGetJSON(theUrl)
{
	header = {Authorization:'Bearer ' + token};
	string = loadURL("GET",theUrl,header);

	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
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


function loadPages(theURL,key)
{
	result = [];
	page = 0;
	if (theURL.indexOf("?") !== -1)
	{
		theURL = theURL + "&page=";
	}
	else
	{
		theURL = theURL + "?page=";
	}
	do
	{
		page ++
		data = httpGetJSON(theURL + page);
		items = data[key];
		if (items)
		{
			result = result.concat(items);
		}
		meta = data["meta"];
		if (!meta) {
			break;
		}
	}
	while (meta["last_page"] > page)
	
	return result;
}


function timedEntries()
{
	if (defaultRate == 0)
	{
		return localize("Set rate");
	}
	
	var result = [];
	var aOrganizationsData = httpGetJSON("https://api.keeping.nl/v1/organisations");

	if (aOrganizationsData["server_error"])
	{
		return aOrganizationsData["server_error"]["error"]["message"];
	}
	var aOrganizations = aOrganizationsData["organisations"];
	var aOrganization = aOrganizations[0];
	
	for (i in aOrganizations)
	{
		var aCheckOrganization = aOrganizations[i];

		if (aCheckOrganization["name"].indexOf(organization) !== -1 || aCheckOrganization["url"].indexOf(organization))
		{
			aOrganization = aCheckOrganization;
		}
	}
	
	
	var aOrganizationID = aOrganization["id"];
	
	var aProjects = loadPages("https://api.keeping.nl/v1/"+ aOrganizationID + "/projects","projects");
	var aProjectsLookup = createIDLookUp(aProjects);
	
	/// this call fails currently. Maybe it will be fixed
	var aUsers = loadPages("https://api.keeping.nl/v1/"+ aOrganizationID + "/users","users");
	var aUsersLookup = createIDLookUp(aUsers);
		
	var aTasks = loadPages("https://api.keeping.nl/v1/"+ aOrganizationID + "/tasks","tasks");
	var aTasksLookup = createIDLookUp(aTasks);
	
	var date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
		
	var aTimes = loadPages("https://api.keeping.nl/v1/"+ aOrganizationID + "/report/time-entries?from=" + date.yyyymmdd(),"time_entries");

	for (i in aTimes)
	{
		var aTime = aTimes[i];
		
		if (aTime["ongoing"] == 1)
		{
			continue;
		}
		var aItemResult = {};
		
		aProject = aProjectsLookup[aTime["project_id"]];
		aTask = aTasksLookup[aTime["task_id"]];
		aUser = aUsersLookup[aTime["user_id"]];

		if (aProject)
		{
			aClient = aProject["client"];		
			aItemResult["project"] = aProject["name"];
			if (aClient)
			{
				aItemResult["client"] = aClient["name"];
			}
		}
		if (aTask)
		{
			aItemResult["category"] = aTask["name"];
		}
		aItemResult["minutes"] = Math.round(aTime["hours"] * 60);
		if (aUser)
		{
			aItemResult["user"] = aUser["first_name"] + " " + aUser["surname"];
		}
		aItemResult["startDate"] = aTime["start"];
		aItemResult["endDate"] = aTime["end"];
		aItemResult["cost"] = aItemResult["minutes"] / 60 * defaultRate;
		
		if (aTime["note"])
		{
			aItemResult["notes"] = aTime["note"];
		}

		aItemResult["uid"] = "nl.keeping." + aOrganizationID + "." + aTime["id"];

		result.push(aItemResult);
	}
	return result;
}
