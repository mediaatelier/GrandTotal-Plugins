
run();

function run()
{
	var aClient = query().record();
	
	for (aContact of aClient.children.editableRecords()) 
	{
		aContact.address = aClient.address;
		aContact.zip = aClient.zip;
		aContact.city = aClient.city;
	}
	
}

