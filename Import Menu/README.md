## GrandTotal Import Plugins

Installed in File → Import, next to the built-in importers. Use them to read a file the user picks and turn it into GrandTotal records.

### Plugin Type

```xml
<key>types</key>
<array>
    <string>import</string>
</array>
```

There is a matching `export` type that appears in File → Export.

### How it works

The whole script runs when the menu item is chosen — no entry function is required unless you set `mainFunction`. Ask for the file yourself with `grandtotal.fileManager.openFileDialog("xlsx")`, read it with the file functions from [JavaScript-API.md](../JavaScript-API.md) (`contentsOfXLSFile`, `contentsOfCSVFile`, `contentsOfFile`, …) and create records with `insertRecord(entityName)`:

```javascript
var url = grandtotal.fileManager.openFileDialog("xlsx");
if (!url) return;

for (line of contentsOfXLSFile(url)) {
	var invoice = insertRecord("Invoice");
	invoice.subject = line[2];
	invoice.parentDocument = client;      // documents attach to a client via parentDocument

	var item = insertRecord("Cost");
	item.unitPrice = line[3];
	item.parent = invoice;                // items attach to their document via parent
}
```

Set `runAsynchronous` in the `Info.plist` when the import may take a while or talks to a server — the plugin then runs in the background with a progress window.

See `Import Invoices.grandtotalplugin` in this folder for a working example.
