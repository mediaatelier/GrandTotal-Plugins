/* 
  ClickUp integration plugin 
  Fetch tasks from ClickUp and format them for GrandTotal.
*/


function httpGetJSON(theUrl, token) {
  var headers = { "Authorization": token };
  var string = loadURL("GET", theUrl, headers);
  if (string.length == 0) {
    return null;
  }
  return JSON.parse(string);
}


function fetchAllTimeEntries(token, teamId) {
  var allTimeEntries = [];
  var page = 0;
  var limit = 100;
  var maxPages = 5;
  var hasMore = true;
  
  while (hasMore && page < maxPages) {
    var timeEntriesUrl = `https://api.clickup.com/api/v2/team/${teamId}/time_entries?page=${page}&limit=${limit}&include_location_names=true`;
    var timeEntries = httpGetJSON(timeEntriesUrl, token);
    if (timeEntries && timeEntries.data && timeEntries.data.length > 0) {
      allTimeEntries = allTimeEntries.concat(timeEntries.data);
      page++;
      if (timeEntries.data.length < limit) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }
  return allTimeEntries;
}


function fetchClickUpTasks() {
  var aEndDate = new Date();
  var aEndDateString = aEndDate.toISOString();

  var aStartDate = new Date();
  aStartDate.setDate(aEndDate.getDate() - 180);
  var aStartDateString = aStartDate.toISOString();

  var clickUpToken = token;
  
  // Fetch team ID
  var teamUrl = `https://api.clickup.com/api/v2/team`;
  var teamData = httpGetJSON(teamUrl, clickUpToken);

  if (!teamData || !teamData.teams || teamData.teams.length === 0) {
    return localize("Check your token");
  }
  
  var teamId = teamData.teams[0].id;
    
  var time_entries = fetchAllTimeEntries(clickUpToken, teamId);



  if (time_entries) {
    var result = time_entries.map(entry => {
    
	var task_location = entry.task_location ? entry.task_location : {};
       minutes = Math.ceil(entry.duration / 60000); 

      return {
        startDate: new Date(parseInt(entry.start)),
        client: entry.client || "Unknown Client",
        category: entry.task ? entry.task.name : "",
        minutes: minutes,
        notes: entry.description || "",
        user: entry.user ? entry.user.username : "",
        rate: defaultRate,
        client: task_location.folder_name,
        project: task_location.list_name,
        cost: defaultRate / 60 * minutes,
        uid: `com.clickup.${entry.id}`
      };
    });
    
      	//log(result);

    return JSON.stringify(result);
  } else {
    return "[]";
  }
}


fetchClickUpTasks();
