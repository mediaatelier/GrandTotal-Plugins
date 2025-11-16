/*
 * TimeTrack Enterprise Import Plugin for GrandTotal
 * 
 * This plugin imports time entries from TimeTrack Enterprise via their REST API
 * 
 * Keep in mind that you can't use browser specific calls. Use following calls:
 * 
 * --Loading httpContents--
 * loadURL(method,url,headers);
 * 
 * --Logging to the Console--
 * log(value);
 * 
 * --Base64--
 * base64Encode(string);
 * 
 * Expected result is a JSON string representation of an array.
 * 
 * [
 *     {"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.toggle.233283908"},
 *     {"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.toggle.233275239"}
 * ]
 * 
 * Make *sure* the uid you provide is not just a plain integer.
 * 
 * Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)
 * 
 * Returning a string will present it as warning.
 * 
 * To see how to add global variables (Settings) look at the Info.plist of this sample.
 * 
 * Keep in mind that for security reasons passwords are stored in the keychain and
 * you will have to enter them again after modifying your code.
 */

// Main entry point - start the import process
importTimedEntries();



/**
 * Makes an authenticated HTTP GET request to TimeTrack Enterprise API
 * 
 * @param {string} endpoint - The API endpoint to call
 * @returns {Object|null} Parsed JSON response or null if request failed
 */
function httpGETEndpoint(endpoint) {
    // Construct the full API URL
    url = "https://" + account + ".timetrackenterprise.com/api/v2/ext/" + endpoint;
    
    // Set up authentication headers
    header = {
        'X-TimeTrack-Api-Secret': secret,
        'X-TimeTrack-Api-Key': key,
        'content-type': 'application/json'
    };
    
    // Make the HTTP request
    string = loadURL("GET", url, header);
    
    // Return null if no response received
    if (string.length == 0) {
        return null;
    }
    
    // Parse and return JSON response
    return JSON.parse(string);
}



/**
 * Imports timed entries from TimeTrack Enterprise API
 * Fetches project time entries and formats them for GrandTotal
 * 
 * @returns {Array|string} Array of formatted time entries or error message
 */
function importTimedEntries() {
    let result = [];
    
    // Fetch time entries from API (limited to 1000 entries, page 1)
    let entries = httpGETEndpoint("project_time_entries?limit=1000&page=1");
    
    // Handle API errors
    if (entries.grandtotal_error) {
        if (entries.server_error) {
            return entries.server_error.message;
        } else {
            return entries.grandtotal_error;
        }
    }
    
    // Process each time entry
    entries.forEach(entry => {
        let item = {};
        
        // Map TimeTrack fields to GrandTotal format
        item.client = entry.clientName;
        item.project = entry.projectName;
        item.category = entry.task;
        item.startDate = entry.from.replace(/.000Z$/, ''); // Fix time format by removing .000Z suffix
        item.minutes = entry.workedMinutes;
        item.cost = entry.hourRate / 60 * entry.workedMinutes;
        item.notes = entry.details;
        item.user = entry.user;
        
        // Add tags as labels if they exist
        if (typeof(entry.tags) == "string") {
            item.label = entry.tags;
        }
        
        // Generate unique identifier
        item.uid = "com.timetrackenterprise." + entry.id;
        
        // Only include billable entries
        if (typeof entry.billable == 'boolean' && entry.billable == 1) {
            result.push(item);
        }
    });
    
    return result;
}

