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


Date.prototype.myISO = function() 
{
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
        
    
    return this.getFullYear() 
        + '-' + pad(this.getMonth()+1)
        + '-' + pad(this.getDate())
        + 'T' + pad(this.getHours())
        + ':' + pad(this.getMinutes()) 
        + ':' + pad(this.getSeconds()) 
        + dif + pad(tzo / 60) 
        + ':' + pad(tzo % 60);
}


Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}


timedEntries();

function httpGetJSON(theUrl)
{
	header = {"X-LogMyTimeApiKey":token,"accept": "application/json"};
	string = loadURL("GET",theUrl,header);
	
	if (string.length == 0)
	{
		return null;
	}
	try {
		return JSON.parse(string);
	}
	catch(err) {
		return null;
	}
}


function createIDLookUp(theJSON)
{
	var result = {};
	for (aEntry in theJSON)
	{
		var aItemResult = {};
		result[theJSON[aEntry]["ID"]] = theJSON[aEntry];
	}
	return result;
}


function timedEntries()
{
	var aTestdate = new Date()
	var aOffset = aTestdate.getTimezoneOffset() / 60;

	var result = [];
	
	var aClients = httpGetJSON("https://api.logmytime.de/v1/api.svc/Clients");
	if (aClients["grandtotal_error"]) {
		return aClients["grandtotal_error"];
	}
	if (aClients["error"]) {
		return aClients["error"]["message"]["value"];
	}
		
	var aClientsLookup = createIDLookUp(aClients["d"]["results"]);
	
	var aProjects = httpGetJSON("https://api.logmytime.de/v1/api.svc/Projects");
	var aProjectsLookup = createIDLookUp(aProjects["d"]["results"]);
	
	var aUsers = httpGetJSON("https://api.logmytime.de/v1/api.svc/Users");
	var aUsersLookup = createIDLookUp(aUsers["d"]["results"]);
	
	var aTasks = httpGetJSON("https://api.logmytime.de/v1/api.svc/Tasks");
	var aTasksLookup = createIDLookUp(aTasks["d"]["results"]);

	var aTimeEntries = httpGetJSON("https://api.logmytime.de/v1/api.svc/TimeEntries?$filter=Billable eq true&orderby=StartTime desc");
	aTimeEntries = aTimeEntries["d"]["results"];
	for (aTimeEntryIndex in aTimeEntries)
	{
		var aItem = {};
		var aTimeEntry = aTimeEntries[aTimeEntryIndex];
		if (!aTimeEntry["RevenuePerHour"])	{
			return localize("No Rates defined");
		}
		var aRate = aTimeEntry["RevenuePerHour"] + 0;
			
		var aProject = aProjectsLookup[aTimeEntry["ProjectID"]];
		var aClient = aClientsLookup[aProject["ClientID"]];
		var aUser = aUsersLookup[aTimeEntry["UserID"]];
		var aTask = aTasksLookup[aTimeEntry["TaskID"]];
		
		var aStartTime = aTimeEntry["StartTime"].replace(/[\/]/g,"");
		
		var aStartDate = eval("new " + aStartTime);
		aStartDate.addHours(aOffset);

		aItem["startDate"] = aStartDate.myISO();
		if (aProject) {
			aItem["project"] = aProject["Name"];
		}
		if (aClient) {
			aItem["client"] = aClient["Name"];
		}
		if (aTask["Description"]) {
			aItem["category"] = aTask["Description"];
		}

		aItem["user"] = aUser["FirstName"] + " " + aUser["LastName"];

		if (aTimeEntry["Comment"]) {
			aItem["notes"] = aTimeEntry["Comment"];
		}
		
		aItem["minutes"] = Math.round(aTimeEntry["DurationSeconds"] / 60);
		aItem["cost"] = aRate * (aItem["minutes"] / 60)
		aItem["uid"] = "de.logmytime." + aTimeEntry["ID"];

		result.push(aItem);
	}
	return result;
}
