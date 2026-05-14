/*
    Office-Manager Time Importer Plugin for GrandTotal

    Imports time entries from Office-Manager (daylio) time tracking.

    API Documentation:
    - POST requests to api.php with JSON body
    - Headers: X-API-Key, X-API-Secret
    - Actions: external_getTimeEntries, external_getProjects, external_getClients

    Response format for time entries:
    {
        "success": true,
        "data": {
            "entries": [{
                "id": "...",
                "date": "2024-01-15",
                "start": "09:00:00",
                "duration": 120,  // minutes
                "description": "...",
                "projectName": "...",
                "clientName": "...",
                "userName": "...",
                "projectRate": "70.00",
                "billed": 0/1,
                "taskName": "..."
            }],
            "pagination": { "currentPage": 1, "totalPages": 5, "totalEntries": 48, "perPage": 100 }
        }
    }
*/

// Date helper
Date.prototype.yyyymmdd = function () {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString();
	var dd = this.getDate().toString();
	return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
};

// Main entry point
timedEntries();

function httpPostJSON(url, body) {
	var headers = {
		"Content-Type": "application/json",
		"X-API-Key": apiKey,
		"X-API-Secret": apiSecret
	};

	var response = loadURL("POST", url, headers, body);

	if (!response || response.length === 0) {
		return null;
	}

	// Small delay to avoid rate limiting
	try {
		grandtotal.sleep(0.05);
	} catch (e) {}

	return JSON.parse(response);
}

function timedEntries() {
	// Validate settings
	if (!apiURL || apiURL.length === 0) {
		return "Bitte geben Sie die API-URL in den Plugin-Einstellungen ein.";
	}

	if (!apiKey || apiKey.length === 0) {
		return "Bitte geben Sie den API-Key in den Plugin-Einstellungen ein.";
	}

	if (!apiSecret || apiSecret.length === 0) {
		return "Bitte geben Sie das API-Secret in den Plugin-Einstellungen ein.";
	}

	// Calculate date range
	var endDate = new Date();
	var startDate = new Date();

	if (loadAll) {
		// Load entries from 5 years ago
		startDate.setFullYear(endDate.getFullYear() - 5);
	} else {
		// Load entries from last year
		startDate.setFullYear(endDate.getFullYear() - 1);
	}

	var result = [];
	var page = 1;
	var hasMorePages = true;
	var perPage = 100;

	// Setup progress indicator
	var progressIndicator = grandtotal.progress;
	progressIndicator.configuration.message = "Lade Zeiteintraege...";
	progressIndicator.configuration.canCancel = true;
	progressIndicator.start();

	while (hasMorePages) {
		// Check for cancellation
		if (progressIndicator.cancelled) {
			progressIndicator.end();
			return "Import abgebrochen.";
		}

		// Build request body
		var requestBody = {
			action: "external_getTimeEntries",
			dateFrom: startDate.yyyymmdd(),
			dateTo: endDate.yyyymmdd(),
			page: page,
			perPage: perPage
		};

		// Only load unbilled entries if setting is enabled
		if (unbilledOnly) {
			requestBody.billed = false;
		}

		var response = httpPostJSON(apiURL, requestBody);

		// Handle errors
		if (!response) {
			progressIndicator.end();
			return "Verbindung zum Server fehlgeschlagen. Bitte pruefen Sie die API-URL.";
		}

		if (response.grandtotal_error) {
			progressIndicator.end();
			return response.grandtotal_error;
		}

		if (!response.success) {
			progressIndicator.end();
			if (response.error) {
				return "API-Fehler: " + response.error;
			}
			return "API-Anfrage fehlgeschlagen. Bitte pruefen Sie Ihre Zugangsdaten.";
		}

		if (!response.data || !response.data.entries) {
			progressIndicator.end();
			return "Unerwartetes Antwortformat vom Server.";
		}

		var entries = response.data.entries;
		var pagination = response.data.pagination;

		// Update progress
		if (pagination && pagination.totalEntries) {
			progressIndicator.configuration.maxValue = pagination.totalEntries;
			progressIndicator.configuration.value = Math.min(page * perPage, pagination.totalEntries);
			progressIndicator.configuration.message = "Lade Seite " + page + " von " + pagination.totalPages + "...";
		}

		// Process entries
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var item = processEntry(entry);
			if (item) {
				result.push(item);
			}
		}

		// Check for more pages
		if (pagination && pagination.currentPage < pagination.totalPages) {
			page++;
		} else {
			hasMorePages = false;
		}
	}

	progressIndicator.end();

	if (result.length === 0) {
		return "Keine Zeiteintraege gefunden.";
	}

	return result;
}

function processEntry(entry) {
	var item = {};

	// Required: unique ID
	item.uid = "de.codish.officemanager." + entry.id;

	// Required: start date in ISO 8601 format
	// Combine date and start time
	var dateStr = entry.date;
	var timeStr = entry.start || "00:00:00";

	// Create ISO 8601 date string
	// Format: 2024-01-15T09:00:00+01:00
	item.startDate = dateStr + "T" + timeStr + "+01:00";

	// Required: duration in minutes
	item.minutes = parseInt(entry.duration) || 0;

	// Skip entries with 0 duration
	if (item.minutes === 0) {
		return null;
	}

	// Optional: client name
	if (entry.clientName) {
		item.client = entry.clientName;
	}

	// Optional: project name
	if (entry.projectName) {
		item.project = entry.projectName;
	}

	// Optional: description/notes
	if (entry.description) {
		item.notes = entry.description;
	}

	// Optional: task as category
	if (entry.taskName) {
		item.category = entry.taskName;
	}

	// Optional: user name
	if (entry.userName) {
		item.user = entry.userName;
	}

	// Calculate cost based on project rate
	var rate = 0;
	if (entry.projectRate) {
		rate = parseFloat(entry.projectRate);
	} else if (entry.clientRate) {
		rate = parseFloat(entry.clientRate);
	}

	if (rate > 0) {
		item.cost = (rate * item.minutes) / 60;
	}

	// Apply rounding if configured
	if (item.minutes > 0 && roundTo > 0) {
		var originalMinutes = item.minutes;
		item.minutes = Math.ceil(item.minutes / roundTo) * roundTo;

		// Recalculate cost after rounding
		if (rate > 0) {
			item.cost = (rate * item.minutes) / 60;
		}
	}

	// Store invoice number in label if billed
	if (entry.billed == 1 && entry.invoiceNumber) {
		item.label = entry.invoiceNumber;
	}

	return item;
}
