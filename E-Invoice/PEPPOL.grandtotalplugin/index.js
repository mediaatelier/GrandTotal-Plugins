/*
	Variables:
	
	document the GrandTotal document formed like the clipboard representation 
	
*/

var currencyAttr = {currencyID: document["currency"]};


createFile();


function createFile()
{

	var source = {
  		_name: 'Invoice',
  		_attrs: {
    		'xmlns':'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
    		'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2', 
    		'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
 		 },
 		 _content: []
 	}
 	
 	 	
 	
 	var header = [
 		{
 			_name: 'cbc:UBLVersionID',
			_content: '2.1'
		},
		{
 			_name: 'cbc:CustomizationID',
 			_attrs: {schemeID:'PEPPOL'},
			_content: 'urn:www.cenbii.eu:transaction:biicoretrdm010:ver1.0:#urn:www.peppol.eu:bis:peppol4a:ver1.0'
		},
		{
			_name: 'cbc:ProfileID',
			_content: 'urn:www.cenbii.eu:profile:bii04:ver1.0'
		},
		{
 			_name: 'cbc:ID',
			_content: document["name"]
		},
		{
			_name: 'cbc:IssueDate',
			_content: makeDateTime(document["dateSent"])
		},
		{
			_name: 'cbc:InvoiceTypeCode',
			_content: '380'
		},
		{
			_name: 'cbc:DocumentCurrencyCode',
			_content: document["currency"]
		},
		{
			_name: 'cac:OrderReference',
			_content: [
				{
					_name: 'cbc:ID',
					_content: document["reference"]
				}
			]
		}
 	];
 	
 	
 	appendItems(header,source["_content"]);
 	
 	

 	var seller = makeTradeParty(document["sender"],"AccountingSupplierParty");
 	var recipient = makeTradeParty(document["recipient"],"AccountingCustomerParty");
 	
 
 	
 	var supplierIDEntry = {
 		_name: 'cbc:CustomerAssignedAccountID',
 		_content: supplierID
 	}
 	
 	var customSupplierID = document["recipient"]["customFields"]["peppol:supplierID"];
 	
 	if (customSupplierID)
 	{
 		supplierIDEntry["_content"] = customSupplierID;
 	}
 	
 	seller["_content"].splice(0, 0, supplierIDEntry);
 	
 	source["_content"].push(seller);
 	source["_content"].push(recipient);
 	
 	var delivery = {
 		_name: 'cac:Delivery',
 		_content: [
 			{
 				_name: 'cbc:ActualDeliveryDate',
 				_content: makeDateTime(document["period"]["end"]) 
 			}
 		] 
 	}
 	
 	source["_content"].push(delivery);
 	
 	var paymentMeans = {
 		_name: 'cac:PaymentMeans',
 		_content: [
 			{
 				_name: 'cbc:PaymentMeansCode',
 				_content: '31'
 			},
 			{
 				_name: 'cbc:PaymentDueDate',
 				_content: makeDateTime(document["dateDue"])
 			},
 			{
 				_name: 'cbc:PaymentChannelCode',
 				_content: 'IBAN'
 			},
 			{
 				_name: 'cbc:InstructionNote',
 				_content: document["conditions"]
 			},
 			{
 				_name: 'cac:PayeeFinancialAccount',
 				_content: [
 					{
 						_name: 'cbc:ID',
 						_attrs: {schemeID:'IBAN'},
 						_content: document["sender"]["IBAN"]
 					},
 					{
 						_name: 'cac:FinancialInstitutionBranch',
 						_content: [
 							{
 							 	_name: 'cac:FinancialInstitution',
 							 	_content: [
 							 		{
 							 			_name: 'cbc:ID',
 							 			_attrs: {schemeID:'BIC'},
 							 			_content: document["sender"]["BIC"]
 							 		}
 							 	]
							}
 						]
 					}
 				]
 			}
 		]
 	};
 	
 	
 	source["_content"].push(paymentMeans);

 	
 	var paymentTerms = {
 		_name: 'cac:PaymentTerms',
 		_content: [
 			{
 				_name: 'cbc:Note',
 				_content: document["conditions"] 
 			}
 		]
 	}
 	
 	source["_content"].push(paymentTerms);
 	
 
 
 	var taxTotal = {
 		_name: 'cac:TaxTotal',
 		_content: [
 			{
 				_name: 'cbc:TaxAmount',
 				_attrs: currencyAttr,
 				_content: document["taxAsString"] 
 			}
 		]
 	}
 	
 	
 	appendTaxes(document["taxes"],taxTotal["_content"]);
 	source["_content"].push(taxTotal);
 	
 	var legalMonetaryTotal = {
 		_name: 'cac:LegalMonetaryTotal',
 		_content: [
 			{
 				_name: 'cbc:LineExtensionAmount',
 				_attrs: currencyAttr,
 				_content: document["netAsString"]
 			},
 			{
 				_name: 'cbc:TaxExclusiveAmount',
 				_attrs: currencyAttr,
 				_content: document["netAsString"]
 			},
 			{
 				_name: 'cbc:TaxInclusiveAmount',
 				_attrs: currencyAttr,
 				_content: document["grossAsString"]
 			},
 			{
 				_name: 'cbc:PayableAmount',
 				_attrs: currencyAttr,
 				_content: document["grossAsString"]
 			}
 		]
 	}
 	
 	source["_content"].push(legalMonetaryTotal);


 	appendLines(document["items"],source["_content"]);

 	
	var content = toXML(source,{header: true, indent: '  '});
	
	var prefix = "";
	if (document["label"])
	{
		prefix = prefix + document["label"] + " ";
	}
	if (document["name"])
	{
		prefix = prefix + document["name"] + " ";
	}
	
	prefix = sanitizeFileName(prefix);

	var result = {};
	result["files"] = [{
		"destination" : "mail",
		"content" : content,
		"name" : prefix+"PEPPOL.xml"
	}];
	return result;
}


