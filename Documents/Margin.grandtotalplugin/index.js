/*
	
	
*/


calculate();


function calculate()
{
	var aDocument = query().record();
	var aItems = aDocument.valueForKey("children").records();
	var aTable = [];
	var purchasingPrice = 0;
	var sellingPrice = 0;
	for (aItemIndex in aItems)
	{
		var aTableItem = [];
		aItem = aItems[aItemIndex];
		
		var aCustomValues = aItem.customValues.records()
		for (aValueIndex in aCustomValues)
		{
			aValue = aCustomValues[aValueIndex];
			if (aValue.valueForKeyPath("field.name") == localize("Purchasing Price"))
			{
			
				purchasingPrice += parseFloat(aValue.name.replace(/,/g, '.')) * aItem.quantity;
				sellingPrice += aItem.unitPrice * aItem.quantity;
				break;
			}
		}
	}
	
	displayUserNotification(localize("Margin"), aDocument.valueForKeyPath("currency.name")+ " " + (sellingPrice - purchasingPrice));
	
}

