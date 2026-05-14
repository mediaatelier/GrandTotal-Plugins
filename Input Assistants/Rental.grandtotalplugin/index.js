/*
	Return a JSON with the values you like to replace
	
	Keys:
	
	name		-> Title (string)
	notes		-> Description (string)
	quantity	-> Quantity (number)
	unit 		-> Unit	(string)
	unitPrice	-> Unit Price (number)
	discount	-> Discount (number)
	
	Variables:
	
	currency
	and the ones you define in the info.plist
	
	Functions:
	
	localize(string) returns a string with the localized value (if defined)
	formattedNumber(number) returns a string with the number format for the document

*/

update();

function update() {
	var result = {};

	var daysName = localize("Days");
	if (days == 1) daysName = localize("Day");

	result["unitPrice"] = unitPrice * days;
	result["notes"] =
		"" + days + " " + daysName + " " + localize("at") + " " + currency + " " + formattedNumber(unitPrice);
	result["unit"] = localize("Pcs");
	return result;
}
