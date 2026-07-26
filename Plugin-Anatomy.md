# Plugin Anatomy

How a GrandTotal plugin is put together: bundle layout, `Info.plist` keys, how the JavaScript is invoked and what it is expected to return. Read this together with [JavaScript-API.md](JavaScript-API.md) (the functions available inside the script), [Entities.md](Entities.md) (the data model) and [Records-Format.md](Records-Format.md) (creating records).

## Bundle layout

```
YourPlugin.grandtotalplugin/
├── Info.plist          required
├── index.js            required (except for document templates, which use index.html)
├── Icon.png            optional (CFBundleIconFile)
└── de.lproj/…          optional localization (see README.md)
```

Installed plugins live in:

```
~/Library/Application Support/com.mediaatelier.GrandTotal3/PlugIns/
```

A symlink into that folder is enough — GrandTotal resolves symlinks and aliases, which makes it possible to keep the plugin in a project folder while developing.

| Change | Takes effect |
| --- | --- |
| `index.js` / `index.html` | on the next run — no restart |
| `Info.plist` | after restarting GrandTotal |
| `Localizable.strings` | after restarting GrandTotal |

## Info.plist

### Required

| Key | Type | Meaning |
| --- | --- | --- |
| `CFBundleIdentifier` | String | Unique per plugin. A plugin in the user's library replaces a built-in plugin with the same identifier. |
| `types` | Array of String | Which plugin types this bundle registers for (see table below). Matched case-insensitively, so `DynamicCost` and `dynamiccost` are the same type. A bundle may register for several types. |

### Common

| Key | Type | Meaning |
| --- | --- | --- |
| `CFBundleVersion` | String | Version of the plugin, used for update checks. |
| `CFBundleIconFile` | String | Icon file inside the bundle (`.png` or `.pdf`). |
| `copyright` | String | Shown in the plugin list. |
| `URL` | String | Download URL of the `.zip` for updates. |
| `MenuName` | String | Menu title; falls back to the bundle name. |
| `displayNames` | Dict | Per-type menu title, keyed by the lowercased type: `displayNames.sendtomenu`. |
| `menuNameTemplate` | String | Template for the menu title. `<name/>` is replaced by the menu name, `<settingName/>` by the value of that setting. |
| `helpAnchor` | String | Anchor opened by the help button in the settings sheet. |

### Gating — when the plugin is loaded at all

| Key | Type | Meaning |
| --- | --- | --- |
| `FeatureIdentifier` | String | The plugin is skipped entirely unless the user owns that GrandTotal feature. Without this key the plugin loads for everyone and its usage is logged as `GTFeaturePlugins.<CFBundleIdentifier>`. Custom plugins normally use `GTFeaturePlugins`. |
| `GrandTotalMinimumVersion` | Number | Minimum major version of GrandTotal. |
| `restrictToCountries` | Array of String | ISO country codes; the plugin is hidden elsewhere. Ignored in debug builds. |
| `countries` | Array of String | Countries the plugin is *offered* for (e-invoice / send-to lists), without hiding it. |

### Execution

