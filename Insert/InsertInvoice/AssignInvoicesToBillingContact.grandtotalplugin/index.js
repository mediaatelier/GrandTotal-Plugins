var records = query().records(); /// Get the inserted records. Usually an array of one

var departments = ["Buchhaltung","Verwaltung","Billing","Bookkeeping"];

for (i in records)
{
	var record = records[i];
	var client = record.client;
	var contacts = client.children.records();

	for (c in contacts)
	{
		var contact = contacts[c];
		if (departments.includes(contact.department))
		{
			record.contact = contact;
			break;
		}
	}
}

