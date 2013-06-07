
var mysql = require('mysql');


var connection = mysql.createConnection({
  host     : 'ss-db-staging.csqxivzy0twu.ap-southeast-1.rds.amazonaws.com',
  user     : 'ss_master_user',
  password : 'BackupInstance456',
  database: 'sstru1',
});


connection.connect(function(err)
	{
		console.log(err);
		if(err)
		{
		console.log('Error creating connection');
		}
		else
		{
			console.log('connection established');
		}

	});


exports.queryMysqlDb = queryMysqlDb;
// currently writing fixed query, change once aync.waterfall works
function queryMysqlDb(queryString,callback)
{
	console.log("Entering queryMysqlDb");
	console.log("Query",queryString);
connection.query(queryString, function(err, rows){
		if(err)
		{
		console.log('Error getting records',err);
		}
		else
		{
			console.log("records");
			//writeToSSADb(rows)
			connection.destroy();
			console.log(rows);
		    callback(null,rows);
			//connection.destroy();
			//console.log('connection ended');
			

		}
});
}
