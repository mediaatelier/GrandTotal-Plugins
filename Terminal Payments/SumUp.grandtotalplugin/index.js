// Card payment on a SumUp Solo through the SumUp Cloud API.
// https://developer.sumup.com/terminal-payments/cloud-api
//
// GrandTotal provides `payment` (amount, currency, reference, description,
// client), `setStatus(text)` and `isCancelled()`; pay() answers
// {status: "paid"|"cancelled"|"failed", amount, date, notes, message,
// showSettings}. The result arrives by webhook at SumUp's end — the Mac
// cannot receive one, so the transaction is polled by its
// client_transaction_id instead.

var baseURL = "https://api.sumup.com";
var defaultAppID = "com.mediaatelier.GrandTotal3"; // when the setting is empty


function request(method, path, body)
{
	var headers = {"Authorization": "Bearer " + apiKey, "Accept": "application/json"};
	var string = body ? loadURL(method, baseURL + path, headers, body) : loadURL(method, baseURL + path, headers);
	var result = string && string.length > 0 ? JSON.parse(string) : {};
	if (result.grandtotal_error)
	{
		var server = result.server_error || {};
		return {error: server.detail || server.message || server.title || result.grandtotal_error, httpError: result.http_error};
	}
	return result;
}


function failed(message, showSettings)
{
	return {status: "failed", message: message, showSettings: showSettings == true};
}


function merchantCode()
{
	var me = request("GET", "/v0.1/me");
	if (me.error)
	{
		return me;
	}
	return {code: me.merchant_profile ? me.merchant_profile.merchant_code : null};
}


function pairedReader(merchant)
{
	var readers = request("GET", "/v0.1/merchants/" + merchant + "/readers");
	if (readers.error)
	{
		return readers;
	}
	var items = (readers.items || []).filter(function (reader) { return reader.status == "paired"; });
	if (readerName && readerName.length > 0)
	{
		items = items.filter(function (reader) { return reader.name == readerName; });
	}
	return {reader: items.length > 0 ? items[0] : null};
}


function pair(merchant)
{
	setStatus(localize("Pairing the reader…"));
	var name = readerName && readerName.length > 0 ? readerName : "GrandTotal";
	var reader = request("POST", "/v0.1/merchants/" + merchant + "/readers", {pairing_code: pairingCode.trim(), name: name});
	if (reader.error)
	{
		return reader;
	}
	while (reader.status == "processing")
	{
		if (isCancelled())
		{
			return {cancelled: true};
		}
		sleep(2);
		reader = request("GET", "/v0.1/merchants/" + merchant + "/readers/" + reader.id);
		if (reader.error)
		{
			return reader;
		}
	}
	if (reader.status != "paired")
	{
		return {error: localize("The reader could not be paired. Pair it again with a new code.")};
	}
	return {reader: reader};
}


function pay()
{
	if (!apiKey || !affiliateKey)
	{
		return failed(localize("Enter the API key and the Affiliate Key in the plugin settings."), true);
	}
	setStatus(localize("Connecting to SumUp…"));
	var merchant = merchantCode();
	if (merchant.error)
	{
		return failed(merchant.error, merchant.httpError == 401);
	}
	var found = pairedReader(merchant.code);
	if (found.error)
	{
		return failed(found.error);
	}
	if (!found.reader)
	{
		if (!pairingCode || pairingCode.trim().length == 0)
		{
			return failed(localize("No paired reader. Enter the pairing code shown on the Solo in the plugin settings."), true);
		}
		found = pair(merchant.code);
		if (found.cancelled)
		{
			return {status: "cancelled"};
		}
		if (found.error)
		{
			return failed(found.error, true);
		}
	}
	var readerPath = "/v0.1/merchants/" + merchant.code + "/readers/" + found.reader.id;

	var checkout = request("POST", readerPath + "/checkout", {
		total_amount: {value: Math.round(payment.amount * 100), currency: payment.currency, minor_unit: 2},
		description: payment.description,
		affiliate: {app_id: appID && appID.trim().length > 0 ? appID.trim() : defaultAppID, key: affiliateKey, foreign_transaction_id: payment.reference + "-" + Date.now()}
	});
	if (checkout.error)
	{
		return failed(checkout.error);
	}
	var transactionID = checkout.data.client_transaction_id;
	setStatus(localize("Present the card on the reader…"));

	var terminated = false;
	var pollsAfterTermination = 0;
	while (true)
	{
		sleep(2);
		if (isCancelled() && !terminated)
		{
			request("POST", readerPath + "/terminate", {});
			terminated = true;
		}
		var transaction = request("GET", "/v2.1/merchants/" + merchant.code + "/transactions?client_transaction_id=" + encodeURIComponent(transactionID));
		var status = transaction.error ? "PENDING" : transaction.status;
		if (status == "SUCCESSFUL")
		{
			return {
				status: "paid",
				amount: transaction.amount,
				date: new Date(transaction.timestamp),
				notes: "SumUp " + transaction.transaction_code
			};
		}
		if (status == "FAILED")
		{
			return failed(localize("The payment failed at the reader."));
		}
		if (status == "CANCELLED")
		{
			return {status: "cancelled"};
		}
		if (terminated)
		{
			// a checkout nobody started never becomes a transaction
			pollsAfterTermination += 1;
			if (pollsAfterTermination == 5)
			{
				return {status: "cancelled"};
			}
		}
	}
}
