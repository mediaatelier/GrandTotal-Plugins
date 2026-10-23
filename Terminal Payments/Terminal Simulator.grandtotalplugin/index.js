// Terminal payment simulator: walks through the steps of a real terminal
// without one. GrandTotal provides `payment` (amount, currency, reference,
// description, client), `setStatus(text)` and `isCancelled()`; pay() answers
// {status: "paid"|"cancelled"|"failed", amount, date, notes, message}.

function wait(seconds)
{
	for (var i = 0; i < seconds; i++)
	{
		if (isCancelled())
		{
			return false;
		}
		sleep(1);
	}
	return !isCancelled();
}


function pay()
{
	var steps = [
		[localize("Connecting to the terminal…"), 1],
		[localize("Present the card on the terminal…"), 4],
		[localize("Processing…"), 2]
	];
	for (var step of steps)
	{
		setStatus(step[0]);
		if (!wait(step[1]))
		{
			return {status: "cancelled"};
		}
	}
	if (declineCard)
	{
		return {status: "failed", message: localize("The card was declined.")};
	}
	var code = "SIM" + Math.floor(Math.random() * 1000000);
	return {
		status: "paid",
		amount: payment.amount,
		date: new Date(),
		notes: localize("Terminal Simulator") + " " + code
	};
}
