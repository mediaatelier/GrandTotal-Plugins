/*
 * TrackingTime Import Plugin for GrandTotal
 * 
 * This plugin imports time tracking data from TrackingTime.co via their REST API
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
 * Expected result is a JSON representation of an array.
 * 
 * [
 *     {"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.trackingtime.233283908"},
 *     {"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.trackingtime.233275239"}
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

/**
 * Extends Date prototype with custom ISO 8601 formatting method
 * Formats date as YYYY-MM-DDTHH:MM:SSZ
 * 
 * @returns {string} Formatted date string in ISO 8601 format
 */
Date.prototype.yyyymmddhhss = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var hh = this.getHours().toString();
    var min = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    
    // Pad single digits with leading zeros and format as ISO 8601
    return yyyy + "-" + 
           (mm[1] ? mm : "0" + mm[0]) + "-" + 
           (dd[1] ? dd : "0" + dd[0]) + "T" + 
           (hh[1] ? hh : "0" + hh[0]) +":" +
           (min[1] ? min : "0" + min[0]) + ":" + 
           (ss[1] ? ss : "0" + ss[0]) + "Z";
};



/**
 * Constructs API URL for TrackingTime endpoints
 * 
 * @param {string} theEndPoint - The API endpoint to access
 * @returns {string} Complete API URL
 */
function urlForEndPoint(theEndPoint) {
    // Use account-specific URL if accountId is provided
    if (accountId && accountId.length > 0) {
        return "https://app.trackingtime.co/api/v4/" + accountId + "/" + theEndPoint;
    } else {
        // Use generic API URL
        return "https://app.trackingtime.co/api/v4/" + theEndPoint;
    }
}

/**
 * Makes authenticated HTTP GET request and returns parsed JSON
 * 
 * @param {string} theUrl - The URL to request
 * @returns {Object|null} Parsed JSON response or null if request failed
 */
function httpGetJSON(theUrl) {
    // Create Basic authentication string
    var authString = email +":" + password;
    var encodedAuth = base64Encode(authString);
    
    // Set up request headers
    var headers = {
        "Authorization": "Basic " + encodedAuth,
        "User-Agent": "GrandTotal Plugin; info@mediaatelier.com",
        "Content-Type": "application/json"
    };
    
    // Make the HTTP request
    var response = loadURL("GET", theUrl, headers);
    
    // Log URL and response for debugging
    log(theUrl);
    log(response);
    
    // Return null if no response received
    if (response.length == 0) {
        return null;
    }
    
    // Parse JSON response
    var responseData = JSON.parse(response);
    
    // Check for API errors
    if (responseData.response && responseData.response.status !== 200) {
        return null;
    }
    
    // Return data property or full response
    return responseData.data || responseData;
}

// Main entry point - start the time import process
timedEntries();

/**
 * Main function to import timed entries from TrackingTime API
 * Validates credentials, fetches events with pagination, and formats for GrandTotal
 * 
 * @returns {Array|string} Array of formatted time entries or error message
 */
function timedEntries() {
    // Validate required credentials
    if (!email || email.length === 0) {
        return localize("Email is required");
    }
    
    if (!password || password.length === 0) {
        return localize("Password is required");
    }
    
    // Set date range: last 20 days to tomorrow
    var aEndDate = new Date();
    aEndDate.setDate(aEndDate.getDate() + 1);
    var aEndDateString = aEndDate.toISOString().split('T')[0];
    
    var aStartDate = new Date();
    aStartDate.setDate(aEndDate.getDate() - 20);
    var aStartDateString = aStartDate.toISOString().split('T')[0];
    
    // Initialize pagination variables
    var result = [];
    var page = 1;
    var limit = 100;
    var hasMoreData = true;
    
    // Fetch data with pagination (max 10 pages)
    while (hasMoreData && page <= 10) {
        // Build API URL with parameters
        var eventsUrl = urlForEndPoint("events/flat") + 
            "?from=" + encodeURIComponent(aStartDateString) + 
            "&to=" + encodeURIComponent(aEndDateString) + 
            "&page=" + page + 
            "&page_size=" + limit;
        
        log("Requesting URL: " + eventsUrl);
        
        // Fetch events from API
        var events = httpGetJSON(eventsUrl);
        log("Events response:");
        
        // Break if no valid response
        if (!events || !Array.isArray(events)) {
            break;
        }
        
        log(events.length);
        
        // Break if no more events
        if (events.length === 0) {
            hasMoreData = false;
            break;
        }
        
        // Process each event
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var itemResult = {};
            
            // Map TrackingTime fields to GrandTotal format
            if (event.start_date) {
                itemResult["startDate"] = event.start_date;
            }
            
            itemResult["uid"] = "com.trackingtime." + event.id;
            
            if (event.project_name) {
                itemResult["project"] = event.project_name;
            }
            
            if (event.task_name) {
                itemResult["category"] = event.task_name;
            }
            
            if (event.client_name) {
                itemResult["client"] = event.client_name;
            }
            
            if (event.description) {
                itemResult["notes"] = event.description;
            }
            
            if (event.user_name) {
                itemResult["user"] = event.user_name;
            }
            
            // Convert duration from seconds to minutes
            if (event.duration && event.duration > 0) {
                itemResult["minutes"] = Math.round(event.duration / 60);
            }
            
            // Calculate cost based on hourly rate and duration
            if (event.hourly_rate && event.duration) {
                var hours = event.duration / 3600;
                itemResult["cost"] = hours * event.hourly_rate;
            }
            
            result.push(itemResult);
        }
        
        page++;
        
        // Check if this was the last page
        if (events.length < limit) {
            hasMoreData = false;
        }
    }
    
    return result;
}