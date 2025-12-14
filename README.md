# GrandTotal Plugins

Javascript based plugins to extend the [GrandTotal](https://www.mediaatelier.com/en/GrandTotal/) invoicing application.

## How it works

Download one of the samples and create your own plugin by customizing the plist and the js file.

Plugins can be installed by double clicking them and are located in:
```
~/Library/Application Support/GrandTotal/PlugIns/
```

Once installed, you can edit the JavaScript file in place. Changes to the `.plist` file require a restart of GrandTotal.

## Plugin Types

GrandTotal supports several plugin types:

- **[Migration](Migration/README.md)** - Import data from external services (Menu: GrandTotal → Migrate data from)
- **[Time Importer](Time%20Importer/README.md)** - Import time tracking entries (Menu: File → Import Time Entries)
- **[Send To Menu](Send%20To%20Menu/README.md)** - Export invoices to other applications (Menu: File → Send to)
- **Document Numbering** - Custom document numbering schemes
- **Insert** - Insert content into documents
- **E-Invoice** - Electronic invoice generation
- **Plugins Menu** - General purpose plugins

See the respective directories for detailed documentation on each plugin type.

## Localization

All plugin types support localization using the standard macOS `.lproj` folder structure.

### Directory Structure

Create language-specific folders within your plugin bundle:

```
YourPlugin.grandtotalplugin/
├── Info.plist
├── index.js
├── en.lproj/
│   └── Localizable.strings
├── de.lproj/
│   └── Localizable.strings
├── fr.lproj/
│   └── Localizable.strings
└── es.lproj/
    └── Localizable.strings
```

### Localizable.strings Format

Each `.lproj` folder contains a `Localizable.strings` file with key-value pairs:

**en.lproj/Localizable.strings:**
```
"Settings" = "Settings";
"API Token" = "API Token";
"Company ID" = "Company ID";
"Export completed" = "Export completed successfully";
"Error message" = "Could not connect to server";
```

**de.lproj/Localizable.strings:**
```
"Settings" = "Einstellungen";
"API Token" = "API-Token";
"Company ID" = "Firmen-ID";
"Export completed" = "Export erfolgreich abgeschlossen";
"Error message" = "Verbindung zum Server fehlgeschlagen";
```

### Using Localization in JavaScript

Use the `localize()` function to get localized strings:

```javascript
// Get localized string
var message = localize("Export completed");
log(message);  // "Export completed successfully" (en) or "Export erfolgreich abgeschlossen" (de)

// Use in error messages
if (error) {
    return localize("Error message");
}

// Use in progress indicators
progressIndicator.configuration.message = localize("Processing");
```

### Using Localization in Info.plist

String values in `Info.plist` are automatically localized if matching keys exist in `Localizable.strings`:

**Info.plist:**
```xml
<key>GlobalsInfo</key>
<string>Enter your API token to connect.</string>
```

**Localizable.strings:**
```
"Enter your API token to connect." = "Geben Sie Ihr API-Token ein, um sich zu verbinden.";
```

GrandTotal will automatically use the localized version based on the user's system language.

### Common Localizable Elements

Elements that support localization:
- `GlobalsInfo` - Settings description text
- `displayNames` - Plugin type display names
- Label values in `Globals` array
- String values returned from JavaScript
- Progress indicator messages
- Alert and notification messages

### Testing Localization

1. Add localized strings to appropriate `.lproj` folders
2. Restart GrandTotal (for Info.plist localizations)
3. Change macOS system language in System Preferences
4. Launch GrandTotal and verify localized strings appear

### Best Practices

1. **Always provide English**: Include `en.lproj` as the fallback language
2. **Use descriptive keys**: Make keys self-documenting (e.g., "Export completed" not "msg1")
3. **Keep strings in sync**: Ensure all languages have the same keys
4. **Test with placeholders**: If using string interpolation, test with different languages
5. **Consider string length**: Translations may be longer/shorter than English

### Language Codes

Common `.lproj` folder names:
- `en.lproj` - English
- `de.lproj` - German
- `fr.lproj` - French
- `es.lproj` - Spanish
- `it.lproj` - Italian
- `ja.lproj` - Japanese
- `pt.lproj` - Portuguese
- `nl.lproj` - Dutch
- `pl.lproj` - Polish
- `ru.lproj` - Russian
- `zh-Hans.lproj` - Simplified Chinese
- `zh-Hant.lproj` - Traditional Chinese

## Things you should know

### Bundle Identifiers

Only one plugin is allowed per bundle identifier. Plugins in the user's library will override built-in plugins with the same identifier.

### Automatic Updates

Installing a new version of GrandTotal will automatically update built-in plugins. Make sure you use custom bundle identifiers on modified versions of the plugins, otherwise they could be replaced.

### File Changes

- **JavaScript changes**: Take effect immediately after saving the file
- **Info.plist changes**: Require restarting GrandTotal
- **Localization changes**: Require restarting GrandTotal

## JavaScript API

See [JavaScript-API.md](JavaScript-API.md) for the complete API reference including:
- Database operations
- HTTP requests
- File operations
- User interface functions
- And more...


