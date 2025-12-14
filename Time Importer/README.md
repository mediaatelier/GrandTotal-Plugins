# Time Importer Plugins for GrandTotal

Time importer plugins allow users to import time tracking entries from external time tracking applications and services into GrandTotal for billing. These plugins appear in the **File → Import Time Entries** menu.

## Key Characteristics

- **Menu placement**: Appear in "File → Import Time Entries" menu
- **Requires icon**: Must include an icon file (`Icon.png` or `Icon.icns`)
- **Settings support**: Can define settings using the `Globals` array in Info.plist
- **Bidirectional**: Can support both importing (timeimporter) and exporting (timeexporter)
- **Localization**: Supports localized strings via `.lproj` folders

## Plugin Structure

Each time importer plugin is a `.grandtotalplugin` bundle containing:

```
ServiceName.grandtotalplugin/
├── Info.plist
├── index.js
├── Icon.png (or Icon.icns)
├── en.lproj/
│   └── Localizable.strings
└── de.lproj/
    └── Localizable.strings
```

## Info.plist Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>com.mediaatelier.servicename</string>

    <key>CFBundleVersion</key>
    <string>1.0</string>

    <key>CFBundleIconFile</key>
    <string>Icon.png</string>

    <key>GrandTotalMinimumVersion</key>
    <real>7</real>

    <key>types</key>
    <array>
        <string>timeimporter</string>
    </array>

    <key>Globals</key>
    <array>
        <dict>
            <key>label</key>
            <string>API Token</string>
            <key>name</key>
            <string>token</string>
            <key>type</key>
            <string>password</string>
        </dict>
    </array>

    <key>GlobalsInfo</key>
    <string>Enter your API token to allow access to your data.</string>

    <key>copyright</key>
    <string>© 2025 Your Name</string>
</dict>
</plist>
```

### Required Keys

- **CFBundleIdentifier**: Unique identifier for your plugin (e.g., `com.mediaatelier.servicename`)
- **CFBundleVersion**: Version string (e.g., "1.0")
- **CFBundleIconFile**: Icon file name (`Icon.png` or `Icon.icns`)
- **GrandTotalMinimumVersion**: Minimum GrandTotal version required (e.g., 7)
- **types**: Must contain `"timeimporter"` for import functionality

### Optional Keys

- **copyright**: Copyright notice (e.g., "© 2025 Your Name")
- **URL**: Download URL for plugin updates
- **Globals**: Array of settings/configuration fields (see Settings section below)
- **GlobalsInfo**: Informational text shown in settings UI
- **displayNames**: Custom display names for different plugin types (see Multi-Type Plugins)
- **TimeImporterEntryURLTemplate**: URL template for deep linking to entries (e.g., `"tyme://time_entry/%@"`)
- **RequiresFullDiskAccess**: Set to `true` if plugin needs full disk access
- **callOnDeactivate**: Set to `true` to call plugin when deactivated

### Multi-Type Plugins

Plugins can support multiple types (import, export, send to other apps):

```xml
<key>types</key>
<array>
    <string>timeimporter</string>
    <string>timeexporter</string>
    <string>estimates</string>
    <string>invoices</string>
</array>

<key>displayNames</key>
<dict>
    <key>timeimporter</key>
    <string>ServiceName</string>
    <key>timeexporter</key>
    <string>Export to ServiceName</string>
    <key>estimates</key>
    <string>Send to ServiceName</string>
    <key>invoices</key>
    <string>Send to ServiceName</string>
</dict>
```

## Settings (Globals)

The `Globals` array defines user-configurable settings. Each setting is a dictionary with these keys:

### Field Types

#### Password Field
```xml
<dict>
    <key>label</key>
    <string>API Token</string>
    <key>name</key>
    <string>token</string>
    <key>type</key>
    <string>password</string>
    <key>placeholder</key>
    <string>Optional hint text</string>
</dict>
```

#### String Field
```xml
<dict>
    <key>label</key>
    <string>Subscription ID</string>
    <key>name</key>
    <string>subscriptionID</string>
    <key>type</key>
    <string>string</string>
    <key>default</key>
    <string>default value</string>
</dict>
```

#### Integer Field
```xml
<dict>
    <key>label</key>
    <string>Round to</string>
    <key>name</key>
    <string>roundTo</string>
    <key>buttonlabel</key>
    <string>Minutes</string>
    <key>type</key>
    <string>integer</string>
    <key>default</key>
    <real>1</real>
