# GrandTotal Entities Documentation

This document lists all entities with their attributes and relationships.

## Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **source**: To-One → Base (inverse: derivates)

---

## CatalogFileStorage

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **attach**: NSNumber
- **checkSum**: NSString
- **data**: NSData
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **catalogItem**: To-One → CatalogItem (inverse: files)
- **derivates**: To-Many → Base (inverse: source)
- **source**: To-One → Base (inverse: derivates)

---

## CatalogItem

**Inherits from:** Cost

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **comment**: NSString
- **costPrice**: NSNumber
- **dateCreation**: NSDate
- **defaultQuantity**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **ean**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **itemNumber**: NSString
- **name**: NSString
- **notes**: NSString
- **optional**: NSNumber
- **payInterval**: NSNumber
- **quantity**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **unit**: NSString
- **unitPrice**: NSNumber
- **unitPriceGross**: NSNumber
- **useGrossPrices**: NSNumber
- **weight**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **files**: To-Many → CatalogFileStorage (inverse: catalogItem)
- **image**: To-One → Image (inverse: items)
- **itemGroup**: To-One → ItemGroup (inverse: costs)
- **language**: To-One → Language (inverse: costs)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **taxRule**: To-One → TaxRule (inverse: costs)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Client

**Inherits from:** Contact

### Attributes

- **address**: NSString
- **archived**: NSNumber
- **bic**: NSString
- **checkSum**: NSString
- **city**: NSString
- **clientID**: NSString
- **countryCode**: NSString
- **dateCreation**: NSDate
- **department**: NSString
- **doNotClone**: NSNumber
- **email**: NSString
- **firstName**: NSString
- **iban**: NSString
- **id**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lastName**: NSString
- **middleName**: NSString
- **name**: NSString
- **notes**: NSString
- **organization**: NSString
- **payInterval**: NSNumber
- **phoneNumber**: NSString
- **preferredSendType**: NSNumber
- **rate**: NSNumber
- **salutation**: NSString
- **sendPluginIdentifier**: NSString
- **sepaCreditorID**: NSString
- **sepaMandateDate**: NSDate
- **sepaMandateID**: NSString
- **state**: NSString
- **subject**: NSString
- **taxID**: NSString
- **taxNumber**: NSString
- **title**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber
- **zip**: NSString

### Relationships

- **assignedDocuments**: To-Many → Document (inverse: contact)
- **childs**: To-Many → Container (inverse: parent)
- **clientGroup**: To-One → ClientGroup (inverse: clients)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **language**: To-One → Language (inverse: contacts)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## ClientGroup

**Inherits from:** Container

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **clients**: To-Many → Client (inverse: clientGroup)
- **derivates**: To-Many → Base (inverse: source)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)
- **taxRules**: To-Many → TaxRule (inverse: clientGroup)

---

## Contact

**Inherits from:** Document

### Attributes

- **address**: NSString
- **archived**: NSNumber
- **bic**: NSString
- **checkSum**: NSString
- **city**: NSString
- **clientID**: NSString
- **countryCode**: NSString
- **dateCreation**: NSDate
- **department**: NSString
- **doNotClone**: NSNumber
- **email**: NSString
- **firstName**: NSString
- **iban**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lastName**: NSString
- **middleName**: NSString
- **name**: NSString
- **notes**: NSString
- **organization**: NSString
- **payInterval**: NSNumber
- **phoneNumber**: NSString
- **preferredSendType**: NSNumber
- **rate**: NSNumber
- **salutation**: NSString
- **sendPluginIdentifier**: NSString
- **sepaCreditorID**: NSString
- **sepaMandateDate**: NSDate
- **sepaMandateID**: NSString
- **state**: NSString
- **subject**: NSString
- **taxID**: NSString
- **taxNumber**: NSString
- **title**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber
- **zip**: NSString

### Relationships

- **assignedDocuments**: To-Many → Document (inverse: contact)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **language**: To-One → Language (inverse: contacts)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Container

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)

---

## Cost

