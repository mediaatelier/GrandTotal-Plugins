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
	
	var root = pasteBoard["com.apperdeck.receipts.pasteboard.2"];
	items = root.items;
	
	var itemGroups = fetchRecords("ItemGroup"); /// get item groups from GrandTotal
	var useGrossPrices = query().record().valueForKey("useGrossPrices");  /// get this from the invoice the item is pasted into
	
	for (index in items)
	{
		item = items[index];
		aRec = insertRecord("Cost");
		aRec.setValueForKey(1,"quantity");
		if (item.provider) {
			aRec.setValueForKey(item.provider.title,"name");
		}
		if (item.amounts)
		{
			if (useGrossPrices) {
				aRec.setValueForKey(parseFloat(item.amounts.gross),"unitPrice");
			}
			else {
				aRec.setValueForKey(parseFloat(item.amounts.net),"unitPrice");
			}
		}
		aRec.setValueForKey(item["note"],"notes");
		aRec.setValueForKey(item.date,"dateCreation");
		if (item.category) {
			var matchingItemGroups = itemGroups.filter("name CONTAINS[cd] '" + item.category.title + "'");
			aRec.setValueForKey(matchingItemGroups.record(),"itemGroup");
		}
		result.push(aRec);
	}
	return result;
}