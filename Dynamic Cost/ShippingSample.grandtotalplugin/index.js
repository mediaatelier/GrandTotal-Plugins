changed();

function changed()
{
	var result = {};
	var pieces = query().valueForKeyPath("@sum.quantity");
	result["cost"] = 6.5 * pieces;
	result["quantity"] = 0;
	result["unit"] = "";
	result["notes"] = "" + pieces + " " + localize("items home delivery");
	result["name"] = localize("ShippingSample");
	return result; 
}
