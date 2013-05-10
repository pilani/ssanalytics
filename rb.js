
var http = require('http'),req= require('request'),ds=require('./datastore.js');




var url ='http://www.redbus.in/booking/SearchResultsJSON.aspx/?fromcityid=%src%&fromcityname=Ahmedabad&tocityid=%dest%&tocityname=Mumbai&doj=%doj%&bustype=any&opId=0';

function get(sDdj,callback){
//wget redbus json
console.log(sDdj);
req.get(formUrl(sDdj.srcid,sDdj.destid,sDdj.doj), function(err,res,body) {
data = JSON.parse(formValidJson(res.toJSON()['body']));
routes = data['data'];
console.log("got resp "+sDdj)
ds.logRbRoutes(routes,callback);

 });

}
exports.get = get;
function formUrl(srcid,destid,doj){
	
url = url.replace(/%src%/gi,srcid);
url = url.replace(/%dest%/gi,destid);
url = url.replace(/%doj%/gi,doj);
return url;
}

function formValidJson(rawjson){
	rawjson = rawjson.replace('status', '\"status\"');
    rawjson = rawjson.replace('data', '\"data\"');
    return rawjson;
}

