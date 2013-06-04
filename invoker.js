//var mongoDb = require('./mongoDb.js');
var mysqlDb = require('./mysqlDb.js');
var async = require('async');

// temporarily added
var mysql = require('./mysql');
//mongoDb.createNewCappedModel('test2caps',10240,10000);

//function orchestrate(){

	async.waterfall(
		[mysqlDb.queryMysqlDb,mysql.writeToSSADb],function(res,err)
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