**Inherits from:** Item

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **costPrice**: NSNumber
- **dateCreation**: NSDate
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **ean**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **itemNumber**: NSString
- **name**: NSString
- **notes**: NSString
- **optional**: NSNumber
- **payInterval**: NSNumber
- **quantity**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **unit**: NSString
- **unitPrice**: NSNumber
- **useGrossPrices**: NSNumber
- **weight**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **itemGroup**: To-One → ItemGroup (inverse: costs)
- **language**: To-One → Language (inverse: costs)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **taxRule**: To-One → TaxRule (inverse: costs)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## CreditNote

**Inherits from:** Invoice

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **recurring**: NSNumber
- **recurringInterval**: NSNumber
- **recurringMode**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childInvoices**: To-Many → Invoice (inverse: parentInvoice)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **parentInvoice**: To-One → Invoice (inverse: childInvoices)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Currency

**Inherits from:** Container

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **code**: NSString
- **doNotClone**: NSNumber
- **format**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **rate**: NSNumber
- **symbol**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **documents**: To-Many → Document (inverse: currency)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)

---

## CustomField

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **set**: To-One → CustomFieldSet (inverse: fields)
- **source**: To-One → Base (inverse: derivates)
- **values**: To-Many → CustomValue (inverse: field)

---

## CustomFieldSet

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **fields**: To-Many → CustomField (inverse: set)
- **source**: To-One → Base (inverse: derivates)

---

## CustomValue

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **document**: To-One → Document (inverse: customValues)
- **field**: To-One → CustomField (inverse: values)
- **source**: To-One → Base (inverse: derivates)

---

## Document

**Inherits from:** Container

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## DocumentLabel

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **color**: NSString
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **type**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **documents**: To-Many → Document (inverse: documentLabels)
- **source**: To-One → Base (inverse: derivates)

---

## DynamicCost

**Inherits from:** Cost

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **cost**: NSNumber
- **costPrice**: NSNumber
- **dateCreation**: NSDate
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **ean**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **itemNumber**: NSString
- **name**: NSString
- **notes**: NSString
- **optional**: NSNumber
- **payInterval**: NSNumber
- **pluginIdentifier**: NSString
- **quantity**: NSNumber
- **rangeType**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **unit**: NSString
- **unitPrice**: NSNumber
- **useGrossPrices**: NSNumber
- **weight**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **itemGroup**: To-One → ItemGroup (inverse: costs)
- **language**: To-One → Language (inverse: costs)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **taxRule**: To-One → TaxRule (inverse: costs)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Estimate

**Inherits from:** Sendable

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## ExternalFile

**Inherits from:** Document

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **mailWithParentDocument**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **printWithParentDocument**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → ExternalFileStorage (inverse: externalFile)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## ExternalFileGroup

**Inherits from:** Document

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **mailWithParentDocument**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **printWithParentDocument**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## ExternalFileStorage

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **data**: NSData
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **externalFile**: To-One → ExternalFile (inverse: storage)
- **source**: To-One → Base (inverse: derivates)

---

## Financial

**Inherits from:** Document

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## FollowUp

**Inherits from:** Sendable

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **followUpType**: To-One → FollowUpType (inverse: followUps)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## FollowUpType

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **conditions**: NSData
- **doNotClone**: NSNumber
- **imageName**: NSString
- **includeParentInMail**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rules**: NSData
- **uid**: NSString
- **ungroupItems**: NSNumber
- **useCustomNumbering**: NSNumber

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **followUps**: To-Many → FollowUp (inverse: followUpType)
- **layout**: To-One → Layout (inverse: followUps)
- **source**: To-One → Base (inverse: derivates)

---

## Group

**Inherits from:** Item

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **excludeFromTotal**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **showSubTotal**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Image

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **data**: NSData
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **items**: To-Many → Item (inverse: image)
- **source**: To-One → Base (inverse: derivates)

---

