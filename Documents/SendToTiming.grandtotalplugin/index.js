/*
	Sends an offer from GrandTotal to Timing.

	Keep in mind that you can't use browser specific calls. Use following calls
*/

send();

function send() {
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
    	 	if (entityName != "title" && entityName != "option" && entityName != "subtotal" && entityName != "pagebreak") {
    	 		parameters.push(item.name);
    	 	}
    	 }
    });
    
    var quotedAndCommaSeparated = "{\"" + parameters.join("\",\"") + "\"}";


	var path = PluginDirectory + "Script.applescript";
	var script = contentsOfFile(path);
	
	
	script = "processList(" + quotedAndCommaSeparated + ")" + script;
	
    executeAppleScript(script);
}