/*

	pasteBoard a associative array of the pasteBoardTypes
	hourlyRate the rate GrandTotal provides
	timeUnit the unit GrandTotal uses for timed entries
	
	create records using insertRecord(entityType) and return them as an array
	
	NOTE: this type of plugin is running synchronously 

*/

paste();


function paste()
{
	var result = new Array();
	 /// Yes, this is a Dr. Frankenstein Plugin. It uses Applescript to get the current selected items from Things
	var path = PluginDirectory + "script.applescript";
	var script = contentsOfFile(path);
	var json = executeAppleScript(script);
	var items = JSON.parse(json);
	
	for (index in items)
	{
		item = items[index];
		aRec = insertRecord("Cost");
		aRec.setValueForKey(item["name"],"name");
		aRec.setValueForKey(item["notes"],"notes");
		aRec.setValueForKey(timeUnit,"unit");
		aRec.setValueForKey(hourlyRate,"unitPrice");
		aRec.setValueForKey(1,"quantity");
		result.push(aRec);
	}
	return result;
}