## ImportRule

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **field**: NSString
- **name**: NSString
- **notes**: NSString
- **operator**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **itemGroup**: To-One → ItemGroup (inverse: importRules)
- **source**: To-One → Base (inverse: derivates)

---

## InternalNote

**Inherits from:** Note

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Invoice

**Inherits from:** Sendable

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **recurring**: NSNumber
- **recurringInterval**: NSNumber
- **recurringMode**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childInvoices**: To-Many → Invoice (inverse: parentInvoice)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **parentInvoice**: To-One → Invoice (inverse: childInvoices)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Item

**Inherits from:** Document

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## ItemGroup

**Inherits from:** Container

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **revenueAccount**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **costs**: To-Many → Cost (inverse: itemGroup)
- **derivates**: To-Many → Base (inverse: source)
- **importRules**: To-Many → ImportRule (inverse: itemGroup)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)
- **taxGroup**: To-One → TaxGroup (inverse: itemGroups)

---

## Key

**Inherits from:** Preference

### Attributes

- **archived**: NSNumber
- **category**: NSString
- **checkSum**: NSString
- **data**: NSData
- **date**: NSDate
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **number**: NSNumber
- **string**: NSString
- **type**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)

---

## Language

**Inherits from:** Document

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **contacts**: To-Many → Contact (inverse: language)
- **costs**: To-Many → Cost (inverse: language)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Layout

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **classes**: NSString
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **paperFormat**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **documents**: To-Many → Document (inverse: layout)
- **estimateDocuments**: To-Many → Document (inverse: estimateLayout)
- **followUps**: To-Many → FollowUpType (inverse: layout)
- **source**: To-One → Base (inverse: derivates)
- **statementDocuments**: To-Many → Document (inverse: statementLayout)
- **storage**: To-One → LayoutStorage (inverse: layout)

---

## LayoutStorage

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **data**: NSData
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **layout**: To-One → Layout (inverse: storage)
- **source**: To-One → Base (inverse: derivates)

---

## MetaValue

**Inherits from:** Preference

### Attributes

- **archived**: NSNumber
- **category**: NSString
- **checkSum**: NSString
- **data**: NSData
- **date**: NSDate
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **number**: NSNumber
- **string**: NSString
- **type**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **document**: To-One → Document (inverse: metaValues)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)

---

## Note

**Inherits from:** Item

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Option

**Inherits from:** Title

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **mode**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## PageBreak

**Inherits from:** Item

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## PartialInvoice

**Inherits from:** Invoice

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **partialPortion**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **recurring**: NSNumber
- **recurringInterval**: NSNumber
- **recurringMode**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childInvoices**: To-Many → Invoice (inverse: parentInvoice)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **parentInvoice**: To-One → Invoice (inverse: childInvoices)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Payment

**Inherits from:** Financial

### Attributes

- **amount**: NSNumber
- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## PaymentType

**Inherits from:** Container

### Attributes

- **accountHolder**: NSString
- **archived**: NSNumber
- **bic**: NSString
- **checkSum**: NSString
- **conditions**: NSData
- **doNotClone**: NSNumber
- **excludeFromDirectDebit**: NSNumber
- **excludeFromStatistics**: NSNumber
- **iban**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **type**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **documents**: To-Many → Document (inverse: paymentType)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)

---

## PermanentInvoice

**Inherits from:** Invoice

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateEnd**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **recurring**: NSNumber
- **recurringInterval**: NSNumber
- **recurringMode**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childInvoices**: To-Many → Invoice (inverse: parentInvoice)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **parentInvoice**: To-One → Invoice (inverse: childInvoices)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## PermanentInvoiceRepetition

**Inherits from:** PermanentInvoice

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateEnd**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **recurring**: NSNumber
- **recurringInterval**: NSNumber
- **recurringMode**: NSNumber
- **reference**: NSString
- **sequence**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childInvoices**: To-Many → Invoice (inverse: parentInvoice)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **parentInvoice**: To-One → Invoice (inverse: childInvoices)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Preference

**Inherits from:** Container

### Attributes

