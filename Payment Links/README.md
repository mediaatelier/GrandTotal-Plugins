# Payment Link Plugins for GrandTotal

Payment link plugins create an online payment link when an invoice is sent and render it as a QR code on the invoice. When the customer has paid, the plugin books the payment in GrandTotal automatically.

## Key Characteristics

- **Two entry points**: `com.mediaatelier.stripe.paymentlink` runs when a document is sent (create the link); `activateapplication` runs when GrandTotal becomes active (check for payments)
- **Layout element**: The Stripe QR element in the payment elements palette renders the link
- **Settings**: API key in Settings › Identification (stored in the macOS keychain); checkout options via the `Globals` array
- **Full circle**: link creation, payment, and booking all happen without user interaction

## Plugin Structure

```
StripePaymentLink.grandtotalplugin/
├── Info.plist
├── index.js
├── Icon.tiff
├── en.lproj/
│   └── Localizable.strings
└── de.lproj/
    └── Localizable.strings
```

## index.js Contract

```js
if (pluginType() == "activateapplication")
{
    checkPayments();   // poll the provider, book payments
}
else
{
    createLink();      // called when the document is sent
}
```

`createLink()` runs with the document as `query().editableRecord()` and must return an object with two keys — GrandTotal stores them as document meta values:

```js
return {
    id:  result["id"],   // stored as stripe_payment_link_id
    url: result["url"]   // stored as stripe_payment_link, rendered as QR code
};
```

`checkPayments()` fetches the open invoices via their meta values and creates `Payment` records:

```js
var unpaid = fetchRecords("MetaValue")
    .filter("name LIKE 'stripe_payment_link_id' AND document.balance != 0");

for (metaData of unpaid.records())
{
    // ask the provider's API whether the link was paid, then:
    var payment = insertRecord("Payment");
    payment.parentDocument = metaData.document;
    payment.amount = Math.round(metaData.document.balance * 100) / 100;
    payment.date = paidDate;
    displayUserNotification(localize("Stripe Payment"), metaData.document.client.displayName);
}
```

Read the API key from the keychain preference:

```js
function key()
{
    var keyRecord = fetchRecordWithUID("Preference", "GTPref.stripeAPIKey@keychain");
    return keyRecord ? keyRecord.payload : null;
}
```

## Checkout Options via Globals

Options declared in the `Globals` array show up in the plugin settings and are injected as JavaScript globals:

```xml
<key>Globals</key>
<array>
    <dict>
        <key>label</key>
        <string>Force SEPA Payments</string>
        <key>name</key>
        <string>forceSEPA</string>
        <key>type</key>
        <string>boolean</string>
    </dict>
</array>
```

For invoice amounts, percentage card fees add up quickly — offering an option to force flat-fee methods (SEPA, iDEAL) is good practice.

## Example

- **[StripePaymentLink](StripePaymentLink.grandtotalplugin/)** — Stripe payment links with `forceSEPA`/`forceIDEAL` options and automatic archiving of paid links.
