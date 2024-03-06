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

if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}


if (pluginType() == "timeexporter")
{
	exportTimedEntries();
}
else
{
	importTimedEntries();
}


function httpGetJSON(theUrl)
{
	if (!token) {
		return null;
	}
	grandtotal.sleep(0.05);
	header = {Authorization:'Basic ' + base64Encode(token.trim() + ':api_token')};
	string = loadURL("GET",theUrl,header);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}


function httpPostJSON(theUrl,body)
{
	if (!token) {
		return null;
	}
	header = {Authorization:'Basic ' + base64Encode(token.trim() + ':api_token'),'content-type':'application/json'};
	string = loadURL("POST",theUrl,header,JSON.stringify(body));
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}


function getPage(page)
{
	var years = 1;
	if (loadAll)
	{
		years = 5;
	}
	
	var aStartDate = new Date();
	aStartDate.setDate(aStartDate.getDate() - (years * 365));
	var aStartDateString = aStartDate.yyyymmdd();	
	return httpGetJSON("https://" + fixAccountName(accountName) + ".mite.de/time_entries.json?from=" + aStartDateString + "&project_id=all_active&limit=1000&sort=date&page=" + page);
}


function getEndpointValues(endpoint,value)
{
	result = {};
	list = httpGetJSON("https://" + fixAccountName(accountName) + ".mite.de/" + endpoint + ".json");
	for (item in list)
	{
		record = list[item][value];
		keyValue = record["id"];
		result[keyValue] = record;
	}
	return result;
}


function fixAccountName(accountName)
{
	if (accountName != undefined)
	{
		if (accountName.indexOf(".") !== -1)
		{
			newName = accountName.replace(/^https?:\/\//, "")
                              .replace(/^www\./, "")
                              .replace(/\..*/, '');
			return newName;
		}
	}
	return accountName;
}



function importTimedEntries()
{
	if (accountName != undefined)
	{
		if (accountName.indexOf("@") !== -1)
		{
			return localize("Please replace the email in the settings with the account name");
		}
	}
	if (token == undefined) {
		return "No API-Key";
	}
	var result = new Array();

	for (page = 1; page < 21; page++)
	{
		aArray = getPage(page);
		if (aArray["grandtotal_error"]) 
		{
			return aArray["grandtotal_error"];
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
			aItemResult["startDate"] = new Date(aEntry["date_at"] + "T00:00:00");
			var datePart = aEntry["date_at"].replace(/-/g,"/");
			aItemResult["url"] = "https://"+ accountName + ".mite.de/daily#"+ datePart +"?open=time_entry_"+  aEntry["id"];
			if (aEntry["billable"] > 0 && aEntry["locked"] == 0) {
				result.push(aItemResult);
			}
		}
		if (aArray.length == 0)
		{
			break;
		}
		if (aArray.length < 1000)
		{
			break;
		}
	} 
	return result;
}


function getRecordForNameInEndpoint(lookup,name,endpoint,value,extraKey,extraValue)
{
	if (!name) {
		return null;
	}
	
	record = null;
	
	for (i in lookup)
	{
		testrecord = lookup[i];
		if (testrecord["name"] == name)
		{
			if (extraKey && extraValue)
			{
				if (testrecord[extraKey] == extraValue)
				{
					record = testrecord;
					break;
				}
			}
			else
			{
				record = testrecord;
				break;
			}
		}
	}
	

	if (!record)
	{
		payload = {};
		payload["name"] = name;
		if (extraKey && extraValue)
		{
			payload[extraKey] = extraValue;
		}
		body = {};
		body[value] = payload;
		item = httpPostJSON("https://" + accountName + ".mite.de/" + endpoint + ".json",body);
		record = item[value];
		keyValue = record["id"];
		lookup[keyValue] = record;
	}
	return record;
}


function exportTimedEntries()
{
	var existingItems = importTimedEntries();
	
	customers = getEndpointValues("customers","customer");
	projects = getEndpointValues("projects","project");
	services = getEndpointValues("services","service");
	
	skipCount = 0;
	addCount = 0;
	
	for (i in timeentries)
	{
		entry = timeentries[i];
		skip = false;
		for (ii in existingItems)
		{
			existingEntry = existingItems[ii];
			if (entry["client"] == existingEntry["client"])
			{
				if (entry["project"] == existingEntry["project"])
				{
					if (entry["category"] == existingEntry["category"])
					{
						if (entry["minutes"] == existingEntry["minutes"])
						{
							if (entry["startDate"].yyyymmdd() == existingEntry["startDate"].yyyymmdd())
							{
								skip = true;
							} 
						}
					}
				}
			}
		}
		
		if (skip)
		{
			skipCount++;
			continue;
		}
		
		clientName = entry["client"];
		client = getRecordForNameInEndpoint(customers,clientName,"customers","customer");
		if (!client)
		{
			continue;
		}
		projectName = entry["project"];
		project = getRecordForNameInEndpoint(projects,projectName,"projects","project","customer_id",client["id"]);
		if (!project)
		{
			continue;
		}
		serviceName = entry["category"];
		service = getRecordForNameInEndpoint(services,serviceName,"services","service","hourly_rate",entry["rate"] * 100);
		if (!service)
		{
			continue;
		}
		
		addCount++;

		payload = {};
		payload["note"] = entry["notes"];
		payload["minutes"] = entry["duration"] / 60;
		payload["service_id"] = service["id"];
		payload["project_id"] = project["id"];
		payload["date_at"] = entry["startDate"].yyyymmdd();
		body = {};
		body["time_entry"] = payload;
		httpPostJSON("https://" + accountName + ".mite.de/" + "time_entries" + ".json",body);
	}
	
	displayUserNotification("mite",
		localize("Created %d records").replace("%d",addCount) + "\n" + 
		localize("Ignored %d duplicates").replace("%d",skipCount)
	);	

}
