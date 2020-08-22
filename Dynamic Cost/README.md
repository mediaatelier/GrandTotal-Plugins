## GrandTotal Dynamic Cost Plugins

Installed in the the Dynamic Cost item of GrandTotal 7 or newer

Methods

query()		GrandTotalQuery holding the affected items according to the plugins settings

Provided variables:

unitPrice	the value in the unit price field - this is the sum of the affected items according to the plugins settings
quantity	the value in the quantity field

The plugins may return a JS object with following keys:

cost	the calculated cost of the item
unit	unit used in that item (optional)
notes	description of the item (optional)
title 	title of the item (optional)

