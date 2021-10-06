var records = query().records();

var departments = ["Buchhaltung","Verwaltung","Billing","Bookkeeping"];

for (i in records)
{
	var record = records[i];
	var client = record.valueForKey("client");
	var contacts = client.valueForKey("children").records();

	for (c in contacts)
	{
		var contact = contacts[c];
		var department = contact.valueForKey("department");
		if (departments.includes(department))
		{
			record.setValueForKey(contact,"contact");
			break;
		}
	}
}

