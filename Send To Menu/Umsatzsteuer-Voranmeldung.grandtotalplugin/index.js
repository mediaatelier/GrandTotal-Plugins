/* global items:false, url:false, writeToURL:false */

(function (invoices, exportFilename) {
  const renderOutput = (dates, exportedTaxes) => {
    const unindent = str => str.replace(/^ +/gm, '')
    const localizeNumber = number => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number)
    const localizeDate = date => new Intl.DateTimeFormat('de-DE').format(date)

    let output = unindent(`
      Umsatzsteuer-Voranmeldung (${localizeDate(dates[0])} – ${localizeDate(dates[dates.length - 1])})
      =========================

      4 - Lieferungen und sonstige Leistungen (steuerpflichtige Umsätze)


      Bemessungsgrundlage ohne Umsatzsteuer (Euro)                Steuer (Euro, Cent)
    `)

    if (exportedTaxes['19']) {
      output += unindent(`
        zum Steuersatz von 19 Prozent (Kennzahl 81):
        ${localizeNumber(exportedTaxes['19'].net).padEnd(60, ' ')}${localizeNumber(exportedTaxes['19'].tax)}
      `)
    }

    if (exportedTaxes['7']) {
      output += unindent(`
        zum Steuersatz von 7 Prozent(Kennzahl 86):
        ${localizeNumber(exportedTaxes['7'].net).padEnd(60, ' ')}${localizeNumber(exportedTaxes['7'].tax)}
      `)
    }

    return output
  }

  let dates = []
  const exportedTaxes = {}

  for (const invoice of invoices) {
    dates.push(new Date(invoice.datePaid))
    invoice.taxes.forEach(tax => {
      if (!exportedTaxes[tax.rateAsString]) {
        exportedTaxes[tax.rateAsString] = { net: 0, tax: 0 }
      }

      exportedTaxes[tax.rateAsString].net += tax.net
      exportedTaxes[tax.rateAsString].tax += tax.tax
    })
  }

  dates = dates.sort((a, b) => a.getTime() - b.getTime())
  writeToURL(renderOutput(dates, exportedTaxes), exportFilename)
})(items, url)
