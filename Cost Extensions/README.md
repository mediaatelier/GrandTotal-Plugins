## GrandTotal Cost Extension Plugins

A cost extension turns an ordinary item into one whose amount the plugin calculates. The item keeps its quantity, unit price, notes and discount; the plugin adds its own fields and decides the line amount from them. Typical uses are fee schedules, rates with a multiplier, or any line whose amount is not simply quantity × unit price. Available in GrandTotal 10 or newer.

Cost extensions need the feature `GTFeatureCostPlugins`. Without it the plugin is not offered, and existing plugin items keep their last calculated amount.

### Plugin Type

```xml
<key>types</key>
<array>
    <string>CostExtension</string>
</array>
<key>displayNames</key>
<dict>
    <key>costextension</key>
    <string>My Extension</string>
</dict>
```

The display name is the menu title. It is also stored with every item the plugin calculates, so a Mac without the plugin can say which one the item needs.

### Where it appears

- **Documents:** the add menu of the items list gets one entry per installed cost extension, below Dynamic Cost. It inserts an item that belongs to the plugin.
- **Catalog:** a catalog item has a *Type* popup (Normal item or one of the installed cost extensions). The plugin's fields appear as their own section below *General*. An item inserted from the catalog takes the plugin and its values with it.

### Methods

The `index.js` defines one function:

```
evaluate(row)	called whenever the item changes, returns the amount and warnings
```

`row` holds:

```
values		the plugin's values of this item (see below), numbers as decimal strings ("2.5")
quantity	the quantity field
unitPrice	the unit price field
notes		the notes field
```

`evaluate` returns an object:

```
amount		the line amount before discount, as a decimal string with a dot ("123.45")
warnings	optional, { <field key>: <message> } for fields whose value needs attention
```

GrandTotal applies the item's discount and the tax to `amount` as with any other item. Round in the plugin if your amount has to be rounded per line. If `amount` is missing or not a number, the item falls back to its last stored amount.

`evaluate` runs often (on every edit and when totals are drawn). It runs in a plain JavaScript context: the helpers other plugin types get (`loadURL`, `log`, `localize` …) are not there. Keep it a pure calculation. Warning texts come from the script, so a localized plugin picks them in `index.js`.

```js
function evaluate(row)
{
	var values = row.values || {};
	var factor = parseFloat(values.factor);
	if (isNaN(factor)) { factor = 1; }
	var amount = Math.round(row.quantity * row.unitPrice * factor * 100) / 100;
	var warnings = {};
	if (factor > 3) { warnings.factor = "Factor above 3"; }
	return { amount: amount.toFixed(2), warnings: warnings };
}
```

### Values

Each item stores the plugin's values as JSON (`customValuesJSON`). Keys starting with an underscore are GrandTotal's own: `_ext` is the plugin's `CFBundleIdentifier`, `_extName` its display name. `amount` holds the last amount the plugin calculated; GrandTotal writes it on save. Every other key belongs to the plugin.

Values entered once survive switching an item to another type and back. Defaults from `CostFields` only fill keys that are still missing.

### Info.plist keys

#### CostFields

The plugin's input fields. They show up as a section in the catalog item and fill the defaults when an item is assigned to the plugin.

```xml
<key>CostFields</key>
<dict>
    <key>rows</key>
    <array>
        <dict>
            <key>items</key>
            <array>
                <dict>
                    <key>key</key><string>factor</string>
                    <key>label</key><string>Factor</string>
                    <key>type</key><string>number</string>
                    <key>default</key><string>1</string>
                </dict>
            </array>
        </dict>
    </array>
</dict>
```

| Key | Meaning |
| --- | --- |
| `key` | Name of the value in `row.values` and in the JSON |
| `label` | Field label, localizable |
| `type` | `string`, `number`, `date`, `boolean` or `select` (with `options`, an array of `{label, value}`) |
| `default` | Value an item gets when it is assigned to the plugin |
| `placeholder` | Placeholder text, localizable |
| `width` | Field width in points (number fields default to 100) |
| `bind` | Name of an item attribute the field stands for, such as `itemNumber` or `unitPrice`. Such a field is not shown again in the catalog section, because the catalog already edits that attribute |

#### CellNib

Name of a nib in the bundle (without extension) that replaces the item's editor in documents. Without `CellNib` the item uses the normal editor. Bind the controls to the cell's `objectValue`, the item:

```
objectValue.quantity, objectValue.unitPrice, objectValue.notes, objectValue.cost   item attributes
objectValue.jsonValues.<key>       the plugin's values, read and written as decimals for number fields
objectValue.pluginWarnings.<key>   the message evaluate() returned for that key, nil if none
```

A warning icon can bind `hidden` to `objectValue.pluginWarnings.<key>` (with the `NSIsNil` transformer) and its `toolTip` to the same key path.

Give the nib's cell view the plugin's `CFBundleIdentifier` as its identifier. Ship the compiled `.nib` in the bundle.

#### Placeholders and PlaceholdersPrefix

Layout placeholders for the plugin's values. They appear in the layout editor under the item placeholders, as `<prefix>.<key>`:

```xml
<key>PlaceholdersPrefix</key>
<string>myext</string>
<key>Placeholders</key>
<dict>
    <key>cost</key>
    <dict>
        <key>label</key><string>My Extension</string>
        <key>rows</key>
        <array>
            <dict>
                <key>label</key><string>Factor</string>
                <key>items</key>
                <array>
                    <dict><key>key</key><string>factor</string><key>type</key><string>Number</string></dict>
                </array>
            </dict>
        </array>
    </dict>
</dict>
```

`<myext.factor/>` prints the value on the plugin's own items, formatted like the quantity, and stays empty on every other item. Without `PlaceholdersPrefix` the prefix is the bundle identifier.

### Items without the plugin

A document can travel to a Mac where the plugin is missing, or the feature is off. There the item shows its stored amount and cannot be edited, because a changed quantity or price would no longer match an amount only the plugin can calculate. Its tooltip names the plugin it needs. Installing the plugin makes it editable again.