function appendLines(input,theArray)
{
	for (i=0;i<input.length;i++)
	{
		var aItem = input[i];
		
		var aTaxes =  [
						{
							_name: 'cbc:TaxAmount',
							_attrs: currencyAttr,
							_content:  aItem["tax"] 
						}
					];
					
		aTaxes.push(createTaxesSubtotal(aItem));
			
		
		var aLineItem  = {
			_name: 'cac:InvoiceLine',
			_content: [
				{
					_name: 'cbc:ID',
					_content: i+1
				},
				{
					_name: 'cbc:InvoicedQuantity',
					_attrs: {unitCode:unitCodeForItem(aItem)},
					_content: aItem["quantityAsString"]
				},
				{
					_name: 'cbc:LineExtensionAmount',
					_attrs: currencyAttr,
					_content: aItem["netAsString"]
				},
				{
					_name: 'cac:OrderLineReference',
					_content: [
						{
							_name: 'cbc:LineID',
							_content: i+1 
						}
					]
				},
				{
					_name: 'cac:TaxTotal',
					_content:  aTaxes
				},
				{
					_name: 'cac:Item',
					_content: [
						{
							_name: 'cbc:Description',
							_content:  aItem["description"] 
						},
						{
							_name: 'cbc:Name',
							_content:  aItem["name"] 
						}
					]
				},
				{
					_name: 'cac:Price',
					_content: [
						{
							_name: 'cbc:PriceAmount',
							_attrs: currencyAttr,
							_content:  aItem["rateAsString"] 
						},
						{
							_name: 'cbc:BaseQuantity',
							_content:  1 
						}
					]
				}
			]
		}
		
		
		
		theArray.push(aLineItem);

	}
}


function unitCodeForItem(item)
{
	if (item["hasTimeUnit"] == 1) {
		return "LH";
	}
	else {
		return "C62";
	}
}

