var mysql = require('mysql');
cfg = require('./config.js').config;
var mongoose = require('mongoose');
Schema = mongoose.Schema;
//console.log(mysql);
var connection = mysql.createConnection({
  host     : 'ss-db-staging.csqxivzy0twu.ap-southeast-1.rds.amazonaws.com',
  user     : 'ss_master_user',
  password : 'BackupInstance456',
  database: 'sstru1',
});
console.log(connection);
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

var gds = connection.query('SELECT source,destination,boAccount from gds_routesdata', function(err, rows){
	console.log(err);
		if(err)
		{
		console.log('Error getting records');
		}
		else
		{
			console.log(rows);
			writeToSSADb(rows);
			connection.destroy();
			console.log('connection ended');
		}
});
		

/*var gdsschema =  new Schema({
    name: String
});
console.log(gdsschema);


mongoose.connect('mongodb://'+cfg["MONGO_URL"],function(err){
	if(err){
		console.log(" Error occured.......");
	}
	else{

        mongoose.model('gdsOperators',gdsschema);
        var gdsop = mongoose.model('gdsOperators');
		console.log("Schema is created...");
	}
});*/

function writeToSSADb(gds)
{

var mongoose = require('mongoose');
mongoose.connect('mongodb://'+cfg["MONGO_URL"]);

var schema = mongoose.Schema({ source: 'string' , destination: 'string' ,boaccount: 'string' });
var Event = mongoose.model('gdsOperators', schema);


//Useful when creating a new collection -- check with Pradeep
/*var event1= new Event({ boaccount: '57823746' });
event1.save(function (err) {
  if (err) // ...
  console.log('meow');*/


Event.collection.insert(gds,{},function(err){
    
   		if(err){
   			//console.log(event1);
    	console.log(" error in flushing to mongo "+err);
    	callback();
   		}else{ 
   			console.log(" successfully flushed to mongo:"+gds);
   		 }
   			
 		});
mongoose.connection.close();
}



/*mongoose.connect('mongodb://'+cfg["MONGO_URL"],function(err){
    if(err){
        console.log("error in connecting to mongo"+err.stack)
        
    }else 
    { 
    	console.log (" connection to mongo succesfull")
		var gdsop = mongoose.model('gdsOperators');
		gdsop.collection.insert(gdsoperators,{},function(err){
    
   		if(err){
    	console.log(" error in flushing to mongo "+err);
   		}else{ 
   			console.log(" successfully flished to mongo:"+gdsoperators)
   		 };
   			callback();
 		});
	 };
});*/


function callback()
{
	console.log("Done");
}




