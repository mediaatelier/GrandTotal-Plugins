## GrandTotal E-Invoice Plugins

**⚠️ IMPORTANT WARNING**: The sample E-Invoice plugins provided are likely outdated and are **NOT guaranteed to output valid XML** according to current standards (ZUGFeRD, EN16931, XRechnung, etc.). These samples serve as implementation examples only. You MUST:

- Validate all generated XML against the current official specifications
- Test thoroughly with actual validation tools
- Update the code to match current standard versions
- Consult official documentation for your target e-invoice format
- Consider these samples as starting points, not production-ready code

E-Invoice standards change frequently. Always verify compliance with the latest version.

---

## How E-Invoice Plugins Work

Installed in the client settings, these plugins generate electronic invoice files (typically XML) that are either embedded in the PDF or attached to emails.

The plugin must return an array of files:

```javascript
var result = {};
result["files"] = [{
    "destination": "mail",
    "content": contents,
    "name": "Filename.xml"
}];
return result;
```

### Valid Destinations

```
pdf  - The file is embedded in the PDF
mail - The file is attached alongside the PDF
```

## Validation Required

Before using any e-invoice plugin in production:

1. **Validate XML output** against official validators
2. **Test with receiving systems** to ensure acceptance
3. **Check compliance** with current legal requirements
4. **Update regularly** as standards evolve
5. **Consult official specs** for your country/format:
   - ZUGFeRD: https://www.ferd-net.de/
   - EN16931 / XRechnung: https://www.xeinkauf.de/
   - Peppol: https://peppol.org/

## Disclaimer

The sample plugins are provided as implementation examples. MediaAtelier and plugin authors are not responsible for invalid or non-compliant e-invoice output. Users are solely responsible for ensuring compliance with applicable standards and regulations.
