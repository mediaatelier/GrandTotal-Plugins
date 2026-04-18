/*
	Fix CustomField Relations Plugin

	This plugin restores lost relations between CustomField records and their CustomFieldSet.

	INSTRUCTIONS:
	1. Edit the mappings array below with your UIDs
	2. Each mapping should specify:
	   - customFieldSetUID: The UID of the CustomFieldSet
	   - customFieldUIDs: An array of CustomField UIDs that belong to this set
	3. Run the plugin from the Plugins menu
*/

run();

function run() {
	var mappings = [
		{
			customFieldSetUID: "com.mediaatelier.GrandTotal.customFieldSet.sendable",
			customFieldUIDs: [
				"TKxGzB6BQcObGLtUzUXL0A",  // Approntamento
				"0eMNXpS4TqGtvJnG8gobHA",  // Bestell Nr.
				"GiB8B5zNRIm_wgMCDuTJnw",  // Ritiro
				"PMEwbKuYRGiD_AGGmIRx2Q",  // Liefertermin
				"75AVzyUwT-uWpUubjxFccA",  // Artikel Nr.
				"1-2TxmLNR9C5pLLOlzKViQ",  // Provision - Monat
				"L87bO9AHS9qrfrC4HKbp2A",  // Lieferadresse
				"Ufj8i5WOTOK6w7aRh-xSuQ",  // Anlieferoption
				"hkLBxmkpS6-R1bm6XiAJJg"   // Anfrage Nr.
			]
		},
		{
			customFieldSetUID: "com.mediaatelier.GrandTotal.customFieldSet.client",
			customFieldUIDs: [
				"R8YHEkJaRPC7UbO-l3s77g",  // Produkt
				"FuExbp8VQ62TT52wfCB-BQ",  // Anmerkungen
				"o0WPD_QDRsO84PNvcKptAw",  // PV - Interesse?
				"s7_bLeY1TOGguwfsGA69vw",  // Mobil
				"yvmUzXKKT2KfNZ3M_x-lPg",  // Festnetz
				"81ka3mCTRMCGUyTNjxVzpg",  // Bundesland
				"EZXCFqkERea9dbB9q2cvzg",  // Besuch
				"hUO_foSXT5Sl86MUTJ0tYg",  // Handlese
				"CgFHjV-YRpWGbsqv6hhbKw",  // Webseite
				"lLDwIVNOT5uLzE2_0do1kA",  // HA
				"PN5_bkXbQvKJOwqcQ-dG8w",  // Lieferadresse
				"e6cW2LhsQUeI0tJs0bNCCw"   // VDP
			]
		}
	];

	var totalFixed = 0;
	var errors = [];

	log("=== Starting CustomField Relations Fix ===");

	for (var i = 0; i < mappings.length; i++) {
		var mapping = mappings[i];
		var setUID = mapping.customFieldSetUID;
		var fieldUIDs = mapping.customFieldUIDs;

		// Find the CustomFieldSet record
		var customFieldSet = fetchRecordWithUID("CustomFieldSet", setUID, true);

		if (!customFieldSet) {
			var error = "CustomFieldSet not found: " + setUID;
			errors.push(error);
			log("ERROR: " + error);
			continue;
		}

		log("\nProcessing CustomFieldSet: " + customFieldSet.name + " (" + setUID + ")");

		// Process each CustomField
		for (var j = 0; j < fieldUIDs.length; j++) {
			var fieldUID = fieldUIDs[j];
			var customField = fetchRecordWithUID("CustomField", fieldUID, true);

			if (!customField) {
				var error = "CustomField not found: " + fieldUID;
				errors.push(error);
				log("  ERROR: " + error);
				continue;
			}

			// Set the relation
			customField.set = customFieldSet;
			totalFixed++;

			log("  ✓ Fixed: " + customField.name + " -> " + customFieldSet.name);
		}
	}

	// Show summary
	log("\n=== Summary ===");
	log("Fixed " + totalFixed + " CustomField relation(s).");

	if (errors.length > 0) {
		log("\nErrors encountered:");
		for (var i = 0; i < errors.length; i++) {
			log("  - " + errors[i]);
		}
	}

	log("\n=== Complete ===");
}
