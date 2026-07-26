## GrandTotal Plugins Menu

Installed in the Plugins menu these plugins can be used for scripts that can't be added to the other categories

### Plugin Type

```xml
<key>types</key>
<array>
    <string>pluginsmenu</string>
</array>
```


### How it works

The script runs from the top, without a selection. Set `runAsynchronous` in the `Info.plist` when the plugin talks to a server, so it runs in the background with a progress window.

See [Plugin-Anatomy.md](../Plugin-Anatomy.md) for the `Info.plist` keys and [JavaScript-API.md](../JavaScript-API.md) for the available functions.
