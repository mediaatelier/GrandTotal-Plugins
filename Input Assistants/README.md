## GrandTotal Input Assistants

Installed on the assistant button next to an invoice or estimate item. The user picks the assistant, fills in the fields defined in `Globals`, and the plugin returns the values that are written into the item.

### Plugin Type

```xml
<key>types</key>
<array>
    <string>costassistant</string>
</array>
```

### Fields

The input fields come from `Globals` in the `Info.plist` (see [Plugin-Anatomy.md](../Plugin-Anatomy.md)). Every field is available in the script as a global variable of the same name. `width` on the plugin sets the width of the sheet, `width` on a field the width of that field.

### Return value

The script returns an object with the values to replace on the item. All keys are optional:

| Key | Type | Item field |
| --- | --- | --- |
| `name` | String | Title |
| `notes` | String | Description |
| `quantity` | Number | Quantity |
| `unit` | String | Unit |
| `unitPrice` | Number | Unit price |
| `discount` | Number | Discount |

Besides the fields, the script has `currency` and the usual helpers — `localize(string)` for localized strings and `formattedNumber(number)` for a number in the document's format.

### Example

```javascript
update();

function update() {
	var result = {};
	var area = width * length;

	result.quantity = area;
	result.unit = unit;
	result.notes = formattedNumber(length) + " × " + formattedNumber(width) + " " + unit;
	return result;
}
```

See `Area.grandtotalplugin`, `Volume.grandtotalplugin` and `Rental.grandtotalplugin` in this folder.
