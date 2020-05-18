## GrandTotal Time Importer Plugins
### Import items to be invoiced from a third party application or service

Loading httpContents
loadURL(method,url,headers);

Logging to the Console
log(value);

Base64
base64Encode(string);

Expected result is a JSON representation of an array.

[
{"startDate":"2015-05-24T17:49:27+02:00","client":"Client A","project":"My Project","minutes":120,"notes":"HTML Coding","user":"me","cost":200,"uid":"com.toggle.233283908"},
{"startDate":"2015-05-24T16:58:00+02:00","client":"Client B","project":"Other Project","minutes":10,"notes":"Fixing bugs","user":"me","cost":16.666666666666664,"uid":"com.toggle.233275239"}
]

Make *sure* the uid you provide is not just a plain integer and globally unique. Prepend an identifier for your application if needed. Eg: com.myservice.1

Dates must be returned as strings in ISO 8601 format (e.g., 2004-02-12T15:19:21+00:00)

Returning a string instead of an array will present that string as warning.    

To see how to add global variables (Settings) look at the Info.plist of the samples.

Keep in mind that for security reasons passwords are stored in the keychain and
you will have to enter them again after modifying your code.

