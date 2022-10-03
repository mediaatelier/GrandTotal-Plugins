/*
	Keep in mind that you can't use browser specific calls. Use following calls
	
	--Loading httpContents--
	String loadURL(method,url,headers);
	
	--Files--
	BOOL fileExists(path);
	BOOL fileIsDirectory(path);
	String contentsOfFile(path);
	String plistToJSON(String);
	Array of Strings contentsOfDirectory(path);
	
	NSHomeDirectory variable
	
	--Logging to the Console--
	log(value);
	
	--Base64--
	String base64Encode(string);
	
	Expected result is a JSON string representation of an array.
	
	[
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.toggle.233283908"},
		{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.toggle.233275239"}
	]
	
	Make *sure* the uid you provide is not just a plain integer. Use your domain as prefix.
	
	Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

	Returning a string will present it as warning.	
	
	To see how to add global variables (Settings) look at the Info.plist of this sample.
	
	Keep in mind that for security reasons passwords are stored in the keychain and
	you will have to enter them again after modifying your code.
	
*/


timedEntries();



function timedEntries()
{	
	var path = PluginDirectory + "Script.applescript";
	var script = contentsOfFile(path);
 	var json = executeAppleScript(script);
 	
 	var entries = JSON.parse(json);
 	
 	var result = [];
 	
	var clients = entries["groups"];
 	var nodes = entries["nodes"];

 	clients["ARCHIVE"] = {"type":"archive"};

	parents = {};
	 	
 	for (node of nodes)
 	{ 	
 		if (node["parent"])
 		{
			parents[node["id"]] = clients[node["parent"]];
 		}
 		
	}
	
 	
 	var tasks = entries["tasks"];
 	var keys = Object.keys(tasks)
 	
 	for (key of keys)
 	{
 		task = tasks[key];
 		rate = task["rate"];
 		if (!rate) {
 			rate = 0;
 		}
 		project = task["title"];
 		records = task["records"];
 		
 		
 		client = parents[key];
 		if (client)
 		{
 			if (client["type"] == "archive")
 			{
 				continue;
 			}
 		}
 		

 		for (record of records)
 		{
 			start = new Date(record["start"]);
 			end = new Date(record["end"]);
 			minutes =  (((end - start)/1000)/60);
 			if (minutes > 0 && roundTo > 0)
			{
				minutes = Math.ceil(minutes/roundTo) * roundTo;
			}
 			item = {};
 			item["startDate"] =  new Date(record["start"]);
 			item["notes"] = record["note"];
 			item["uid"] = key + record["start"]; // this is totally not a uid
 			item["rate"] = rate;
 			item["project"] = project;
 			item["minutes"] = minutes;
 			item["cost"] = rate / 60 * minutes;
 			
 			if (client)
 			{
 				item["client"] = client["title"];
 			}
 			
 			result.push(item);
  		}

 		
 	}
 	return result;
}
