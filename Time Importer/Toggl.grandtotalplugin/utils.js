Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};


function httpGetJSON(theUrl)
{
	
	header = {Authorization:'Basic ' + base64Encode(token + ':api_token')};
	string = loadURL("GET",theUrl,header);
	if (string.length == 0)
	{
		return null;
	}
	return JSON.parse(string);
}