</dict>
```

#### Boolean Field
```xml
<dict>
    <key>label</key>
    <string>Load entries older than 1 year</string>
    <key>name</key>
    <string>loadAll</string>
    <key>type</key>
    <string>boolean</string>
</dict>
```

#### Link (Information)
```xml
<dict>
    <key>label</key>
    <string>More about ServiceName</string>
    <key>type</key>
    <string>link</string>
    <key>url</key>
    <string>https://example.com</string>
</dict>
```

### Accessing Settings in JavaScript

Settings defined in `Globals` are available as global variables in your `index.js`:

```javascript
// If you defined a setting with name="token"
var apiToken = token;

// If you defined a setting with name="subscriptionID"
var subID = subscriptionID;
```

**Important**: Password values are stored in the system keychain. After modifying your code, users must re-enter passwords.

## index.js Implementation

### Basic Structure

```javascript
// Check which plugin type is being called
if (pluginType() === "timeexporter") {
    exportEntries();
} else {
    importEntries();
}

function importEntries() {
    // Fetch time entries from external service
    var entries = fetchTimeEntries();

    // Return array of time entry objects
    return entries.map(entry => ({
        startDate: entry.start,
        client: entry.clientName,
        project: entry.projectName,
        minutes: entry.duration,
        notes: entry.description,
        user: entry.userName,
        cost: entry.amount,
        uid: "com.servicename." + entry.id,
        url: entry.webUrl,
        appURL: entry.deepLink
    }));
}
```

### Time Entry Format

Each time entry must be a JavaScript object with these properties:

```javascript
{
    // Required fields
    "startDate": "2015-05-24T17:49:27+02:00",  // ISO 8601 format
    "minutes": 120,                             // Duration in minutes
    "uid": "com.servicename.233283908",         // Globally unique ID

    // Optional fields
    "client": "Client Name",
    "project": "Project Name",
    "notes": "Description of work",
    "user": "User Name",
    "cost": 200.00,                            // Calculated cost
    "url": "https://service.com/entry/123",    // Web link (for double-click)
    "appURL": "appname://entry/123"            // Deep link to native app
}
```

**Important Requirements**:
- **startDate**: Must be ISO 8601 format (e.g., `2004-02-12T15:19:21+00:00`)
- **uid**: Must be globally unique. Use a prefix like `com.servicename.` + entry ID
- **url/appURL**: Provide deep links when possible for direct navigation to entries

### Available Helper Functions

```javascript
// HTTP requests
loadURL(method, url, headers)

// Logging (visible in Console.app)
log(value)

// Base64 encoding
base64Encode(string)

// Check current plugin type
pluginType()  // Returns: "timeimporter", "timeexporter", etc.

// Plugin directory path
PluginDirectory  // Global variable with plugin's directory path

// User settings
// All settings from Globals array are available as global variables
```

### Error Handling

Return a string instead of an array to display it as a warning to the user:

```javascript
function importEntries() {
    if (!token) {
        return "Please enter your API token in the plugin settings.";
    }

    var response = loadURL("GET", apiUrl, {
        "Authorization": "Bearer " + token
    });

    if (!response || response.error) {
        return "Could not connect to service. Please check your API token.";
    }

    // Return entries array on success
    return processEntries(response);
}
```

## Exporting Time Entries (timeexporter)

Add `"timeexporter"` to the types array to support exporting:

```javascript
if (pluginType() === "timeexporter") {
    exportEntries();
} else {
    importEntries();
}

function exportEntries() {
    // 'timeentries' is a global variable containing entries to export

    // Setup progress indicator
    var progressIndicator = grandtotal.progress;
    progressIndicator.configuration.value = 0;
    progressIndicator.configuration.maxValue = timeentries.length;
    progressIndicator.configuration.canCancel = true;
    progressIndicator.start();

    for (var i = 0; i < timeentries.length; i++) {
        var entry = timeentries[i];

        // Check if user cancelled
        if (progressIndicator.cancelled) {
            progressIndicator.end();
            return "Export cancelled by user.";
        }

        // Upload entry to external service
        uploadEntry(entry);

        // Update progress
        progressIndicator.configuration.value = i + 1;
        progressIndicator.configuration.message = "Uploading " + (i + 1) + " of " + timeentries.length;
    }

    progressIndicator.end();
    return "Export completed successfully.";
}
```

### Progress Indicator API

```javascript
// Access progress indicator
var progressIndicator = grandtotal.progress;

