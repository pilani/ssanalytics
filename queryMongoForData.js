var logger=require('./logger.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
cfg = require('./config.js').config;
db = mongoose.connect('mongodb://'+cfg["MONGO_URL"]);
var hashes = require('hashes');


//default schema
var schema = mongoose.Schema({ key: String});
var model = mongoose.model("rbroutes", schema);




var faresHashTable = new hashes.HashTable();
var fareArray = new Array();
//getFareData(3309);


/*

var map = function(){

val = new Object();

if(this.IsAc){

val['ACFARE']=set fare from list;
}
if(this.IsSeater){

val['SEATER_FARE']=set fare from list;
}


val['OCCUPANCY]= (this.availableSeats/this.totalSeatsAvailable)*100;

emit(this.OpId,val);

}


var reduce = function (){

var r = (operatorId:key,avgAcFare:0,avgSeaterFare:0,occupancy:0)
for()

}

*/
var map = function() {
   // logger.logMsg("mapper");

  emit(this.OpId, this.FrLst);
}

var reduce = function(key, values) {

  var r = { OperatorId: key, ap_sum: 0, count: 0, avg_mark: 0 };
  for(var i in values) {
    var fare = 0;

    r.ap_sum = Array.sum(values[i]);
    /*if(values[i] != null)
    {
    for(var j in values[i])
    {
     fare= parseInt(values[i][j]);
    r.ap_sum += fare;
    r.count += 1;
}
}
else
 r.count += 1;
  }
 /* values.forEach(function(v) {
   // v.forEach(function(i)
    //{ 
                r.ap_sum += v;

    //});

    
    //console.log("reducer");*/

r.count += 1;
  }
  return r;
}

var finalize = function(key, value) {
  if (value.count > 0) {
   // console.log("reducer");
    value.avg_mark = value.ap_sum / value.count;
  }
  return value;
}

//mongoose.connection.db.executeDbCommand({
model.mapReduce({
  map: map,
  reduce: reduce,
 
  out: { reduce: "session_stat" },
  finalize: finalize
}, function(err, ret){ 
  if (err) console.log(err)
  else {
    console.log(ret.length)

}
    })
  


function aggregateRecords(modelName,matchString,callback)
{
    //var ms = { IsAc: false };
    logger.logMsg("Entering aggregateRecords");
    var model = mongoose.model(modelName, schema);
    var fareAvg = 0;
    model.aggregate([
        { $match:  matchString},
         { $unwind : "$FrLst" },
        { $group: {
            _id: {
                "source" : "$source",
                "destination": "$destination"
            },
            fareAvg: { $avg: '$FrLst'}
        }}

    ], function (err, res) {
        if (err) {
            logger.logMsg(err);
        } else {
            logger.logMsg("FareAvg",res);
           callback(null,res);
        }
    }
);
}


function getFareData(OperatorId,callback)
{
    var matchString = { IsAc: false, OpId : OperatorId };
    var opFareAvg = aggregateRecords("rbroutes",{ IsAc: false, OpId : OperatorId },function(err,res){
        if(err)
        {
            logger.logMsg(err,"Error retrieving fare");
        }
        else
        {


            for (var i=0; i<res.length; i++)
            {
               // var json = JSON.parse(res[i]);
                  logger.logMsg("res[i]._id.source ",res[i]._id.source);
            }
            /*for(i = 0; i < res.length ;i++)
            {
                logger.logMsg("res[i][0] ",res[i]);
                var fareString  = 3309 + '-' + res[i][0] + '-' + res[i][1];
                logger.logMsg(fareString);
                faresHashTable.add(fareString,res[i].fareAvg);
                logger.logMsg(faresHashTable);
                //fareArray.push(fareString);
            }*/
        }
    });

  /*  var totalFareAvg = aggregateRecords("rbroutes",{ IsAc: false },function(err,res){
        if(err)
        {
            logger.logMsg(err,"Error retrieving fare");
        }
        else
        {
            for(i = 0; i < res.length ;i++)
            {
                var fareString  = 'All' + '-' + res[i].source + '-' + res[i].destination;
                faresHashTable.add(fareString,res[i].fareAvg);
                logger.logMsg(faresHashTable);
                //fareArray.push(fareString);
            }
            
           // callback(null);
        }
        });*/

   
   
}
