## GrandTotal E-Invoice Plugins

Installed in the client settings.
The plugins needs to return an array of files. 

```var result = {};
result["files"] = [{
		"destination" : "mail",
		"content" : contents,
		"name" : "Filename.xml"
	}];
return result;```

valid destinations:

pdf (The file is embedded in the PDF)
mail (The file is attached alongside the PDFx)
