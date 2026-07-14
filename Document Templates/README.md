# Document Template Plugins (Draft Spec)

A plugin type that hooks into the template chooser of **File → New Document**. Selecting the template opens the plugin's HTML UI in a sheet; on commit, GrandTotal creates the document internally from a [Records-Format](../Records-Format.md) payload — same semantics as opening a `.grandtotalrecords` file, without the file.

Status: **implemented** in GrandTotal 9.5 (`GTDocumentTemplateSheetController`). Plugins of this type are gated by the feature identifier `GTFeaturePluginsDocumentTemplates` (XL). First plugin: HOAI (German architects' fee calculation), now shipped inside the app's internal `PlugIns/` folder.

## Bundle Layout

```
Name.grandtotalplugin/
    Info.plist
    index.html       ← UI, loaded in a WKWebView sheet
    Icon.pdf
    de.lproj/…       ← optional, for the template name in the chooser
```

### Info.plist

```xml
<key>types</key>
<array><string>documenttemplate</string></array>
<key>CFBundleIdentifier</key>
<string>com.mediaatelier.hoai</string>
<key>documentType</key>
<string>invoice</string>              <!-- invoice | estimate -->
<key>sheetSize</key>
<string>{720, 640}</string>           <!-- optional, size of the HTML area; the native button row adds to the window height -->
<key>commitButtonTitle</key>
<string>Create Invoice</string>       <!-- localized via the bundle's Localizable.strings -->
<key>FeatureIdentifier</key>
<string>GTFeaturePluginsDocumentTemplates</string>
```

## Native Chrome

Cancel and commit are native `GTTintButton`s below the WKWebView — the HTML must NOT render its own button row. GrandTotal sets the page background to the window background color at load (a user script assigns `document.documentElement.style.backgroundColor`), so the page should not set its own opaque body background; it blends with the native button row automatically.

## JavaScript API

GrandTotal injects `window.grandtotal` before `index.html` runs:

- **grandtotal.language** — UI language of the app (`"de"`, `"en"`, …)
- **grandtotal.currency** — currency code of the frontmost document (`"EUR"`)
- **grandtotal.tintColor** — the app's button tint as an `rgba(…)` string; also available in CSS as `var(--gt-tint)`
- **grandtotal.commit(entities)** — create the document and close the sheet. `entities` is the `entities` dictionary of the Records Format (e.g. one `Invoice` record plus `Cost` records related via `parent` — NOT `parentDocument`, which is blocked for item imports). Documents are created as drafts; numbering, contact and layout follow the app's normal flow.
- **grandtotal.cancel()** — close the sheet without creating anything.
- **grandtotal.onCommit** — assign a function; called when the user clicks the native commit button. The function validates, builds the payload and calls `grandtotal.commit(entities)`.
- **grandtotal.setCanCommit(bool)** — enable/disable the native commit button (call it once on load and on every input change).
- **grandtotal.setModal(bool)** — disable both native buttons while an in-page overlay is open; pass `false` when it closes.
- **grandtotal.getDefaults() / grandtotal.setDefaults(object)** — optional persistence per plugin (last used inputs), stored in the plugin's preferences.

The HTML page is self-contained: no network access, no external resources.
