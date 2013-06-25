var mongo = require('./mongoDb.js');
var logger = require('./logger.js');
logger = require('./logger.js');
//var hashes = require('hashes');
//var distinctOpRoutes = new hashes.HashSet();


/*function preprocess(routes,srcid,destid,doj,callback)
{
 for(var i  = 0; i < routes.length; i++ )
  {

    //Adding these fields into the record
    routes[i].destination = destid;
    routes[i].source = srcid;
    routes[i].doj = doj;
    //routes[i].operatorid=routes[i].whatever;
    //routes[i].routeid = routes[i].whatever;

    //this check is added in order to get distinct operator ids and routes id pairs
    var key = routes[i].OpId + '-' + routes[i].RtId;
    //logger.logMsg("Key",key);
    distinctOpRoutes.add(key);

    //logger.logMsg("i value",i);
    if(i == routes.length-1)
    {
      callback(null,routes,srcid,destid,doj);
    }

  }
  //logger.logMsg("distinctOpRoutes",distinctOpRoutes);
  
}
*/

function insertRoutes(routes,srcid,destid,doj,callback)
{
  //var keys = distinctOpRoutes.getKeys();
  //logger.logMsg("Keys length",keys.length);
  logger.logMsg("routes length",routes.length);

  for(i=0;i < routes.length ; i++)
  {

// inserting the columns into the routes data
  routes[i].destination = destid;
  routes[i].source = srcid;
  routes[i].doj = doj;  


  var updateCondition = {source:srcid,destination:destid,doj:doj,OpId:routes[i].OpId,RtId:routes[i].RtId};
  mongo.upsertRecords("rbroutes",updateCondition,routes[i],true,function(err){
    
   if(err){
    logger.logMsg(" error in flushing to mongo "+err);
   }else{ 
     logger.logMsg(" flushed to mongo ");
     if(i == routes.length-1)
    {
      callback(null);
    }

    
  }
 });
 
}
}

function logRbRoutes(routes,srcid,destid,doj,callback)
{

  insertRoutes(routes,srcid,destid,doj,function(err)
  {     if(err)
     {
      logger.logMsg(" error in flushing to mongo "+err);
     }

     else
     { 
        callback(null);
     }
        
 });

 } 
  

exports.logRbRoutes=logRbRoutes;