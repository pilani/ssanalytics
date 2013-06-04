var mongoose = require('mongoose'),Schema = mongoose.Schema,
cfg = require('./config.js').config;


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


function logRbRoutes(routes,srcid,destid,doj,callback){

for(var i = routes.length-1; i >= 0; i-- )
  {
    routes[i].rbSource = srcid;
    routes[i].rbDestination = destid;
    routes[i].doj = doj;
  }


    //var routesJSON = JSON.stringify(routes[i]);
    //routes[i].put(source,srcid);
    //console.log("routesJSON"+routesJSON);

  //RbRoute.collection.insert(routes,{},function(err){

    /*RbRoute.collection.update({rbSource:srcid.rbSource,rbDestination:destid,doj:doj
    ,OpId:routes[i].OpId,RtId:routes[i].RtId},routes[i], {upsert: true} ,function(err){*/

   RbRoute.collection.update({rbSource:srcid.rbSource,rbDestination:destid,doj:doj
    ,OpId:routes[i].OpId,RtId:routes[i].RtId},routes[i], {upsert: true} ,function(err){
    
   if(err){
    loggit(" error in flushing to mongo "+err);
   }else{ 
     /*var currDate = new Date();
    db.gdsoperators.modify(
      {

    query: { rbSource: routes[i].rbSource, rbDestination:routes[i].rbDestination },
    sort: { lastUpdated: 1 },
    update: { $lastUpdated: { currDate: 1 } }*/
} 
    /*RbRoute.findOneAndUpdate({source:routes[i].source,destination:routes[i].destination,doj:routes[i].doj
    ,OpId:routes[i].OpId},{source:routes[i].source},function(err,num,rows)
    {
      if(err)
      {
        callback();
      }
      else
      {
        loggit("Updated row"+rows);
      }
    }) */

       //loggit("Rows",raw);
    //loggit(" successfully flished to mongo:"+routes.length)
     
   callback();
 });
  
  


/*key
  RbRoute.collection.update(key,routes,{upsert:true},function(err){
    
   if(err){
    loggit(" error in flushing to mongo "+err);
   }else{ loggit(" successfully flished to mongo:"+routes.length) };
   callback();
 });*/
  
}
exports.logRbRoutes=logRbRoutes;

function loggit(msg){
  console.log(msg);
}