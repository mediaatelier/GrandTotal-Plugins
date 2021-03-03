/*
	
	
*/

run();


function run()
{
	var path = PluginDirectory + "as.txt";
	var script = grandtotal.fileManager.contentsOfFile(path);
	var ids = executeAppleScript(script);
	var existingIds = getBilledUIDs("");
	for (i in ids)
	{
		var id = ids[i];
		if (!existingIds.includes(id))
		{
			var entry = insertRecord("Cost");
			entry.name = "TIMEENTRY_HIDDEN";
			entry.uid = id;
		}
	}
}




