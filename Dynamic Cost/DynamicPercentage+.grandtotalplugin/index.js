

changed();




function changed()
{
	var result = {};
	result["cost"] = quantity / 100 * unitPrice;
	result["unit"] = "%";
	return result; 
}
