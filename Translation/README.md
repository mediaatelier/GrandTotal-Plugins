## GrandTotal Translation Plugins

Translation plugins are context menu plugins (see [Others/README.md](../Others/README.md)) that send the text of the selected record to a translation service and write the result back. `Translate with DeepL` is the working example in this folder.

### Plugin Type

Registered for every list whose records carry translatable text:

```xml
<key>types</key>
<array>
    <string>items</string>
    <string>projects</string>
    <string>estimates</string>
    <string>invoices</string>
    <string>layouts</string>
    <string>languages</string>
    <string>catalogitems</string>
</array>
```

### Translating a record

Records expose their translatable content as a single HTML string, so a plugin does not have to know which fields a given entity has:

```javascript
var record = query().editableRecord();
var html = record.translationHTML();          // all translatable text of the record
// … send html to the service …
record.setTranslationHTML(translatedHTML);    // write the translation back
```

Keep the markup intact — the tags carry the field boundaries. Services that support it should be told they are handling HTML (DeepL: `tag_handling=html`).

### Info.plist

The example is worth copying from:

| Key | Value | Why |
| --- | --- | --- |
| `runAsynchronous` | `true` | The plugin talks to a web service; without this the UI blocks. |
| `menuNameTemplate` | `<name/> (<language/>)` | Shows the configured target language in the menu title. |
| `menuValidationKeyPath` | `isUnlocked` | Greys the item out for records that must not be changed (sent documents). |
| `Globals` | token / account / language / formality | API credentials and options; `password` fields go to the keychain. |

See [Plugin-Anatomy.md](../Plugin-Anatomy.md) for all keys and [JavaScript-API.md](../JavaScript-API.md) for `loadURL`.
