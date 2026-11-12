// CostExtension plugin: GOÄ.
// Receives a row { values: {<customValuesJSON>}, quantity, unitPrice, notes } and
// returns { amount: "<decimal string>", warnings: { <field key>: <message> } }.
// amount is the line amount before discount: quantity x unit price (Einfachsatz)
// x values.factor (the user's input, default 1), rounded to cents as GOÄ line
// amounts are. GrandTotal stores it in values.amount and applies the discount.
// The fee range comes with the catalog item (§ 5 GOÄ): values.threshold is the
// Schwellenwert above which a written justification is needed (2.3, 1.8 for
// Abschnitt A/E/O, 1.15 for M and Nr. 437), values.max the Höchstsatz (3.5,
// 2.5, 1.3). Positions without these keys use 2.3 and 3.5. values.agreement
// "0" marks Abschnitte A, E, M and O, where § 2 Abs. 3 GOÄ rules out a
// Honorarvereinbarung above the Höchstsatz.

var DEFAULT_THRESHOLD = 2.3;
var DEFAULT_MAX = 3.5;

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

function germanNumber(n)
{
	return String(n).replace(".", ",");
}

function evaluate(row)
{
	var values = (row && row.values) || {};
	var f = parseNumber(values.factor);
	if (isNaN(f)) { f = 1; }
	var threshold = parseNumber(values.threshold);
	if (isNaN(threshold)) { threshold = DEFAULT_THRESHOLD; }
	var max = parseNumber(values.max);
	if (isNaN(max)) { max = DEFAULT_MAX; }
	var quantity = parseNumber(row && row.quantity);
	if (isNaN(quantity)) { quantity = 0; }
	var unitPrice = parseNumber(row && row.unitPrice);
	if (isNaN(unitPrice)) { unitPrice = 0; }
	// cents: trim the float noise first (4.67 x 2.5 is 1167.4999.. cents, not
	// 1167.5), round half up, then format with exactly two decimals
	var cents = Math.round(Number((quantity * unitPrice * f * 100).toFixed(6)));
	var amount = (cents / 100).toFixed(2);
	var notes = String((row && row.notes) || "").trim();
	var warnings = {};
	if (f > max)
	{
		if (String(values.agreement) == "0")
		{
			warnings.factor = "Faktor über Höchstsatz " + germanNumber(max) + ": für diese Leistung nicht zulässig (§ 2 Abs. 3 GOÄ)";
		}
		else
		{
			warnings.factor = "Faktor über Höchstsatz " + germanNumber(max) + ": nur mit Honorarvereinbarung (§ 2 GOÄ)";
		}
	}
	else if (f > threshold && notes.length == 0)
	{
		warnings.factor = "Faktor über " + germanNumber(threshold) + ": Begründung in der Beschreibung fehlt";
	}
	return { amount: amount, warnings: warnings };
}
