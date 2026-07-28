# Send To Menu Plugins for GrandTotal

Send To Menu plugins allow users to export invoices and documents from GrandTotal to third-party accounting and business applications. These plugins appear in the **File → Send to** menu.

## Key Characteristics

- **Menu placement**: Appear in "File → Send to" menu
- **Minimal or scripted**: Can be plist-only (no code) or include JavaScript for data transformation
- **Icon optional**: Can include an icon file but not required for plist-only plugins
- **Settings support**: Can define settings using the `Globals` array in Info.plist
- **File-based**: Generate files that are opened by target applications

## Plugin Types

### Type 1: Plist-Only (No Code)

Simple plugins that export GrandTotal's property list directly to another application. No `index.js` required.

### Type 2: Scripted (With index.js)

Advanced plugins that transform document data before exporting (e.g., CSV, custom formats).

## Plugin Structure

### Plist-Only Plugin
```
Send to AppName.grandtotalplugin/
└── Info.plist
```

### Scripted Plugin
```
Send to AppName.grandtotalplugin/
├── Info.plist
├── index.js
├── Icon.png (optional)
├── Template.txt (optional)
├── en.lproj/ (optional)
│   └── Localizable.strings
└── de.lproj/ (optional)
    └── Localizable.strings
```

## Info.plist Configuration

### Plist-Only Plugin Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>com.mediaatelier.sendto.AppName</string>

    <key>CFBundleVersion</key>
    <string>1.0</string>

    <key>GrandTotalMinimumVersion</key>
    <integer>7</integer>

    <key>types</key>
    <array>
        <string>sendtomenu</string>
    </array>

    <key>SendToMenu</key>
    <dict>
        <key>ApplicationName</key>
        <string>AppName</string>

        <key>ApplicationIdentifiers</key>
        <array>
            <string>com.company.appname</string>
        </array>

        <key>ApplicationFileExtension</key>
        <string>grandtotal2appname</string>

        <key>ApplicationMinimumVersion</key>
        <string>1.0</string>

        <key>ApplicationURL</key>
        <string>https://www.company.com/product</string>
    </dict>

    <key>copyright</key>
    <string>© 2025 Your Name</string>
</dict>
</plist>
```

### Scripted Plugin Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>com.mediaatelier.sendto.AppName</string>

    <key>CFBundleVersion</key>
    <string>1.0</string>

    <key>CFBundleIconFile</key>
    <string>Icon.png</string>

    <key>GrandTotalMinimumVersion</key>
    <integer>7</integer>

    <key>types</key>
    <array>
        <string>sendtomenu</string>
    </array>

    <key>Globals</key>
    <array>
        <dict>
            <key>label</key>
            <string>Account Number</string>
            <key>name</key>
            <string>accountNumber</string>
            <key>type</key>
            <string>string</string>
            <key>default</key>
            <string>1200</string>
        </dict>
    </array>

    <key>SendToMenu</key>
    <dict>
        <key>ApplicationName</key>
        <string>AppName</string>

        <key>ApplicationIdentifiers</key>
        <array>
            <string>com.company.appname2024</string>
            <string>com.company.appname2025</string>
        </array>

        <key>ApplicationFileExtension</key>
        <string>txt</string>

        <key>ApplicationFileName</key>
        <string>Export.txt</string>

        <key>AskForFile</key>
        <true/>

        <key>ApplicationMinimumVersion</key>
        <string>1.0</string>

        <key>ApplicationURL</key>
        <string>https://www.company.com/product</string>
    </dict>

    <key>copyright</key>
    <string>© 2025 Your Name</string>
</dict>
</plist>
```

## Required Keys

### Top-Level Keys

- **CFBundleIdentifier**: Unique identifier (e.g., `com.mediaatelier.sendto.AppName`)
- **CFBundleVersion**: Version string (e.g., "1.0")
- **GrandTotalMinimumVersion**: Minimum GrandTotal version required (integer, e.g., 7)
- **types**: Must contain `"sendtomenu"`
- **SendToMenu**: Dictionary defining the target application (see below)

