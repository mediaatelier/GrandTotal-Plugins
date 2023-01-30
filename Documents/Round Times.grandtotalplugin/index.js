round();

function mod(n, m) {
     return ((n % m) + m) % m;
}

function round()
{          
   
   	var roundTo = 0.1;
	var aInvoice = query().record();
	if (aInvoice.dateSent) {
		return;
	}
	aChildren = aInvoice.children.editableRecords();
	
	
	for (var i = 0; i < aChildren.length; i++) 
	{
		aItem = aChildren[i];
		
		if (aItem.valueForKey("hasTimeUnit")) 
		{
			if (aItem.valueForKey("className") == "GTGroup") 
			{
				var aQty = Math.round(aItem.quantity *100000) / 100000;
				aMod = aQty % roundTo;

				if (aMod >= 0.00001)
				{
					var aCost = grandtotal.insertRecord("Cost");
					if (aMod < 0.001)
					{
						aCost.quantity = - aMod;
					}
					else
					{
						aCost.quantity = roundTo - aMod;

					}
					aCost.rate = aItem.rate;
					aCost.name = "Round";
					aCost.parent = aItem;
				}
			}
			else if (aItem.valueForKey("className") == "GTCost")
			{

				if ((aItem.quantity % roundTo) > 0.01)
				{
					aItem.quantity = aItem.quantity + (roundTo - (aItem.quantity % roundTo));
				}

			}
		}
    	
	}
	
}


  
         

