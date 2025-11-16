/*
	Keep in mind that you can't use browser specific calls. Use following calls
	
	--Loading httpContents--
	loadURL(method,url,headers);
	
	--Logging to the Console--
	log(value);
	
	--Base64--
	base64Encode(string);
	
	Expected result is a JSON representation of an array.
	
	[
		{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.toggle.233283908"},
		{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.toggle.233275239"}
	]
	
	Make *sure* the uid you provide is not just a plain integer.
	
	Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

	Returning a string will present it as warning.	
	
	To see how to add global variables (Settings) look at the Info.plist of this sample.
	
	Keep in mind that for security reasons passwords are stored in the keychain and
	you will have to enter them again after modifying your code.
	
*/



importinvoices();


function importinvoices()
{
	

	var url = grandtotal.fileManager.openFileDialog("xlsx");
	if (!url) {
		return;
	}
		
	var lines = contentsOfXLSFile(url);
	for (line of lines)
	{
		if (line[0] == "client_id")
		{
			continue; // header
		}
		
		var params  						= {};
		
		params["clientID"]					= line[0];
		params["clientName"]				= line[1];
		params["invoiceDate"] 				= line[2];
		params["amount"]					= line[3];
		params["itemName"]					= line[5];
		params["clientStreet"]				= line[6];
		params["clientAdditionalAddress"]	= line[7];
		params["clientZipCode"]				= line[8];
		params["clientCity"]				= line[9];
		params["clientCountry"]				= line[10];
		params["vat"]						= line[11];
		
		

		var client = createClientForParams(params);
		
		
		invoice = fetchRecordWithPredicate("Invoice","client.uid LIKE '" + client.uid + "' AND dateSent == NULL");
		if (!invoice) {
			invoice = insertRecord("Invoice");
		}
		invoice.subject 		= params["invoiceDate"];
		invoice.parentDocument	= client;
		item = insertRecord("Cost");
		item.unitPrice 		= params["amount"];
		item.name 			= params["itemName"];
		item.parent		 	= invoice;
		if (params["vat"] == 0)
		{
			item.itemGroup		= fetchRecordWithPredicate("ItemGroup","name LIKE[cd] 'zahlungsdienstleistungen'");
		}
		else
		{
			item.itemGroup		= fetchRecordWithPredicate("ItemGroup","name LIKE[cd] 'dienstleistungen'");
		}
	}
	
}


function createClientForParams(params)
{
	var results = fetchRecords("Client");
	for (client of results.records())
	{
		if (client.valueForCustomField("matchID") == params["clientID"])
		{
			return client;
		}
	}
	result = insertRecord("Client");
	result.organization	= params["clientName"];
	result.department	= params["clientAdditionalAddress"];
	result.city			= params["clientCity"];
	result.address		= params["clientStreet"];
	result.zip			= params["clientZipCode"];
	result.countryName	= params["clientCountry"];
	result.setValueForCustomField(params["clientID"],"matchID");
	
	if (result.countryCode == "DE")
	{
		result.clientGroup		= fetchRecordWithPredicate("ClientGroup","name LIKE[cd] 'inland'");
	}
	else
	{
		result.clientGroup		= fetchRecordWithPredicate("ClientGroup","name LIKE[cd] 'ausland'");
	}

	return result;
}


