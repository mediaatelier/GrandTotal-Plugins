## GrandTotal Context Menu Plugins

Plugins that show up in the context menu of a list. The examples in this folder use them to act on the selected records: `Round Times` rounds the time items of an invoice, `Print Envelope` prints an envelope for the selected client or document.

### Plugin Type

One entry per list the plugin should appear in:

```xml
<key>types</key>
<array>
    <string>invoices</string>
    <string>estimates</string>
    <string>clients</string>
    <string>overview</string>
</array>
```

Available lists: `invoices`, `estimates`, `templates`, `clients`, `items`, `projects`, `catalogitems`, `layouts`, `languages`, `overview`.

### How it works

The script runs from the top; there is no required entry function. The selection is reached through `query()`:

```javascript
var invoice = query().record();          // first selected record
var records = query().editableRecords(); // all selected records, editable
```

Change records by assigning to their properties or with `setValueForKey`, and create new ones with `insertRecord(entityName)`. To-many relationships are read through the accessor of the same name, e.g. `invoice.children.editableRecords()` for the items of a document.

If the script returns an array of records, GrandTotal opens the last one — handy for plugins that create a document.

`menuValidationKeyPath` in the `Info.plist` decides whether the menu item is enabled for the current selection, `menuNameTemplate` builds the menu title. See [Plugin-Anatomy.md](../Plugin-Anatomy.md).

### Related types

- `pluginsmenu` — same mechanism, but in the Plugins menu without a selection
- `insertInvoice`, `insertEstimate`, `insertProject`, `insertClient` — run automatically when such a record is created (see [Insert/README.md](../Insert/README.md))
