## GrandTotal Time Importer Plugins
### Import items to be invoiced from a third party application or service

Loading httpContents
`loadURL(method,url,headers);`

Logging to the Console
`log(value);`

Base64
`base64Encode(string);`

Expected result is a JSON representation of an array.

```
[
	{
		"startDate":"2015-05-24T17:49:27+02:00",
		"client":"Client A",
		"project":"My Project",
		"minutes":120,
		"notes":"HTML Coding",
		"user":"me",
		"cost":200,
		"uid":"com.toggle.233283908"
	},
	{
		"startDate":"2015-05-24T16:58:00+02:00",
		"client":"Client B",
		"project":"Other Project",
		"minutes":10,
		"notes":"Fixing bugs",
		"user":"me",
		"cost":16.666666666666664,
		"uid":"com.toggle.233275239",
		"url":"https://linktotheentry",
		"appURL":"appname://linktotheentry"
	}
]
```

Make *sure* the uid you provide is not just a plain integer and globally unique. Prepend an identifier for your application if needed. Eg: com.myservice.1

Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

Returning a string instead of an array will present that string as warning.    

To see how to add global variables (Settings) look at the Info.plist of the samples.

Keep in mind that for security reasons passwords are stored in the keychain and
you will have to enter them again after modifying your code.

The provided url will be opened when double clicking the the entry in GrandTotal 7 and newer. Supply a deep link to the exact entry when possible. If there is a macOS App, also provide appURL with your app's URL scheme.


### Export items to a third party application or service

The unified JSON can also be used to migrate time entries to your service. For this, in your plist add the "timeexporter" type.

```
<key>types</key>
<array>
	<string>timeimporter</string>
	<string>timeexporter</string>`
</array>
```

In the code check the pluginType() to call the corresponding function.

```
if (pluginType() === "timeexporter") {
    exportEntries();
} else {
    importEntries();
}
```

Use the progressIndicator to give the user feedback on the progress. Setup:

```
progressIndicator = grandtotal.progress;
progressIndicator.configuration.value = 0;
progressIndicator.configuration.maxValue = timeentries.length;
progressIndicator.configuration.canCancel = true;
progressIndicator.start();
```

Update the progressIndicator

```
progressIndicator.configuration.value += recordBatchItems.length;
progressIndicator.configuration.message = "Uploading";
```


Stop your upload if cancelled

```
if (progressIndicator.cancelled) {
	progressIndicator.end();
	break;
}
```

End the progressIndicator

```
progressIndicator.end();
```

Make *sure* that you store the source service's item uid. This uid has to be provided to when importing to GrandTotal, so the user won't bill the same times twice.
