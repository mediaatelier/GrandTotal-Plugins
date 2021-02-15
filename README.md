# GrandTotal Plugins
Javascript based plugins to extend the [GrandTotal](https://www.mediaatelier.com/GrandTotal7) invoicing application.
### How it works
Download one of the samples and create your own plugin by customizing the plist and the js file.
Plugins can be installed by double clicking them and are located in ~/Library/Application Support/com.mediaatelier.GrandTotal3/Plugins/
Once installed, you can edit the JavaScript file in place. Changes on the .plist file require a restart of GrandTotal.
### Localiz(s)ing
Localization is done the standard way using a strings file in the corresponding .lproj folder.
### Things you should know
Only one plugin is allowed per bundle identifier. Plugins in the users library will override built-in plugins with the same identifier.


