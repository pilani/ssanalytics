var async = require("async");
var helper = require("./helper.js");
var logger = require("./logger.js");
var HashMap = require('hashmap').HashMap;

exports.getOccupancyStatus = getOccupancyStatus;


//Interfaces for serving UI data
var dataMap = new HashMap();
//logger.logMsg("map",map);

getOccupancyStatus(6,'2013-06-26');


function getOccupancyStatus(operatorId,doj,callback){
	logger.logMsg("operatorId",operatorId);

//res= helper.getAcFareAvgForOperator(operatorId,doj);

async.parallel([
    function(callback){
        helper.getAcFareAvgForOperator(operatorId,doj,function(err,map,res1){
        	//logger.logMsg("res",res1[0]);
        	dataMap = map;
        	logger.logMsg("Map",dataMap);
            callback(null, res1);
        });
    },
    function(callback){
        helper.getNonAcFareAvgForOperator(operatorId,doj,function(err,map,res2){
        	//logger.logMsg("res",res2[0]);
        	dataMap = map;
        	logger.logMsg("Map",dataMap);
            callback(null, res2);
        });
    },
    function(callback){
        helper.getSlprFareAvgForOperator(operatorId,doj,function(err,map,res3){
        	//logger.logMsg("res",res3[0]);
        	dataMap = map;
        	logger.logMsg("Map",dataMap);
            callback(null, res3);
        });
    },
    function(callback){
        helper.getStrFareAvgForOperator(operatorId,doj,function(err,map,res4){
        	//logger.logMsg("res",res4[0]);
            callback(null, res4);
            dataMap = map;
        	logger.logMsg("Map",dataMap);
        });
    }
],
// optional callback
function(err, results){
	if(err)
	{
		logger.logMsg(err, "Error Occurred while getting occupancy results")
	}
	//getRoutesStats(4663,null,'2013-06-26');
	//logger.logMsg("Results",JSON.stringify(results));
	//logger.logMsg("Results length",results.length);
	//processResults(results);

});

}	

function processResults(results)
{

	var OccupancyStatus = new Array();
   for(i=0;i<results.length;i++)
   {
   	
   	//logger.logMsg("results[i]",JSON.stringify(results[i]));


   	if(i==results.length-1)
   	{
   		//callback(null,OccupancyStatus);
   	}

   	for(j=0;j<results[i].length;j++)
   	{
   		
   }
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

// fitering at bustype level might not matter but we'll have it now and in case it is not useful , we can later club
//them into single item like selfCommission/standardCommission and selfAgent/standardAgents

// changed the method signature added operatorId, results are specific to opId and given for diff routeId

getRoutesStats(6,null,'2013-06-26');
function getRoutesStats(operatorId,routeId,doj,callback){

logger.logMsg("operatorId",operatorId);
var routeStats = new Array();
//res= helper.getAcFareAvgForOperator(operatorId,doj);

async.parallel([
    function(callback){
        helper.getOperatorCommission(operatorId,doj,null,null,function(err,map,res1){
        	//logger.logMsg("res",res1[0]);
        	dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res1);
        });
    },
    function(callback){
        helper.getOtherOperatorCommission(operatorId,doj,null,null,function(err,map,res2){
        	//logger.logMsg("res",res2[0]);
        	dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res2);
        });
    },
    function(callback){
        helper.getAverageAgentCountForOthers(operatorId,doj,function(err,map,res3){
        	//logger.logMsg("res",res[0]);
        	dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res3);
        });
    },
    function(callback){
        helper.getAverageAgentCount(operatorId,doj,function(err,map,res4){
        	//logger.logMsg("res",res[0]);
        	dataMap = map;
        	//logger.logMsg("Map",dataMap);
            callback(null, res4);
        });
    }
],
// optional callback
function(err, results){
   for(i=0;i<results.length;i++)
   {
   	routeStats.push(results[i]);
   	if(i==results.length-1)
   	{
   		//callback(null,routeStats);
   	}
   for(j=0;j<results[i].length;j++)
   	{
   	//logger.logMsg("results",JSON.stringify(results[i][j]));
   }
   }
});


	

// you wull fetch this effectively from ss db but we can pre store the value in cache.
//callback(new routeStats())
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

