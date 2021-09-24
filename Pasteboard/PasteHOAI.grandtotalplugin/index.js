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
	result = new Array();
	string = pasteBoard["NSStringPboardType"];
	lines = string.split("\r");
	
	
	for (index in lines)
	{
		line = lines[index];
		items = line.split(" ");
		if (!items.includes("EUR"))
		{
			continue;
		}
		count = items.length;
		if (count < 4)
		{
			continue;
		}
		cost = items[count-2];
		cost = cost.replaceAll(".","");
		cost = cost.replaceAll(",",".");
		
		titleitems = items.slice(0,count-3);
		title = titleitems.join(" ");
		
		
		aRec = insertRecord("Cost");
		aRec.setValueForKey(title,"name");
		aRec.setValueForKey(parseFloat(cost),"unitPrice");
	/*	aRec.setValueForKey(hourlyRate,"unitPrice");
		aRec.setValueForKey(fileModificationDate(path),"dateCreation");
*/
		result.push(aRec);
	}
	return result;
}