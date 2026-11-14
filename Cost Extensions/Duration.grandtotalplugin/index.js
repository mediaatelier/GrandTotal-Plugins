// CostExtension plugin: Duration.
// Receives a row { values: {<customValuesJSON>}, quantity, unitPrice, notes } and
// returns { amount: "<decimal string>" }.
// A position with a second quantity such as "3 pieces x 7 days x 12.00 = 252.00": quantity is
// the number of pieces, unitPrice the price per piece and per unit of the
// period, values.value the length of the period (default 1)
// and values.unit its unit ("days"), which only appears in the layout.
// amount is the line amount before discount: quantity x unit price x duration,
// rounded to cents. GrandTotal stores it in values.amount and applies the
// discount.

function parseNumber(value)
{
	var s = String(value == null ? "" : value).split(" ").join("").split("'").join("");
	var lastComma = s.lastIndexOf(",");
	var lastDot = s.lastIndexOf(".");
	if (lastComma > lastDot) { s = s.split(".").join("").replace(",", "."); }
	else if (lastComma >= 0) { s = s.split(",").join(""); }
	var n = parseFloat(s);
	return isNaN(n) ? NaN : n;
}

function evaluate(row)
{
	var values = (row && row.values) || {};
	var duration = parseNumber(values.value);
	if (isNaN(duration)) { duration = 1; }
	var quantity = parseNumber(row && row.quantity);
	if (isNaN(quantity)) { quantity = 0; }
	var unitPrice = parseNumber(row && row.unitPrice);
	if (isNaN(unitPrice)) { unitPrice = 0; }
	// cents: trim the float noise first (4.67 x 2.5 is 1167.4999.. cents, not
	// 1167.5), round half up, then format with exactly two decimals
	var cents = Math.round(Number((quantity * unitPrice * duration * 100).toFixed(6)));
	var amount = (cents / 100).toFixed(2);
	return { amount: amount, warnings: {} };
}
