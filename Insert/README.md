## GrandTotal Insert Plugins

Called when a document is added.
### Types
- insertInvoice
- insertEstimate
- insertProject
- insertClient

Find the API-Documentation at the bottom of the GrandTotal help or by opening this URL in your browser:
grandtotal://openReference

### How it works

The script runs from the top when such a record is created; the new record is available through `query()`. No return value is expected.

See [Plugin-Anatomy.md](../Plugin-Anatomy.md) for the `Info.plist` keys and [JavaScript-API.md](../JavaScript-API.md) for the available functions.
