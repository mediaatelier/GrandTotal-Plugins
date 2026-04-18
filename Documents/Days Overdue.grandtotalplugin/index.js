run();

function run() {
	var invoice = query().record();
	var dateDue = invoice.dateDue;

	if (!dateDue) {
		alert(localize("Title"), localize("NoDueDate"));
		return;
	}

	var now = new Date();
	var dueDate = new Date(dateDue);
	var diffMs = now.getTime() - dueDate.getTime();
	var days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	var message;
	if (days > 0) {
		message = days + " " + localize("DaysOverdue");
	} else if (days === 0) {
		message = localize("DueToday");
	} else {
		message = Math.abs(days) + " " + localize("DaysRemaining");
	}

	alert(localize("Title"), message);
}
