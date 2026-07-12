# GrandTotal Records Format

A JSON-based format for exchanging records with GrandTotal. It is used by migration plugins (see [Migration/README.md](Migration/README.md)) and by `.grandtotalrecords` files. The same structure works in both contexts: a plugin returns it as an object, a file contains it as plain JSON.

## Files

Records files use the extension `.grandtotalrecords` (UTI `com.mediaatelier.grandtotal.records`, conforms to `public.json`). Opening one in GrandTotal runs a dry run first and shows the file's name, description and — per entity — how many records would be created, updated or skipped. Nothing is touched until the import is confirmed.

## File Header

Records files may carry metadata at the root level. All header fields are optional.

```json
{
    "format": "grandtotal-records",
    "version": 1,
    "name": "ACME Customer Data",
    "description": "Weekly sync from the customer portal",
    "language": "en",
    "entities": { }
}
```

- **name**: Shown as the title in the import dialog instead of the file name
- **description**: Shown as subtitle; useful for stating the source and generator
- **language**: ISO language code of the file's origin

## Entities

`entities` is a dictionary keyed by entity name. Entity names and attribute names are the internal Core Data names — see [Entities.md](Entities.md) for the complete reference (e.g. `Client`, `CatalogItem`, `Invoice`, `Cost`).

Each entity key holds either a plain **array of records** or a **block** with matching options:

```json
{
    "entities": {
        "Client": {
            "match": ["clientID"],
            "mode": "upsert",
            "records": [
                {
                    "attributes": {
                        "clientID": "K-1001",
                        "organization": "ACME Corp",
                        "email": "billing@acme.com",
                        "countryCode": "US"
                    }
                }
            ]
        },
        "CatalogItem": [
            {
                "attributes": {
                    "uid": "myservice.product.9",
                    "name": "Consulting",
                    "unitPrice": 120.0
                }
            }
        ]
    }
}
```

- **Array form**: records are matched by `uid` and updated if a record with the same `uid` already exists, otherwise created. This is the behavior migration plugins have always had.
- **Block form**: adds control over matching and update behavior via `match` and `mode`.

## Matching (`match`)

An array of attribute names that identify an existing record. All listed attributes must be equal for a record to count as a match (compound key). Defaults to `["uid"]` when omitted.

```json
"match": ["clientID"]
```

If a record is missing a value for one of the match attributes, it is treated as not matching (and created or skipped depending on `mode`).

Matching also works against records earlier in the same import, so duplicates within one file resolve to a single record.

## Modes (`mode`)

| mode | match found | no match |
|---|---|---|
| `upsert` (default) | update existing record | create new record |
| `update` | update existing record | skip record |
| `create` | skip record | create new record |

Updates only touch the attributes present in the JSON. Omitted attributes keep their current value; use `null` to explicitly clear a value.

## Sent Documents Are Immutable

For GoBD compliance, documents that have reached the customer (`dateSent` is set) cannot be modified by an import. This applies to all sendable types — `Invoice`, `CreditNote`, `PartialInvoice`, `PermanentInvoice`, `Estimate` — and covers:

- Updating attributes of a sent document — the record is skipped
- Updating items (`Cost`, `Note`, `Title`, …) that belong to a sent document — skipped
- Attaching new items to a sent document via relations — the imported item is discarded

Unsent documents (drafts) can be updated normally, and complete documents — including `dateSent` and their items — can still be created in a single import.

## Records

Each record has two keys:

- **attributes**: Dictionary of entity properties. Names match the Core Data attributes in [Entities.md](Entities.md).
- **relations**: Dictionary of relationships to other entities (optional).

### Attribute Values

- **Strings**: JSON strings
- **Numbers** (integer, float, decimal, boolean): JSON numbers — not strings
- **Dates**: strings in the format `yyyy-MM-dd'T'HH:mm:ssZ`, e.g. `"2026-07-01T00:00:00+0000"`
- **null**: clears the value

Unknown attribute names and values of the wrong type are skipped silently.

### Relations

Relation values are path strings. Two forms are supported:

- `"Entity/uid"` — reference by uid
- `"Entity/attribute=value"` — reference by any attribute

```json
{
    "attributes": {
        "number": "2026-0042",
        "name": "2026-0042"
    },
    "relations": {
        "parentDocument": "Client/clientID=K-1001"
    }
}
```

References resolve first against records in the same import, then against existing records in the database. To-many relationships take an array of path strings. Unresolvable references are left empty.

Records can reference each other regardless of their order in the file — relations are resolved in a second pass after all records exist.

## Complete Example

```json
{
    "format": "grandtotal-records",
    "version": 1,
    "name": "ACME Portal Sync",
    "description": "Clients and catalog items from the ACME portal",
    "language": "en",
    "entities": {
        "Client": {
            "match": ["clientID"],
            "mode": "upsert",
            "records": [
                {
                    "attributes": {
                        "clientID": "K-1001",
                        "organization": "ACME Corp",
                        "email": "billing@acme.com",
                        "address": "1 Main Street",
                        "zip": "10115",
                        "city": "Berlin",
                        "countryCode": "DE",
                        "taxID": "DE123456789"
                    }
                }
            ]
        },
        "CatalogItem": {
            "match": ["itemNumber"],
            "mode": "update",
            "records": [
                {
                    "attributes": {
                        "itemNumber": "A-100",
                        "name": "Consulting",
                        "unitPrice": 120.0
                    }
                }
            ]
        }
    }
}
```
