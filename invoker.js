//var mongoDb = require('./mongoDb.js');
var mysqlDb = require('./mysqlDb.js');
var async = require('async');

// temporarily added
var mysql = require('./mysql');
//mongoDb.createNewCappedModel('test2caps',10240,10000);

//function orchestrate(){

function queryString(callback)
{	
var queryString = 'SELECT SUM(a.bookedSeats) AS bs,a.source,b.rbMasterId as rbSource,c.destination,d.rbMasterId as rbDestination, LOCALTIME() as lastupdated FROM gds_routesdata a JOIN  sslocation_region b JOIN gds_routesdata c JOIN  sslocation_region d ON (a.source = b.id AND c.destination = d.id AND a.id = c.id) GROUP BY a.source,c.destination ORDER BY bs DESC LIMIT 10';
callback(null,queryString);

}
	async.waterfall(

		[ queryString,mysqlDb.queryMysqlDb,mysql.writeToSSADb],function(res,err)
		{
			if(err)
			{
				console.log("err" +  err);
			}
			else
			{
				console.log("Res length",res.length);
				console.log("Res :%j", res[0]);
			}
			
		});
/*[

function dummy(){
	
	forEachSeries(array,abc,callback){
	
	}
}

function abc(array.a){
	
}
function(callback) {
var gds = mysqlDb.queryMysqlDb(function(rows)
	{
		if(err)
		{
			finalCallback(err);
		}
		else
		{
			console.log("Rows", rows);
			callback(null, gds);	
		}
		
	});
//callback(null, gds);
//console.log("Record" + gds);

},

function(gds,callback) {
	console.log("gds" + gds);
mysql.writeToSSADb(gds);
		callback(null,null);
	
},

],




); */
//}

function finalCallback(err){
console.log(err);
}




