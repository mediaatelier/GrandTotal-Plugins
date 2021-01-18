/*
	Variables:
	
	document the GrandTotal document formed like the clipboard representation 
	
*/



createFile();


function createFile()
{

	var destinations = ["pdf"];
	
	//// Get all the Extra Values
	
	var ramBuyerReference = document["metaValues"]["ram:BuyerReference"];
	if (!ramBuyerReference)
	{
		ramBuyerReference = document["recipient"]["metaValues"]["ram:BuyerReference"];
	}
	if (!ramBuyerReference) // legacy
	{
		ramBuyerReference = document["customFields"]["ram:BuyerReference"];
	}
	if (!ramBuyerReference) // legacy
	{
		ramBuyerReference = document["recipient"]["customFields"]["ram:BuyerReference"];
	}
	
	
	var ramBuyerOrderReferencedDocumentIssuerAssignedID = document["metaValues"]["ram:BuyerOrderReferencedDocument:IssuerAssignedID"];
 	if (!ramBuyerOrderReferencedDocumentIssuerAssignedID)
	{
		ramBuyerOrderReferencedDocumentIssuerAssignedID = document["reference"];
	}
	
	
	var ramContractReferencedDocumentIssuerAssignedID = document["metaValues"]["ram:ContractReferencedDocument:IssuerAssignedID"];
	if (!ramContractReferencedDocumentIssuerAssignedID)  // legacy
	{
		ramContractReferencedDocumentIssuerAssignedID = document["customFields"]["ram:ContractReferencedDocument:IssuerAssignedID"];
	}
	
	
	var ramSellerID = document["recipient"]["metaValues"]["ram:SellerTradeParty:ID"];
	if (!ramSellerID)  // legacy
	{
		ramSellerID = document["recipient"]["customFields"]["ram:SellerID"];
	}
	
	
	var ramSpecifiedProcuringProjectID = document["metaValues"]["ram:SpecifiedProcuringProject:ID"];
	var ramSpecifiedProcuringProjectName = document["metaValues"]["ram:SpecifiedProcuringProject:Name"];

	
	
	if (ramBuyerReference)
	{
		destinations = ["mail","file"];
	}

	var source = {
  		_name: 'rsm:CrossIndustryInvoice',
  		_attrs: {
  			'xmlns:a' :  'urn:un:unece:uncefact:data:standard:QualifiedDataType:100',
    		'xmlns:rsm': 'urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100',
    		'xmlns:qdt': 'urn:un:unece:uncefact:data:standard:QualifiedDataType:10',
    		'xmlns:ram': 'urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100',
    		'xmlns:xs':  'http://www.w3.org/2001/XMLSchema',
    		'xmlns:udt': 'urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100'
 		 },
 		 _content: []
 	}
 	 	
 	 	
 	 	
 	var context = {
 		_name: 'rsm:ExchangedDocumentContext',
 		_content: [
 			{
 				_name: 'ram:GuidelineSpecifiedDocumentContextParameter',
 				_content: [
 					{
 						_name: 'ram:ID',
 						_content: 'urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_1.2'
 					}
 				]
 			}
 		]
 	}
 	 	
 	
 	var header = {
 		_name: 'rsm:ExchangedDocument',
 		_content: [
 			{
 				_name: 'ram:ID',
 				_content: document["name"]
 			},
 			{
 				_name: 'ram:TypeCode',
 				_content: 380
 			},
 			{
 				_name: 'ram:IssueDateTime',
 				_content: makeDateTime(document["dateSent"])
 			},
 			{
 				_name: 'ram:IncludedNote',
 				_content: [
 					{
 						_name: 'ram:Content',
 						_content: document["conditions"]
 					}
 				]
 			}
 		]
 	}
 	

 	
 	var seller = makeTradeParty(document["sender"],"SellerTradeParty",ramSellerID);
 	var recipient = makeTradeParty(document["recipient"],"BuyerTradeParty",undefined);
 	
 	
 	var agreementItems = [seller,recipient];
 	
 	if (ramBuyerReference)
 	{
 	 	var buyerreference = {
 	 		_name: 'ram:BuyerReference',
 	 		_content: ramBuyerReference
 	 	}
 		agreementItems = [buyerreference,seller,recipient];
 	}
 	

 	if (ramBuyerOrderReferencedDocumentIssuerAssignedID)
 	{
 	    var order = {
			_name: 'ram:BuyerOrderReferencedDocument',
			_content: [
				{
					_name: 'ram:IssuerAssignedID',
					_content: ramBuyerOrderReferencedDocumentIssuerAssignedID
				}
			]
		}

 		agreementItems.push(order);
 		
 	}
 	
 	if (ramContractReferencedDocumentIssuerAssignedID)
 	{
 		var contract = {
			_name: 'ram:ContractReferencedDocument',
			_content: [
				{
					_name: 'ram:IssuerAssignedID',
					_content: ramContractReferencedDocumentIssuerAssignedID
				}
			]
		}
 		agreementItems.push(contract);
 	}
 	
 	
 	for (var externalFileIndex in document["externalFiles"])
 	{
 		var externalFile = document["externalFiles"][externalFileIndex];
 		if (externalFile["metaValues"]["ram:AdditionalReferencedDocument:Include"])
 		{
 		
 			var aRecord = fetchRecordWithUID("ExternalFile",externalFile["uid"]);
 			var aData = aRecord.valueForKeyPath("data.base64EncodedString");
 			
 		
 			var attachment = {
				_name: 'ram:AdditionalReferencedDocument',
				_content: [
					{
						_name: 'ram:IssuerAssignedID',
						_content: externalFile["metaValues"]["ram:AdditionalReferencedDocument:IssuerAssignedID"]
					},
					{
						_name: 'ram:TypeCode',
						_content: "916"
					},
					{
						_name: 'ram:Name',
						_content: externalFile["name"]
					},
					{
						_name: 'ram:AttachmentBinaryObject',
						_attrs: {mimeCode:externalFile["mimeType"],filename:externalFile["fileName"]},
						_content: aData
					}
				]
			}
 			agreementItems.push(attachment);
 		}
 	}
 	
 	
 	
 	if (ramSpecifiedProcuringProjectID || ramSpecifiedProcuringProjectName)
 	{
 		var projectContent = [];
 		var project = {
			_name: 'ram:SpecifiedProcuringProject',
			_content: projectContent
		}
		
		projectContent.push(
			{
				_name: 'ram:ID',
				_content: ramSpecifiedProcuringProjectID
			}
		)
	
		projectContent.push(
			{
				_name: 'ram:Name',
				_content: ramSpecifiedProcuringProjectName
			}
		)
 		agreementItems.push(project);
 	}
 	
 	
 	
 	var ramSpecifiedProcuringProjectID = document["metaValues"]["ram:SpecifiedProcuringProject:ID"];
	var ramSpecifiedProcuringProjectName 
 	
 	
 	
 	var supplyChainTradeSettlement = {
		_name: 'ram:ApplicableHeaderTradeSettlement',
		_content: [
			{
				_name: 'ram:InvoiceCurrencyCode',
				_content: document["currency"]
			},
			{
				_name: 'ram:SpecifiedTradeSettlementPaymentMeans',
				_content: [
					{
						_name: 'ram:TypeCode',
						_content: '30'
					},
					{
						_name: 'ram:PayeePartyCreditorFinancialAccount',
						_content: [
							{
								_name: 'ram:IBANID',
								_content: document["sender"]["IBAN"]
							}
						]
					},
					{
						_name: 'ram:PayeeSpecifiedCreditorFinancialInstitution',
						_content: [
							{
								_name: 'ram:BICID',
								_content: document["sender"]["BIC"]
							}
						]
					}
				]
			}
		]
	}
	
 	var taxes = makeTaxes(document["taxes"]);
 	
 	supplyChainTradeSettlement["_content"].push(taxes);
 	
	var paymentTerms = {
		_name: 'ram:SpecifiedTradePaymentTerms',
		_content: [
			{
				_name : 'ram:Description',
				_content: document["conditions"]
			},
			{
				_name : 'ram:DueDateDateTime',
				_content: makeDateTime(document["dateDue"])
			}
		]
	} 
	
	if (document["recipient"]["SEPA"]["mandateID"])
	{
		var mandateID =  {
			_name: 'ram:DirectDebitMandateID',
			_content: document["recipient"]["SEPA"]["mandateID"]
		}
		paymentTerms["_content"].push(mandateID);
	}
	
	supplyChainTradeSettlement["_content"].push(paymentTerms);

 	
 	var values = {
 		_name: 'ram:SpecifiedTradeSettlementHeaderMonetarySummation',
 		_content : [
 			{
 				_name: 'ram:LineTotalAmount',
 				_content: document["netAsString"]
 			},
 			{
 				_name: 'ram:ChargeTotalAmount',
 				_content: 0
 			},
 			{
 				_name: 'ram:AllowanceTotalAmount',
 				_content: 0
 			},
 			{
 				_name: 'ram:TaxBasisTotalAmount',
 				_content: document["taxedNetAsString"]
 			},
 			{
 				_name: 'ram:TaxTotalAmount',
 				_attrs: {currencyID: document["currency"]},
 				_content: document["taxAsString"]
 			},
 			{
 				_name: 'ram:GrandTotalAmount',
 				_content: document["grossAsString"]
 			},
 			{
 				_name: 'ram:DuePayableAmount',
 				_content: document["grossAsString"]
 			}
 		]
 	}
 	
 	supplyChainTradeSettlement["_content"].push(values);

 	
 	var supplyChain = {
 		_name: 'rsm:SupplyChainTradeTransaction',
		_content: [
 			
 		]
 	}
 	
 	
 

 	
 	
 	appendTradeItems(document,supplyChain["_content"]);
 	

 	
 	var agreement = {
 		_name: 'ram:ApplicableHeaderTradeAgreement',
 		_content: agreementItems
 			
 	}
 	
 	
 	var delivery = {
		_name: 'ram:ApplicableHeaderTradeDelivery',
		_content: [
			{
				_name : 'ram:ActualDeliverySupplyChainEvent',
				_content: [
					{
						_name: 'ram:OccurrenceDateTime',
						_content: makeDateTime(document["dateSent"])
					}
				]
			}
		]
	} 
 	
 	
 	supplyChain["_content"].push(agreement);
 	supplyChain["_content"].push(delivery);
 	supplyChain["_content"].push(supplyChainTradeSettlement);


 	
 	
 	source["_content"] = [context,header,supplyChain];
 	
	var content = toXML(source,{header: true, indent: '  '});

	var result = {};
	result["files"] = [{
		"destinations" : destinations,
		"type" : "zugferd2",
		"content" : content,
		"name" : localize("zugferd-invoice.xml")
	}];
	return result;
}



