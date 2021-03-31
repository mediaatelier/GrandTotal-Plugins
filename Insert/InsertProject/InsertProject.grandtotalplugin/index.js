records = query().records();
existing = fetchRecords("Project");
existingNames = existing.valueForKeyPath("name");

for (i in records)
{
	record = records[i];
	clientID = record.valueForKeyPath("client.clientID");
	counter = 1;
	do {
		newName = clientID + "-" + padToFour(counter);
		counter++;
	} while (existingNames.includes(newName));
	record.name = newName;	
}


function padToFour(number) {
  if (number<=9999) { number = ("000"+number).slice(-4); }
  return number;
}