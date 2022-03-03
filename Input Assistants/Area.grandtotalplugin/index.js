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


function update()
{
	var result = {};
	
	var area = width  * length;
	
	var aNotes = valueForKeyPath("notes");
	if (!aNotes)
		aNotes = "";
		
	aNotes = removeItalic(aNotes)
	
	aLine = "" + formattedNumber(length) +" "+  unit + " x " + formattedNumber(width)  +" "+ unit;
	
	aLine = "<i>"+ aLine + "</i>";
	
	if (aNotes.length > 0)
		aNewNotes = aNotes + aLine;
	else
		aNewNotes = aLine;
		
	result["notes"] = aNewNotes;
	result["unit"] = unit + "²";
	result["quantity"] = area;

	return result;
}


function removeItalic(s) 
{
	var regExp = /(\<i)\s*[^\>]*\>([^\<]*\<\/i>)?/gi;
	return s.replace(regExp,"");
}