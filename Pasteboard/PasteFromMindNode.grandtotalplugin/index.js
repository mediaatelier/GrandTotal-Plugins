/*

	pasteBoard a associative array of the pasteBoardTypes
	hourlyRate the rate GrandTotal provides
	timeUnit the unit GrandTotal uses for timed entries
	
	create records using insertRecord(entityType) and return them as an array
	
	NOTE: this type of plugin is running synchronously. Avoid calls to remote servers.

*/

paste();

function paste()
{
	var result = new Array();
	var testitems = pasteBoard["com.ideasoncanvas.mindnode.canvasObjects"];
	if (!testitems)
	{
		return result; /// this was not the right clipboard. Ignore it by returning an empty array
	}
	var text = pasteBoard["NSStringPboardType"];	
	var lines = text.split("\n");
	
	var items = new Array();
	var item = {};
	for(var i in lines)
	{   
		var line = lines[i];
		line = line.replace(/^\t+/g, ""); //// trim tabs
		if (isNote(line))
		{
			line = line.replace(/^ /g, ""); //// trim space
			var aNotes = item["notes"];
			if (!aNotes)
			{
				aNotes = line;
			}
			else
			{
				aNotes = aNotes + "\n" + line;
			}
			item["notes"] = aNotes;
		}
		else
		{
			if (item["title"])
			{
				items.push(item);
				item = {};
			}
			item["title"] = line;
		}
	}
	
	items.push(item);

	for (var index in items)
	{
		item = items[index];
		aRec = insertRecord("Cost");
		aRec.setValueForKey(item["title"],"name");
		aRec.setValueForKey(item["notes"],"notes");
		aRec.setValueForKey(timeUnit,"unit");
		aRec.setValueForKey(hourlyRate,"unitPrice");
		aRec.setValueForKey(1,"quantity");
		result.push(aRec);
	}
	return result;
}


function isNote(string)
{
	if (string.length > 0)
	{
		if (string.charAt(0) == " ")
		{
			return true;
		}
	}
	return false;
}