- **archived**: NSNumber
- **category**: NSString
- **checkSum**: NSString
- **data**: NSData
- **date**: NSDate
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **number**: NSNumber
- **string**: NSString
- **type**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)

---

## Profile

**Inherits from:** Contact

### Attributes

- **address**: NSString
- **archived**: NSNumber
- **bic**: NSString
- **checkSum**: NSString
- **city**: NSString
- **clientID**: NSString
- **countryCode**: NSString
- **dateCreation**: NSDate
- **department**: NSString
- **doNotClone**: NSNumber
- **email**: NSString
- **firstName**: NSString
- **iban**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lastName**: NSString
- **middleName**: NSString
- **name**: NSString
- **notes**: NSString
- **organization**: NSString
- **payInterval**: NSNumber
- **phoneNumber**: NSString
- **preferredSendType**: NSNumber
- **rate**: NSNumber
- **salutation**: NSString
- **sendPluginIdentifier**: NSString
- **sepaCreditorID**: NSString
- **sepaMandateDate**: NSDate
- **sepaMandateID**: NSString
- **state**: NSString
- **subject**: NSString
- **taxID**: NSString
- **taxNumber**: NSString
- **title**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber
- **zip**: NSString

### Relationships

- **assignedDocuments**: To-Many → Document (inverse: contact)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **language**: To-One → Language (inverse: contacts)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Project

**Inherits from:** Document

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **number**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## SectionEnd

**Inherits from:** Item

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Sendable

**Inherits from:** Financial

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## SendableStorage

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **data**: NSData
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **sendable**: To-One → Sendable (inverse: storage)
- **source**: To-One → Base (inverse: derivates)
- **transcript**: To-One → Transcript (inverse: storage)

---

## SendableTemplate

**Inherits from:** Sendable

### Attributes

- **archived**: NSNumber
- **cachedBalance**: NSNumber
- **cachedCost**: NSNumber
- **cachedCostWithTaxes**: NSNumber
- **checkSum**: NSString
- **completeMode**: NSNumber
- **customRangeEnd**: NSDate
- **customRangeStart**: NSDate
- **dateCreation**: NSDate
- **dateDue**: NSDate
- **dateSent**: NSDate
- **deliveryType**: NSNumber
- **discount**: NSNumber
- **doNotClone**: NSNumber
- **footnote**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lead**: NSString
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **reference**: NSString
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **updateFromCatalogItems**: NSNumber
- **useCustomRange**: NSNumber
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **storage**: To-One → SendableStorage (inverse: sendable)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## SmartList

**Inherits from:** Container

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **predicate**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)

---

## SubTotal

**Inherits from:** Item

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## SummaryCost

**Inherits from:** Cost

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **costPrice**: NSNumber
- **dateCreation**: NSDate
- **discount**: NSNumber
- **displayType**: NSNumber
- **doNotClone**: NSNumber
- **ean**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **itemNumber**: NSString
- **name**: NSString
- **notes**: NSString
- **optional**: NSNumber
- **payInterval**: NSNumber
- **quantity**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **subtotal**: NSNumber
- **toDo**: NSNumber
- **uid**: NSString
- **unit**: NSString
- **unitPrice**: NSNumber
- **useGrossPrices**: NSNumber
- **weight**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **itemGroup**: To-One → ItemGroup (inverse: costs)
- **language**: To-One → Language (inverse: costs)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **taxRule**: To-One → TaxRule (inverse: costs)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## TaxGroup

**Inherits from:** Container

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **shortName**: NSString
- **uid**: NSString

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **derivates**: To-Many → Base (inverse: source)
- **itemGroups**: To-Many → ItemGroup (inverse: taxGroup)
- **parent**: To-One → Container (inverse: childs)
- **source**: To-One → Base (inverse: derivates)
- **taxRules**: To-Many → TaxRule (inverse: taxGroup)

---

