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

// Check plugin type and route accordingly
if (pluginType() === "estimates") {
	sendEstimate();
} else {
	timedEntries();
}

function sendEstimate() {
    var estimate = query().record().valueForKey("interchangeRecord");
 	var clientName = estimate.clientName;
    var projectName = estimate.project === "" ? estimate.subject : estimate.project;
    var hasTitles = false;

    var parameters = [clientName,projectName];

    estimate.allItems.forEach((item, index) => {
        var entityName = item.entityName.toLowerCase();
    	 if (entityName == "title" || entityName == "option") {
    	 		hasTitles = true;
    	 }
    });


    estimate.allItems.forEach((item, index) => {

    	var entityName = item.entityName.toLowerCase();
    	if (hasTitles) {
    	 	if (entityName == "title" || entityName == "option") {
    	 		parameters.push(item.name);
    	 	}
    	 }
    	 else
    	 {
    	 	if (entityName != "title" && entityName != "option" && entityName != "subtotal" && entityName != "pagebreak") {
    	 		parameters.push(item.name);
    	 	}
    	 }
    });

	var quotedAndCommaSeparated = "{\"" + parameters.map(param => param.replace(/\\/g, '\\\\').replace(/"/g, '\\"')).join("\",\"") + "\"}";


	var path = PluginDirectory + "Script.applescript";
	var script = contentsOfFile(path);


	script = "processList(" + quotedAndCommaSeparated + ")" + script;

    executeAppleScript(script);
}

function timedEntries()
{
	if (defaultRate == 0)
	{
		return localize("Set rate");
	}
	
	if (token)
	{
		return timeEntriesAPI();
	}
	else
	{
		return timeEntriesLocal();
	}
}


function timeEntriesAPI()
{
	var url = "https://web.timingapp.com/api/v1/time-entries?is_running=false&include_project_data=true&include_team_members=true&start_date_min=2010-01-01&start_date_max=2050-01-01&billing_status[]=billable&billing_status[]=billed&billing_status[]=paid&billing_status[]=undetermined";
	var counter = 0;
	var result = [];

	// Paginate through up to the first 5 pages, aborting if there is no next page available.
	while (url && counter < 5)
	{
		var response = httpGetJSON(url);

		// Error reporting.
		if (response["message"]) {
			return "Timing API Error: " + response["message"];
		}
		if (response["server_error"]) {
			return "Timing API Error: " + JSON.stringify(response["server_error"]);
		}
		if (response["grandtotal_error"]) {
			return "Timing API Error: " + response["grandtotal_error"];
		}

		// Iterate through response["data"] and add each item to result.
		var items = response["data"];
		for (itemToParse of items) 
		{
			if (filterString
				// Suppress items that either have no project at all or whose project title chain does not contain the filter string.
				&& (!itemToParse["project"]
					|| !itemToParse["project"]["title_chain"].join(" ▸ ").includes(filterString)))
			{
				continue;
			}

			lineitem = transformItem(itemToParse, "https://web.timingapp.com/time-entries/");
			result.push(lineitem);
		}

		// Iterate through meta["links"] to find the first element with "next" in "label" whose url starts with "https".
		var meta = response["meta"];
		url = null;
		for (link of meta["links"]) {
			if (typeof(link["url"]) == "string"
				&& link["label"].toLowerCase().includes("next")
				&& link["url"].startsWith("https"))
			{
				url = link["url"];
				break;
			}
		}
		counter++;
	}
	return result;
}

	
function timeEntriesLocal()
{
	// Update billing status in Timing first
	updateBillingStatus();

	var path = PluginDirectory + "Script.applescript";
	var script = contentsOfFile(path);
	var dest = NSTemporaryDirectory + "Timing.csv";
	var years = 1;
	if (loadAll)
	{
		years = 5;
	}
	script = script.replace("<destination/>",dest);
	script = script.replace("<years/>",years);

 	var error = executeAppleScript(script);
 	if (error["NSAppleScriptErrorMessage"])
 	{
 		return error["NSAppleScriptErrorMessage"];
 	}
 	var content = contentsOfCSVFile(dest);
 	var counter = 0;
 	var result = [];
 	for (line of content) 
 	{
 		if (counter > 0)
 		{
 			var project = {};
 			var itemToParse = {};
 			itemToParse["project"] = project;
 			itemToParse["start_date"] = line[2];
 			itemToParse["duration"] = line[1];
 			itemToParse["notes"] = line[6];
 			itemToParse["title"] = line[5];
 			itemToParse["self"] = line[0];
 			var projectPath = line[4];
 			if (!projectPath) {
 				projectPath = "";
 			}
			project["title_chain"] =  projectPath.split(" ▸ ");
 			if (filterString && !projectPath.includes(filterString))
 			{
 				continue;
 			}
 			var lineitem = transformItem(itemToParse,"timing2://editTask/");
			result.push(lineitem);
 		}
 		counter++
 	}
 	return result;
}


function transformItem(item, urlPrefix) {
    lineitem = {};
    var rate = defaultRate;
    
    if (item["project"]) {
        var parsedComponents = parseComponents(item["project"]["title_chain"]);

        if (parsedComponents["rate"] != null) {
            rate = parsedComponents["rate"];
        }
        lineitem["client"] = parsedComponents["client"];
        lineitem["project"] = parsedComponents["project"];
        lineitem["category"] = parsedComponents["category"];
    }
    
    // Check for rate in time entry title
    if (item["title"]) {
        var extracted = extractRate(item["title"]);
        if (extracted.rate !== null) {
            rate = extracted.rate;
        }
        lineitem["category"] = extracted.cleanString;
    }
    
    lineitem["user"] = fixString(item["creator_name"]);
    lineitem["startDate"] = item["start_date"];
    lineitem["notes"] = fixString(item["notes"]);
    lineitem["minutes"] = item["duration"] / 60;

    var aMinutes = lineitem["minutes"];
    if (aMinutes > 0 && roundTo > 0) {
        aMinutes = Math.ceil(aMinutes/roundTo) * roundTo;
        lineitem["minutes"] = aMinutes;
    }
    lineitem["cost"] = rate * lineitem["minutes"] / 60;
    var uid = item["self"].split("/").pop();
    lineitem["uid"] = "info.eurocomp.Timing.TaskActivity." + uid;
    lineitem["url"] = urlPrefix + uid;
    return lineitem;
}


function fixString(string)
{
	if (typeof(string) == "string") 
	{
		return string;
	}
	return "";
}


function parseComponents(rawComponents) {
    var result = {};
    var projectComponents = new Array();
    for (index in rawComponents) {
        var projectComponent = rawComponents[index];
        var extracted = extractRate(projectComponent);
        
        if (extracted.rate !== null) {
            result["rate"] = extracted.rate;
        }
        projectComponents.push(extracted.cleanString);
    }
            
    var clientOffset = 0;
    
    // if root is eg. "billable" this folder is ingnored
    if (projectComponents[0] == filterString && projectComponents.length > 2) {
        clientOffset = 1;
    }
    result["category"] = "";
    if (projectComponents.length == 1) {
        result["project"] = projectComponents[0];
        result["client"] = localize("Move project '%' in a folder named after your client").replace("%",lineitem["project"]);
    } else {
        result["client"] = projectComponents[clientOffset];
        result["project"] = projectComponents[clientOffset + 1];
        if (projectComponents.length > clientOffset + 1) {
            result["category"] = projectComponents[clientOffset + 2];
        }
    }
    return result;
}


function extractRate(string) {
    if (typeof(string) != "string") {
        return { rate: null, cleanString: "" };
    }
    // Matches numbers in parentheses with zero or one dot at the end of the string
    var matches = string.match(/.+\s(\((\d+[\,\.]?\d*)\))$/);
    if (matches) {
        var rate = parseFloat(matches[2].replace(",","."));
        var cleanString = string.replace(/\s*\(\d+[\,\.]?\d*\)$/, "").trim();
        return { rate: rate, cleanString: cleanString };
    }
    return { rate: null, cleanString: string };
}


function httpGetJSON(theUrl)
{
	header = {Authorization:'Bearer ' + token};
	string = loadURL("GET",theUrl,header);
	if (string.length == 0)
	{
		return null;
	}
	return result =  JSON.parse(string);
}


function updateBillingStatus()
{
	try
	{
		var prefix = "info.eurocomp.Timing.TaskActivity.";

		// Get UIDs from GrandTotal
		var billedUIDs = getBilledUIDs(prefix);
		var paidUIDs = getPaidUIDs(prefix);

		// Extract numeric IDs from UIDs
		var billedIDs = [];
		for (uid of billedUIDs)
		{
			var id = uid.replace(prefix, "");
			if (id && id.length > 0)
			{
				billedIDs.push(id);
			}
		}

		var paidIDs = [];
		for (uid of paidUIDs)
		{
			var id = uid.replace(prefix, "");
			if (id && id.length > 0)
			{
				paidIDs.push(id);
			}
		}

		// Only update if there are IDs to update
		if (billedIDs.length > 0 || paidIDs.length > 0)
		{
			if (token)
			{
				// Use API for team accounts
				updateBillingStatusAPI(billedIDs, paidIDs);
			}
			else
			{
				// Use AppleScript for local accounts
				var path = PluginDirectory + "UpdateBillingStatus.applescript";
				var script = contentsOfFile(path);

				script = script.replace(/<billableIDs\/>/g, "");
				script = script.replace(/<billedIDs\/>/g, billedIDs.join(","));
				script = script.replace(/<paidIDs\/>/g, paidIDs.join(","));

				executeAppleScript(script);
				// Silently ignore any errors - feature might not be available in older Timing versions
			}
		}
	}
	catch (e)
	{
		// Silently ignore errors - feature might not be available
	}
}


function updateBillingStatusAPI(billedIDs, paidIDs)
{
	try
	{
		// Update billed entries
		if (billedIDs.length > 0)
		{
			var billedUrl = "https://web.timingapp.com/api/v1/time-entries/batch-update";
			var billedPayload = JSON.stringify({
				time_entries: billedIDs,
				data: {
					billing_status: "billed"
				}
			});

			var header = {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			};

			loadURL("PATCH", billedUrl, header, billedPayload);
			// Silently ignore any errors
		}

		// Update paid entries
		if (paidIDs.length > 0)
		{
			var paidUrl = "https://web.timingapp.com/api/v1/time-entries/batch-update";
			var paidPayload = JSON.stringify({
				time_entries: paidIDs,
				data: {
					billing_status: "paid"
				}
			});

			var header = {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			};

			loadURL("PATCH", paidUrl, header, paidPayload);
			// Silently ignore any errors
		}
	}
	catch (e)
	{
		// Silently ignore errors - feature might not be available or network issues
	}
}
