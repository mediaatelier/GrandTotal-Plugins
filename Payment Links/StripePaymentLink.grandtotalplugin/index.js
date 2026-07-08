
if (pluginType() == "activateapplication")
{
	checkPayments();
}
else 
{
	createLink();
}


function key()
{
	var keyRecord = fetchRecordWithUID("Preference","GTPref.stripeAPIKey@keychain");
	if (keyRecord)
	{
		return keyRecord.payload;
	}
	return null;
}


function checkPayments()
{
	if (!key())
	{
		return;
	}

	var unpaidInvoices = fetchRecords("MetaValue");
	unpaidInvoices = unpaidInvoices.filter("name LIKE 'stripe_payment_link_id' AND document.balance != 0");

	if (unpaidInvoices.count() == 0)
	{
		return; // all paid
	}

	for (metaData of unpaidInvoices.records())
	{
		var paymentLinkID = metaData.payload;
		if (!paymentLinkID || paymentLinkID.length == 0)
		{
			continue;
		}

		var sessions = httpGetJSON("https://api.stripe.com/v1/checkout/sessions?payment_link=" + encodeURIComponent(paymentLinkID) + "&limit=100");
		if (!sessions || !sessions["data"])
		{
			continue;
		}

		for (session of sessions["data"])
		{
			if (session["payment_status"] != "paid")
			{
				continue;
			}

			var invoice = metaData.document;
			var paymentIntentID = session["payment_intent"];
			var paidDate = new Date(session["created"] * 1000);
			if (paymentIntentID)
			{
				var intent = httpGetJSON("https://api.stripe.com/v1/payment_intents/" + encodeURIComponent(paymentIntentID));
				if (intent && intent["created"])
				{
					paidDate = new Date(intent["created"] * 1000);
				}
			}

			var payment = insertRecord("Payment");
			payment.parentDocument = invoice;
			payment.amount = Math.round(invoice.balance * 100) / 100;
			payment.notes = "https://dashboard.stripe.com/payments/" + paymentIntentID;
			payment.date = paidDate;
			displayUserNotification(localize("Stripe Payment"), invoice.client.displayName);

			archiveStripeObjects(paymentLinkID);
			break; // one paid session per link is enough
		}
	}
}


function createLink()
{
	var doc = query().editableRecord();
	if (doc.entityName != "Invoice" && doc.entityName != "PartialInvoice")
	{
		return;
	}
	if (!key())
	{
		doc.setMetaValueForKey("Stripe API Key is missing","stripe_link");
		return;
	}
	result = httpPostJSON("https://api.stripe.com/v1/products",{name:doc.label + " " +doc.name});
	if (result["server_error"])
	{
		doc.setMetaValueForKey("Check your API key","stripe_payment_link");
		return;
	}
	var cost = Math.round(doc.balance * 100);
	var productID = result["id"];
	result = httpPostJSON("https://api.stripe.com/v1/prices",{currency:doc.currency.name,unit_amount:cost,product:productID});
	var priceID = result["id"];
	
	var options = {
		"line_items[0][price]":priceID,
		"line_items[0][quantity]":"1",
	};

	if (doc.currency.name == "EUR")
	{
		var methods = [];
		if (forceSEPA) methods.push("sepa_debit");
		if (forceIDEAL) methods.push("ideal");
		for (var i = 0; i < methods.length; i++)
		{
			options["payment_method_types[" + i + "]"] = methods[i];
		}
	}
	
	result = httpPostJSON("https://api.stripe.com/v1/payment_links",options);
	
	return result;
}


function archiveStripeObjects(paymentLinkID)
{
	if (!paymentLinkID || paymentLinkID.length == 0)
	{
		return;
	}

	// deactivate payment link (prevent further payments via same URL)
	httpPostJSON("https://api.stripe.com/v1/payment_links/" + encodeURIComponent(paymentLinkID), {active: "false"});

	// fetch line items to discover price + product
	var lineItems = httpGetJSON("https://api.stripe.com/v1/payment_links/" + encodeURIComponent(paymentLinkID) + "/line_items?expand[]=data.price");
	if (!lineItems || !lineItems["data"])
	{
		return;
	}

	for (var item of lineItems["data"])
	{
		var price = item["price"];
		if (!price)
		{
			continue;
		}
		var priceID = price["id"];
		var productID = price["product"];

		// price must be archived before product
		if (priceID)
		{
			httpPostJSON("https://api.stripe.com/v1/prices/" + encodeURIComponent(priceID), {active: "false"});
		}
		if (productID)
		{
			httpPostJSON("https://api.stripe.com/v1/products/" + encodeURIComponent(productID), {active: "false"});
		}
	}
}


function httpPostJSON(theUrl,body)
{
	header = {Authorization:'Bearer ' + key(),"Accept":'application/json',"content-type": "application/x-www-form-urlencoded"};
	string = loadURL("POST",theUrl,header,getFormData(body));
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}


function httpGetJSON(theUrl)
{
	
	header = {Authorization:'Bearer ' + key(),"Accept":'application/json'};
	string = loadURL("GET",theUrl,header);
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