## TaxRule

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **tax1mode**: NSNumber
- **tax1name**: NSString
- **tax1value**: NSNumber
- **tax2mode**: NSNumber
- **tax2name**: NSString
- **tax2value**: NSNumber
- **tax3mode**: NSNumber
- **tax3name**: NSString
- **tax3value**: NSNumber
- **taxExemptionCode**: NSString
- **uid**: NSString

### Relationships

- **clientGroup**: To-One → ClientGroup (inverse: taxRules)
- **costs**: To-Many → Cost (inverse: taxRule)
- **derivates**: To-Many → Base (inverse: source)
- **source**: To-One → Base (inverse: derivates)
- **taxGroup**: To-One → TaxGroup (inverse: taxRules)

---

## TeamMember

**Inherits from:** Contact

### Attributes

- **address**: NSString
- **archived**: NSNumber
- **bic**: NSString
- **checkSum**: NSString
- **city**: NSString
- **clientID**: NSString
- **countryCode**: NSString
- **dateCreation**: NSDate
- **department**: NSString
- **doNotClone**: NSNumber
- **email**: NSString
- **firstName**: NSString
- **iban**: NSString
- **internalReference**: NSString
- **isDefault**: NSNumber
- **lastName**: NSString
- **middleName**: NSString
- **name**: NSString
- **notes**: NSString
- **organization**: NSString
- **payInterval**: NSNumber
- **phoneNumber**: NSString
- **preferredSendType**: NSNumber
- **rate**: NSNumber
- **salutation**: NSString
- **sendPluginIdentifier**: NSString
- **sepaCreditorID**: NSString
- **sepaMandateDate**: NSDate
- **sepaMandateID**: NSString
- **signature**: NSData
- **state**: NSString
- **subject**: NSString
- **taxID**: NSString
- **taxNumber**: NSString
- **title**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber
- **zip**: NSString

### Relationships

- **assignedDocuments**: To-Many → Document (inverse: contact)
- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **language**: To-One → Language (inverse: contacts)
- **layout**: To-One → Layout (inverse: documents)
- **memberDocuments**: To-Many → Document (inverse: teamMember)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Title

**Inherits from:** Item

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **dateCreation**: NSDate
- **doNotClone**: NSNumber
- **internalReference**: NSString
- **isDefault**: NSNumber
- **name**: NSString
- **notes**: NSString
- **payInterval**: NSNumber
- **rate**: NSNumber
- **subject**: NSString
- **toDo**: NSNumber
- **uid**: NSString
- **useGrossPrices**: NSNumber

### Relationships

- **childs**: To-Many → Container (inverse: parent)
- **contact**: To-One → Contact (inverse: assignedDocuments)
- **currency**: To-One → Currency (inverse: documents)
- **customValues**: To-Many → CustomValue (inverse: document)
- **derivates**: To-Many → Base (inverse: source)
- **documentLabels**: To-Many → DocumentLabel (inverse: documents)
- **documents**: To-Many → Document (inverse: parentDocument)
- **estimateLayout**: To-One → Layout (inverse: estimateDocuments)
- **image**: To-One → Image (inverse: items)
- **layout**: To-One → Layout (inverse: documents)
- **metaValues**: To-Many → MetaValue (inverse: document)
- **parent**: To-One → Container (inverse: childs)
- **parentDocument**: To-One → Document (inverse: documents)
- **paymentType**: To-One → PaymentType (inverse: documents)
- **source**: To-One → Base (inverse: derivates)
- **statementLayout**: To-One → Layout (inverse: statementDocuments)
- **teamMember**: To-One → TeamMember (inverse: memberDocuments)

---

## Transcript

**Inherits from:** Base

### Attributes

- **archived**: NSNumber
- **checkSum**: NSString
- **date**: NSDate
- **doNotClone**: NSNumber
- **name**: NSString
- **notes**: NSString
- **operation**: NSString
- **recordData**: NSData
- **type**: NSString
- **uid**: NSString

### Relationships

- **derivates**: To-Many → Base (inverse: source)
- **source**: To-One → Base (inverse: derivates)
- **storage**: To-One → SendableStorage (inverse: transcript)

---

