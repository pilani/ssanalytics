var mysql = require('mysql');
cfg = require('./config.js').config;
rb=require('./rb.js');
var mongoose = require('mongoose');
Schema = mongoose.Schema;
//console.log(mysql);
//require('http').createServer().listen('8080');
//giving unclosed connectnon error
db = mongoose.connect('mongodb://'+cfg["MONGO_URL"]);

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

var gds = connection.query('SELECT source,destination from gds_routesdata group by source,destination', function(err, rows){
  console.log(err);
    if(err)
    {
    console.log('Error getting records');
    }
    else
    {
      //console.log(rows);
      writeToSSADb(rows)
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


var schema = mongoose.Schema({ source: 'string' , destination: 'string' ,boaccount: 'string' });
var Event = mongoose.model('gdsoperators', schema);


//Useful when creating a new collection -- check with Pradeep
/*var event1= new Event({ boaccount: '57823746' });
event1.save(function (err) {
  if (err) // ...
  console.log('meow');*/

//Event.collection.insert(gds,{},function(err){
  for(var i = 10; i >= 0; i-- ){
  console.log("Row" + gds[i].source)

Event.collection.update({source:gds[i].source,destination:gds[i].destination},gds[i],{upsert: true},function(err){
    
      if(err){
        //console.log(event1);
      console.log(" error in flushing to mongo "+err);
      return callback();
      }

      else{             
        //console.log(" successfully flushed to mongo:"+gds);
        var query = Event.find({});
        query.select('source destination');
        var source = query.exec(function(err,rows)
        {
          if(err)
          {
            console.log(" error getting record "+err);
            return callback();
          }
          else
          {


            //for(var i = rows.length - 1; i >= 0; i--) 
            for(var i = rows.length; i >= 0; i--) 
            {
              console.log(" record"+rows[i]);
              rb.get(rows[i].source,rows[i].destination,'27-May-2013',callback)
            }
            
            //mongoose.connection.close();

          }


        });

        //console.log("56884488 rows"+query.toJSON());
          /*Event.find({},'source destination',function(err,rows)
            {
              if(err)
              {
                console.log("Unable to retrieve the records"+err);
                return callback();
              }
              else
              {
                console.log("retrieve the records"+rows);
                for (var i = rows.length - 1; i >= 0; i--) {
                  //rb.get(rows[i].fields());
                  console.log("Rows" +rows[i].fields());
                 }
              }
            });*/
        
  
       }

        
    });
}


}


                





/*
mongoose.connect('mongodb://'+cfg["MONGO_URL"],function(err){
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
}); */


function callback()
{
  //mongoose.connection.close();
  console.log("Done");
}