### SendToMenu Dictionary Keys

- **ApplicationName**: Display name in the "Send to" menu (e.g., "MonKey Office")
- **ApplicationIdentifiers**: Array of bundle identifiers for target applications
- **ApplicationFileExtension**: File extension for exported files (e.g., "txt", "csv", "xml")
- **ApplicationMinimumVersion**: Minimum version of target application (string)

### Optional Keys

#### Top-Level
- **CFBundleIconFile**: Icon filename (`Icon.png` or `Icon.icns`)
- **copyright**: Copyright notice
- **URL**: Download URL for plugin updates
- **Globals**: Array of settings (see Settings section)

#### SendToMenu Dictionary
- **ApplicationURL**: URL to target application's website
- **ApplicationFileName**: Default filename for export; may contain `{period}` (GrandTotal 9.5+, see Date Ranges section)
- **AskForFile**: If `true`, show save dialog; if `false` or omitted, use temp file
- **DateRanges**: Array limiting the period popup, e.g. `["quarter", "month"]` (GrandTotal 9.5+, see Date Ranges section)
- **DateMode**: Number presetting the date basis, `1` = payment date (GrandTotal 9.5+)
- **CountFunction**: Function name for the dialog's count line; also opts the plugin into `receiveddocuments` (GrandTotal 9.5+, see Inbound Documents section)

## Settings (Globals)

Settings work the same as in Time Importer plugins. See examples:

```xml
<key>Globals</key>
<array>
    <dict>
        <key>label</key>
        <string>Company ID</string>
        <key>name</key>
        <string>companyID</string>
        <key>type</key>
        <string>string</string>
        <key>default</key>
        <string>1</string>
    </dict>
    <dict>
        <key>label</key>
        <string>Debit Account</string>
        <key>name</key>
        <string>debitAccount</string>
        <key>type</key>
        <string>string</string>
        <key>default</key>
        <string>1200</string>
    </dict>
</array>
```

Settings are available as global variables in `index.js`:

```javascript
var company = companyID;
var account = debitAccount;
```

## Date Ranges and Periods (Year, Half-Year, Quarter, Month)

Plugins do **not** implement their own period picker. The send-to dialog that
GrandTotal shows before running the plugin already contains one: a year field
plus a range popup with the whole year, half-years, quarters and months. It
also has a toggle for the date basis — invoice date (`dateSent`, accrual) or
payment date (`datePaid`, cash basis). The user's choice filters the documents
before they reach the plugin, so `invoices`/`creditnotes` only ever contain the
selected period.

What the plugin receives:

- `mode` — `1` if the user filtered by payment date, otherwise the invoice
  date was used. Use it to pick the matching date field when you need dates:
  `var dateKey = (mode == 1) ? "datePaid" : "dateSent";`
- `periodFrom` / `periodTill` (GrandTotal 9.5+) — the exact period boundaries
  as `Date` values. On older versions these globals do not exist, so guard
  them and fall back to the min/max document date:

```javascript
var pFrom = (typeof periodFrom !== "undefined" && periodFrom) ? new Date(periodFrom) : minDate;
var pTill = (typeof periodTill !== "undefined" && periodTill) ? new Date(periodTill) : maxDate;
```

Related `SendToMenu` Info.plist keys (GrandTotal 9.5+):

- `DateRanges` — array restricting which ranges the popup offers, e.g.
  `["quarter", "month"]` for a VAT plugin with only monthly/quarterly filing.
  Allowed values: `year`, `half-year`, `quarter`, `month`. Omit the key to
  offer all of them.
