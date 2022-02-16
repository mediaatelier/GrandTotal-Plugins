records = query().records();

for (i in records)
{
	record = records[i];	
	
	addCustomValueToRecord(record,"Custom Field","Custom Value");
	addCustomValueToRecord(record,"Custom Field 2","Custom Value 2");
}


function addCustomValueToRecord(document,fieldName,value)
{
	/// possible set names: sendable, cost, client
	var setIdentifier = document.customFieldSetIdentifier;
	var predicate = "name LIKE '" + fieldName + "' AND set.name LIKE '" + setIdentifier + "'";
	var customField = fetchRecordWithPredicate("CustomField",predicate);
	if (customField)
	{
		var customValue = insertRecord("CustomValue");
		customValue.setValueForKey(value,"name");
		customValue.setValueForKey(customField,"field");
		customValue.setValueForKey(document,"document");
	}
}