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
	var b64 = base64Encode(username + ":" + password);	
	header = {"Authorization":"Basic " + b64};
	string = loadURL("GET",theUrl,header);
	
//	log(theUrl);
	if (string.length == 0)
	{
		return null;
	}
	
	try
	{
 	  	grandtotal.sleep(0.05);
	} 
	catch (error)
	{
	}

	
	return JSON.parse(string);
}



function timedEntries()
{
	var aServiceRequests = httpGetJSON("https://portal.mobilefieldreport.com/odata/ServiceRequests?$expand=Qualifications");

	if (aServiceRequests["grandtotal_error"])
	{
		return aServiceRequests["grandtotal_error"];
	}
		
	if (!aServiceRequests)
	{
		return "Check your settings, please";
	}
	
	
	companies = {};
	
	var aContacts = httpGetJSON(`https://portal.mobilefieldreport.com/odata/Companies?$expand=Contacts,Tags,ServiceObjects,MainContact`);
	for (aContact of aContacts.value)
	{
		companies[aContact.Id] = aContact;
	}
	
	
	
	result = [];

	
	for (aServiceRequest of aServiceRequests.value)
	{
	
		//log(aServiceRequest);
		var id = aServiceRequest.Id;
		var companyId = aServiceRequest.CompanyId;
		//var aTimes = httpGetJSON(`https://portal.mobilefieldreport.com/odata/ServiceRequests(${id}L)?$expand=TimeEvents&$select=TimeEvents`);
	
			
		var aItems = httpGetJSON(`https://portal.mobilefieldreport.com/odata/ServiceRequests(${id}L)?$expand=Items&$select=Items`);
	
	
	
		//log(companyId);
		//			log(aServiceRequest);

		
		for (aItem of aItems.Items)
		{

			var aItemResult = {};
			aItemResult.client = aServiceRequest.CustomerId;
			aItemResult.category = aItem.NameOrNumber;
			if (aItem.Note)
			{
				aItemResult.notes = aItem.Note;
			}
			aItemResult.project = aServiceRequest.Name;
			aItemResult.startDate = aServiceRequest.DueDateRangeEnd;
			if (aItem.UnitString) {
				aItemResult.unit = aItem.UnitString;
			}
			aItemResult.cost = aItem.Price;
			//log(aItem);
			
			//aItemResult.minutes = aItem.QuantityHours * 60;
			
			if (aItem.Type == "Material")
			{
				result.push(aItemResult);
			}
		}
	}
	
	return result;
}
