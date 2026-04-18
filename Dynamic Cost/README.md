## GrandTotal Dynamic Cost Plugins

Dynamic Cost is a cost type that can be added to invoices. Available in GrandTotal 7 or newer.

### Plugin Type

```xml
<key>types</key>
<array>
    <string>DynamicCost</string>
</array>
```

Methods

```
query()		GrandTotalQuery holding the affected items according to the plugins settings
```

Provided variables:
```

unitPrice	the value in the unit price field - this is the sum of the affected items according to the plugins settings
quantity	the value in the quantity field
```

The plugins may return a JS object with following keys:
```

cost	the calculated cost of the item
unit	unit used in that item (optional)
notes	description of the item (optional)
title 	title of the item (optional)
```

