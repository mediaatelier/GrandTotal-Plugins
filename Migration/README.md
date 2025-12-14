# Migration Plugins for GrandTotal

Migration plugins allow users to import baseline data (clients, products, catalog items) from external accounting and invoicing services into GrandTotal. These plugins appear in the **GrandTotal → Migrate data from** menu.

## Key Characteristics

- **Menu placement**: Appear in "GrandTotal → Migrate data from" menu
- **No settings required**: Migration plugins do not use the settings system
- **No icons needed**: Unlike other plugin types, migration plugins do not require icon files
- **MenuName required**: Must specify a MenuName in Info.plist for menu display
- **Baseline data only**: Should import clients and products, NOT invoices/estimates from other systems

## What to Import

**DO import:**
- **Clients** - Customer and contact information
- **CatalogItem** - Product catalog, services, standard items
- **Projects** - Project information (if applicable)

**DO NOT import:**
- **Invoices** - Invoices created in other systems should remain there
- **Estimates** - Quotes/estimates created in other systems should remain there
- **Payments** - Payment records from other systems

**Why?** Documents created in other systems will look different when imported into GrandTotal. They should remain in their original system. Migration is about setting up GrandTotal with your baseline data so you can start creating new documents going forward.

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

- **CFBundleIdentifier**: Unique identifier for your plugin (e.g., `com.mediaatelier.migrate.ServiceName`)
- **CFBundleVersion**: Version string (e.g., "1.0")
- **GrandTotalMinimumVersion**: Minimum GrandTotal version required (e.g., 9)
- **types**: Must contain `"migration"` - this identifies the plugin as a migration plugin
- **MenuName**: Display name shown in the "Migrate data from" menu (e.g., "SevDesk", "Invoice Ninja")
- **APIKeyURL**: URL where users can find or generate their API key

### Optional Keys

- **copyright**: Copyright notice (e.g., "© 2025 Your Name")

### Keys NOT Used by Migration Plugins

Migration plugins do not use:
- **Settings**: No settings UI is shown
- **Icon files**: No icon display in menus
- **Menu hierarchy keys**: Migration plugins always appear in the fixed "Migrate data from" menu

## index.js Implementation

The plugin's `index.js` must return a dictionary with an `entities` key containing the data to import:

```javascript
// Global variable 'token' contains the API key entered by the user

function migrate() {
    // Fetch data from external API
    const clients = fetchClients();
    const products = fetchProducts();

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

            CatalogItem: products.map(product => ({
                attributes: {
                    uid: "service.product." + product.id,
                    name: product.name,
                    itemDescription: product.description,
                    unitPrice: parseFloat(product.price),
                    tax: parseFloat(product.taxRate)
                }
            }))
        }
    };
}

migrate();
```

### Available Helper Functions

- `loadURL(method, url, headers)`: Make HTTP requests
- `token`: Global variable containing the user's API key

### Entity Types

Entity types that **should be imported** in migration plugins:
- `Client` - Customers and contacts
- `CatalogItem` - Product catalog items, services, standard line items
- `Project` - Projects (optional, if your service uses projects)

Entity types that **should NOT be imported** (documents created in other systems):
- `Invoice` - Keep invoices in their original system
- `Estimate` - Keep estimates/quotes in their original system
- `Cost` - Line items (part of invoices, should not be imported separately)
- `Payment` - Payment records (tied to invoices in original system)

### Entity Structure

Each entity has:
- **uid**: Unique identifier (string) - must be unique across all entities
- **attributes**: Dictionary of entity properties (matches Core Data attributes)
- **relations**: Dictionary of relationships to other entities

### Relationship Format

Most migration plugins **do not need relationships** since they import independent entities (clients and catalog items). However, if you need to link entities (e.g., Projects to Clients), use this format:

**Format**: Relations must use `"EntityType/uid"` where:
- `EntityType` is the entity name (e.g., `Client`, `Project`)
- `/` is the separator (forward slash)
- `uid` is the unique identifier of the related entity

**Example** (linking a Project to a Client):
```javascript
return {
    entities: {
        Client: [{
            attributes: {
                uid: "service.client.100",
                organization: "ACME Corp"
            }
        }],

        Project: [{
            attributes: {
                uid: "service.project.1",
                name: "Website Redesign"
            },
            relations: {
                parentDocument: "Client/service.client.100"  // Links to client above
            }
        }]
    }
};
```

**Note:** Most migration plugins only import Clients and CatalogItems, which don't require relationships.

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

## Localization

Migration plugins support full localization. See the [main README Localization section](../README.md#localization) for complete documentation on:
- Directory structure (`.lproj` folders)
- Localizable.strings format
- Using localization in JavaScript (`localize()` function)
- Localizing Info.plist values
- Best practices and language codes

## Testing

1. Copy plugin to `~/Library/Application Support/GrandTotal/PlugIns/`
2. Launch GrandTotal
3. Open a document
4. GrandTotal → Migrate data from → [Your Service Name]
5. Enter API key when prompted
6. Verify that data imports correctly

## Example: Complete Plugin

See `Migrate SevDesk.grandtotalplugin` and `Migrate LexOffice.grandtotalplugin` for complete working examples.

## Distribution

1. Zip the `.grandtotalplugin` bundle
2. Users can double-click the zip to install
3. Or manually copy to `~/Library/Application Support/GrandTotal/PlugIns/`
