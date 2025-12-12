
migrate();



function urlForEndPoint(theEndPoint)
{
	return "https://api.lexware.io/v1/" + theEndPoint + "/";
}


function httpGetJSON(theUrl)
{
	header = {"Authorization":"Bearer " + token,"Accept":"application/json"};
	string = loadURL("GET",theUrl,header);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}



function migrate()
{
	var contactsResponse = httpGetJSON(urlForEndPoint("contacts"));
	if (contactsResponse.server_error) {
		return contactsResponse;
	}
	var contacts = contactsResponse.content;

	var articlesResponse = httpGetJSON(urlForEndPoint("articles"));
	if (articlesResponse.server_error) {
		return articlesResponse;
	}
	var articles = articlesResponse.content;

	return {
		entities: {
			Client: contacts.map(function(contact) {
				var company = contact.company || {};
				var person = contact.person || {};
				var billingList = (contact.addresses && contact.addresses.billing) || [];
				
				var billingAddress = billingList.find(function(addr) {
					return addr && (addr.street || addr.city || addr.zip);
				}) || {};

				var email = (contact.emailAddresses && contact.emailAddresses.business && contact.emailAddresses.business[0]) || "";
				var phone = (contact.phoneNumbers && contact.phoneNumbers.business && contact.phoneNumbers.business[0]) || "";

				var firstName = "";
				var lastName = "";
				var title = "";

				if (company.contactPersons && company.contactPersons.length > 0) {
					var primary = company.contactPersons.find(function(p) { return p.primary; }) || company.contactPersons[0];
					firstName = primary.firstName || "";
					lastName = primary.lastName || "";
					title = primary.salutation || "";
					if (!email) email = primary.emailAddress || "";
					if (!phone) phone = primary.phoneNumber || "";
				} else if (person.firstName || person.lastName) {
					firstName = person.firstName || "";
					lastName = person.lastName || "";
					title = person.salutation || "";
				}

				return {
					attributes: {
						uid: "lexWare.Client." + contact.id,
						organization: company.name || "",
						lastName: lastName,
						firstName: firstName,
						title: title,
						clientID: (contact.roles.customer && contact.roles.customer.number) || "",
						taxID: company.vatRegistrationId || company.taxNumber || "",
						email: email,
						phoneNumber: phone,
						city: billingAddress.city || "",
						zip: billingAddress.zip || "",
						address: billingAddress.street || "",
						countryCode: billingAddress.countryCode || ""
					}
				};
			}),

			CatalogItem: articles.map(function(article) {
				return {
					attributes: {
						uid: "lexWare." + article.type + "." + article.id,
						name: article.title || "",
						notes: article.note || article.description || "",
						itemNumber: article.articleNumber || "",
						ean: article.gtin || "",
						unit: article.unitName || "",
						unitPrice: article.price && article.price.netPrice || 0,
						unitPriceGross: article.price && article.price.grossPrice || 0,
						taxRate: article.price && article.price.taxRate || 0
					}
				};
			})
		}
	};
}