function appendTaxes(input,theArray)
{
	for (i=0;i<input.length;i++)
	{
		var aItem = input[i];
		
		
		aTaxItem = createTaxesSubtotal(aItem);
		theArray.push(aTaxItem);

 	}
		

	
 }
 
 
 function createTaxesSubtotal(aItem)
 {
 
	var aTaxItem  = {
		_name : 'cac:TaxSubtotal',
		_content: [ 
			{
				_name: 'cbc:TaxableAmount',
				_attrs: currencyAttr,
				_content: aItem["netAsString"]

			},
			{
				_name: 'cbc:TaxAmount',
				_attrs: currencyAttr,
				_content: aItem["taxAsString"]

			},
			{
				_name: 'cac:TaxCategory',
				_content: [
					{
						_name: 'cbc:ID',
						_attrs: {schemeAgencyID:'6',schemeID:'UN/ECE 5305'},
						_content: 'S'
					},
					{
						_name: 'cbc:Percent',
						_content: aItem["taxPercentageAsString"]
					},
					{
						_name: 'cac:TaxScheme',
						_content: [
							{
								_name: 'cbc:ID',
								_attrs: {schemeAgencyID:'6',schemeID:'UN/ECE 5153'},
								_content: 'VAT'
							}
						]
					}
				]
			}
		]
	}
	return aTaxItem;
}


function appendItems(input,theArray)
{
	for (i=0;i<input.length;i++)
	{
		var aItem = input[i];
		theArray.push(aItem);
	}
}


function makeTradeParty(party,name)
{

	var personname = "";
	
	if (party["firstName"])
	{
		personname = personname + party["firstName"];
	}
	if (party["lastName"])
	{
		if (party["firstName"]) {
			personname = personname + " ";
		}
		personname = personname + party["lastName"];
	}
	
	return {
		_name: 'cac:'+ name,
		_content : [
			{
				_name: 'cac:Party',
				_content: [
					{
						_name: 'cac:PartyName',
						_content: [
							{
								_name: 'cbc:Name',
								_content: party["name"]
							}
						]
					},
					{
						_name: 'cac:PostalAddress',
						_content: [
							{
								_name: 'cbc:StreetName',
								_content: party["street"]
							},
							{
								_name: 'cbc:CityName',
								_content: party["city"]
							},
							{
								_name: 'cbc:PostalZone',
								_content: party["zip"]
							},
							{
								_name: 'cac:Country',
								_content: [
									{
										_name: 'cbc:IdentificationCode',
										_content: party["countryCode"]
									}
								]
							}
						]
					},
					{
						_name: 'cac:PartyTaxScheme',
						_content: [
							{
								_name: 'cbc:CompanyID',
								_content: party["VATID"]
							},
							{
								_name: 'cac:TaxScheme',
								_content: [
									{
										_name: 'cbc:ID',
										_attrs: {schemeAgencyID:'6', schemeID:'UN/ECE 5153'},
										_content: 'VAT'
									}
								]
							}
					
						]
					},
					{
						_name: 'cac:Contact',
						_content: [
							{
								_name: 'cbc:ElectronicMail',
								_content: party["email"]
							}
				
						]
					},
						{
						_name: 'cac:Person',
						_content: [
							{
								_name: 'cbc:FirstName',
								_content: party["firstName"]
							},
							{
								_name: 'cbc:FamilyName',
								_content: party["lastName"]
							}
						]
					}
			
				]
			}
			
		]
	} 
} 


