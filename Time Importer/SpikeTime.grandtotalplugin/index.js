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
	header = {XAPIKEY:token};
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
		result[theJSON[aEntry]["Id"]] = theJSON[aEntry];

	}
	return result;
}


function timedEntries()
{
	var aTestdate = new Date()
	var aOffset = aTestdate.getTimezoneOffset() / 60 * -1;

	var result = [];
	
	var aCustomers = httpGetJSON("https://www.spiketime.de/api/Customer");
	if (aCustomers["grandtotal_error"]) {
		return aCustomers["grandtotal_error"];
	}
	if (aCustomers == null) {
		return "Check your account settings";
	}
		
	var aCustomersLookup =  createIDLookUp(aCustomers);
	var aProjects = httpGetJSON("https://www.spiketime.de/api/Project");
	var aProjectsLookup =  createIDLookUp(aProjects);
	
	var aRates = httpGetJSON("https://www.spiketime.de/api/Rate");
	var aRatesLookup =  createIDLookUp(aRates);
	
	var aUsers = httpGetJSON("https://www.spiketime.de/api/user/all");
	var aUsersLookup =  createIDLookUp(aUsers);
	
	var aEndDate = new Date();
	var aEndDateString = aEndDate.yyyymmdd();
	var aStartDate = new Date();
	aStartDate.setDate(aEndDate.getDate() - 180);
	if (loadAll) {
		aStartDate.setDate(aEndDate.getDate() - 720);
	}
	var aStartDateString = aStartDate.yyyymmdd();
	
	var aTimeEntries = httpGetJSON("https://www.spiketime.de/api/TimeEntry?DateFrom="+ aStartDateString+ "&DateTo=" + aEndDateString);
	
	for (aTimeEntryIndex in aTimeEntries)
	{
		var aItem = {};
		var aTimeEntry = aTimeEntries[aTimeEntryIndex];
		var aRate = aTimeEntry["RateAmount"];
		var aBillable = aTimeEntry["IsBillable"];

		var aMinutes = aTimeEntry["DurationMinutes"];
		var aProjectID = aTimeEntry["ProjectId"];
		var aProject =  aProjectsLookup[aProjectID];
		if (aProject)
		{
			var aClientID = aProject["Customer_Id"];
			var aCustomer = aCustomersLookup[aClientID];
		}
		var aUserID = aTimeEntry["UserId"];
		var aUser = aUsersLookup[aUserID];
		
		var aRate =  aTimeEntry["RateAmount"];
				
		var aRateID = aTimeEntry["RateId"];
		if (aRateID)
		{
			aRate = aRatesLookup[aRateID]["Amount"];
			aItem["category"] = aRatesLookup[aRateID]["Name"];
		}

		
		var aDate = aTimeEntry["DateTimeFrom"];
		if (!aDate)
			aDate = aTimeEntry["EntryDate"];
		

		
		if (aBillable == 0) {
			continue;
		}
		if (aMinutes == 0) {
			continue;
		}
		aItem["startDate"] = aDate + "+" + aOffset;
		if (aTimeEntry["Description"]) {
			aItem["notes"] = aTimeEntry["Description"];
		}
		aItem["minutes"] = aMinutes;
		aItem["project"] = aProject["Name"];
		aItem["cost"] = aRate *  (aMinutes / 60);
		aItem["user"] = aUser["Name"];
		aItem["client"] = aCustomer["Name"];
		aItem["uid"] = "de.spiketime." + aTimeEntry["Id"];
		result.push(aItem);
	}
	return result;
}
