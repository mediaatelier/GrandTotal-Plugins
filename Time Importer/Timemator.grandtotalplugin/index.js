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





function timedEntries()
{
    var dataPath = grandtotal.fileManager.homeDirectory + "/Library/Application Support/com.catforce.timemator.macos/Data/timemator.storedata";
    if (!grandtotal.fileManager.fileExists(dataPath))
    {
    	dataPath = grandtotal.fileManager.homeDirectory + "/Library/Containers/com.catforce.timemator.macos/Data/Library/Application\ Support/com.catforce.timemator.macos/Data/timemator.storedata"; 
	}
	var db = grandtotal.SQLite.openDatabase(dataPath);
	if (!db)
	{
		return "No data found";
	}
	var nodes = db.executeQuery("SELECT * FROM ZNODE");
	
	
	var newNodes = {};
	
	for (const node of nodes)
	{
		var newNode = {};
		
		newNode["name"] = node["ZNAME"];
		newNode["id"] = node["Z_PK"];
		newNode["parentID"] = cleanString(node["ZPARENT"]);
		newNode["archived"] = node["ZARCHIVED"];
		newNodes[node["Z_PK"]] = newNode;
	} 
		
	var sessions = db.executeQuery("SELECT * FROM ZSESSION");
	var result = [];
	
	for (const session of sessions)
	{
		seconds = session["ZCONFIRMEDDURATION"];
		rate = session["ZHOURLYRATE"];
		taskID = session["ZTASK"];
		
		minutes = seconds / 60;
		minutes = Math.ceil(minutes);
				
		var resultItem = {};
		resultItem["notes"] = cleanString(session["ZNOTES"]);
		resultItem["startDate"] = cleanDate(session["ZBEGIN"]);
		resultItem["minutes"] = minutes;
		resultItem["rate"] = rate;
		resultItem["uid"] = cleanString(session["ZIDENTIFIER"]);
		resultItem["cost"] = rate * (minutes / 60);
		
		
		category = newNodes[taskID];
		resultItem["category"] = category["name"];
		if (category["archived"])
		{
			continue;
		}
		
		if (category["parentID"])
		{
			project = newNodes[category["parentID"]];
			resultItem["project"] = project["name"];
			if (project["archived"])
			{
				continue;
			}
		
			if (project["parentID"])
			{
				client = newNodes[project["parentID"]];
				resultItem["client"] = client["name"];
				if (client["archived"])
				{
					continue;
				}
			}
		}
		result.push(resultItem);

	}
	db.close();
	return result;
}


function cleanString(input)
{
	if (input == null)
		return undefined;
	else
		return input;
}


function cleanDate(input)
{
	result =  new Date((input + 978303600) * 1000);
	result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
	return result;
}

