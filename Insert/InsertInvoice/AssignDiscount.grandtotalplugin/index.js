var records = query().records(); /// Get the inserted records. Usually an array of one

for (i in records)
{
	var record = records[i];
	var client = record.client;
	var customFieldName = localize("Discount");
	var discount = parseFloat(client.customFieldAccessor[customFieldName]);
	if (!Number.isNaN(discount))
	{
		record.discount = discount;
		displayUserNotification(localize("Applied discount"),discount);
	}
}

