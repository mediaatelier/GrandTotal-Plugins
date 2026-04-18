/*
	Migrate CustomFields to Fields Plugin

	This plugin migrates Custom Field values from Cost records to regular fields:
	- "Gewicht" → weight (converted to number, multiplied by 1000)
	- "Artikel Nr. " → itemNumber

	INSTRUCTIONS:
	1. Run the plugin from the Plugins menu
	2. The plugin will process all Cost records in the database
	3. Custom field values will be migrated to the corresponding regular fields
*/

run();

function run() {
	var totalProcessed = 0;
	var gewichtMigrated = 0;
	var artikelNrMigrated = 0;
	var errors = [];

	log("=== Starting CustomFields to Fields Migration ===");

	// Fetch all Cost records (editable)
	var costsQuery = fetchRecords("Cost", true);

	if (!costsQuery || costsQuery.count() === 0) {
		log("No Cost records found.");
		log("\n=== Complete ===");
		return;
	}

	var costs = costsQuery.records();
	log("Found " + costs.length + " Cost record(s) to process.\n");

	// Process each Cost record
	for (var i = 0; i < costs.length; i++) {
		var cost = costs[i];
		var itemName = cost.name || "Unnamed Cost";
		var changed = false;

		// Get custom values for this cost
		var customValues = cost.customValues.records();

		if (!customValues || customValues.length === 0) {
			continue;
		}

		// Process each custom value
		for (var j = 0; j < customValues.length; j++) {
			var customValue = customValues[j];
			var fieldName = customValue.valueForKeyPath("field.name");
			var value = customValue.name;

			if (!fieldName || !value) {
				continue;
			}

			// Handle "Gewicht" → weight
			if (fieldName === "Gewicht") {
				try {
					var weight = parseWeight(value);
					cost.weight = weight;
					gewichtMigrated++;
					changed = true;
					log("  ✓ " + itemName + ": Gewicht '" + value + "' → weight " + weight);
				} catch (error) {
					var errorMsg = "Failed to parse weight for '" + itemName + "': " + value + " - " + error;
					errors.push(errorMsg);
					log("  ERROR: " + errorMsg);
				}
			}
			// Handle "Artikel Nr. " → itemNumber (note the space!)
			else if (fieldName === "Artikel Nr. ") {
				cost.itemNumber = value;
				artikelNrMigrated++;
				changed = true;
				log("  ✓ " + itemName + ": Artikel Nr. '" + value + "' → itemNumber");
			}
		}

		if (changed) {
			totalProcessed++;
		}
	}

	// Show summary
	log("\n=== Summary ===");
	log("Processed " + totalProcessed + " Cost record(s).");
	log("  - Gewicht → weight: " + gewichtMigrated + " migration(s)");
	log("  - Artikel Nr. → itemNumber: " + artikelNrMigrated + " migration(s)");

	if (errors.length > 0) {
		log("\nErrors encountered:");
		for (var i = 0; i < errors.length; i++) {
			log("  - " + errors[i]);
		}
	}

	log("\n=== Complete ===");
}

/**
 * Parses a weight string and converts it to a number (in grams).
 * Handles both comma and period as decimal separators.
 * The value is multiplied by 1000 to convert kg to grams.
 *
 * @param {string} value - The weight string (e.g., "1.5" or "1,5")
 * @returns {number} - The weight in grams
 */
function parseWeight(value) {
	if (!value || typeof value !== "string") {
		throw "Invalid value";
	}

	// Trim whitespace
	value = value.trim();

	// Determine decimal separator from the last occurrence
	// Check if the last comma or period appears later in the string
	var lastCommaPos = value.lastIndexOf(',');
	var lastPeriodPos = value.lastIndexOf('.');

	var numericValue;

	if (lastCommaPos > lastPeriodPos) {
		// Comma is the decimal separator
		// Remove periods (thousand separators) and replace comma with period
		numericValue = parseFloat(value.replace(/\./g, '').replace(/,/g, '.'));
	} else if (lastPeriodPos > lastCommaPos) {
		// Period is the decimal separator
		// Remove commas (thousand separators)
		numericValue = parseFloat(value.replace(/,/g, ''));
	} else if (lastCommaPos === -1 && lastPeriodPos === -1) {
		// No decimal separator
		numericValue = parseFloat(value);
	} else {
		// Only one separator exists
		if (lastCommaPos !== -1) {
			numericValue = parseFloat(value.replace(/,/g, '.'));
		} else {
			numericValue = parseFloat(value);
		}
	}

	if (isNaN(numericValue)) {
		throw "Cannot parse number from: " + value;
	}

	// Multiply by 1000 to convert to grams (assuming input is in kg)
	return numericValue * 1000;
}
