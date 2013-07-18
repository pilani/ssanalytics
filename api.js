var async = require("async");
var helper = require("./helper.js");
var logger = require("./logger.js");
var HashMap = require('hashmap').HashMap;

exports.getOccupancyStatus = getOccupancyStatus;
exports.getRoutesStats = getRoutesStats;


//Interfaces for serving UI data

//logger.logMsg("map",map);

//getOccupancyStatus(6,'2013-06-06');


function getOccupancyStatus(operatorId,doj,callback){
	logger.logMsg("operatorId",operatorId);

//res= helper.getAcFareAvgForOperator(operatorId,doj);

async.parallel({
   AC: function(callback){
        helper.getAcFareAvgForOperator(operatorId,doj,function(err,res1){
        	logger.logMsg("res",JSON.stringify(res1));
        	//dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res1);
        });
    },
   NAC: function(callback){
        helper.getNonAcFareAvgForOperator(operatorId,doj,function(err,res2){
        	//logger.logMsg("res",res2[0]);
        	//dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res2);
        });
    },
    Slpr: function(callback){
        helper.getSlprFareAvgForOperator(operatorId,doj,function(err,res3){
        	//logger.logMsg("res",res3[0]);
        	//dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res3);
        });
    },
    Str:function(callback){
        helper.getStrFareAvgForOperator(operatorId,doj,function(err,res4){
        	//logger.logMsg("res",res4[0]);
            callback(null, res4);
           // dataMap = map;
        	//logger.logMsg("Map",dataMap);
        });
    }
},
// optional callback
function(err, results){
	if(err)
	{
		logger.logMsg(err, "Error Occurred while getting occupancy results")
	}
  //logger.logMsg("Result",results.length);
  var map = new HashMap();
  var items = Object.keys(results);
  logger.logMsg("Items",items);
  items.sort(); // sort the array of keys
  async.forEach(Object.keys(results),function(result,finalcallback)
    {
      type = result;
       //logger.logMsg("type",type);
      //logger.logMsg("Result",results[type]);
       processResultsForOccupancy(map,results[type],operatorId,doj,type);
       // logger.logMsg("Map",map);
        finalcallback();  
    //console.log(item + '=' + results[item]);
  },function()
  {
    callback(null,map);
  /*logger.logMsg("Map",map);
  map.forEach(function(value, key) {
   var innerMap = map.get(key);
   //logger.logMsg("key",key);
   innerMap.forEach(function(value, key) {

   // console.log(key + " : " + value);
  });
 });*/
 });


  //callback(null,OccupancyStatus);




	//logger.logMsg("Results length",results.length);
  
    //type = ""
    //processResultsForOccupancy(result,operatorId,doj,type);
   /* if(i==results.length-1)
    {
      //callback(null,OccupancyStatus);
    }*/
  
	

});

}	

function finalcallback()
{
  logger.logMsg("ENtered");
  //callback(null,OccupancyStatus);
}

function processResultsForOccupancy(map,results,operatorId,doj,type)
{
  
	var OccupancyStatus = new Array();


   results.forEach(function(result) {
   // logger.logMsg("results",result);
    var key  = result._id.source + "_" + result._id.destination + "_" + doj + "_" + operatorId;
     processMapForOccupancyStatus(map,key,result,type,operatorId,doj,type)
    //console.log(item + '=' + results[item]);
  });

}


function processMapForOccupancyStatus(map,key,record,type,operatorId,doj)
{
 var innerMap; 
    if(map.get(key) == null)
    {
      innerMap = new HashMap();

      if(type == "AC")
      {
      innerMap.set("AC",record.fareAvg)
      }
      else if(type == "NAC")
      {
      innerMap.set("NAC",record.fareAvg)
      
      }
      else if(type == "Slpr")
      {
      innerMap.set("Slpr",record.fareAvg)
      }
      else if(type == "Str")
      {
      innerMap.set("Str",record.fareAvg)
      }
      
      map.set(key,innerMap); 


    //logger.logMsg("map_key",key);
    //logger.logMsg("map_value",map.get(key));
    }

    else if(map.get(key) != null)
    {
      innerMap = map.get(key);
      //logger.logMsg("JSON Parsed",fareString.toString()));
      //logger.logMsg("innermap for a given key",innerMap);
      if(type == "AC")
      {
      innerMap.set("AC",record.fareAvg)
      }
      else if(type == "NAC")
      {
      innerMap.set("NAC",record.fareAvg)
      }
      else if(type == "Slpr")
      {
      innerMap.set("Slpr",record.fareAvg)
      }
      else if(type == "Str")
      {
      innerMap.set("Str",record.fareAvg)
      }
      map.set(key,innerMap); 
    //logger.logMsg("map_key",key);
    //logger.logMsg("map_value",map.get(key));
   }
}





function occupancyStatus(route){
//routeid:2344
//doj:30-may-2013
//routename:bang-hyderabad
//selfOccupnacy:50% 
//standarOccupancy:60%
//selfAcFare:600
//standardAcFare:670
//selfVovloFare:400
//standaraVolvoDare:444



}

