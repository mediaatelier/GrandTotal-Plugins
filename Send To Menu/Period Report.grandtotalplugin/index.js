/*
	Period Report (Sample)

	Minimal working demonstration of the send-to period features:

	- mode                      date basis chosen in the dialog (1 = payment date)
	- periodFrom / periodTill   exact period boundaries (GrandTotal 9.5+)
	- invoices / creditnotes    separate arrays; credit notes are subtracted
	- receiveddocuments         inbound invoices, opted in via CountFunction
	- sendToCount()             live count line in the send-to dialog
	- {period}                  placeholder in ApplicationFileName (Info.plist)
	- fail()                    the {version: 2, ...} result-dialog protocol

	Writes a plain-text summary of the selected period to the chosen file.
*/

var __result;
if (pluginType() == "sendtomenu") {
	__result = doExport();
} else if (pluginType() != "count") {
	// "count" runs must not trigger the export — GrandTotal evaluates the
	// whole script before calling sendToCount().
	showPluginSettings();
}

// Count line of the send-to dialog: GrandTotal calls this with
// pluginType() == "count" whenever the user changes year, range or date
// basis. `counts` holds the number of documents per type in the period.
function sendToCount() {
	var parts = [];
	if (mode == 1) {
		parts.push(counts.payments + " " + (counts.payments == 1 ? "payment" : "payments"));
	} else {
		parts.push(counts.invoices + " " + (counts.invoices == 1 ? "invoice" : "invoices"));
	}
	if (counts.creditnotes > 0) {
		parts.push(counts.creditnotes + " " + (counts.creditnotes == 1 ? "credit note" : "credit notes"));
	}
	// Without the inbound-documents feature GrandTotal always reports 0
	if (counts.receiveddocuments > 0) {
		parts.push(counts.receiveddocuments + " received");
	}
	return parts.join(", ");
}

// Returning this object makes GrandTotal show an error dialog.
function fail(message) {
	return { "version": 2, "success": false, "title": "Export Failed", "message": message };
}

function fmt(date) {
	return date.toISOString().split("T")[0];
}

function doExport() {
	// Date basis: 1 = payment date (cash basis), otherwise invoice date.
	var dateKey = (mode == 1) ? "datePaid" : "dateSent";

	var minDate = null, maxDate = null;
	var net = 0, vat = 0;

	function accumulate(document, sign) {
		var aDate = document[dateKey] ? new Date(document[dateKey]) : null;
		if (aDate) {
			if (!minDate || aDate < minDate) { minDate = aDate; }
			if (!maxDate || aDate > maxDate) { maxDate = aDate; }
		}
		for (var aTax of (document["taxes"] || [])) {
			net += (Number(aTax["net"]) || 0) * sign;
			vat += (Number(aTax["tax"]) || 0) * sign;
		}
	}

	// The arrays only contain the period selected in the dialog.
	for (var invoice of invoices) {
		accumulate(invoice, 1);
	}
	// Credit notes arrive separately and reduce the totals.
	for (var creditNote of creditnotes) {
		accumulate(creditNote, -1);
	}

	if (invoices.length == 0 && creditnotes.length == 0) {
		return fail("No documents in the selected period.");
	}

	// Exact boundaries from the dialog on GrandTotal 9.5+; min/max document
	// date as fallback on older versions — always guard with typeof.
	var pFrom = (typeof periodFrom !== "undefined" && periodFrom) ? new Date(periodFrom) : minDate;
	var pTill = (typeof periodTill !== "undefined" && periodTill) ? new Date(periodTill) : maxDate;

	// Inbound invoices (input VAT side). Only populated while the edition has
	// the inbound-documents feature; always filtered by invoice date.
	var received = (typeof receiveddocuments !== "undefined" && receiveddocuments) ? receiveddocuments : [];
	var inputVAT = 0;
	for (var aReceived of received) {
		var aSign = aReceived["entityName"] == "InboundCreditNote" ? -1 : 1;
		var aRows = aReceived["taxes"] || [];
		if (aRows.length) {
			for (var aRow of aRows) {
				inputVAT += (Number(aRow["tax"]) || 0) * aSign;
			}
		} else {
			// no breakdown — fall back to gross minus net
			inputVAT += ((Number(aReceived["gross"]) || 0) - (Number(aReceived["net"]) || 0)) * aSign;
		}
	}

	var lines = [];
	lines.push("Period Report " + fmt(pFrom) + " – " + fmt(pTill));
	lines.push("Date basis: " + (mode == 1 ? "payment date" : "invoice date"));
	lines.push("");
	lines.push("Invoices:       " + invoices.length);
	lines.push("Credit notes:   " + creditnotes.length);
	lines.push("Net revenue:    " + net.toFixed(2));
	lines.push("VAT charged:    " + vat.toFixed(2));
	if (received.length > 0) {
		lines.push("");
		lines.push("Received documents: " + received.length);
		lines.push("Input VAT:          " + inputVAT.toFixed(2));
	}

	writeToURL(lines.join("\n") + "\n", url);
	return undefined;
}

__result;
