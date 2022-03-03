/*
	
	
*/

createReminder();


function createReminder()
{
	var percentage = 5;
	var invoice = query().record();
	var balance = invoice.balance;
	var dateDue = invoice.dateDue;
	var dateNow = new Date();
	if (!dateDue)
	{
		return;
	}
	var diff = dateNow.getTime() - dateDue.getTime();
	var days = diff / (1000 * 3600 * 24);
	var ratio = days / 365;
	
	var value = balance * percentage;
	var payment = insertRecord("Payment");
	payment.amount = Math.round(value * ratio * -1) / 100;
	payment.parentDocument = invoice;
	payment.currency = invoice.currency;
	payment.notes = localize("Late Fee");
	
	var followUpTypes = fetchRecords("FollowUpType");
	filteredFollowUpTypes = followUpTypes.filter("name LIKE '" + localize("Reminder") + "'");
	var followUpType = filteredFollowUpTypes.records()[0];
	var reminder = insertRecord("FollowUp");
	reminder.parentDocument = invoice;
	reminder.followUpType = followUpType;
	reminder.layout = followUpType.layout;
}
