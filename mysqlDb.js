
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
function queryMysqlDb(callback)
{
	console.log("Entering queryMysqlDb");
connection.query('SELECT SUM(a.bookedSeats) AS bs,a.source,b.rbMasterId as rbSource,c.destination,d.rbMasterId as rbDestination, LOCALTIME() as lastupdated FROM gds_routesdata a JOIN  sslocation_region b JOIN gds_routesdata c JOIN  sslocation_region d ON (a.source = b.id AND c.destination = d.id AND a.id = c.id) GROUP BY a.source,c.destination ORDER BY bs DESC LIMIT 10', function(err, rows){
		if(err)
		{
		console.log('Error getting records');
		}
		else
		{
			
			//writeToSSADb(rows)
			connection.destroy();
			console.log(rows);
		    callback(null,rows);
			//connection.destroy();
			//console.log('connection ended');
			

		}
});
}