// Configure
progressIndicator.configuration.value = 0;           // Current progress
progressIndicator.configuration.maxValue = 100;      // Maximum value
progressIndicator.configuration.message = "Loading"; // Status message
progressIndicator.configuration.canCancel = true;    // Allow cancellation

// Control
progressIndicator.start();                           // Show progress UI
progressIndicator.end();                             // Hide progress UI

// Check status
if (progressIndicator.cancelled) {                   // User cancelled?
    // Clean up and exit
}
```

## Localization

Time importer plugins support full localization. See the [main README Localization section](../README.md#localization) for complete documentation on:
- Directory structure (`.lproj` folders)
- Localizable.strings format
- Using localization in JavaScript (`localize()` function)
- Localizing Info.plist values
- Best practices and language codes

## Testing

1. Copy plugin to `~/Library/Application Support/GrandTotal/PlugIns/`
2. Launch GrandTotal
3. Open or create a document
4. File → Import Time Entries → [Your Service Name]
5. Configure settings if needed
6. Test import functionality
7. Check Console.app for any `log()` output

## Distribution

### Option 1: ZIP File
1. Compress the `.grandtotalplugin` bundle into a ZIP file
2. Users can double-click the ZIP to install
3. Or manually copy to `~/Library/Application Support/GrandTotal/PlugIns/`

### Option 2: GitHub Release
1. Host the plugin on GitHub
2. Add `URL` key to Info.plist pointing to the ZIP file
3. GrandTotal can check for updates automatically

## Complete Examples

See these plugins for complete working implementations:
- **Tyme.grandtotalplugin** - Import/export with Tyme time tracking
- **Tick.grandtotalplugin** - API-based import with settings
- **Timing.grandtotalplugin** - Complex settings, multiple types
- **Clockodo.grandtotalplugin** - Full-featured API integration

## Advanced Features

### Deep Linking

Use `TimeImporterEntryURLTemplate` to enable double-click navigation:

```xml
<key>TimeImporterEntryURLTemplate</key>
<string>tyme://time_entry/%@</string>
```

Then provide the entry ID in your time entry's `appURL`:

```javascript
{
    "uid": "com.tyme.12345",
    "appURL": "tyme://time_entry/12345"
}
```

### Full Disk Access

For plugins that need to read files outside sandboxed locations:

```xml
<key>RequiresFullDiskAccess</key>
<true/>
```

### AppleScript Integration

Include `.applescript` files in your plugin bundle to interact with other apps:

```javascript
// Run AppleScript from plugin directory
var script = PluginDirectory + "Script.applescript";
// Execute using system APIs
```

## Troubleshooting

### Common Issues

1. **Password not available**: Passwords are stored in keychain. Users must re-enter after code changes.
2. **UID conflicts**: Ensure UIDs are globally unique using a service prefix
3. **Date format errors**: Always use ISO 8601 format for dates
4. **Settings not appearing**: Check `Globals` array syntax in Info.plist
5. **Icon not showing**: Verify `CFBundleIconFile` matches actual filename

### Debugging

Use `log()` extensively and check Console.app:

```javascript
log("Fetching entries...");
log("API Response: " + JSON.stringify(response));
log("Processed " + entries.length + " entries");
```

## API Reference Summary

### Global Variables
- `token`, `subscriptionID`, etc. - User settings from `Globals`
- `PluginDirectory` - Path to plugin bundle
- `timeentries` - Array of entries (timeexporter only)
- `grandtotal.progress` - Progress indicator object

### Functions
- `loadURL(method, url, headers)` - Make HTTP requests
- `log(value)` - Log to console
- `base64Encode(string)` - Encode to Base64
- `pluginType()` - Get current plugin type
- `showPluginSettings()` - Show settings UI

### Time Entry Object
```javascript
{
    startDate: "2015-05-24T17:49:27+02:00",  // Required, ISO 8601
    minutes: 120,                             // Required
    uid: "com.service.123",                   // Required, unique
    client: "Client Name",                    // Optional
    project: "Project Name",                  // Optional
    notes: "Description",                     // Optional
    user: "User Name",                        // Optional
    cost: 200.00,                            // Optional
    url: "https://...",                      // Optional, web link
    appURL: "app://..."                      // Optional, deep link
}
```
