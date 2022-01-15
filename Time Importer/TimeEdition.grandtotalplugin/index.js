/*
	Keep in mind that you can't use browser specific calls. Use following calls
	
	--Loading httpContents--
	loadURL(method,url,headers);
	
	--Logging to the Console--
	log(value);
	
	--Base64--
	base64Encode(string);
	
	--SLQLite--
	db = openSQLiteDatabase(path);
	array = db.runQuery("SELECT * from 'tablename'");
	
	
	Expected result is a JSON string representation of an array or a js array in the same format
	
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


function timedEntries()
{
	var aItems = findFiles("kMDItemFSName == 'timeEdition.edb'","modificationDate");
	if (aItems.length == 0)
	{
		return localize("Data not found.");
	}
	var aItem = aItems[aItems.length - 1];
	aPath = aItem["path"];
	var aDB = openSQLiteDatabase(aPath);
	var aItems = aDB.runQuery("SELECT * from 'records'");
	var aResult = [];
	for (i = 0; i < aItems.length; i++) {
		var aItem = aItems[i];
		var aLine = {};
		aLine["client"] = aItem["customerNAME"];
		aLine["project"] = aItem["projectNAME"];
		aLine["category"] = aItem["taskNAME"];
		aLine["notes"] = aItem["comments"];
		aLine["startDate"] = aItem["fromTime"].replace(" ","T");
		aLine["endDate"] = aItem["toTime"].replace(" ","T");
		var minutes = aItem["dauer"] / 60000;
		minutes = Math.ceil(minutes);
		aLine["minutes"] = minutes;
		aLine["cost"] = aItem["rate"] * (minutes / 60) ;
		aLine["uid"] = "com.timeEditon." + aItem["_id"];
		aResult.push(aLine);
	} 
	return aResult;
}