- `DateMode` — number presetting the date-basis toggle (`1` = payment date).
- `ApplicationFileName` may contain the placeholder `{period}`, which
  GrandTotal replaces with a label of the selected period (e.g. "2026
  Quarter 1") in the save dialog: `<string>VAT Return {period}</string>`.

For a complete real-world example see the built-in **MTDSheets** plugin
(quarterly UK VAT return): it uses `mode`, `periodFrom`/`periodTill`, the
`{period}` filename placeholder and signed credit-note handling.

## Inbound Documents and the Count Line (GrandTotal 9.5+)

A send-to plugin can also receive the **received (inbound) invoices** of the
selected period — needed for VAT filings that report input VAT, not just
sales. This is opt-in: declare a `CountFunction` in the `SendToMenu` dict:

```xml
<key>CountFunction</key>
<string>sendToCount</string>
```

The key has two effects:

**1. `receiveddocuments` global.** The export run receives the inbound
documents of the period as an array. Each record carries the usual fields plus
`supplierName`, `supplierID`, `category` and — when the document has an
e-invoice — the original XML as string in `xml`. The array is only populated
while the user's edition has the inbound-documents feature; otherwise it is
empty. Always guard it:

```javascript
var received = (typeof receiveddocuments !== "undefined" && receiveddocuments) ? receiveddocuments : [];
```

Note: inbound documents are always filtered by invoice date (`dateSent`),
regardless of the dialog's date-basis toggle — input VAT arises with the
invoice, never with the payment (§ 15 UStG).

**2. Live count line in the dialog.** Whenever the user changes year, range or
date basis, GrandTotal calls the named function with `pluginType()` returning
`"count"` (so the plugin's top-level dispatch must not run the export then).
Available globals: `counts` — a dict with the document counts of the selected
period (`invoices`, `payments`, `creditnotes`, `transcripts`,
`receiveddocuments`) — and `mode`. Return a string; it is shown in the dialog:

```javascript
if (pluginType() == "sendtomenu") {
    doExport();
} else if (pluginType() != "count") {
    showPluginSettings();
}

function sendToCount() {
    var parts = [counts.invoices + " " + localize(counts.invoices == 1 ? "invoice" : "invoices")];
    // Without the inbound feature GrandTotal always reports 0 — don't advertise then
    if (counts.receiveddocuments > 0) {
        parts.push(counts.receiveddocuments + " " + localize("received invoices"));
    }
    return parts.join(", ");
}
```

For a complete real-world example see the built-in **Send to Steuererklärung**
plugin (German UStVA): it combines `CountFunction`, `receiveddocuments`,
`DateRanges` (quarter/month) and the period globals.

## Result Dialog (Success/Error Feedback)

The value of the last evaluated expression in `index.js` is the plugin's
result. Return `undefined` for silent success, or an object to make GrandTotal
show a dialog — useful for validation errors:

```javascript
var __result;
if (pluginType() == "sendtomenu") {
    __result = doExport();   // returns undefined or the error object below
} else {
    showPluginSettings();
}

function fail(message) {
    return { "version": 2, "success": false, "title": localize("Save Failed"), "message": message };
}

__result;   // last expression = plugin result
```

If the destination filename ends in `.zip`, GrandTotal lets the plugin write
into a temporary folder and zips it afterwards automatically. An
`ApplicationFileName` without extension makes the save dialog target a folder —
the plugin can then write several files into `url` (create it first with
`createFolderAtURL(url)`).

## index.js Implementation

### Global Variables Available

```javascript
items            // Array of selected invoices (compatibility alias for invoices)
invoices         // Array of selected invoices
creditnotes      // Array of selected credit notes (subtract these from totals!)
payments         // Array of selected payments
transcripts      // Array of selected transcripts
mode             // Date basis chosen in the dialog: 1 = payment date (datePaid), otherwise invoice date (dateSent)
url              // Destination URL for the exported file
PluginDirectory  // Path to plugin bundle

// GrandTotal 9.5 and later — guard with typeof (see Date Ranges below):
periodFrom       // Date: first day of the period selected in the dialog
periodTill       // Date: last day of the period selected in the dialog
profile          // The default sender profile as a record
receiveddocuments // Array of received (inbound) invoices — opt-in, see Inbound Documents below
```

Documents that lie outside the period selected in the send-to dialog are
already filtered out — the arrays only contain what the user sees in the
dialog's list. Credit notes arrive separately in `creditnotes`; a correct
export subtracts their amounts (multiply by −1) instead of ignoring them.

### Global Functions Available

```javascript
// Logging
log(object)                        // Log to console

// File operations
writeToURL(string, url)            // Write string to file URL
writeCSVToURL(array, url, encoding, delimiter, linebreak)

// URL operations
launchURL(url)                     // Open URL in default app
loadURLtoURL(sourceUrl, destUrl)   // Download URL to local file

// CSV parsing
contentsOfCSVFile(path)            // Parse CSV file, returns array

// Plugin type
pluginType()                       // Returns "sendtomenu"
showPluginSettings()               // Show plugin settings UI
```

### Basic Structure

```javascript
// Check plugin type
if (pluginType() == "sendtomenu") {
    doExport();
} else {
    showPluginSettings();
}

function doExport() {
    // Process selected documents
    for (var i = 0; i < items.length; i++) {
        var document = items[i];
        processDocument(document);
    }

    // Write output
    var output = generateOutput();
    writeToURL(output, url);
}
```

### Document Object Structure

Each document in the `items` array has these properties:

```javascript
{
    // Document metadata
    name: "INV-2025-001",           // Invoice number
    reference: "PO-12345",          // Reference/PO number
    subject: "Web Development",     // Subject
    project: "Client Website",      // Project name

    // Dates (Date objects)
    date: Date,                     // Invoice date
    dateSent: Date,                 // Date sent
    dateDue: Date,                  // Due date
    datePaid: Date,                 // Date paid (if paid)

    // Amounts
    gross: 1190.00,                 // Total including tax
    grossAsString: "1190.00",       // Formatted string
    net: 1000.00,                   // Total excluding tax
    netAsString: "1000.00",         // Formatted string
    discountAsString: "0.00",       // Discount amount

    // Currency
    currency: "EUR",                // ISO currency code

    // Recipient (Client)
    recipient: {
        name: "ACME Corp",          // Client name
        organization: "ACME Corp",  // Company name
        firstName: "John",          // Contact first name
        lastName: "Doe",            // Contact last name
        email: "john@acme.com",     // Email
        street: "123 Main St",      // Street address
        city: "New York",           // City
        zip: "10001",               // Postal code
        state: "NY",                // State/region
        countryCode: "US",          // Country code
        clientNumber: "C-001",      // Client number
        taxNumber: "DE123456789"    // Tax/VAT number
    },

    // Line items
    costs: [
        {
            description: "Web Development",
            quantity: 10,
            quantityAsString: "10.00",
            unitPrice: 100,
            unitPriceAsString: "100.00",
            total: 1000,
            totalAsString: "1000.00",
            taxPercentage: 19,
            taxRate: 0.19
        }
    ],

    // Tax breakdown
    taxes: [
        {
            taxPercentage: 19,
            taxRate: 0.19,
            gross: 1190,
            grossAsString: "1190.00",
            net: 1000,
            netAsString: "1000.00",
            tax: 190,
            taxAsString: "190.00"
        }
    ]
}
```

> The structure above is simplified for readability. For a complete, real-world
> example of the data GrandTotal passes to a Send To Menu plugin — including the
> full `sender`/`recipient` profiles, `taxes`, `invoiceItems`, `itemGroups`,
> embedded e-invoice XML and all `*AsString` fields — see
> [`sample-payload.json`](sample-payload.json). It contains two anonymized
> invoices (a private client and a company) as the `items` array is delivered to
> `index.js`.

### Example: CSV Export

```javascript
if (pluginType() == "sendtomenu") {
    doExport();
} else {
    showPluginSettings();
}

function doExport() {
    var lines = [];

    // Add header row
    lines.push(["Date", "Invoice", "Client", "Amount", "Currency"]);

    // Process each document
    for (var i = 0; i < items.length; i++) {
        var doc = items[i];

        // Skip if no recipient
        if (!doc.recipient) continue;

        // Format date
        var dateStr = doc.dateSent.toLocaleDateString("en-US");

        // Create row
        var row = [
            dateStr,
            doc.name,
            doc.recipient.name,
            doc.grossAsString,
            doc.currency
        ];

        lines.push(row);
    }

    // Write CSV (encoding 4 = UTF-8, delimiter ",", linebreak "\n")
    writeCSVToURL(lines, url, 4, ",", "\n");
}
```

### Example: Tab-Delimited with Template

```javascript
if (pluginType() == "sendtomenu") {
    doExport();
} else {
    showPluginSettings();
}

function doExport() {
    var lines = [];

    // Load template header from Template.txt
    var fields = contentsOfCSVFile(PluginDirectory + "Template.txt")[0];
    lines.push(fields);

    // Process documents
    for (var i = 0; i < items.length; i++) {
        var doc = items[i];

        if (!doc.recipient) continue;

        // Process each tax rate
        for (var j = 0; j < doc.taxes.length; j++) {
            var tax = doc.taxes[j];

            var line = [];
            addFieldValue(line, "Date", formatDate(doc.dateSent), fields);
            addFieldValue(line, "InvoiceNumber", doc.name, fields);
            addFieldValue(line, "Client", doc.recipient.name, fields);
            addFieldValue(line, "Amount", tax.grossAsString, fields);
            addFieldValue(line, "TaxRate", tax.taxPercentage, fields);

            lines.push(line);
        }
    }

    // Write tab-delimited (encoding 30 = MacOSRoman, delimiter "\t", linebreak "\r")
    writeCSVToURL(lines, url, 30, "\t", "\r");
}

function addFieldValue(array, field, value, fields) {
    var index = fields.indexOf(field);
    for (var i = 0; i < index; i++) {
        if (!array[i]) {
            array[i] = "";
        }
    }
    array[index] = value;
}

function formatDate(date) {
    return date.toLocaleDateString("de-DE", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
```

### Example: Custom Format

```javascript
function doExport() {
    var output = "";

    for (var i = 0; i < items.length; i++) {
        var doc = items[i];

        if (!doc.recipient) continue;

        // Custom format
        output += "INVOICE|" + doc.name + "|";
        output += doc.recipient.name + "|";
        output += doc.grossAsString + "|";
        output += doc.currency + "\n";

        // Add line items
        for (var j = 0; j < doc.costs.length; j++) {
            var cost = doc.costs[j];
            output += "ITEM|" + cost.description + "|";
            output += cost.quantityAsString + "|";
            output += cost.unitPriceAsString + "\n";
        }

        output += "END\n\n";
    }

    writeToURL(output, url);
}
```

## Date Formatting

JavaScript Date objects can be formatted in various ways:

```javascript
var date = doc.dateSent;

// ISO format
date.toISOString()                              // "2025-12-14T10:30:00.000Z"
date.toISOString().split('T')[0]               // "2025-12-14"

// Locale-specific
date.toLocaleDateString("en-US")               // "12/14/2025"
date.toLocaleDateString("de-DE")               // "14.12.2025"

// Custom format
date.toLocaleDateString("de-DE", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
})                                              // "14.12.2025"

// Manual formatting
var year = date.getFullYear();
var month = ("0" + (date.getMonth() + 1)).slice(-2);
var day = ("0" + date.getDate()).slice(-2);
var formatted = year + "-" + month + "-" + day;  // "2025-12-14"
```

## CSV Encoding Options

The `writeCSVToURL` function accepts encoding parameters:

```javascript
writeCSVToURL(lines, url, encoding, delimiter, linebreak);
```

### Common Encodings
- `4` - UTF-8
- `30` - MacOSRoman
- `5` - ISO Latin 1
- `10` - Windows Latin 1

### Delimiters
- `","` - Comma
- `"\t"` - Tab
- `";"` - Semicolon

### Line Breaks
- `"\n"` - Unix/macOS (LF)
- `"\r"` - Classic Mac (CR)
- `"\r\n"` - Windows (CRLF)

## Localization

Send To Menu plugins support full localization. See the [main README Localization section](../README.md#localization) for complete documentation on:
- Directory structure (`.lproj` folders)
- Localizable.strings format
- Using localization in JavaScript (`localize()` function)
- Localizing Info.plist values
- Best practices and language codes

## Testing

1. Copy plugin to `~/Library/Application Support/GrandTotal/PlugIns/`
2. Launch GrandTotal
3. Open or create an invoice document
4. Select one or more invoices
5. File → Send to → [Your Application Name]
6. If `AskForFile` is `true`, choose save location
7. Verify exported file opens in target application

## Distribution

### Option 1: ZIP File
1. Compress the `.grandtotalplugin` bundle
2. Users double-click to install
3. Or manually copy to `~/Library/Application Support/GrandTotal/PlugIns/`

### Option 2: GitHub
1. Host on GitHub
2. Add `URL` key to Info.plist
3. Enable automatic updates

## Complete Examples

See these plugins for working implementations:
- **Send to MonKey Office.grandtotalplugin** - Tab-delimited export with template and settings
- **Send to Receipts.grandtotalplugin** - Plist-only, no code required
- **Send to Xero.grandtotalplugin** - Complex export with multiple settings
- **Send to Finder.grandtotalplugin** - File-based export

## Common Use Cases

### Export for Accounting Software

Create CSV or tab-delimited files for accounting software import:
- Map GrandTotal fields to accounting software fields
- Handle tax rates and account codes from settings
- Format dates according to target software requirements

### Send to Cloud Services

Export to cloud accounting services:
- Generate XML or JSON formats
- Include all necessary metadata
- Handle multiple currencies and tax jurisdictions

### Archive to File System

Export for archival purposes:
- Create human-readable formats
- Include all document details
- Organize by date, client, or project

## Troubleshooting

### Common Issues

1. **Plugin not appearing in menu**: Check `types` array contains `"sendtomenu"`
2. **Target app not launching**: Verify `ApplicationIdentifiers` are correct
3. **File encoding issues**: Try different encoding values (4 for UTF-8, 30 for MacOSRoman)
4. **Settings not appearing**: Check `Globals` array syntax
5. **Empty recipient**: Always check `if (!document.recipient)` before accessing client data

### Debugging

Use `log()` to debug:

```javascript
log("Processing " + items.length + " documents");
log("Document: " + JSON.stringify(items[0]));
log("Output URL: " + url);
```

Check Console.app for log output.

## API Reference Summary

### Global Variables
- `items` / `invoices` - Array of selected invoices
- `creditnotes`, `payments`, `transcripts` - Further selected record arrays
- `mode` - Date basis (1 = payment date, else invoice date)
- `periodFrom` / `periodTill` - Selected period boundaries (9.5+, guard with `typeof`)
- `profile` - Default sender profile (9.5+)
- `receiveddocuments` - Inbound invoices, requires `CountFunction` (9.5+)
- `counts` - Document counts per type, only during `"count"` runs (9.5+)
- `url` - Destination file URL
- `PluginDirectory` - Plugin bundle path
- Settings from `Globals` (e.g., `companyID`, `accountNumber`)

### Functions
- `log(object)` - Log to console
- `writeToURL(string, url)` - Write string to file
- `writeCSVToURL(array, url, encoding, delimiter, linebreak)` - Write CSV
- `launchURL(url)` - Open URL
- `loadURLtoURL(sourceUrl, destUrl)` - Download file
- `contentsOfCSVFile(path)` - Parse CSV
- `pluginType()` - Returns `"sendtomenu"`
- `showPluginSettings()` - Show settings UI

### Document Properties (Selected Fields)
```javascript
{
    name: string,              // Invoice number
    reference: string,         // PO/Reference
    subject: string,           // Subject
    project: string,           // Project
    date: Date,               // Invoice date
    dateSent: Date,           // Sent date
    dateDue: Date,            // Due date
    gross: number,            // Total with tax
    grossAsString: string,    // Formatted total
    currency: string,         // ISO currency code
    recipient: {...},         // Client object
    costs: [...],            // Line items
    taxes: [...]             // Tax breakdown
}
```
