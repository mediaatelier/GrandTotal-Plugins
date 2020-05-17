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

function httpGetJSON(theUrl)
{
	header = {Authorization:'Basic ' + base64Encode(token + ':api_token')};
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


function timedEntries()
{
	

	var result = [];
	var aProjects = httpGetJSON("https://app.paymoapp.com/api/projects?where=active=true&billable=true");
	
	if (aProjects["grandtotal_error"])
		return aProjects["grandtotal_error"];
		
	if (aProjects["message"])
	{
		return aProjects["message"];
	}
	
	var aClients = httpGetJSON("https://app.paymoapp.com/api/clients");
	var aClientsLookup =  createIDLookUp(aClients["clients"]);
	
	var aUsers = httpGetJSON("https://app.paymoapp.com/api/users");
	var aUsersLookup =  createIDLookUp(aUsers["users"]);

	var aTasks = httpGetJSON("https://app.paymoapp.com/api/tasks");
	var aTasksLookup =  createIDLookUp(aTasks["tasks"]);
	
	var aCompany = httpGetJSON("https://app.paymoapp.com/api/company");
	var aCompanyRate = aCompany["company"]["default_price_per_hour"];

	
	var aProjectObjects = aProjects["projects"];


	for (aProject in aProjectObjects)
	{
		var aProjectObject = aProjectObjects[aProject];
		var aProjectName = aProjectObject["name"];
		var aProjectRate = aProjectObject["price_per_hour"];
		var aClientID = aProjectObject["client_id"];

	
		var aEntries = httpGetJSON("https://app.paymoapp.com/api/entries?where=project_id=" + aProjectObject["id"]);
		if (!aEntries)
		{
			return "Check your settings, please";
		}
	
		var aEntryObjects = aEntries["entries"];
		
		for (aEntry in aEntryObjects)
		{
			var aItemResult = {};
			var aUser = aUsersLookup[aEntryObjects[aEntry]["user_id"]];
			var aBillingType = aProjectObject["hourly_billing_mode"];

					
			aItemResult["notes"] = aEntryObjects[aEntry]["description"];
			aItemResult["project"] = aProjectName;
			aItemResult["client"] = aClientsLookup[aClientID]["name"];
			aItemResult["user"] = aUser["name"];
			
			aItemResult["minutes"] = aEntryObjects[aEntry]["duration"] / 60;
			aItemResult["cost"] = aProjectRate * aItemResult["minutes"] / 60;
			
			aItemResult["startDate"] = aEntryObjects[aEntry]["start_time"];
			aItemResult["endDate"] = aEntryObjects[aEntry]["end_time"];
			
			if (!aItemResult["startDate"])
			{
				aItemResult["startDate"] = aEntryObjects[aEntry]["date"] + "T00:00:00";
			}
			var aTask = aTasksLookup[aEntryObjects[aEntry]["task_id"]];
			
			aItemResult["category"] = aTask["name"];
			var aRate =  aUserRate = aUser["price_per_hour"];

			
			if (aBillingType == "task")
			{
				aRate = aTask["price_per_hour"];
			}
			else if (aBillingType == "project")
			{
				aRate = aProjectObject["price_per_hour"];
			}
			else if (aBillingType == "company")
			{
				aRate = aCompanyRate
			}
			
			aItemResult["cost"] = aRate * (aItemResult["minutes"] / 60);
			
			aMinutes = aItemResult["minutes"];
			if (aMinutes > 0 && roundTo > 0)
			{
				aRate = aItemResult["cost"] / (aMinutes / 60);
				aMinutes = Math.ceil(aMinutes/roundTo) * roundTo;
				aItemResult["minutes"] = aMinutes;
				aItemResult["cost"] =  aMinutes / 60 * aRate;
			}
			
			
			/*
			aItemResult["__raw"] = aEntryObjects[aEntry];
			aItemResult["__raw.task"] = aTask;
			aItemResult["__raw.project"] = aProjectObject;
			aItemResult["__raw.user"] = aUser;
			*/

			aItemResult["uid"] = "com.paymoapp." + aEntryObjects[aEntry]["id"];

			result.push(aItemResult);
		}
	}
	return result;
}
