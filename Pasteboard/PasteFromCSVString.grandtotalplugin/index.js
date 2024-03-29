/*

	pasteBoard a associative array of the pasteBoardTypes
	hourlyRate the rate GrandTotal provides
	timeUnit the unit GrandTotal uses for timed entries
	
	create records using insertRecord(entityType) and return them as an array
	
	NOTE: this type of plugin is running synchronously 

*/

paste();


/*
	NOTE: this is a fairly primitive Sample. The built-in parser is much smarter. Better make sure you remove it after testing	
*/


function paste()
{
	var result = new Array();
	
	var string = pasteBoard["NSStringPboardType"];
	var lines = parseCSVString(string);
		
	for (index in lines)
	{
		var line = lines[index];
		
		var quantity = parseFloat(line[0]);
		var unitPrice = parseFloat(line[1]);
		if (!Number.isNaN(quantity) && !Number.isNaN(unitPrice))
		{
			aRec = insertRecord("Cost");
			aRec.quantity = quantity;
			aRec.unitPrice = unitPrice;
			aRec.name = line[2];
			aRec.notes = line[3];
			result.push(aRec);
		}
		else
		{
			aRec = insertRecord("Title");
			aRec.name = line[0];
			result.push(aRec);
		}
	}
	return result;
}