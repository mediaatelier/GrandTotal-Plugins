
migrate();



function urlForEndPoint(theEndPoint)
{
	return "https://my.sevdesk.de/api/v1/" + theEndPoint;
}


function httpGetJSON(theUrl)
{
	header = {"Authorization":token};
	string = loadURL("GET",theUrl,header);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}



function migrate()
{
	var contacts = httpGetJSON(urlForEndPoint("Contact"));
	if (contacts.server_error)
	{
		return contacts;
	}
	var contactAddresses = httpGetJSON(urlForEndPoint("ContactAddress"));
	var communicationWaysEmail = httpGetJSON(urlForEndPoint("CommunicationWay?type=EMAIL"));
	var communicationWaysPhone = httpGetJSON(urlForEndPoint("CommunicationWay?type=PHONE"));
	var countries = httpGetJSON(urlForEndPoint("StaticCountry"));
	
	
	var catalogItems = httpGetJSON(urlForEndPoint("Part"));
	return {
		entities: {
			Client: contacts.objects.map(function(contact, index) {
			
				var address = contactAddresses.objects.find(function(addr) {
					return addr.contact && addr.contact.id == contact.id;
				});
				
				
				var communicationWayEmail = communicationWaysEmail.objects.find(function(cw) {
					return cw.contact && cw.contact.id == contact.id;
				});
				
				var communicationWayPhone = communicationWaysPhone.objects.find(function(cw) {
					return cw.contact && cw.contact.id == contact.id;
				});
				
				var country = countries.objects.find(function(ctr) {
					return ctr.id == address.country.id;
				});
				
				var countryCode = "";
				if (country)
				{
				 	countryCode = country.code.toUpperCase();
				}
				
				var email = "";
				if (communicationWayEmail) {
					email = communicationWayEmail.value;
				}
				
				var phoneNumber = "";
				if (communicationWayPhone) {
					email = communicationWayPhone.value;
				}
				
				
				
				return {
					attributes: {
						uid: "sevDesk.contact." + contact.id,
						organization: contact.name || "",
						lastName: contact.familyname || "",
						firstName: contact.surename  || "",
						middleName: contact.name2  || "",
						title : contact.academicTitle  || "",
						clientID: contact.customerNumber || "",
						taxID: contact.vatNumber || "",
						iban: contact.bankAccount || "",
						email: email,
						phoneNumber: phoneNumber,
						city: address.city || "",
						zip: address.zip || "",
						address: address.street || "",
						countryCode: countryCode

					}
				};
			}),
			CatalogItem: catalogItems.objects.slice(0, 2).map(function(item, index) {
				return {
					attributes: {
						uid: "sevDesk.part." + item.id,
						name: item.name || "",
						notes: item.text || "",
						itemNumber: item.partNumber || "",
						unitPriceGross: item.priceGross,
						unitPrice: item.priceNet,
						costPrice:item.pricePurchase

					}
				};
			})
		}
	};
}


