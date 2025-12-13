
migrate();


function httpGetJSON(theUrl) {
	var header = {
		"X-API-TOKEN": token,
		"X-Requested-With": "XMLHttpRequest",
		"Accept": "application/json"
	};

	var response = loadURL("GET", theUrl, header);

	// Check if response is an error object (not a string)
	if (typeof response === 'object' && response !== null) {
		// Check for HTTP errors (403, 401, etc.)
		if (response.server_error) {
			return {
				server_error: true,
				message: "API Error: " + (response.server_error.message || "Authentication failed. Please check your API token and Base URL.")
			};
		}

		// Check for grandtotal_error
		if (response.grandtotal_error) {
			return {
				server_error: true,
				message: "Connection Error: " + response.grandtotal_error
			};
		}

		// Check for http_error
		if (response.http_error) {
			return {
				server_error: true,
				message: "HTTP Error " + response.http_error + ": Authentication failed. Please check your API token and Base URL."
			};
		}
	}

	if (!response || response.length == 0) {
		return {
			server_error: true,
			message: "No response from Invoice Ninja API. Please check your API token and internet connection."
		};
	}

	var result = JSON.parse(response);

	// Check for API error message in response
	if (result.message && (result.message.indexOf("Unauthenticated") !== -1 || result.message.indexOf("Invalid token") !== -1)) {
		return {
			server_error: true,
			message: "Authentication failed: " + result.message + "\n\nPlease check:\n1. Your API token is correct\n2. The Base URL matches your Invoice Ninja installation\n3. You have API access enabled"
		};
	}

	return result;
}


function fetchAllClientsPaginated(baseUrl) {
	var allClients = [];
	var page = 1;
	var perPage = 100;
	var hasMore = true;

	while (hasMore) {
		var url = baseUrl + "/api/v1/clients?per_page=" + perPage + "&page=" + page;
		var response = httpGetJSON(url);

		if (response.server_error) {
			return response;
		}

		// Invoice Ninja v5 returns data in a "data" array
		if (!response.data || !Array.isArray(response.data)) {
			return {
				server_error: true,
				message: "Unexpected response format from Invoice Ninja API."
			};
		}

		allClients = allClients.concat(response.data);

		// Check pagination meta
		if (response.meta && response.meta.pagination) {
			var pagination = response.meta.pagination;
			if (pagination.current_page >= pagination.total_pages) {
				hasMore = false;
			} else {
				page++;
			}
		} else {
			// No pagination info, assume single page
			hasMore = false;
		}
	}

	return allClients;
}


function fetchAllProductsPaginated(baseUrl) {
	var allProducts = [];
	var page = 1;
	var perPage = 100;
	var hasMore = true;

	while (hasMore) {
		var url = baseUrl + "/api/v1/products?per_page=" + perPage + "&page=" + page;
		var response = httpGetJSON(url);

		if (response.server_error) {
			// Products might not exist or endpoint might be different
			// Return empty array instead of error
			return [];
		}

		if (!response.data || !Array.isArray(response.data)) {
			return [];
		}

		allProducts = allProducts.concat(response.data);

		// Check pagination
		if (response.meta && response.meta.pagination) {
			var pagination = response.meta.pagination;
			if (pagination.current_page >= pagination.total_pages) {
				hasMore = false;
			} else {
				page++;
			}
		} else {
			hasMore = false;
		}
	}

	return allProducts;
}


function fetchCountryMapping(baseUrl) {
	var url = baseUrl + "/api/v1/statics";
	var response = httpGetJSON(url);

	if (response.server_error) {
		log("Country mapping failed: " + response.message);
		return {};
	}

	var mapping = {};
	if (response.countries && Array.isArray(response.countries)) {
		for (var i = 0; i < response.countries.length; i++) {
			var country = response.countries[i];
			if (country.id && country.iso_3166_2) {
				// Ensure country.id is stored as string for consistent lookup
				mapping[String(country.id)] = country.iso_3166_2;
			}
		}
	}

	return mapping;
}


