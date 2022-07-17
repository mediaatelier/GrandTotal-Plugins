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

if (pluginType() == "timeexporter")
{
	exportTimedEntries();
}
else
{
	importTimedEntries();
}



function httpPostJSON(theUrl,body)
{
	header = {Authorization:'Bearer ' + token,'content-type':'application/json'};
	string = loadURL("POST",theUrl,header,body);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}



function importTimedEntries()
{

	var startDate = new Date();
	startDate.setFullYear(startDate.getFullYear() - 1);
	startCursor = "";
	
	
	query = { "query": "{teams { nodes { id, name }}}" }
	response = httpPostJSON("https://1.clockograph.com/api/graphql",query);
	if (response["grandtotal_error"]) {
		return localize("Please check your settings");
	}
	
	
	teamID = response["data"]["teams"]["nodes"][0]["id"];
	

		
	var result = [];

	do
	{
		query = {  "query": "query recordTimesByTeamId($teamId: ID, $startsGte: String, $before: String) { recordTimesByTeamId(teamId:$teamId, startsAt:{gte:$startsGte}, last:1000, before:$before) { nodes { id, startsAt, duration, note, labels { name }, rate, price, subproject { name, project { name, client { name } } }, teamMember { nickname } } pageInfo { startCursor hasPreviousPage } }}", 
			
			"variables": {"teamId" :teamID, "startsGte": startDate.toISOString(), "before": startCursor} };
				
	
		response = httpPostJSON("https://1.clockograph.com/api/graphql",query);
		
		rows = response["data"]["recordTimesByTeamId"]["nodes"];
		pageInfo = response["data"]["recordTimesByTeamId"]["pageInfo"];

	
		for (var i = 0; i < rows.length; i++)
		{
			var aEntry = rows[i];
			var aItemResult = {};
		
			if (aEntry["isRunning"])
			{
				continue;
			}
	
			aItemResult["uid"] =  "1.clockograph.com." + aEntry["id"];
			aItemResult["minutes"] = aEntry["duration"];
			aItemResult["startDate"] = aEntry["startsAt"];
			aItemResult["notes"] = aEntry["note"];
      aItemResult["rate"] = aEntry["rate"];
			aItemResult["cost"] = aEntry["price"];
			aItemResult["label"] = aEntry["labels"].map(label => label.name).join(", ");
			aItemResult["category"] = aEntry["subproject"]["name"];
			aItemResult["project"] = aEntry["subproject"]["project"]["name"];
			aItemResult["client"] = aEntry["subproject"]["project"]["client"]["name"];
			aItemResult["user"] = aEntry["teamMember"]["nickname"];

			result.push(aItemResult);
		}
		startCursor = pageInfo["startCursor"];
	} while (pageInfo["hasPreviousPage"] == 1)
	
	return result;
}
