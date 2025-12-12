
migrate();


function httpGetJSON(theUrl) {
	var header = {
		"Authorization": "Bearer " + token,
		"Accept": "application/json"
	};

	var string = loadURL("GET", theUrl, header);

	if (!string || string.length == 0) {
		return {
			server_error: true,
			message: "No response from Bexio API. Please check your API token and internet connection."
		};
	}

	var result = JSON.parse(string);
	return result;
}


function fetchAllContactsPaginated() {
	var allContacts = [];
	var limit = 100;
	var offset = 0;
	var hasMore = true;

	// Fetch contacts with pagination (v2.0 API)
	while (hasMore) {
		var url = "https://api.bexio.com/2.0/contact?limit=" + limit + "&offset=" + offset;
		var response = httpGetJSON(url);

		if (response.server_error) {
			return response;
		}

		if (!Array.isArray(response)) {
			return {
				server_error: true,
				message: "Unexpected response format from Bexio API."
			};
		}

		allContacts = allContacts.concat(response);

		// Check if there are more pages
		if (response.length < limit) {
			hasMore = false;
		} else {
			offset += limit;
		}
	}

	return allContacts;
}


function fetchArticles() {
	var url = "https://api.bexio.com/2.0/article";
	return httpGetJSON(url);
}


function fetchContactRelations() {
	var url = "https://api.bexio.com/2.0/contact_relation";
	return httpGetJSON(url);
}


function mapBexioContactToClient(contact, relations) {
	var attributes = {
		uid: "bexio.contact." + contact.id
	};

	// Company or Person (contact_type_id: 1 = Company, 2 = Person)
	if (contact.contact_type_id == 1) {
		attributes.organization = contact.name_1 || "";
		if (contact.name_2) {
			attributes.organization += " " + contact.name_2;
		}
	} else {
		attributes.firstName = contact.name_1 || "";
		attributes.lastName = contact.name_2 || "";

		// Check for company relationship
		if (relations && relations.length > 0) {
			var relation = null;
			for (var i = 0; i < relations.length; i++) {
				if (relations[i].contact_sub_id == contact.id) {
					relation = relations[i];
					break;
				}
			}
			if (relation && relation.contact_id) {
				// Store parent company ID to link later
				attributes.parentContactId = relation.contact_id;
				// Add role to notes
				if (relation.description) {
					attributes.notes = relation.description;
				}
			}
		}
	}

	// Contact number
	if (contact.nr) {
		attributes.clientID = contact.nr;
	}

	// Email (prefer primary, fallback to secondary)
	if (contact.mail) {
		attributes.email = contact.mail;
	} else if (contact.mail_second) {
		attributes.email = contact.mail_second;
	}

	// Phone numbers
	if (contact.phone_fixed) {
		attributes.phoneNumber = contact.phone_fixed;
	} else if (contact.phone_mobile) {
		attributes.phoneNumber = contact.phone_mobile;
	} else if (contact.phone_fixed_second) {
		attributes.phoneNumber = contact.phone_fixed_second;
	}

	// Mobile number (if different from fixed)
	if (contact.phone_mobile && contact.phone_mobile !== attributes.phoneNumber) {
		attributes.mobileNumber = contact.phone_mobile;
	}

	// Fax
	if (contact.fax) {
		attributes.faxNumber = contact.fax;
	}

	// Website
	if (contact.url) {
		attributes.website = contact.url;
	}

	// Address
	if (contact.address) {
		attributes.address = contact.address;
	} else if (contact.street_name) {
		var addr = contact.street_name || "";
		if (contact.house_number) {
			addr += " " + contact.house_number;
		}
		if (contact.address_addition) {
			addr += ", " + contact.address_addition;
		}
		attributes.address = addr;
	}

	attributes.zip = contact.postcode ? String(contact.postcode) : "";
	attributes.city = contact.city || "";

	if (contact.country_id) {
		attributes.countryCode = String(contact.country_id);
	} else if (contact.country) {
		attributes.countryCode = contact.country;
	}

	// Title
	if (contact.title_id) {
		attributes.title = String(contact.title_id);
	}

	// Remarks
	if (contact.remarks) {
		if (attributes.notes) {
			attributes.notes += "\n" + contact.remarks;
		} else {
			attributes.notes = contact.remarks;
		}
	}

	var entity = {
		attributes: attributes
	};

	// Add relations (parent company for persons)
	if (attributes.parentContactId) {
		entity.relations = {
			parent: "Client/bexio.contact." + attributes.parentContactId
		};
		delete attributes.parentContactId;
	} else {
		entity.relations = {};
	}

	return entity;
}


function mapBexioArticleToItem(article) {
	var attributes = {
		uid: "bexio.article." + article.id,
		name: article.intern_name || article.intern_code || "",
		itemNumber: article.intern_code || ""
	};

	// Price
	if (article.sale_price) {
		attributes.unitPrice = parseFloat(article.sale_price) || 0;
	} else if (article.sale_total) {
		attributes.unitPrice = parseFloat(article.sale_total) || 0;
	}

	// Cost price (purchase price)
	if (article.purchase_price) {
		attributes.costPrice = parseFloat(article.purchase_price) || 0;
	}

	// Unit
	if (article.unit_name) {
		attributes.unit = article.unit_name;
	}

	// Tax rate
	if (article.tax_income_id) {
		var taxMap = {
			"1": 8.1,
			"2": 2.6,
			"3": 0,
			"4": 3.8
		};
		attributes.taxRate = taxMap[String(article.tax_income_id)] || 8.1;
	}

	// Description
	var notes = [];
	if (article.intern_description) {
		notes.push(article.intern_description);
	}
	if (article.remarks) {
		notes.push(article.remarks);
	}
	if (article.html_text) {
		notes.push(article.html_text);
	}
	if (notes.length > 0) {
		attributes.notes = notes.join("\n");
	}

	return {
		attributes: attributes
	};
}


function migrate() {
	// Fetch contacts
	var contacts = fetchAllContactsPaginated();
	if (contacts.server_error) {
		return contacts;
	}

	// Fetch relations (non-critical)
	var relations = fetchContactRelations();
	if (relations.server_error) {
		relations = [];
	}

	// Fetch articles
	var articles = fetchArticles();
	if (articles.server_error) {
		return articles;
	}

	// Validate data
	if (!Array.isArray(contacts)) {
		return {
			server_error: true,
			message: "Invalid contacts data received from Bexio."
		};
	}

	if (!Array.isArray(articles)) {
		articles = [];
	}

	// Map to GrandTotal entities
	var clients = [];
	for (var i = 0; i < contacts.length; i++) {
		clients.push(mapBexioContactToClient(contacts[i], relations));
	}

	var catalogItems = [];
	for (var j = 0; j < articles.length; j++) {
		catalogItems.push(mapBexioArticleToItem(articles[j]));
	}

	// Return migrated data
	return {
		entities: {
			Client: clients,
			CatalogItem: catalogItems
		}
	};
}
