# Migration Plugins for GrandTotal

Migration plugins allow users to import data from external accounting and invoicing services into GrandTotal.

## Plugin Structure

Each migration plugin is a `.grandtotalplugin` bundle containing:

```
Migrate ServiceName.grandtotalplugin/
├── Info.plist
└── index.js
```

## Info.plist Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>com.mediaatelier.migrate.ServiceName</string>

    <key>CFBundleVersion</key>
    <string>1.0</string>

    <key>GrandTotalMinimumVersion</key>
    <real>9</real>

    <key>types</key>
    <array>
        <string>migration</string>
    </array>

    <key>MenuName</key>
    <string>ServiceName</string>

    <key>APIKeyURL</key>
    <string>https://example.com/api-documentation</string>

    <key>copyright</key>
    <string>© 2025 Your Name</string>
</dict>
</plist>
```

### Required Keys

- **CFBundleIdentifier**: Must follow pattern `com.mediaatelier.migrate.{ServiceName}` where `{ServiceName}` matches the last component
- **types**: Must contain `"migration"`
- **MenuName**: Display name shown in the "Migrate data from" menu (e.g., "SevDesk", "LexOffice")
- **APIKeyURL**: URL where users can find or generate their API key

## index.js Implementation

The plugin's `index.js` must return a dictionary with an `entities` key containing the data to import:

```javascript
// Global variable 'token' contains the API key entered by the user

function migrate() {
    // Fetch data from external API
    const clients = fetchClients();
    const invoices = fetchInvoices();

    return {
        entities: {
            Client: clients.map(client => ({
                attributes: {
                    uid: "service.client." + client.id,
                    organization: client.companyName,
                    firstName: client.firstName,
                    lastName: client.lastName,
                    email: client.email,
                    address: client.street,
                    city: client.city,
                    zip: client.postalCode,
                    countryCode: client.countryCode
                }
            })),

            Invoice: invoices.map(invoice => ({
                attributes: {
                    uid: "service.invoice." + invoice.id,
                    name: invoice.number,
                    date: invoice.date
                },
                relations: {
                    parentDocument: "service.client." + invoice.clientId
                }
            })),

            Cost: extractLineItems(invoices)
        }
    };
}

migrate();
```

### Available Helper Functions

- `loadURL(method, url, headers)`: Make HTTP requests
- `token`: Global variable containing the user's API key

### Entity Types

Supported entity types include:
- `Client` - Customers and contacts
- `Invoice` - Invoices
- `Estimate` - Estimates/quotes
- `Cost` - Line items
- `CatalogItem` - Product catalog items
- `Payment` - Payment records

### Entity Structure

Each entity has:
- **uid**: Unique identifier (string) - must be unique across all entities
- **attributes**: Dictionary of entity properties (matches Core Data attributes)
- **relations**: Dictionary of relationships to other entities (reference by `EntityType/uid`)

### Relationship Format

- To-one: `"parentDocument": "Client/client123"`
- To-many: `"costs": ["Cost/cost1", "Cost/cost2"]`

## Error Handling

Return an error object to display to the user:

```javascript
if (apiResponse.error) {
    return {
        server_error: true,
        message: "Could not connect to API"
    };
}
```

## Testing

1. Copy plugin to `~/Library/Application Support/GrandTotal/PlugIns/`
2. Launch GrandTotal
3. Open a document
4. File → Migrate data from → [Your Service Name]
5. Enter API key and test import

## Example: Complete Plugin

See `Migrate SevDesk.grandtotalplugin` and `Migrate LexOffice.grandtotalplugin` for complete working examples.

## Distribution

1. Zip the `.grandtotalplugin` bundle
2. Users can double-click the zip to install
3. Or manually copy to `~/Library/Application Support/GrandTotal/PlugIns/`
