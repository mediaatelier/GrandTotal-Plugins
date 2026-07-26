## GrandTotal Document Numbering Plugins

Called when generating a number for estimates or invoices. Not visible in the UI.
Don't install multiple plugins of that type.

### Plugin Type

```xml
<key>types</key>
<array>
    <string>documentNumbering</string>
</array>
```

### How it works

The script runs from the top and returns the number to use as a string. The document being numbered is available through `query()`.

See [Plugin-Anatomy.md](../Plugin-Anatomy.md) for the `Info.plist` keys.
