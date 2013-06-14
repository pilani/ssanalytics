

//Interfaces for serving UI data


function getOccupancyStatus(operatorId,callback){

// you need to hit mongo db routes table and build this data
callback(new List<OccupancyStatus>());
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


funtion routeStats(){

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
