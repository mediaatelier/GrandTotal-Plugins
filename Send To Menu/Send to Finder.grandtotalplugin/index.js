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

	createFolderAtURL(url);

	for (document of items)
	{
		// Document Properties
		aInvoiceNumber	= document.name;
		aFileURL = url + "/" + aInvoiceNumber + ".pdf";
		loadURLtoURL(document.url,aFileURL);
	}

}

