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
	var result = [];
	root = pasteBoard["net.projectwizards.merlin.xml"];
	var aActivities = new Array();
	collectActivities(root["Project"],aActivities);
	
	for (index in aActivities)
	{
		activity = aActivities[index];
		if (activity.type == "Project")
		{
			continue; /// not adding the project
		}
		if (activity.type == "Cost" && !activity.unitPrice)
		{
			continue; /// not listing items without cost
		}
		
		aRec = insertRecord(activity.type);
		aRec.setValueForKey(activity.title,"name");
		if (activity.type == "Cost")
		{
			aRec.setValueForKey(activity.notes,"notes");
			aRec.setValueForKey(activity.duration,"quantity"); 
			aRec.setValueForKey(activity.unitPrice,"unitPrice");  
			aRec.setValueForKey(timeUnit,"unit");
		}
		result.push(aRec);
	}
	return result;
}


function collectActivities(object,array)
{
	activity = collectAttributes(object);
	array.push(activity);
	var children = getChildrenFromObject(object,"Activity");
	if (object.xmlns)
	{
		activity.type = "Project";
	}
	else if (children.length == 0)
	{
		activity.type = "Cost";
	}
	else
	{
		activity.type = "Title";
	}
	for (var i in children)
	{
		child = children[i];
		collectActivities(child,array);
	}
	var assignments = getChildrenFromObject(object,"Assignment");
	activity.assignments = [];
	totalUnitPrice = 0;
	totalDuration = 0;
	
	for (var i in assignments)
	{
		assignment = assignments[i];
		var parsedAssignment = collectAttributes(assignment);
		if (parsedAssignment.duration > 0)
		{
			totalDuration += parsedAssignment.duration;
		}
		if (parsedAssignment.unitPrice > 0)
		{	
			totalUnitPrice += parsedAssignment.unitPrice;
			activity.assignments.push(parsedAssignment);
		}
	}	
	
	if (assignments.length > 0 )
	{
		averageUnitPrice = totalUnitPrice / assignments.length;

		if (averageUnitPrice > 0)
		{
			activity.unitPrice = averageUnitPrice;
		}
		if (totalDuration > 0)
		{
			activity.duration = totalDuration;
		}
	}
	
	
}


function collectAttributes(object)
{
	var result = {};
	if (object.title)
	{
		result.title = object.title.text;
	}
	if (object.objectDescription)
	{
		result.notes = object.objectDescription.text;
	}
	if (object.plannedWorkCost)
	{
		result.cost = object.plannedWorkCost.value;
	}
	if (object.expectedDuration)
	{
		result.duration = object.plannedWork.resolvedAmount / 3600;
	}
	if (result.duration != 0 && result.cost)
	{
		result.unitPrice = result.cost / result.duration;
	}
	return result;
}	




// Attributes are either an array or a single object in JSON

function getChildrenFromObject(object,attributeName)
{
	var result = object[attributeName];
	if (!result) {
		return [];
	}
	if (!Array.isArray(result))
	{
		result = [result];
	}
	return result;
}




