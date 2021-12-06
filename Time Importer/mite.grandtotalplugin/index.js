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
	header = {Authorization:'Basic ' + base64Encode(token + ':api_token')};
	string = loadURL("GET",theUrl,header);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}


function getPage(page)
{
	return httpGetJSON("https://" + accountName + ".mite.yo.lk/time_entries.json?from=last_year&project_id=all_active&limit=1000&page=" + page);
}



function timedEntries()
{
	var result = [];
	for (page = 1; page < 21; page++)
	{
		aArray = getPage(page);
		if (aArray["grandtotal_error"]) 
		{
			return aArray["grandtotal_error"];
		}
		if (aArray.length == 0)
		{
			break;
		}
		for (var i = 0; i < aArray.length; i++) 
		{
			aEntry = aArray[i]["time_entry"];
			var aItemResult = {};
			aItemResult["client"] =  aEntry["customer_name"];
			aItemResult["project"] =  aEntry["project_name"];
			aItemResult["category"] =  aEntry["service_name"];
			aItemResult["user"] =  aEntry["user_name"];
			aItemResult["uid"] =  "lk.yo.mite." + aEntry["id"];
			aItemResult["minutes"] = aEntry["minutes"];
			aItemResult["rate"] = aEntry["hourly_rate"] / 100;
			aItemResult["cost"] = aEntry["revenue"] / 100;
			aItemResult["notes"] = aEntry["note"];
			aItemResult["unit"] = "h";
			aItemResult["startDate"] = aEntry["date_at"] + "T00:00:00";
			var datePart = aEntry["date_at"].replace(/-/g,"/");
			aItemResult["url"] = "https://"+ accountName + ".mite.yo.lk/daily#"+ datePart +"?open=time_entry_"+  aEntry["id"];
			if (aEntry["billable"] > 0 && aEntry["locked"] == 0) {
				result.push(aItemResult);
			}
		}
	} 
	return result;
}
