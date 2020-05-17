/*

	pasteBoard a associative array of the pasteBoardTypes
	hourlyRate the rate GrandTotal provides
	timeUnit the unit GrandTotal uses for timed entries
	
	create records using insertRecord(entityType) and return them as an array
	
	NOTE: this type of plugin is running synchronously 

*/

paste();




function paste()
{
	var result = new Array();
	items = pasteBoard["com.momenta.agenda.section"];
	for (index in items)
	{
		item = items[index];
		aRec = insertRecord("Cost");
		aRec.setValueForKey(item["title"],"name");
		aRec.setValueForKey(getNotes(item),"notes");
		aRec.setValueForKey(timeUnit,"unit");
		aRec.setValueForKey(hourlyRate,"unitPrice");
		aRec.setValueForKey(1,"quantity");
		aRec.setValueForKey(parseDate(item["endDate"]),"dateCreation");
		result.push(aRec);
	}
	return result;
}


function parseDate(string)
{
	if (!string) {
		return undefined;
	}
	var offset = new Date().getTimezoneOffset();
	var date = new Date(string);
	if (isNaN(date.getYear()))
	{
		return undefined;
	}
	date.setMinutes(date.getMinutes() - offset);
	return date;
}


function getNotes(item)
{
	var result = "";
	var paragraphs = item["paragraphs"];
	for (p in paragraphs)
	{
		paragraph = paragraphs[p];
		var content = paragraph["content"];
		var runs = JSON.parse(content);
		
		for (r in runs)
		{
			run = runs[r];
			var template = "<content/>";
			var attributes = run["attributes"];
			if (attributes["bold"])
			{
				template = templateReplace(template,"<b><content/></b>");
			}
			if (attributes["italic"])
			{
				template = templateReplace(template,"<i><content/></i>");
			}
			if (attributes["underline"])
			{
				template = templateReplace(template,"<u><content/></u>");
			}
			if (attributes["strikethrough"])
			{
				template = templateReplace(template,"<strike><content/></strike>");
			}
			template = templateReplace(template,run["string"]);
			result += template;
		}
		
	}
	return result;
}


function templateReplace(template,substitute)
{
	return template.replace(/<content\/>/,substitute);
}
