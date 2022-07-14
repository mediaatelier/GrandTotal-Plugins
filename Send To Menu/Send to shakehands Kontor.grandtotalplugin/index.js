/*
	Variables:
	
	items 							an array of the documents the user selected
	url								the destination url
	
	Functions:
	
	log(object)						logs the object to a console
	writeToURL(string,url)			writes the string to the specified url		
	launchURL(url)					launches the url using the finder
	loadURLtoURL(url,url)			loads an URL and saves it to the second (local) one
	
*/

if (pluginType() == "sendtomenu")
{
	doExport();
}
else
{
	showPluginSettings();
}


function doExport()
{
	var lines = [];	
	var fields = contentsOfCSVFile(PluginDirectory + "Template.txt")[0];
	
	lines.push(fields);
	

	for (document of items)
	{
		// Document Properties
		
		if (!document["recipient"])
		{
			continue;
		}
		
		
		aClientNumber	= document["recipient"]["clientNumber"];
		aEmailAddress	= document["recipient"]["email"];
		aPOAddressLine1	= document["recipient"]["street"];
		aPOCity			= document["recipient"]["city"];
		aPOPostalCode	= document["recipient"]["zip"];
		aPORegion		= document["recipient"]["state"];
		aPOCountry		= document["recipient"]["countryCode"];
		aClientName		= document["recipient"]["name"];


		aInvoiceNumber	= document["name"];
		aReference		= document["reference"];
		aInvoiceDate	= document["dateSent"];
		aDueDate		= document["dateDue"];
		aTotal			= document["grossAsString"];
		aCurrency		= document["currency"];
		aInvoiceDiscount= document["discountAsString"];
		aInvoiceSubject	= document["subject"];
		aInvoiceProject	= document["project"];
		
		if (mode == 1)
		{
			aInvoiceDate	= document["datePaid"];
		}

	

		aInvoiceDate 	= aInvoiceDate.toLocaleString("de-DE",{ year: 'numeric', month: '2-digit', day: '2-digit' });
		aDueDate = aDueDate.toISOString().split('T')[0];

		// Item Properties
		
		for (item of document["taxes"])
		{	
					
			
			aGrossAmount 	= item["grossAsString"];
			aTaxPercentage 	= item["taxPercentage"];
			aCreditAccount 	= credit_0_Account;

			if (aTaxPercentage == 7.7)
			{
				aCreditAccount	= credit_7_7_Account;
			}
			else if (aTaxPercentage == 2.5)
			{
				aCreditAccount	= credit_2_5_Account;
			}
		

			
			line = [];
			
			var text = aInvoiceNumber;
			if (aInvoiceSubject)
			{
				text = text + " | " + aInvoiceSubject;
			}
			if (aInvoiceProject)
			{
				text = text + " | " + aInvoiceProject;
			}
			if (aClientName)
			{
				text = text + " | " + aClientName;
			}
			
			
			addFieldValue(line,"Firma_id",companyID,fields);
			addFieldValue(line,"Datum",aInvoiceDate,fields);
			addFieldValue(line,"BelegNr",aInvoiceNumber,fields);
			addFieldValue(line,"Text",text,fields);
			addFieldValue(line,"Währung",aCurrency,fields);
			addFieldValue(line,"KontoSoll",debitAccount,fields);
			addFieldValue(line,"KontoHaben",aCreditAccount,fields);
			addFieldValue(line,"Betrag",aGrossAmount,fields);

			lines.push(line);
		}
	}
	
	writeCSVToURL(lines,url,30,"\t","\r");	 // MacOSRomanEncoding 	

}


function addFieldValue(array,field,value,fields)
{
	var index = fields.indexOf(field);
	for (i = 0;i<index;i++)
	{
		if (!array[i])
		{
			array[i] = 	"";
		}
	}
	array[index] = 	value;
}