| Key | Type | Meaning |
| --- | --- | --- |
| `mainFunction` | String | Name of a function that is called after the script has been evaluated. Without it, only the top level of the script runs. |
| `sendFunction` | String | Send-to / e-invoice entry point (see the type's README). |
| `receiveFunction` | String | Entry point for fetching inbound documents. |
| `runAsynchronous` | Boolean | Runs the plugin on a background thread with a progress window and its own managed object context. Use it for anything that talks to the network. |
| `JSModuleContext` | Boolean | Runs `index.js` as an ES module, so `import` works. Without it the script is a plain script — top-level `import` is a syntax error. |
| `ScriptLocation` | String | Relative path to the script if it is not `index.js`. |
| `RequiresFullDiskAccess` | Boolean | Shows the hint that macOS full disk access is needed. |

### Settings

| Key | Type | Meaning |
| --- | --- | --- |
| `Globals` | Array of Dict | Settings fields. Each value is exposed to the script as a global variable of the same name (see below). |
| `GlobalsInfo` | String | Explanatory text above the settings, localizable. |
| `syncedPreferences` | Boolean | Stores the settings in the synced defaults instead of the local ones. |
| `hiddenFields` | Array of String | Names of settings that are stored but not shown. |
| `RequiredValues` | Array of Dict | Settings that must be filled in before the plugin can run. |

### Type-specific

| Key | Used by | Meaning |
| --- | --- | --- |
| `documentTypes` | Document templates | `invoice`, `estimate` — where the template shows up in File → New. |
| `commitButtonTitle` | Document templates | Title of the confirm button. |
| `sheetSize` | Document templates, settings sheets | `{width, height}` of the sheet. |
| `pasteboardTypes` | Pasteboard | Pasteboard types the plugin claims. |
| `SendToMenu` | Send To Menu | Configuration dict, see [Send To Menu/README.md](Send%20To%20Menu/README.md). |
| `PaymentLink` | Payment links | Configuration dict, see [Payment Links/README.md](Payment%20Links/README.md). |
| `MetaValues` | E-invoice, send-to | Meta values the plugin needs on client/invoice; GrandTotal asks for missing ones before sending. |
| `Placeholders` / `PlaceholdersPrefix` | Layout placeholders | Additional placeholders the plugin provides for layouts. |
| `AppendsPDFPages` | Send To Menu | The plugin appends pages to the PDF instead of replacing the send action. |
| `APIKeyURL` | Migration, importers | URL of the page where the user finds their API key. |
| `TimeImporterEntryURLTemplate` | Time importer | Template for the deep link back to the imported entry. |
| `menuValidationKeyPath` | Menu plugins | Key path on the selection deciding whether the menu item is enabled. |

## Settings fields (`Globals`)

```xml
<key>Globals</key>
<array>
    <dict>
        <key>name</key>    <string>token</string>
        <key>label</key>   <string>API Token</string>
        <key>type</key>    <string>password</string>
    </dict>
</array>
```

Every entry becomes a global variable in the script (`token` in the example). Keys per entry: `name` (required), `label`, `type`, `default`, `width`, plus `options` for `select`.

| `type` | Field |
| --- | --- |
| *(omitted)* / `string` | Text field |
| `number` | Decimal number |
| `integer` | Whole number |
| `password` | Stored in the macOS keychain, never in the preferences |
| `boolean` | Checkbox |
| `select` | Pop-up; either `options` (array of `{name, value}`) or `subtype` = `country`, `currency`, `language` |
| `link` | Static link, `url` |
| `button` | Calls the JS function named in `functionName`, label from `buttonlabel` |
| `shareLink` | Generates a link via `generator` / `copyFunction` / `openFunction` |

## Entry points and return values

Unless a type says otherwise, the whole script is evaluated and the work happens at the top level. If `mainFunction` is set, that function is called afterwards.

| Type | Where it appears | Entry point | Return value |
| --- | --- | --- | --- |
| `pluginsmenu` | Plugins menu | top level | — |
| `invoices`, `estimates`, `templates`, `clients`, `items`, `projects`, `layouts`, `languages`, `catalogitems` | Context menu of that list | top level, selection via `query()` | Optionally an array of records; GrandTotal opens the last one. |
| `insertInvoice`, `insertEstimate`, `insertProject`, `insertClient` | Automatically when such a record is created | top level | — |
| `costassistant` | Input assistant button on an item | top level, values from `Globals` | Object with `name`, `notes`, `quantity`, `unit`, `unitPrice`, `discount` |
| `dynamiccost` | Dynamic cost item | top level, `query()` | Object with `cost`, optionally `unit`, `notes`, `title` |
| `documentnumbering` | When a number is generated | top level | The number as a string |
| `documenttemplate` | File → New Document | `index.html`, `grandtotal.onCommit` | Records via `grandtotal.commit()` |
| `pasteitems`, `pastedocuments` | Paste into a document | top level, `pasteBoard` | Array of created records (empty array = fall back to the built-in parser) |
| `import`, `export` | File → Import / Export | top level | — |
| `timeimporter` | File → Import Time Entries | see [Time Importer/README.md](Time%20Importer/README.md) | Time entries |
| `migration` | GrandTotal → Migrate data from | top level | [Records format](Records-Format.md) |
| `sendtomenu` | File → Send to | `sendFunction` | see [Send To Menu/README.md](Send%20To%20Menu/README.md) |
| `e-invoice` | E-invoice generation | see [E-Invoice/README.md](E-Invoice/README.md) | XML / file |
| `paymentlink` | Payment link on the layout | see [Payment Links/README.md](Payment%20Links/README.md) | Link |
| `overview`, `statistics` | Overview → Plugins | HTML UI | — |

## Notes

- Only one plugin per bundle identifier is loaded.
- A plugin can create and change records, but it cannot delete them by script.
- `Entities.md` is generated by GrandTotal itself — do not edit it by hand, your changes will be overwritten.
