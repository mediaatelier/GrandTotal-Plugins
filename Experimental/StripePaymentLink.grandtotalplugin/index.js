
if (pluginType() == "pluginsmenu")
{
	runInfo();
}
else 
{
	createLink();
}


function runInfo() 
{

	setup();
	showPluginSettings();
}


function createLink()
{
	setup();
	var doc = query().editableRecord();
	if (doc.entityName != "Invoice")
	{
		return;
	}
	result = httpPostJSON("https://api.stripe.com/v1/products",{name:doc.label + " " +doc.name});
	var productID = result["id"];
	result = httpPostJSON("https://api.stripe.com/v1/prices",{currency:doc.currency.name,unit_amount:doc.balance * 100,product:productID});
	var priceID = result["id"];
	result = httpPostJSON("https://api.stripe.com/v1/payment_links",{"line_items[0][price]":priceID,"line_items[0][quantity]":"1"});
	var url = result["url"];
	doc.setValueForCustomField(url,"stripe_link");
}


function httpPostJSON(theUrl,body)
{
	header = {Authorization:'Bearer ' + token,"Accept":'application/json',"content-type": "application/x-www-form-urlencoded"};
	string = loadURL("POST",theUrl,header,getFormData(body));
	if (string.length == 0)
		{
			return null;
		}
	return JSON.parse(string);
}


function getFormData(object)
{
	result = "";
	for (var key in object) 
	{
    	var value = object[key];
    	
    	result = result + key + "=" + encodeURIComponent(value) + "&";
	}
	return result;
}


function setup()
{
	var aSets = fetchRecords("CustomFieldSet");
	aSets = aSets.filter("name LIKE 'sendable'");
	if (aSets.count() == 0)
	{
		aSet = insertRecord("CustomFieldSet");
		aSet.name = "sendable";
	}
	else
	{
		aSet = aSets.records()[0];
	}
	aFields = aSet.fields.filter("name LIKE 'stripe_link'");
	if (aFields.count() == 0)
	{
		aField = insertRecord("CustomField");
		aField.name = "stripe_link";
		aField.set = aSet;
	}
}




