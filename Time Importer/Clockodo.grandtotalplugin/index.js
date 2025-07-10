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

Date.prototype.yyyymmddhhss = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var hh =  this.getHours().toString();
   var min =  this.getMinutes().toString();
   var ss =  this.getSeconds().toString();

   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + "T" + (hh[1]?hh:"0"+hh[0]) + ":"
   + (min[1]?min:"0"+min[0]) + ":" + (ss[1]?ss:"0"+ss[0]) + "Z"
   ; // padding
};


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
	return "https://my.clockodo.com/api/v2/" + theEndPoint;
}



timedEntries();

function httpGetJSON(theUrl)
{
	header = {"X-ClockodoApiUser":email,"X-ClockodoApiKey":token, "X-Clockodo-External-Application": "GrandTotal;info@mediaatelier.com"};
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




function timedEntries()
{
	var aEndDate = new Date();
	aEndDate.setDate(aEndDate.getDate() + 1);
	var aEndDateString = aEndDate.yyyymmddhhss();
	var aStartDate = new Date();
	aStartDate.setDate(aEndDate.getDate() - 365);
	var aStartDateString = aStartDate.yyyymmddhhss();
	var aTestdate = new Date()
	var aOffset = aTestdate.getTimezoneOffset() / 60 * -1;
	
	
	
	var aUser = httpGetJSON( urlForEndPoint("aggregates/users/me"));
	
	if (!aUser["user"])
	{
		return "Check your settings, please";
	}
	
	
	var aProjects = httpGetJSON( urlForEndPoint("projects"));
	aProjects = aProjects["projects"];
	var aProjectsLookup = createIDLookUp(aProjects);
	
	
	var result = [];
	var paging = {};
	var page = 1;
	do
	{
		var aItems = httpGetJSON( urlForEndPoint("entries") + "?time_since=" + aStartDateString + "&time_until=" + aEndDateString  + "&page=" + page + "&enhanced_list=true&filter[billable]=1");
		aPaging = aItems["paging"];
		
		if (!aPaging)
		{
			displayUserNotification(localize("Too many requests for clockodo"),localize("Please wait or switch to another service"));
			break;
		}

		
		aEntries = aItems["entries"];
		for (aIndex in aEntries)
		{
			var aItemResult = {};
			var aEntry = aEntries[aIndex];
			
			

			aRate = aEntry["hourly_rate"];

			aItemResult["startDate"] = aEntry["time_since"];
			aItemResult["uid"] = "com.clockodo." + aEntry["id"];
		
			var aProjectID = aEntry["projects_id"];
			var aProject =  aProjectsLookup[aProjectID];
			var aRevenueFactor = 1; // Default to 1 if no project
		
			if (aProject)
			{
				aRevenueFactor = aProject["revenue_factor"];
				var aBudget = aProject["budget_money"];
				if (aBudget) //// only do this when there is a budget
				{
					if ((!aRevenueFactor || aRevenueFactor == 0)) 
					{
						continue; // nothing to bill
					}
				}
			
			}
			if (aProjectID) {
				projectName = aEntry["projects_name"];
				subprojectName = aEntry["subprojects_name"];
    			if (subprojectName && subprojectName.length > 0) {
        			projectName += " - " + subprojectName;
   				}
				aItemResult["project"] = projectName;
			}
			if (aEntry["customers_id"])
			{
				aItemResult["client"] = aEntry["customers_name"];
			}
			if (aEntry["services_id"])
			{
				aItemResult["category"] = aEntry["services_name"];;
			}
			if (aEntry["revenue"])
			{
				aItemResult["cost"] = aEntry["revenue"];
			}
			if (aEntry["text"])
			{
				aItemResult["notes"] = aEntry["text"];
			}
			if (aEntry["users_name"])
			{
				aItemResult["user"] = aEntry["users_name"];
			}
			if (aEntry["duration"] > 0 && ! aEntry["lumpSum"])
			{
				aItemResult["minutes"] = Math.round(aEntry["duration"] / 60);
				{
					aItemResult["cost"] = (aItemResult["minutes"] / 60) * aRate;
				}
			}
			aItemResult["url"] = "https://my.clockodo.com/en/entries/editentry?id=" + aEntry["id"];
			if (aEntry["billable"] == 1)
			{
				result.push(aItemResult);
			}
		}
		
		page++;
		
	} while (aPaging["count_pages"] > aPaging["current_page"] && page < 5)


	return result;
}
