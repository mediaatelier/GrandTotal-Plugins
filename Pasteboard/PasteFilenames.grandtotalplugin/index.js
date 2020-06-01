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
	paths = pasteBoard["NSFilenamesPboardType"];
	
	
	for (index in paths)
	{
		path = paths[index];
		filename = path.substring(path.lastIndexOf('/')+1);
		
		attributes = spotlightAttributes(path);
		description = "";
				
		if (attributes["kMDItemTitle"])
		{
			filename = attributes["kMDItemTitle"];
		}
		if (attributes["kMDItemNumberOfPages"])
		{
			description += attributes["kMDItemNumberOfPages"] +" "+localize("Pages") + "\n";
		}
		if (attributes["kMDItemPixelWidth"])
		{
			description += attributes["kMDItemPixelWidth"] + "x" + attributes["kMDItemPixelHeight"] + "\n";
		}
		if (attributes["kMDItemDurationSeconds"])
		{
			description += Math.round(attributes["kMDItemDurationSeconds"]) + " " + localize("Seconds") + "\n";
		}
		if (attributes["kMDItemDescription"])
		{
			description += "<i>" + attributes["kMDItemDescription"] + "</i>" + "\n";
		}
		if (attributes["kMDItemKeywords"])
		{
			description += localize("Keywords") + ": " + attributes["kMDItemKeywords"] + "\n";
		}
		
		
		aRec = insertRecord("Cost");
		aRec.setValueForKey(filename,"name");
		aRec.setValueForKey(description,"notes");
		aRec.setValueForKey(timeUnit,"unit");
		aRec.setValueForKey(hourlyRate,"unitPrice");
		aRec.setValueForKey(fileModificationDate(path),"dateCreation");

		result.push(aRec);
	}
	return result;
}