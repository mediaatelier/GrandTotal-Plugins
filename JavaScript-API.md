# GrandTotal JavaScript API Reference

This document describes the JavaScript API available to GrandTotal plugins. All plugins run in a JavaScriptCore context with access to these global functions and objects.

## Table of Contents

- [Global Variables](#global-variables)
- [GrandTotal Object](#grandtotal-object)
- [Database Functions](#database-functions)
- [File Operations](#file-operations)
- [HTTP Requests](#http-requests)
- [User Interface](#user-interface)
- [Data Conversion](#data-conversion)
- [Utility Functions](#utility-functions)
- [System Integration](#system-integration)

---

## Global Variables

### Plugin Information
- `pluginIdentifier` - String: The plugin's bundle identifier
- `pluginType` - String: The type of plugin (e.g., "migration", "e-invoice", "insert")
- `documentID` / `documentIdentifier` - String: Unique identifier for the current document
- `applicationVersion` - String: GrandTotal version number
- `defaultRate` - NSDecimalNumber: Default hourly rate from preferences

### Directory Paths
- `PluginDirectory` - String: Path to the plugin bundle
- `NSHomeDirectory` - String: User's home directory path
- `NSHomeDirectoryURL` - String: User's home directory as file URL
- `NSTemporaryDirectory` - String: System temporary directory path
- `NSTemporaryDirectoryURL` - String: System temporary directory as file URL

### Migration-Specific
- `token` - String: API key entered by the user (available in migration plugins)

---

## GrandTotal Object

The `grandtotal` object provides access to specialized managers.

### Properties

```javascript
grandtotal.fileManager    // File system operations
grandtotal.addressBook    // macOS Contacts access
grandtotal.pasteBoard     // Clipboard operations
grandtotal.SQLite         // SQLite database access
grandtotal.progress       // Progress window management
```

### File Manager (`grandtotal.fileManager`)

```javascript
// Properties
grandtotal.fileManager.homeDirectory         // User home directory
grandtotal.fileManager.temporaryDirectory    // Temp directory

// Methods
grandtotal.fileManager.contentsOfFile(path)                    // Read file as string
grandtotal.fileManager.contentsOfDirectory(path)               // List directory contents
grandtotal.fileManager.contentsOfCSVFile(path)                 // Parse CSV file → Array
grandtotal.fileManager.contentsOfXLSFile(path, sheetName)      // Parse Excel file → Array
grandtotal.fileManager.contentsOfPlistFile(path)               // Parse plist → Object
grandtotal.fileManager.fileExists(path)                        // Check if file exists
grandtotal.fileManager.isDirectory(path)                       // Check if path is directory
grandtotal.fileManager.fileAttributes(path)                    // Get file metadata
grandtotal.fileManager.fileModificationDate(path)              // Get file mod date
grandtotal.fileManager.spotlightAttributes(path)               // Get Spotlight metadata
grandtotal.fileManager.saveFileDialog(filename)                // Show save dialog
grandtotal.fileManager.openFileDialog(fileType)                // Show open dialog
grandtotal.fileManager.relativeURL(path)                       // Convert to relative URL
```

### Address Book (`grandtotal.addressBook`)

```javascript
grandtotal.addressBook.people()                                    // Get all contacts
grandtotal.addressBook.recordsContaining(value, property)          // Search contacts
grandtotal.addressBook.findContactByNumber(phoneNumber)            // Find by phone
grandtotal.addressBook.save()                                      // Save changes

// Contact record methods
contact.valueForProperty(property)                                 // Get property value
contact.setValue(value, property)                                  // Set property value
```

### Paste Board (`grandtotal.pasteBoard`)

```javascript
grandtotal.pasteBoard.writeString(text)    // Copy to clipboard
grandtotal.pasteBoard.readString()         // Read from clipboard
```

### SQLite (`grandtotal.SQLite`)

```javascript
var db = grandtotal.SQLite.openDatabase(path);
var rows = db.executeQuery("SELECT * FROM table");
db.close();
```

### Progress (`grandtotal.progress`)

```javascript
var progress = grandtotal.progress;
progress.configuration.message = "Processing...";
progress.configuration.maxValue = 100;
progress.configuration.value = 50;
progress.configuration.canCancel = true;
progress.start();
// ... do work ...
if (progress.cancelled) {
    // Handle cancellation
}
progress.end();
```

---

## Database Functions

### Query Functions

```javascript
query()                                        // Get current query context
```

### Record Fetching

```javascript
fetchRecords(entityName)                       // Fetch all records of entity type
fetchRecordWithUID(entityName, uid, editable)  // Fetch by UID
fetchRecordWithPredicate(entityName, predicate, editable)  // Fetch with predicate
```

### Record Creation

```javascript
insertRecord(entityName)                       // Create new record
```

### Record Comparison

```javascript
equalRecords(recordA, recordB)                 // Check if records are equal
```

### UID Management

```javascript
getBilledUIDs(prefix)                          // Get UIDs of billed costs
getPaidUIDs(prefix)                            // Get UIDs of paid costs
```

---

## File Operations

### Reading Files

```javascript
contentsOfFile(path)                           // Read text file
contentsOfDirectory(path)                      // List directory
contentsOfCSVFile(path)                        // Parse CSV
contentsOfXLSFile(path, sheetName)             // Parse Excel
contentsOfPlist(path)                          // Parse plist
```

### Writing Files

```javascript
writeToURL(contents, url)                      // Write string/data to file
writeCSVToURL(array, url, encoding, separator, lineBreak)
writeXLSToURL(array, url)                      // Write Excel file
```

### File Information

```javascript
fileExists(path)                               // Check existence
fileIsDirectory(path)                          // Check if directory
fileAttributes(path)                           // Get file attributes
fileModificationDate(path)                     // Get modification date
spotlightAttributes(path)                      // Get Spotlight metadata
```

### File Management

```javascript
createFolderAtURL(url)                         // Create directory
saveFileDialog(filename)                       // Show save dialog
openFileDialog(fileType)                       // Show open dialog
```

---

## HTTP Requests

### Load URL

```javascript
// Basic GET request
var response = loadURL("GET", "https://api.example.com/data", headers);

// POST with JSON body
var response = loadURL("POST", url, headers, jsonBody);

// POST with string body
var response = loadURL("POST", url, headers, stringBody);

// Multipart file upload
var fileData = {
    name: "file",
    filename: "document.xml",
    content: xmlString
};
var response = loadURL("POST", url, headers, fileData);

// Multiple files
var files = [
    {name: "file1", filename: "doc1.pdf", content: base64String},
    {name: "file2", filename: "doc2.pdf", content: base64String}
];
var response = loadURL("POST", url, headers, files);

// Get response with headers
var response = loadURL("GET", url, headers, null, true);
var data = JSON.parse(response);
data.payload;        // Response body
data.headers;        // Response headers
```

### Download to File

```javascript
loadURLtoURL(sourceURL, destinationPath)       // Download file
```

---

## User Interface

### Dialogs

```javascript
alert(message, info, ["Button1", "Button2"])   // Show alert, returns button index
```

### Notifications

```javascript
displayUserNotification(title, message)        // Show notification banner
```

### Plugin Settings

```javascript
displayPluginSetting()                         // Show plugin settings dialog
showPluginSettings()                           // Alternative method
```

### Progress Windows

See [Progress](#progress-grandtotalprogress) section above.

---

## Data Conversion

### Base64

```javascript
btoa(string)                                   // Encode to base64
atob(base64String)                             // Decode from base64
base64Encode(string)                           // Alternative encoder
```

### Encryption

```javascript
__grandtotalEncrypt(data, password)            // AES-GCM encryption
```

### JSON/XML

```javascript
plistToJSON(plistString)                       // Convert plist to JSON
sanitizeXML(xmlString)                         // Clean and format XML
```

### CSV Parsing

```javascript
parseCSVString(csvString)                      // Parse CSV string to array
```

### String Utilities

```javascript
sanitizeFileName(filename)                     // Remove invalid characters
parseIntegerComponents(string)                 // Extract numbers from string
```

### Country Codes

```javascript
ISO2CodeToISO3Code(iso2)                       // Convert ISO2 to ISO3 country code
```

---

## Utility Functions

### Logging

```javascript
log(message)                                   // Log to plugin console
```

### Clipboard

```javascript
copyString(text)                               // Copy to clipboard
```

### Localization

```javascript
localize(key)                                  // Get localized string
```

### File Searching

```javascript
findFiles(query, sortBy)                       // Spotlight search
// Returns: [{path, modificationDate, creationDate, fileName}, ...]
```

### Hashing

```javascript
md5(string)                                    // Calculate MD5 hash
```

### String Extensions

```javascript
String.prototype.xmlEncode()                   // XML-encode string
```

### Timing

```javascript
sleep(seconds)                                 // Sleep for N seconds
grandtotal.sleep(interval)                     // Alternative sleep
```

---

## System Integration

### URLs & Launch

```javascript
launchURL(url)                                 // Open URL or file
pathToURL(path)                                // Convert path to file:// URL
```

### Notifications

```javascript
postNotification(name)                         // Post NSNotification
sendDistributedNotification(name, object, dict) // Send distributed notification
```

### AppleScript

```javascript
executeAppleScript(script)                     // Execute AppleScript
// Returns: string result or array
```

### Sound

```javascript
beep()                                         // System beep
```

### Colors

```javascript
NSColor(colorMethodName)                       // Get RGBA from NSColor method
// Example: NSColor("systemBlueColor") → "rgba(0, 122, 255, 1.0)"
```

### Contact Lookup

```javascript
findContactByNumber(phoneNumber)               // Find contact by phone
```

### Data Conversion

```javascript
writeDataToFile(dataValue, filePath)           // Write NSData to file
```

### MoneyMoney Integration

```javascript
moneymoneyPaymentUID(transaction)              // Get payment UID
```

---

## Database Operations (Legacy)

These are lower-level SQLite functions:

```javascript
openSQLiteDatabase(path)                       // Open SQLite database
runSQLiteQuery(database, query)                // Execute SQL query
```

---

## Special Notes

### Path Handling

- Paths can be absolute file paths or `file://` URLs
- Functions automatically convert between formats as needed
- Use `file:///Users/...` format for URLs

### Encoding Values

Common encoding constants for `writeCSVToURL`:
- UTF-8: `4`
- Mac Roman: `30`
- Windows Latin 1: `12`

### Error Handling

HTTP requests return error objects on failure:
```javascript
{
    grandtotal_error: "Error message",
    http_error: 404,
    server_error: {...},
    server_response: "raw response"
}
```

### Entity Names

Common Core Data entities:
- `Client` - Customers and contacts
- `Invoice` - Invoices
- `Estimate` - Quotes/Estimates
- `Cost` - Line items
- `Payment` - Payment records
- `CatalogItem` - Product catalog
- `Project` - Projects
- `Image` - Embedded images

---

## Example: Complete Migration Plugin

```javascript
// Global 'token' variable contains the API key

function migrate() {
    // Fetch data from API
    var header = {"Authorization": "Bearer " + token};
    var response = loadURL("GET", "https://api.service.com/clients", header);

    if (response.server_error) {
        return {server_error: true};
    }

    var data = JSON.parse(response);

    return {
        entities: {
            Client: data.clients.map(function(client) {
                return {
                    attributes: {
                        uid: "service.client." + client.id,
                        organization: client.name,
                        email: client.email,
                        city: client.city
                    }
                };
            })
        }
    };
}

// Execute migration
migrate();
```

---

## Version Information

This API is available in GrandTotal 9.0 and later. Some features may require specific minimum versions as noted in plugin `Info.plist` files.