function appendTradeItems(document,theArray)
{
	input = document["items"];
	
	for (i=0;i<input.length;i++)
	{
		var aItem = input[i];
		
		var unit = "C62";
		if (aItem["hasHourUnit"])
		{
			unit = "HUR";
		}
				

		var aTradeItem = {
			_name: 'ram:IncludedSupplyChainTradeLineItem',
			_content : [
				{
					_name: 'ram:AssociatedDocumentLineDocument',
					_content: [
						{
							_name: 'ram:LineID',
							_content: i+1
						}
					]
				},
				{
					_name: 'ram:SpecifiedTradeProduct',
					_content: [
						{
							_name: 'ram:Name',
							_content: aItem["name"]
						},
						,
						{
							_name: 'ram:Description',
							_content: aItem["description"]
						}
					]
				},
				{
					_name: 'ram:SpecifiedLineTradeAgreement',
					_content: [
						{
							_name: 'ram:NetPriceProductTradePrice',
							_content: [
								{
									_name: 'ram:ChargeAmount',
									_content: aItem["rateAsString"]
								}
							]
						}
					]
				},
				{
					_name: 'ram:SpecifiedLineTradeDelivery',
					_content: [
						{
							_name: 'ram:BilledQuantity',
							_attrs: {unitCode: unit},
							_content: aItem["quantity"]
						}
					]				
				},
				{
					_name: 'ram:SpecifiedLineTradeSettlement',
					_content: [
						{
							_name: 'ram:ApplicableTradeTax',
							_content: [
								{
									_name: 'ram:TypeCode',
									_content: 'VAT'
								},
								{
									_name: 'ram:CategoryCode',
									_content: 'S'
								},
								{
									_name: 'ram:RateApplicablePercent',
									_content: aItem["taxPercentageAsString"]
								}
							]
						},
						{
							_name: 'ram:SpecifiedTradeSettlementLineMonetarySummation',
							_content: [
								{
									_name: 'ram:LineTotalAmount',
									_content: aItem["netAsString"]
								}
							]
						}
					]	
				}
			]
		}
		theArray.push(aTradeItem);
	}	
}


