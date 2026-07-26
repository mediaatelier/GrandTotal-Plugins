## Clients

Installed in the context menu on the clients list and in the context menu of the contact details

### Plugin Type

```xml
<key>types</key>
<array>
    <string>clients</string>
</array>
```

### How it works

The script runs from the top; the selected clients are available through `query()` (`query().record()`, `query().editableRecords()`). Returning an array of records makes GrandTotal open the last one.

See [Others/README.md](../Others/README.md) for the same mechanism on the other lists, [Plugin-Anatomy.md](../Plugin-Anatomy.md) for the `Info.plist` keys.
