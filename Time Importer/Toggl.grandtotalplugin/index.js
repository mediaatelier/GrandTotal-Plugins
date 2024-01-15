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

import utils.js


timedEntries();


function timedEntries()
{
	var aEndDate = new Date();
	var aEndDateString = aEndDate.yyyymmdd();
	var aStartDate = new Date();
	aStartDate.setDate(aEndDate.getDate() - 365);
	var aStartDateString = aStartDate.yyyymmdd();


	var result = [];
	var aWorkspaces = httpGetJSON("https://api.track.toggl.com/api/v9/workspaces");
	if (aWorkspaces["grandtotal_error"])
		return aWorkspaces["grandtotal_error"];
		
	if (!aWorkspaces)
	{
		return "Check your settings, please";
	}
	
	if (defaultRate == 0 && aPremium == 0)
	{
		return localize("Set rate");
	}	

	for (aIndex in aWorkspaces)
	{
		aWorkspace = aWorkspaces[aIndex];

		var aWorkspaceID = aWorkspace["id"];
		var aWorkspaceName = aWorkspace["name"];
		var aPremium = aWorkspace["premium"];
		
		/// get all projects first
	
		var aProjects = httpGetJSON("https://api.track.toggl.com/api/v9/workspaces/" + aWorkspaceID + "/projects");
		var aProjectIDs = {};
	
		
		
		for(aEntry in aProjects)
		{
			aProject =  aProjects[aEntry];
			aProjectIDs[aProject["id"]] = aProject;
		}
	


		var lastpage = false;
		var pageNum = 1;
		
		var aExtraQuery = "";
		
		if (aPremium == 1)
		{
			aExtraQuery = "&billable=YES";
		}

		while (!lastpage)
		{
			var aArray = httpGetJSON("https://api.track.toggl.com/reports/api/v2/details?workspace_id=" + aWorkspaceID 	+"&since="+ aStartDateString + "&until="+ aEndDateString + "&user_agent=api_test&page=" + pageNum + aExtraQuery);
			var aItems = aArray["data"];
				
			for (aEntry in aItems)
			{
				var aItemResult = {};
			
				aItemResult["startDate"] = aItems[aEntry]["start"];
				if (aItems[aEntry]["client"])
					aItemResult["client"] = aItems[aEntry]["client"];
				if (aItems[aEntry]["project"])
					aItemResult["project"] = aItems[aEntry]["project"];
				if (aItems[aEntry]["task"])
					aItemResult["category"] = aItems[aEntry]["task"];
				aItemResult["minutes"] = Math.round(aItems[aEntry]["dur"] / 60000);
				aItemResult["notes"] = aItems[aEntry]["description"];
				aItemResult["user"] = aItems[aEntry]["user"] + " ("+ aWorkspaceName +")";
				aItemResult["label"] = aItems[aEntry]["tags"].join(", ");

			
				var cost = aItems[aEntry]["billable"];
			
				if (!cost)
				{
					cost = aItemResult["minutes"] / 60 * defaultRate;
				}
				
				var aRate = aWorkspace.default_hourly_rate;
				if (!aRate && !aPremium) {
					aRate = defaultRate;
				}
			
				var pid = aItems[aEntry]["pid"];
			
				if (pid)
				{
					var aProject = aProjectIDs[pid];
					if (aProject)
					{
						if (aProject.rate)
						{
							aRate = aProject.rate;
						}
						if (aRate != undefined)
						{
							cost = aItemResult["minutes"] / 60 * aRate;
						}
					}
				}
			
				aItemResult["cost"] = cost;
				
				
				aMinutes = aItemResult["minutes"];
				if (aMinutes > 0 && roundTo > 0)
				{
					if (!aRate)
					{
						aRate = aItemResult["cost"] / (aMinutes / 60);
					}
					aMinutes = Math.ceil(aMinutes/roundTo) * roundTo;
					aItemResult["minutes"] = aMinutes;
					aItemResult["cost"] =  aMinutes / 60 * aRate;
				}
				aItemResult["uid"] = "com.toggle." + aItems[aEntry]["id"];
			
				result.push(aItemResult);
			}
			
	
			if (aArray["total_count"] < aArray["per_page"] || pageNum == 10)
			{
				lastpage = true;
			}
			else {
				pageNum++;
			}
		}
	}
	
	
	return JSON.stringify(result);
}