function mapInvoiceNinjaClientToClient(client, countryMapping) {
	var attributes = {
		uid: "invoiceninja.client." + client.id
	};

	// Company or individual
	if (client.name) {
		attributes.organization = client.name;
	}

	// Contact information from primary contact
	if (client.contacts && client.contacts.length > 0) {
		var primaryContact = client.contacts.find(function(c) {
			return c.is_primary;
		}) || client.contacts[0];

		if (primaryContact.first_name) {
			attributes.firstName = primaryContact.first_name;
		}
		if (primaryContact.last_name) {
			attributes.lastName = primaryContact.last_name;
		}
		if (primaryContact.email) {
			attributes.email = primaryContact.email;
		}
		if (primaryContact.phone) {
			attributes.phoneNumber = primaryContact.phone;
		}
	}

	// Client number
	if (client.number) {
		attributes.clientID = client.number;
	}

	// VAT number
	if (client.vat_number) {
		attributes.taxID = client.vat_number;
	}

	// Website
	if (client.website) {
		attributes.website = client.website;
	}

	// Address
	if (client.address1) {
		attributes.address = client.address1;
		if (client.address2) {
			attributes.address += ", " + client.address2;
		}
	}

	if (client.city) {
		attributes.city = client.city;
	}

	if (client.postal_code) {
		attributes.zip = client.postal_code;
	}

	if (client.state) {
		attributes.state = client.state;
	}

	if (client.country_id && countryMapping && countryMapping[client.country_id]) {
		// Map numeric country ID to ISO 3166-2 code (e.g. "4" -> "AF")
		attributes.countryCode = countryMapping[client.country_id];
	}

	// Notes
	var notes = [];
	if (client.public_notes) {
		notes.push(client.public_notes);
	}
	if (client.private_notes) {
		notes.push("Private: " + client.private_notes);
	}
	if (notes.length > 0) {
		attributes.notes = notes.join("\n");
	}

	return {
		attributes: attributes,
		relations: {}
	};
}


function mapInvoiceNinjaProductToItem(product) {
	var attributes = {
		uid: "invoiceninja.product." + product.id,
		name: product.product_key || product.notes || "",
		notes: product.notes || ""
	};

	// Product key/number
	if (product.product_key) {
		attributes.itemNumber = product.product_key;
	}

	// Price - Invoice Ninja API returns prices as integers
	// NOTE: These appear to be whole currency units (not cents)
	// Example: price: 331 = 331.00 in currency
	// If your prices seem too high/low, they might be in cents - divide by 100
	// NOTE: Invoice Ninja uses "cost" for selling price and "price" for cost price
	if (product.cost !== undefined && product.cost !== null) {
		attributes.unitPrice = parseFloat(product.cost) || 0;
		// If prices are in cents, uncomment this line:
		// attributes.unitPrice = (parseFloat(product.cost) || 0) / 100;
	}

	// Cost Price
	if (product.price !== undefined && product.price !== null) {
		attributes.costPrice = parseFloat(product.price) || 0;
		// If costs are in cents, uncomment this line:
		// attributes.costPrice = (parseFloat(product.price) || 0) / 100;
	}

	// Quantity (default quantity for the product)
	if (product.quantity) {
		// Store as note since CatalogItem doesn't have default quantity
		if (attributes.notes) {
			attributes.notes += "\nDefault Quantity: " + product.quantity;
		} else {
			attributes.notes = "Default Quantity: " + product.quantity;
		}
	}

	// Tax rate
	if (product.tax_rate1 !== undefined && product.tax_rate1 !== null) {
		attributes.taxRate = parseFloat(product.tax_rate1) || 0;
	}

	// Tax name
	if (product.tax_name1) {
		if (attributes.notes) {
			attributes.notes += "\nTax: " + product.tax_name1;
		} else {
			attributes.notes = "Tax: " + product.tax_name1;
		}
	}

	return {
		attributes: attributes
	};
}


function migrate() {
	// Base URL Configuration
	// For HOSTED version: https://invoicing.co
	// For DEMO: https://demo.invoiceninja.com
	// For SELF-HOSTED: https://your-domain.com
	// Change this to match your Invoice Ninja installation:
	var baseUrl = "https://invoicing.co";

	// Alternative: try to extract from a test request
	// or let user configure via plugin settings

	// Fetch country mapping for ISO codes
	var countryMapping = fetchCountryMapping(baseUrl);

	// Fetch clients
	var clients = fetchAllClientsPaginated(baseUrl);
	if (clients.server_error) {
		return clients;
	}

	// Fetch products
	var products = fetchAllProductsPaginated(baseUrl);
	// Products is optional, don't fail if not available

	// Validate data
	if (!Array.isArray(clients)) {
		return {
			server_error: true,
			message: "Invalid clients data received from Invoice Ninja."
		};
	}

	if (!Array.isArray(products)) {
		products = [];
	}

	// Map to GrandTotal entities
	var mappedClients = [];
	for (var i = 0; i < clients.length; i++) {
		mappedClients.push(mapInvoiceNinjaClientToClient(clients[i], countryMapping));
	}

	var catalogItems = [];
	for (var j = 0; j < products.length; j++) {
		catalogItems.push(mapInvoiceNinjaProductToItem(products[j]));
	}

	// Return migrated data
	return {
		entities: {
			Client: mappedClients,
			CatalogItem: catalogItems
		}
	};
}
