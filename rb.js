
var http = require('http'),req= require('request'),ds=require('./datastore.js');




var url ='http://www.redbus.in/booking/SearchResultsJSON.aspx/?fromcityid=%src%&fromcityname=Ahmedabad&tocityid=%dest%&tocityname=Mumbai&doj=%doj%&bustype=any&opId=0';

function get(srcid,destid,doj,callback){
//wget redbus json
//console.log(srcid+destid+doj);
req.get(formUrl(srcid,destid,doj), function(err,res,body) {
	//console.log("body"+body);
	console.log("result: %j",res);
	if(err != null)
	{
		return callback();
	}
data = JSON.parse(formValidJson(res.toJSON()['body']));
console.log("data"+data);
routes = data['data'];
//console.log("data"+data);
//console.log("got resp "+srcid+destid+doj)
ds.logRbRoutes(routes,srcid,destid,doj,callback);

 });

}
exports.get = get;
function formUrl(srcid,destid,doj){
	
url = url.replace(/%src%/gi,srcid);
url = url.replace(/%dest%/gi,destid);
url = url.replace(/%doj%/gi,doj);
//console.log("URL"+url)
return url;
}

function formValidJson(rawjson){
	rawjson = rawjson.replace('status', '\"status\"');
    rawjson = rawjson.replace('data', '\"data\"');
    return rawjson;
}

