var logger=require('./logger.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
cfg = require('./config.js').config;
db = mongoose.connect('mongodb://'+cfg["MONGO_URL"]);
var hashes = require('hashes');
var operId = 6;

//default schema
var schema = mongoose.Schema({ key: String});
var model = mongoose.model("rbroutes", schema);

exports.getFareData = getFareData;

map = function() {
  op_AC_fare_sum = 0;
  op_NAC_fare_sum =0;
  op_Slpr_fare_sum = 0;
  op_Str_fare_sum = 0;
  other_op_AC_fare_sum = 0;
  other_op_NAC_fare_sum =0;
  other_op_Slpr_fare_sum = 0;
  other_op_Str_fare_sum = 0;
  other_fare_sum =0;
  other_oper_count =0;
  op_fare_sum  =0;
  oper_count =0 ;
  oper_slp_count=0;
  oper_str_count=0;
  other_oper_slp_count=0;
  other_oper_str_count=0;
  oper_AC_count=0;
  other_oper_AC_count=0;
  oper_NAC_count=0;
  other_oper_NAC_count=0;


if(this.OpId == operId)
{
  // AC Fare 
  if(this.IsAc)
  {
    op_AC_fare_sum = Array.sum(this.FrLst);
    oper_AC_count = this.FrLst.length;
  }

  // Non AC Fare
  if(!this.IsAc)
  {
    op_NAC_fare_sum = Array.sum(this.FrLst);
    oper_NAC_count = this.FrLst.length;
  }

 if(this.IsSlpr && !this.IsStr)
  {
    op_Slpr_fare_sum = Array.sum(this.FrLst);
    oper_slp_count = this.FrLst.length;
  }

  if(this.IsSlpr && this.IsStr)
  {
    // The FrLst is sorted, we assume that the minimum amount is the fare of the seater remaining other fares are for sleeper ex: upper/lower
    for(i=0;i<this.FrLst.length;i++)
    {
      if(i ==0 )
      {
        op_Str_fare_sum = this.FrLst[0];
        oper_str_count = 1;
      }
      else
      {
        op_Slpr_fare_sum += this.FrLst[i] ;
        oper_slp_count += 1;
      }
    }
 
    
  }

 
  if(!this.IsSlpr )
  {
    op_Str_fare_sum = Array.sum(this.FrLst);
    oper_str_count = this.FrLst.length;
  }

  op_fare_sum = Array.sum(this.FrLst);
  oper_count = this.FrLst.length;

}

else
{
  // AC Fare 
  if(this.IsAc)
  {
    other_op_AC_fare_sum = Array.sum(this.FrLst);
    other_oper_AC_count = this.FrLst.length;
  }

  // Non AC Fare
  if(!this.IsAc)
  {
    other_op_NAC_fare_sum = Array.sum(this.FrLst);
    other_oper_NAC_count = this.FrLst.length;
  }

   if(this.IsSlpr && !this.IsStr)
  {
    other_op_Slpr_fare_sum = Array.sum(this.FrLst);
    other_oper_slp_count = this.FrLst.length;
  }

  if(this.IsSlpr && this.IsStr)
  {
    // The FrLst is sorted, we assume that the minimum amount is the fare of the seater remaining other fares are for sleeper ex: upper/lower
    for(i=0;i<this.FrLst.length;i++)
    {
      if(i ==0 )
      {
        other_op_Str_fare_sum = this.FrLst[0];
        other_oper_str_count = 1;
      }
      else
      {
        other_op_Slpr_fare_sum += this.FrLst[i];
        other_oper_slp_count += 1;
      }
    }
 
    
  }

 //semi sleeper is currently added as seater
  if(!this.IsSlpr )
  {
    other_op_Str_fare_sum = Array.sum(this.FrLst);
    other_oper_str_count = this.FrLst.length;
  }
  other_fare_sum = Array.sum(this.FrLst);
  other_oper_count = this.FrLst.length;
 
}

var input = {
   operId:operId,
   op_AC_fare_sum:op_AC_fare_sum,
   op_fare_sum:op_fare_sum,
   other_fare_sum:other_fare_sum,
   other_oper_count:other_oper_count,
   oper_count:oper_count,
  op_AC_fare_sum : op_AC_fare_sum,
  op_NAC_fare_sum :op_NAC_fare_sum,
  op_Slpr_fare_sum : op_Slpr_fare_sum,
  op_Str_fare_sum : op_Str_fare_sum,
  other_op_AC_fare_sum : other_op_AC_fare_sum,
  other_op_NAC_fare_sum :other_op_NAC_fare_sum,
  other_op_Slpr_fare_sum : other_op_Slpr_fare_sum,
  other_op_Str_fare_sum : other_op_Str_fare_sum,
  oper_slp_count:oper_slp_count,
  oper_str_count:oper_str_count,
  other_oper_slp_count:other_oper_slp_count,
  other_oper_str_count:other_oper_str_count,
  oper_avg_fare: 0,
   other_oper_avg_fare:0,
   oper_AC_avg_fare: 0,
   other_oper_AC_avg_fare:0,
   oper_NAC_avg_fare: 0,
   other_oper_NAC_avg_fare:0,
   oper_Slpr_avg_fare: 0,
   other_oper_Slpr_avg_fare:0,
   oper_Str_avg_fare: 0,
   other_oper_Str_avg_fare:0,
   oper_AC_count:oper_AC_count,
  other_oper_AC_count:other_oper_AC_count,
  oper_NAC_count:oper_NAC_count,
  other_oper_NAC_count:other_oper_NAC_count
    };

emit(operId, input);
  }

 // var value = Array.sum(this.FrLst);
  


var reduce = function(key, values) {


  var r = { op_fare_sum:0,oper_count: 0, oper_avg_fare: 0 ,other_fare_sum:0,other_oper_count: 0, other_oper_avg_fare: 0,  op_AC_fare_sum : 0,
  op_NAC_fare_sum :0,
  op_Slpr_fare_sum : 0,
  op_Str_fare_sum : 0,
  other_op_AC_fare_sum : 0,
  other_op_NAC_fare_sum :0,
  other_op_Slpr_fare_sum : 0,
  other_op_Str_fare_sum : 0,
  oper_slp_count:0,
  oper_str_count:0,
  other_oper_slp_count:0,
  other_oper_str_count:0, 
  oper_AC_avg_fare: 0,
  other_oper_AC_avg_fare:0,
  oper_NAC_avg_fare: 0,
  other_oper_NAC_avg_fare:0,
  oper_Slpr_avg_fare: 0,
  other_oper_Slpr_avg_fare:0,
  oper_Str_avg_fare: 0,
  other_oper_Str_avg_fare:0,
  oper_AC_count:0,
  other_oper_AC_count:0,
  oper_NAC_count:0,
  other_oper_NAC_count:0 };


  for(var i in values) {
   // var fare = 0;
    r.op_fare_sum += values[i].op_fare_sum;
    r.oper_count += values[i].oper_count;
    r.operId = values[i].operId;
    r.op_AC_fare_sum += values[i].op_AC_fare_sum;
    r.op_NAC_fare_sum +=values[i].op_NAC_fare_sum;
    r.op_Slpr_fare_sum += values[i].op_Slpr_fare_sum;
    r.op_Str_fare_sum  += values[i].op_Str_fare_sum;


    r.other_fare_sum += values[i].other_fare_sum;
    
    r.other_oper_count += values[i].other_oper_count;
    
    
    r.other_op_AC_fare_sum += values[i].other_op_AC_fare_sum;
    r.other_op_NAC_fare_sum +=values[i].other_op_NAC_fare_sum;
    r.other_op_Slpr_fare_sum += values[i].other_op_Slpr_fare_sum;
    r.other_op_Str_fare_sum += values[i].other_op_Str_fare_sum;
    r.oper_slp_count +=values[i].oper_slp_count;
    r.oper_str_count +=values[i].oper_str_count;
    r.other_oper_slp_count +=values[i].other_oper_slp_count;
    r.other_oper_str_count +=values[i].other_oper_str_count;
    r.oper_AC_count += values[i].oper_AC_count;
    r.other_oper_AC_count += values[i].other_oper_AC_count;
    r.oper_NAC_count += values[i].oper_NAC_count;
    r.other_oper_NAC_count += values[i].other_oper_NAC_count
  }

  return r;
}

var finalize = function(key, value) {

  if (value.oper_count > 0) {
   // console.log("reducer");
    value.oper_avg_fare = value.op_fare_sum / value.oper_count;
    value.oper_AC_avg_fare = value.op_AC_fare_sum / value.oper_AC_count;
    value.oper_NAC_avg_fare = value.op_NAC_fare_sum / value.oper_NAC_count;
    value.oper_Slpr_avg_fare = value.op_Slpr_fare_sum / value.oper_slp_count;
    value.oper_Str_avg_fare = value.op_Str_fare_sum / value.oper_str_count;
  }
  if (value.other_oper_count > 0) {
    value.other_oper_avg_fare = value.other_fare_sum / value.other_oper_count;
    value.other_oper_AC_avg_fare = value.other_op_AC_fare_sum / value.other_oper_AC_count;
    value.other_oper_NAC_avg_fare = value.other_op_NAC_fare_sum / value.other_oper_NAC_count;
    value.other_oper_Slpr_avg_fare = value.other_op_Slpr_fare_sum / value.other_oper_slp_count;
    value.other_oper_Str_avg_fare = value.other_op_Str_fare_sum / value.other_oper_str_count;

  }
  return value;
}

/*model.mapReduce({
  map: map,
  reduce: reduce,
  //query:{OpId:6},
  scope:{operId:operId},
  out: { replace: "session_stat" },
  finalize: finalize,verbose: true  
}, function(err, ret,stats){ 
  if (err) console.log(err)
  else {
    console.log(stats);

}
    })*/


  
function aggregateRecords(modelName,matchString,callback)
{
    //logger.logMsg("Entering aggregateRecords",matchString);
    var model = mongoose.model(modelName, schema);
    var fareAvg = 0;
    model.aggregate([
        { $match:  matchString},
        { $unwind : "$FrLst" },
        { $group: {
            _id: {
                "OpId" : "$OpId",
                "source" : "$source",
                "destination": "$destination",
                "doj" : "$doj",
            },
            fareAvg: { $avg: '$FrLst'},
            slprs: {$push: '$IsSlpr'},
            ac: {$push: '$IsAc'},
            fare: {$push: '$FrLst'}
        }}

    ], function (err, res) {
        if (err) {
            logger.logMsg(err);
        } else {
            //logger.logMsg("FareAvg",res);
           callback(null,res);
        }
    });
}

//getFareData(39,null);
function getFareData(OperatorId,matchString,callback)
{
   //var matchString = { IsAc: true, OpId : parseInt(OperatorId) };
   //logger.logMsg("Entering getFareData",matchString);
    var opFareAvg = aggregateRecords("rbroutes",matchString,function(err,res){
        if(err)
        {
            logger.logMsg(err,"Error retrieving fare");
        }
        else
        {

          callback(null,res);
            /*for (var i=0; i<res.length; i++)
            {
               // var json = JSON.parse(res[i]);
                  logger.logMsg("res[i] ",res[i]);
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
