var mongoose = require('mongoose'),Schema = mongoose.Schema,
cfg = require('./config.js').config;
var hashes = require('hashes');
var distinctOpRoutes = new hashes.HashSet();

var rbRouteSchema = new Schema({

 mserverTime:{ type: Date, default: Date.now }
});// table rotation not needed as we have in-built ttl based expiry 
rbRouteSchema.index({ "mserverTime": 1 }, { expireAfterSeconds: cfg["RBROUTE_EXP_TIME"] });

mongoose.model('rbRoute', rbRouteSchema);
/*mongoose.connect('mongodb://'+cfg["MONGO_URL"],function(err){
    if(err){
        loggit("error in connecting to mongo"+err.stack)
    }else { loggit (" connection to mongo succesfull")};
});*/
var RbRoute = mongoose.model('rbRoute');
/*var singleRow = new RbRoute({
     });
singleRow.setValue("key","value");// kind of a hack so that schema is flushed to mongo before actual insertion of data begins
singleRow.save(function(err){
  if(err)
  loggit(err)
});*/


// global variables

var opRoutesArray= new Array();
var count = 0;


function preprocess(routes,srcid,destid,doj,callback)
{
 for(var i  = 0; i < routes.length; i++ )
  {

    //Adding these fields into the record
    routes[i].rbSource = srcid;
    routes[i].rbDestination = destid;
    routes[i].doj = doj;

    //this check is added in order to get distinct operator ids and routes id pairs
    var key = routes[i].OpId + '-' + routes[i].RtId;
    loggit("Key",key);
    distinctOpRoutes.add(key);

  }
  loggit("distinctOpRoutes",distinctOpRoutes);
}


function insertRoutes(routes,srcid,destid,doj,callback)
{
  var keys = distinctOpRoutes.getKeys();
  for(i=0;i < keys.length ; i++)
  {
  var newkeys = keys.split('-');
   RbRoute.collection.update({rbSource:srcid,rbDestination:destid,doj:doj,OpId:newkeys[0],RtId:newkeys[1]
   },routes, {upsert: true} ,function(err){
    
   if(err){
    loggit(" error in flushing to mongo "+err);
   }else{ 
     loggit("logged into mongodb");
}
 });
 }
}

function logRbRoutes(routes,srcid,destid,doj,callback){

loggit("routes[0]",routes[0]);
preprocess(routes,srcid,destid,doj,callback,function(err,callback){
  if(err)
  {
    loggit("Error in getting distinct operator routes pairs");
  }
  else
  {
    insertRoutes(routes,srcid,destid,doj,callback);
  }

})


  
  
}
exports.logRbRoutes=logRbRoutes;

function loggit(msg){
  console.log(msg);
}