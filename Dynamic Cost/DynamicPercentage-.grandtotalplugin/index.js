

changed();




function changed()
{
	var result = {};
	result["cost"] = quantity / 100 * unitPrice * -1;
	result["unit"] = "%";
	return result; 
}
