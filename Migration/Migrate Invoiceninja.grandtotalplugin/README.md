# Invoice Ninja Migration Plugin für GrandTotal

Importiert Kunden und Produkte von Invoice Ninja v5 nach GrandTotal.

## Installation

1. Kopiere `Invoiceninja.grandtotalplugin` in das GrandTotal Plugins-Verzeichnis
2. Starte GrandTotal neu

## Konfiguration

### API-Token generieren

**Für gehostete Version (invoicing.co):**
1. Melde dich bei https://invoicing.co an
2. Gehe zu Einstellungen → API Tokens
3. Erstelle einen neuen API-Token
4. Kopiere den Token

**Für selbst-gehostete Installation:**
1. Melde dich bei deiner Invoice Ninja Installation an
2. Gehe zu Einstellungen → API Tokens
3. Erstelle einen neuen API-Token
4. Kopiere den Token

### Base URL anpassen (nur für selbst-gehostete Installationen)

Wenn du eine selbst-gehostete Invoice Ninja Installation verwendest, musst du die Base URL in `index.js` anpassen:

1. Öffne `Invoiceninja.grandtotalplugin/index.js`
2. Suche nach Zeile ~271: `var baseUrl = "https://invoicing.co";`
3. Ändere die URL zu deiner Installation, z.B.:
   - `var baseUrl = "https://demo.invoiceninja.com";` (für Demo)
   - `var baseUrl = "https://invoice.deine-firma.de";` (für eigene Domain)

## Verwendung

1. In GrandTotal: Wähle Menü → Migration → Invoice Ninja
2. Gib deinen API-Token ein
3. Der Import startet automatisch

## Was wird importiert?

### Kunden (Clients)
- Firmenname
- Kontaktpersonen (Vorname, Nachname, E-Mail, Telefon)
- Kundennummer
- USt-ID / Steuernummer
- Website
- Adresse (Straße, Stadt, PLZ, Bundesland, Land)
- Ländercodes (automatisch von numerischer ID zu ISO 3166-2 konvertiert, z.B. "4" → "AF")
- Notizen (öffentlich und privat)

### Produkte (CatalogItem)
- Produktnummer / Produkt-Key
- Beschreibung
- Verkaufspreis
- Einkaufspreis
- Steuersatz
- Standardmenge (als Notiz)

## Preisformat

**WICHTIG:** Die Invoice Ninja API gibt Preise als Integer-Werte zurück.

Beispiel: `"price": 331`

Dies kann bedeuten:
- **331.00** in deiner Währung (Standard-Interpretation)
- **3.31** in deiner Währung (falls Preise in Cents gespeichert werden)

### Wenn deine Preise um Faktor 100 zu hoch sind:

1. Öffne `index.js`
2. Suche nach Zeile ~223-225 und ~230-232
3. Entferne die Kommentare (`//`) bei den "cents" Zeilen:

```javascript
// Ändere dies:
attributes.unitPrice = parseFloat(product.price) || 0;

// Zu diesem:
attributes.unitPrice = (parseFloat(product.price) || 0) / 100;
```

## Pagination

Das Plugin holt automatisch alle Kunden und Produkte über mehrere Seiten hinweg (100 Einträge pro Request).

## Fehlerbehandlung

Bei Problemen prüfe:
1. Ist der API-Token korrekt?
2. Stimmt die Base URL (bei selbst-gehosteter Installation)?
3. Hast du Netzwerkverbindung?
4. Sind die Preise korrekt (siehe "Preisformat" oben)?

## Technische Details

- **API-Version:** Invoice Ninja v5
- **Authentifizierung:** X-API-TOKEN Header
- **Endpoints:**
  - `/api/v1/statics` - Länder-Mapping (ID → ISO-Code)
  - `/api/v1/clients` - Kundendaten
  - `/api/v1/products` - Produktdaten
- **Pagination:** Automatisch mit 100 Einträgen pro Seite
- **Country Mapping:** Konvertiert numerische Länder-IDs automatisch zu ISO 3166-2 Codes

## Support

Bei Problemen erstelle ein Issue auf GitHub oder kontaktiere den Support.
