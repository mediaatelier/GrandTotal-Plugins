/*
	
	
*/

exportItems();


function exportItems()
{
	var aURL = saveFileDialog("Export.csv");
	if (!aURL) {
		return;
	}
	var aDocument = query().record();
	var aItems = aDocument.valueForKey("children").records();
	var aTable = [];
	for (aItemIndex in aItems)
	{
		var aTableItem = [];
		aItem = aItems[aItemIndex];
		fillAttributeOfItemIntoLine("quantity",aItem,aTableItem);
		fillAttributeOfItemIntoLine("unit",aItem,aTableItem);
		fillAttributeOfItemIntoLine("name",aItem,aTableItem);
		fillAttributeOfItemIntoLine("notes",aItem,aTableItem);
		fillAttributeOfItemIntoLine("unitPrice",aItem,aTableItem);
		fillAttributeOfItemIntoLine("cost",aItem,aTableItem);
		aTable.push(aTableItem);
	}
	writeCSVToURL(aTable,aURL);
}


function fillAttributeOfItemIntoLine(attributeName,item,array)
{
	var value = item.valueForKey(attributeName);
	if (!value)
	{
		value = "";
	}
	array.push(value);
}
