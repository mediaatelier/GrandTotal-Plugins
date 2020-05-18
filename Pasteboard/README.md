## GrandTotal Pasteboard Plugins
### Convert the contents of NSPasteboard to invoice (or estimate) items
 * Declare the pasteboard types you support in the info.plist. 
 * In the js, get the contents of the types from the pasteBoard["PasteBoardType"] object (xml contents is translated to json if possible.)
 * Create GrandTotal objects using insertRecord("Cost"). Allowed entities are Cost, Title, SubTotal, PageBreak, Note
 * Populate the attributes using record.setValueForKey(value,"attributeName")
 * return an array of the created records
 
 Keep in mind, that if you grab NSStringPboardType, you will override the default implementation. Return an empty array to pass to the built in parser.
 