function makeDateTime(input)
{

	if (!input) {
		return {};
	}
   var yyyy = input.getFullYear().toString();
   var mm = (input.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = input.getDate().toString();
   var date = yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
	return date;
}



/*
The MIT License (MIT)
Copyright (c) 2014 by David Calhoun (david.b.calhoun@gmail.com).
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}


function toXML(obj, config)
{
  // include XML header
  config = config || {};
  var out = '';
  if(config.header) {
    if(typeof config.header == 'string') {
      out = config.header;
    } else {
      out = '<?xml version="1.0" encoding="UTF-8"?>\n';
    }
  }
  
  var origIndent = config.indent || '';
  var indent = '';
  var concat = ',';

  var filter = function customFilter(txt) {
    if(!config.filter) return txt;
    var mappings = config.filter;
    var replacements = [];
    for(var map in mappings) {
      if(!mappings.hasOwnProperty(map)) continue;
      replacements.push(map);
    }
    return String(txt).replace(new RegExp('(' + replacements.join('|') + ')', 'g'), function(str, entity) {
      return mappings[entity] || '';
    });
  };
  
  // helper function to push a new line to the output
  var push = function(string){
    out += string + (origIndent ? '\n' : '');
  };
  
  /* create a tag and add it to the output
     Example:
     outputTag({
       name: 'myTag',      // creates a tag <myTag>
       indent: '  ',       // indent string to prepend
       closeTag: true,     // starts and closes a tag on the same line
       selfCloseTag: true,
       attrs: {            // attributes
         foo: 'bar',       // results in <myTag foo="bar">
         foo2: 'bar2'
       }
     });
  */
  var outputTag = function(tag){
    var attrsString = '';
    var outputString = '';
    var attrs = tag.attrs || '';
    
    // turn the attributes object into a string with key="value" pairs
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)) {
        attrsString += ' ' + attr + '="' + attrs[attr] + '"';
      }
    }

    // assemble the tag
    outputString += (tag.indent || '') + '<' + (tag.closeTag ? '/' : '') + tag.name + (!tag.closeTag ? attrsString : '') + (tag.selfCloseTag ? '/' : '') + '>';
    
    // if the tag only contains a text string, output it and close the tag
    if(tag.text || tag.text === ''){
      outputString += filter(tag.text) + '</' + tag.name + '>';
    }
    
    push(outputString);
  };
  
  // custom-tailored iterator for input arrays/objects (NOT a general purpose iterator)
  var every = function(obj, fn, indent){
    // array
    //console.log(Array.isArray(obj))
    if(Array.isArray(obj)){
      obj.every(function(elt){  // for each element in the array
        fn(elt, indent);
        return true;            // continue to iterate
      });
      
      return;
    }
    
    // object with tag name
    if(obj._name){
      fn(obj, indent);
      return;
    }
    
    // iterable object
    for(var key in obj){
      var type = typeof obj[key];
      if(obj.hasOwnProperty(key) && (obj[key] || type === 'boolean' || type === 'number')){
        fn({_name: key, _content: obj[key]}, indent);
      //} else if(!obj[key]) {   // null value (foo:'')
      } else if(obj.hasOwnProperty(key) && obj[key] === null) {   // null value (foo:null)
        obj[key] = 'null';
        fn({_name: key, _content: obj[key]}, indent);       // output the keyname as a string ('foo')
      } else if(obj.hasOwnProperty(key) && obj[key] === '') {
        // blank string
        outputTag({
          name: key,
          text: ''
        });
      }
    }
  };
  
  var convert = function convert(input, indent){
    var type = typeof input;
    if(!indent) indent = '';
    if(Array.isArray(input)) type = 'array';
    
    var path = {
      'string': function(){
        push(indent + filter(escapeXml(input)) + ',');
      },

      'boolean': function(){
        push(indent + (input ? 'true' : 'false'));
      },
      
      'number': function(){
        push(indent + input);
      },
      
      'array': function(){
        every(input, convert, indent);
      },
      
      'function': function(){
        push(indent + input());
      },
      
      'object': function(){
        if(!input._name){
          every(input, convert, indent);
          return;
        }
        
        var outputTagObj = {
          name: input._name,
          indent: indent,
          attrs: input._attrs
        };
        
        var type = typeof input._content;

        if(type === 'undefined' || input._content._selfCloseTag === true){
          if (input._content && input._content._attrs) {
            outputTagObj.attrs = input._content._attrs;
          }
          outputTagObj.selfCloseTag = true;
          outputTag(outputTagObj);
          return;
        }
        
        var objContents = {
          'string': function(){
            outputTagObj.text = escapeXml(input._content);
            outputTag(outputTagObj);
          },

          'boolean': function(){
            outputTagObj.text = (input._content ? 'true' : 'false');
            outputTag(outputTagObj);
          },
          
          'number': function(){
            outputTagObj.text = input._content.toString();
            outputTag(outputTagObj);
          },
          
          'object': function(){  // or Array
            outputTag(outputTagObj);
            every(input._content, convert, indent + origIndent);
            
            outputTagObj.closeTag = true;
            outputTag(outputTagObj);
          },
          
          'function': function(){
            outputTagObj.text = input._content();  // () to execute the fn
            outputTag(outputTagObj);
          }
        };
        
        if(objContents[type]) objContents[type]();
      }
      
    };
    
    if(path[type]) path[type]();
  };
  
  convert(obj, indent);
  
  return out;
};



