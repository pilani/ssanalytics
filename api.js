var async = require("async");
var helper = require("./helper.js");
var logger = require("./logger.js");
exports.getOccupancyStatus = getOccupancyStatus;

//Interfaces for serving UI data


function getOccupancyStatus(operatorId,doj,callback){
logger.logMsg("operatorId",operatorId);
var OccupancyStatus = new Array();
//res= helper.getAcFareAvgForOperator(operatorId,doj);

async.parallel([
    function(callback){
        helper.getAcFareAvgForOperator(operatorId,doj,function(err,res1){
        	//logger.logMsg("res",res[0]);
            callback(null, res1);
        });
    },
    function(callback){
        helper.getNonAcFareAvgForOperator(operatorId,doj,function(err,res2){
        	//logger.logMsg("res",res[0]);
            callback(null, res2);
        });
    },
    function(callback){
        helper.getSlprFareAvgForOperator(operatorId,doj,function(err,res3){
        	//logger.logMsg("res",res[0]);
            callback(null, res3);
        });
    },
    function(callback){
        helper.getStrFareAvgForOperator(operatorId,doj,function(err,res4){
        	//logger.logMsg("res",res[0]);
            callback(null, res4);
        });
    }
],
// optional callback
function(err, results){
   for(i=0;i<results.length;i++)
   {
   	OccupancyStatus.push(results[i]);
   	if(i==results.length-1)
   	{
   		callback(null,OccupancyStatus);
   	}
   /*for(j=0;j<results[i].length;j++)
   	{
   	logger.logMsg("results",JSON.stringify(results[i][j]));
   }*/
   }
});



/*OccupancyStatus.push(helper.getAcFareAvgForOperator(operatorId,doj));
OccupancyStatus.push(helper.getNonAcFareAvgForOperator(operatorId,doj));
OccupancyStatus.push(helper.getSlprFareAvgForOperator(operatorId,doj));
OccupancyStatus.push(helper.getStrFareAvgForOperator(operatorId,doj));*/

// you need to hit mongo db routes table and build this data
//callback(new List<OccupancyStatus>());
//There is no list in node.js so it will be an array

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
function getRoutesStats(routeId,doj,callback){

// you wull fetch this effectively from ss db but we can pre store the value in cache.
callback(new routeStats())
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


function getCommissionForGdsCampaigns(source,destination,doj,fromDate,toDate,operatorId)
{

}
