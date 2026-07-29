# Interactive Document Templates

A plugin type that hooks into the template chooser of **File → New Document**. Selecting the template opens the plugin's HTML UI in a sheet; on commit, GrandTotal creates the document internally from a [Records-Format](../Records-Format.md) payload — same semantics as opening a `.grandtotalrecords` file, without the file.

Available since GrandTotal **9.4.1** (`GTDocumentTemplateSheetController`), gated by the feature identifier `GTFeaturePluginsDocumentTemplates` (XL). The plugins are not bundled with the app — they live in this folder (as bundle and zip) and are installed via **Overview → Get Plugins** or by opening the zip. Plugins so far: [HOAI](HOAI.grandtotalplugin/) (German architects' fee schedule, Leistungsbild Gebäude/Innenräume, §§ 34/35), [HOAI TA](HOAI%20TA.grandtotalplugin/) (German engineers' fee schedule for technical services, Leistungsbild Technische Ausrüstung, §§ 53–56, multiple installation groups per invoice), [SIA 102](SIA%20102.grandtotalplugin/) (Swiss cost-based fee model, localized de/en/fr/it) and [Website](Website.grandtotalplugin/) (a design-showcase example: web-project estimate or invoice — domain address bar, modular services, optional yearly maintenance as % of effort and optional hosting tiers).

## Bundle Layout

```
Name.grandtotalplugin/
    Info.plist
    index.html       ← UI, loaded in a WKWebView sheet
    de.lproj/…       ← template name in the chooser and commit button title
```

The name shown in the File → New submenu is the bundle's file name, localized through the bundle's `Localizable.strings` (`"HOAI" = "HOAI-Honorarrechnung";`). `CFBundleDisplayName` is not used.

### Info.plist

```xml
<key>types</key>
<array><string>documenttemplate</string></array>
<key>CFBundleIdentifier</key>
<string>com.mediaatelier.hoai</string>
<key>GrandTotalMinimumVersion</key>
<string>9.4.1</string>                <!-- required; compared against the app version, plugin is skipped without it -->
<key>documentTypes</key>
<array><string>invoice</string></array>   <!-- invoice and/or estimate; one menu entry per type.
                                               Fallback: singular documentType string -->
<key>sheetSize</key>
<string>{720, 640}</string>           <!-- optional, size of the HTML area; the native button row adds to the window height -->
<key>commitButtonTitle</key>
<string>Create Invoice</string>       <!-- localized via the bundle's Localizable.strings -->
<key>FeatureIdentifier</key>
<string>GTFeaturePluginsDocumentTemplates</string>
```

## Native Chrome

Cancel and commit are native `GTTintButton`s below the WKWebView — the HTML must NOT render its own button row. GrandTotal sets the page background to the text background color (white / dark) at load via a user script, so the page should not set its own opaque body background; it blends with the native button row automatically. The context menu is suppressed.

## JavaScript API

GrandTotal injects `window.grandtotal` before `index.html` runs:

- **grandtotal.language** — UI language of the app (`"de"`, `"en"`, …)
- **grandtotal.currency** — currency code of the frontmost document (`"EUR"`)
- **grandtotal.documentType** — which menu the template was launched from (`"invoice"` or `"estimate"`); relevant when `documentTypes` lists both
- **grandtotal.tintColor** — the app's button tint as an `rgba(…)` string; also available in CSS as `var(--gt-tint)`
- **grandtotal.commit(entities)** — create the document and close the sheet. `entities` is the `entities` dictionary of the Records Format (e.g. one `Invoice` record plus `Cost` records related via `parent` — NOT `parentDocument`, which is blocked for item imports). Documents are created as drafts; numbering, contact and layout follow the app's normal flow.
- **grandtotal.cancel()** — close the sheet without creating anything.
- **grandtotal.onCommit** — assign a function; called when the user clicks the native commit button. The function validates, builds the payload and calls `grandtotal.commit(entities)`.
- **grandtotal.setCanCommit(bool)** — enable/disable the native commit button (call it once on load and on every input change).
- **grandtotal.setModal(bool)** — disable both native buttons while an in-page overlay is open; pass `false` when it closes.
- **grandtotal.getDefaults() / grandtotal.setDefaults(object)** — optional persistence per plugin (last used inputs), stored in the plugin's preferences.

The HTML page must work offline: embed all styles, scripts and data (e.g. price tables) in the bundle — no external resources needed at load time. Network is not blocked, though: the page is loaded via `loadFileURL` (origin `null`), so `fetch()` works against CORS-permissive endpoints (`Access-Control-Allow-Origin: *`). Use it only as an optional enhancement — say, refreshing an embedded price list from a supplier catalog — never as a requirement for the form to function.

## Items and their order

Besides `Cost`, a committed document can contain `Title`, `SubTotal`, `Note`, `PageBreak` and `SectionEnd` items. As soon as those are mixed in, `parent` no longer defines the order — records are created per entity, so all `Cost` items would end up together, followed by all `Title` items. Pass the order explicitly in the document's ordered `childs` relation instead and leave `parent` off the items:

```javascript
grandtotal.commit({
    Estimate: [{
        attributes: { uid: docUID, subject: subject },
        relations: { childs: ["Cost/i1", "SubTotal/i2", "Title/i3", "Cost/i4", "SubTotal/i5"] }
    }],
    Cost: [
        { attributes: { uid: "i1", name: "Concept", quantity: 1, unitPrice: 900 } },
        { attributes: { uid: "i4", name: "Hosting", quantity: 1, unitPrice: 300, optional: 1 } }
    ],
    SubTotal: [
        { attributes: { uid: "i2", name: "One-time" } },
        { attributes: { uid: "i5", name: "Yearly" } }
    ],
    Title: [{ attributes: { uid: "i3", name: "Yearly" } }]
});
```

A `SubTotal` sums everything above it back to the previous subtotal, including items flagged `optional` — those are left out of the document total but still add up in the subtotal. See [Records-Format.md](../Records-Format.md#document-items). The [Website](Website.grandtotalplugin/) plugin uses exactly this structure.
