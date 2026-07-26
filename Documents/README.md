## GrandTotal Document Plugins

Installed in the context menu of estimates or invoices

### Plugin Type

```xml
<key>types</key>
<array>
    <string>invoices</string>
    <string>estimates</string>
    <string>templates</string>
</array>
```

### How it works

The script runs from the top; the selected documents are available through `query()`. Items of a document are reached with `record.children.editableRecords()`. Returning an array of records makes GrandTotal open the last one.

`menuValidationKeyPath` (e.g. `isUnlocked`) keeps the menu item disabled for documents that must not be changed. See [Plugin-Anatomy.md](../Plugin-Anatomy.md).
