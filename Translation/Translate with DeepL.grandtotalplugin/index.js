/*
	
	
*/


run();


function httpPOST(theUrl,body)
{
	header = {"Accept":"*/*","Content-Type":"application/x-www-form-urlencoded"};
	postBody = "auth_key=" + token + "&tag_handling=html&" + body;
	string = loadURL("POST",theUrl + "?auth_key=" + token,header,postBody);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}


function run()
{
	host = "api.deepl.com";
	if (account == "FREE")
	{
		host = "api-free.deepl.com";
	}
	languagesWithFormaility = ["DE","FR","IT","ES","NL","PL","PT-PT","PT-BR","RU"];
	formalityOption = "";
	if (languagesWithFormaility.indexOf(language) > -1)
	{
		formalityOption = "&formality=" + formality;
	}
	document = query().editableRecord();
	html = document.translationHTML();
 	body = "text=" + escape(html) + formalityOption  + "&target_lang=" + language;
	result = httpPOST("https://"+ host + "/v2/translate",body);
	if (result["translations"])
	{
		translated = result["translations"][0]["text"];
		document.setTranslationHTML(unescape(translated));
	}
}