function processMapForRouteStats(map,key,record,type,operatorId,doj)
{
  var key  = record._id.source + "_" + record._id.destination + "_" + doj;
  var innerMap;
    if(map.get(key) == null)
    {
      innerMap = new HashMap();
      if(type == "OpCOM")
      {
      innerMap.set("OpCOM",record.bonusCommission[0])
      }
      else if(type == "OtOpCOM")
      {
      innerMap.set("OtOpCOM",record.bonusCommission[0])
      }
      else if(type == "OtAvgAgtSum")
      {
      innerMap.set("OtAvgAgtSum",record.otherAgentSum)
      }
      else if(type == "AvgAgtSum")
      {
      innerMap.set("AvgAgtSum",record.opAgentCount)
      }

      map.set(key,innerMap); 


    //logger.logMsg("map_key",key);
    //logger.logMsg("map_value",map.get(key));
    }

    else if(map.get(key) != null)
    {
      innerMap = map.get(key);
      //logger.logMsg("JSON Parsed",fareString.toString()));
      //logger.logMsg("innermap for a given key",innerMap);
      
      if(type == "OpCOM")
      {
      innerMap.set("OpCOM",record.bonusCommission[0])
      }
      else if(type == "OtOpCOM")
      {
      innerMap.set("OtOpCOM",record.bonusCommission[0])
      }
      else if(type == "OtAvgAgtSum")
      {
      innerMap.set("OtAvgAgtSum",record.otherAgentSum)
      }
      else if(type == "AvgAgtSum")
      {
      innerMap.set("AvgAgtSum",record.opAgentCount)
      }
      map.set(key,innerMap); 
    //logger.logMsg("map_key",key);
    //logger.logMsg("map_value",map.get(key));
   }
}

// fitering at bustype level might not matter but we'll have it now and in case it is not useful , we can later club
//them into single item like selfCommission/standardCommission and selfAgent/standardAgents

// changed the method signature added operatorId, results are specific to opId and given for diff routeId

//getRoutesStats(4794,null,'2013-07-07');
function getRoutesStats(operatorId,routeId,doj,callback){

logger.logMsg("getRoutesStats",operatorId);
var routeStats = new Array();
//res= helper.getAcFareAvgForOperator(operatorId,doj);

async.parallel({
   OpCOM: function(callback){
        helper.getOperatorCommission(operatorId,doj,null,null,function(err,res1){
        	//logger.logMsg("res",res1[0]);
        	//dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res1);
        });
    },
   OtOpCOM: function(callback){
        helper.getOtherOperatorCommission(operatorId,doj,null,null,function(err,res2){
        	//logger.logMsg("res",res2[0]);
        	//dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res2);
        });
    },
   OtAvgAgtSum: function(callback){
        helper.getAverageAgentCountForOthers(operatorId,doj,function(err,res3){
        	//logger.logMsg("res",res[0]);
        	//dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res3);
        });
    },
    AvgAgtSum: function(callback){
        helper.getAverageAgentCount(operatorId,doj,function(err,res4){
        	//logger.logMsg("res",res[0]);
        	//dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res4);
        });
    }
},
// optional callback
function(err, results){
  if(err)
  {
    logger.logMsg(err, "Error Occurred while getting occupancy results")
  }
  //logger.logMsg("Result",results.length);
  var map = new HashMap();
  var items = Object.keys(results);
  //logger.logMsg("Items",items);
 // items.sort(); // sort the array of keys
  async.forEach(Object.keys(results),function(result,finalcallback)
    {
      type = result;
      // logger.logMsg("type",type);
      //logger.logMsg("Result",results[type]);
       processResultsForRoutes(map,results[type],operatorId,doj,type);
       //logger.logMsg("Map",map);
        finalcallback();  
    //console.log(item + '=' + results[item]);
  },function()
  {
    callback(null,map);
 /* logger.logMsg("Map",map);
  map.forEach(function(value, key) {
   var innerMap = map.get(key);
   //logger.logMsg("key",key);
   innerMap.forEach(function(value, key) {

   console.log(key + " : " + value);
  });
 });*/
 });


   
});


	

// you wull fetch this effectively from ss db but we can pre store the value in cache.
//callback(new routeStats())
}

function processResultsForRoutes(map,results,operatorId,doj,type)
{

  results.forEach(function(result) {
   // logger.logMsg("results",result);
    var key  = result._id.source + "_" + result._id.destination + "_" + doj;
     processMapForRouteStats(map,key,result,type,operatorId,doj,type)
    //console.log(item + '=' + results[item]);
  });
}



function routeStats(){

//routeid:2222
//doj:20-may-2013
//selfAcCommission:10%
//standardAcCommission:11%
//selfVolvoCommission:10%
//standarVolcoCommission:11%
//selfSleeperCommission:10%
//standardSleeprCommission:11%
//selfAcAgents:11
//standardAcAgents:13
//etc etc


}

