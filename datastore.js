var mongoose = require('mongoose'),Schema = mongoose.Schema,
cfg = require('./config.js').config;


var rbRouteSchema = new Schema({

 mserverTime:{ type: Date, default: Date.now }
});// table rotation not needed as we have in-built ttl based expiry 
rbRouteSchema.index({ "mserverTime": 1 }, { expireAfterSeconds: cfg["RBROUTE_EXP_TIME"] });

mongoose.model('rbRoute', rbRouteSchema);
mongoose.connect('mongodb://'+cfg["MONGO_URL"],function(err){
    if(err){
        loggit("error in connecting to mongo"+err.stack)
    }else { loggit (" connection to mongo succesfull")};
});
var RbRoute = mongoose.model('rbRoute');
var singleRow = new RbRoute({
     });
singleRow.setValue("key","value");// kind of a hack so that schema is flushed to mongo before actual insertion of data begins
singleRow.save(function(err){
	if(err)
	loggit(err)
});


function logRbRoutes(routes,callback){

	RbRoute.collection.insert(routes,{},function(err){
    
   if(err){
    loggit(" error in flushing to mongo "+err);
   }else{ loggit(" successfully flished to mongo:"+routes.length) };
   callback();
 });



	RbRoute.collection.update(key,routes,{upsert:true},function(err){
    
   if(err){
    loggit(" error in flushing to mongo "+err);
   }else{ loggit(" successfully flished to mongo:"+routes.length) };
   callback();
 });
  
}
exports.logRbRoutes=logRbRoutes;

function loggit(msg){
	console.log(msg);
}