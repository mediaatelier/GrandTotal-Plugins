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

doExport();

function doExport()
{
	var lines = [];	
	var fields = contentsOfCSVFile(PluginDirectory + "SalesInvoiceTemplate.csv")[0];
	var aCleanFields = [];
	
	for (field of fields)
	{
		aCleanFields.push(field.replace("*", ""));
	}
	
	lines.push(aCleanFields);


	for (document of items)
	{
		// Document Properties
		
		aContactName	= document["recipient"]["name"];
		aEmailAddress	= document["recipient"]["email"];
		aPOAddressLine1	= document["recipient"]["street"];
		aPOCity			= document["recipient"]["city"];
		aPOPostalCode	= document["recipient"]["zip"];
		aPORegion		= document["recipient"]["state"];
		aPOCountry		= document["recipient"]["countryCode"];

		aInvoiceNumber	= document["name"];
		aReference		= document["reference"];
		aInvoiceDate	= document["dateSent"];
		aDueDate		= document["dateDue"];
		aTotal			= document["grossAsString"];
		aCurrency		= document["currency"];
		aInvoiceDiscount= document["discountAsString"];

		aInvoiceDate = aInvoiceDate.toISOString().split('T')[0];
		aDueDate = aDueDate.toISOString().split('T')[0];

		// Item Properties
		
		for (item of document["items"])
		{	
					
			aDescription	= item["name"];
			aQuantity		= item["quantityAsString"];
			aUnitAmount		= item["rateAsString"];
			aDiscount		= item["discount"];
			aAccountCode	= parseInt(item["category"]);
			if (isNaN(aAccountCode))
			{
				aAccountCode = 200; // sales
			}
			aAccountCode 	= aAccountCode + ""; // make this a string
			aTaxType		= item["taxGroup"];
			aTaxAmount		= item["taxAsString"];
			
			if (parseFloat(aInvoiceDiscount) != 0)
			{
				var aFactor = (100 - parseFloat(aInvoiceDiscount)) / 100;
				aUnitAmount = parseFloat(aUnitAmount) * aFactor;
			}
			
			
			line = [];
			
			addFieldValue(line,"ContactName",aContactName,aCleanFields);
			addFieldValue(line,"EmailAddress",aEmailAddress,aCleanFields);
			addFieldValue(line,"POAddressLine1",aPOAddressLine1,aCleanFields);
			addFieldValue(line,"POCity",aPOCity,aCleanFields);
			addFieldValue(line,"POPostalCode",aPOPostalCode,aCleanFields);
			addFieldValue(line,"PORegion",aPORegion,aCleanFields);
			addFieldValue(line,"POCountry",aPOCountry,aCleanFields);

			addFieldValue(line,"InvoiceNumber",aInvoiceNumber,aCleanFields);
			addFieldValue(line,"Reference",aReference,aCleanFields);
			addFieldValue(line,"InvoiceDate",aInvoiceDate,aCleanFields);
			addFieldValue(line,"DueDate",aDueDate,aCleanFields);
			addFieldValue(line,"Total",aTotal,aCleanFields);
			addFieldValue(line,"Currency",aCurrency,aCleanFields);
			
			addFieldValue(line,"Description",aDescription,aCleanFields);
			addFieldValue(line,"Quantity",aQuantity,aCleanFields);
			addFieldValue(line,"UnitAmount",aUnitAmount,aCleanFields);
			addFieldValue(line,"TaxType",aTaxType,aCleanFields);
			addFieldValue(line,"Discount",aDiscount,aCleanFields);
			addFieldValue(line,"AccountCode",aAccountCode,aCleanFields);
			if (parseFloat(aTaxAmount) != 0)
			{
				addFieldValue(line,"TaxType",aTaxType,aCleanFields);
			}
			addFieldValue(line,"TaxAmount",aTaxAmount,aCleanFields);

			lines.push(line);
		}
	}
	
	writeCSVToURL(lines,url,5);	 // LatinEncoding 	

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
