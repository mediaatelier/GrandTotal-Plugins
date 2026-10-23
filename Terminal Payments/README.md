# Terminal Payment Plugins for GrandTotal

Terminal payment plugins take a card payment at a payment terminal for an open invoice. The plugin appears in the context menu of an invoice with an open balance as **Card payment via ‹name›**. GrandTotal shows a sheet with the amount, the plugin's status and a cancel button; once the terminal reports the payment, GrandTotal attaches it to the invoice.

Requires GrandTotal 10 with plan XL.

## Key Characteristics

- **Always the open amount**: the invoice's balance is charged, in the invoice's currency
- **Runs in the background**: the main function may block (polling with `sleep()`); the sheet stays responsive
- **GrandTotal books the payment**: the plugin only reports the result, it does not create records
- **Cancel**: the user's cancel arrives through `isCancelled()`; the plugin stops the terminal and answers

## Plugin Structure

```
SumUp.grandtotalplugin/
├── Info.plist
├── index.js
├── en.lproj/
│   └── Localizable.strings
└── de.lproj/
    └── Localizable.strings
```

## Info.plist

```xml
<key>types</key>
<array>
    <string>terminalpayment</string>
</array>
<key>mainFunction</key>
<string>pay</string>
<key>displayNames</key>
<dict>
    <key>terminalpayment</key>
    <string>SumUp</string>
</dict>
```

`displayNames.terminalpayment` is the name in the menu item and the sheet title. Credentials go into the `Globals` array (`password` fields are stored in the macOS keychain).

## index.js Contract

GrandTotal provides three globals:

| Global | Meaning |
| --- | --- |
| `payment` | `{amount, currency, reference, description, client}` — `amount` is the open balance as a number, `reference` the invoice number |
| `setStatus(text)` | Shows `text` in the sheet |
| `isCancelled()` | `true` once the user pressed Cancel |

The main function returns the result:

```js
function pay()
{
    setStatus(localize("Present the card on the terminal…"));
    // start the payment at the provider, then poll:
    while (true)
    {
        sleep(2);
        if (isCancelled())
        {
            // stop the terminal at the provider
            return {status: "cancelled"};
        }
        // ask the provider for the payment's state …
        if (paid)
        {
            return {status: "paid", amount: payment.amount, date: new Date(), notes: "Provider 1234"};
        }
    }
}
```

| Key | Meaning |
| --- | --- |
| `status` | `"paid"`, `"cancelled"` or `"failed"` |
| `amount` | Paid amount (optional, defaults to the open balance) |
| `date` | Date of the payment (optional, defaults to now) |
| `notes` | Notes of the payment, e.g. the provider's transaction code |
| `message` | For `"failed"`: shown in the sheet |
| `showSettings` | For `"failed"`: the sheet's button opens the plugin settings (missing credentials) |

`"paid"` adds the payment and closes the sheet, `"cancelled"` closes it, `"failed"` keeps it open with the message.

## Samples

- **[Terminal Simulator](Terminal%20Simulator.grandtotalplugin)** — walks through the steps of a terminal without one. The setting *Decline the card* makes it fail.
- **[SumUp](SumUp.grandtotalplugin)** — SumUp Solo through the [SumUp Cloud API](https://developer.sumup.com/terminal-payments/cloud-api). The result arrives by webhook at SumUp's end; a Mac cannot receive one, so the plugin polls the transaction by its `client_transaction_id`.

### SumUp setup

1. In the SumUp account under Settings › For Developers › Toolkit, create an API key and an Affiliate Key. The App ID given to the Affiliate Key goes into the plugin's *App ID* field (empty: `com.mediaatelier.GrandTotal3`).
2. On the Solo, open Connections › API › Connect and enter the code it shows as *Pairing code*. The plugin pairs the reader with the first payment.
3. With several readers, *Reader name* picks one.

The Cloud API supports the SumUp Solo only.
