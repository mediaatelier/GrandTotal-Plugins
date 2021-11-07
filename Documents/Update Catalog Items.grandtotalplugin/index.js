/*
	
	
*/

updateItems();


function updateItems()
{
	var aDocument = query().record();
	if (aDocument.dateSent)
	{
		return;
	}
	
	var catalogItems = fetchRecords("CatalogItem");
	
	refreshCatalogInItem(catalogItems,aDocument);
}

function refreshCatalogInItem(catalogItems,item)
{
	var children = item.children.editableRecords();
	for (childIndex in children)
	{
		child = children[childIndex];
		
		if (child.valueForKeyPath("entity.name") != "Cost")
		{
			continue;
		}
		
		
		var filteredCatalogItems = catalogItems.filter("name LIKE '" + child.name + "'");
		
		if (filteredCatalogItems.count() == 1)
		{
			updateItemWithCatalogItem(child,filteredCatalogItems.records()[0]);
		}
		else
		{
			filteredCatalogItems = filteredCatalogItems.filter("notes LIKE '" + child.notes + "'");
			if (filteredCatalogItems.count() == 1)
			{
				updateItemWithCatalogItem(child,filteredCatalogItems.records()[0]);
			}
		}
		refreshCatalogInItem(catalogItems,child);
	}

}


function updateItemWithCatalogItem(item,catalogitem)
{
	item.notes = catalogitem.notes;
	if (item.invoice.useGrossPrices)
	{
		item.unitPrice = catalogitem.unitPriceGross;
	}
	else
	{
		item.unitPrice = catalogitem.unitPrice;
	}
}