function makeTaxes(input)
{
	result = [];
	for (i=0;i<input.length;i++)
	{
		var aItem = input[i];
		var aTax = {
			_name: 'ram:ApplicableTradeTax',
			_content : [
				{
					_name: 'ram:CalculatedAmount',
					_content: aItem["taxAsString"]
				},
				{
					_name: 'ram:TypeCode',
					_content: 'VAT'				
				},
				{
					_name: 'ram:BasisAmount',
					_content: aItem["netAsString"]
				},
				{
					_name: 'ram:CategoryCode',
					_content: 'S'				
				},
				{
					_name: 'ram:RateApplicablePercent',
					_content: aItem["rateAsString"]
				}
			]
		}
		result.push(aTax);
		
	}	
	return result;
}


function makeTradeParty(party,name,id)
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
	
	var result = {
		_name: 'ram:'+ name,
		_content : [
			{
				_name: 'ram:Name',
				_content: party["name"]
			},
			{
				_name: 'ram:DefinedTradeContact',
				_content: [
					{
						_name: 'ram:PersonName',
						_content: personname
					},
					{
						_name: 'ram:DepartmentName',
						_content: party["department"]
					},
					{
						_name: 'ram:TelephoneUniversalCommunication',
						_content: [
							{
								_name: 'ram:CompleteNumber',
								_content: party["phoneNumber"]
							}
						]
					},
					{
						_name: 'ram:EmailURIUniversalCommunication',
						_content: [
							{
								_name: 'ram:URIID',
								_content: party["email"]
							}
						]
					}
				]
			},
			{
				_name: 'ram:PostalTradeAddress',
				_content: [
					{
						_name: 'ram:PostcodeCode',
						_content: party["zip"]
					},
					{
						_name: 'ram:LineOne',
						_content: party["street"]
					},
					{
						_name: 'ram:CityName',
						_content: party["city"]
					},
					{
						_name: 'ram:CountryID',
						_content: party["countryCode"]
					}
				]
			}
		]
	} 
	
	
 	
 	if (party["taxNumber"])
 	{
 		var taxNumber = {
				_name: 'ram:SpecifiedTaxRegistration',
				_content: [
					{
						_name: 'ram:ID',
						_content: party["taxNumber"],
						_attrs: {
    						'schemeID': 'FC'
    					}
					}
				
				]
			}
			
		var content = result['_content'][2];
		content = [content].concat(taxNumber);
 	 	result['_content'][2] = content;
	}
	
	
	if (party["VATID"])
 	{
		var vatID = {
				_name: 'ram:SpecifiedTaxRegistration',
				_content: [
					{
						_name: 'ram:ID',
						_content: party["VATID"],
						_attrs: {
    						'schemeID': 'VA'
    					}
					}
				
				]
			}
			
		var content = result['_content'][2];
		content = [content].concat(vatID);
 	 	result['_content'][2] = content;
	}
	
	if (id)
 	{
 	 	var partyID = {
 	 		_name: 'ram:ID',
 	 		_content: id
 	 	}
 	 	
 	 	var content = result['_content'];
 	 	content = [partyID].concat(content);
 	 	result['_content'] = content;
 	}
			
 	return result;
 	
} 


function makeISOTime(input)
{
   var yyyy = input.getFullYear().toString();
   var mm = (input.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = input.getDate().toString();
   var date = yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
   date = date + "T00:00:00";
   return date;
}


function makeDateTime(input)
{

	if (!input) {
		return {};
	}
   var yyyy = input.getFullYear().toString();
   var mm = (input.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = input.getDate().toString();
   var date = yyyy + "" + (mm[1]?mm:"0"+mm[0]) + "" + (dd[1]?dd:"0"+dd[0]); // padding
   
	return {
		_name: 'udt:DateTimeString',
		_attrs: {
			format: 102
		},
		_content : date
	}
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



