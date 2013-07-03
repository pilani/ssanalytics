var queryMongo = require("./queryMongoForData.js");
var logger = require("./logger.js");

exports.getAcFareAvgForOperator = getAcFareAvgForOperator;
exports.getNonAcFareAvgForOperator = getNonAcFareAvgForOperator;
exports.getSlprFareAvgForOperator = getSlprFareAvgForOperator;
exports.getStrFareAvgForOperator = getStrFareAvgForOperator;

var matchString = "";

function getAcFareAvgForOperator(operatorId,doj,callback)
{

	matchString = { IsAc: true, OpId : parseInt(operatorId) };
	queryMongo.getFareData(operatorId,matchString,function(err,res)
{
	if(err)
	{
		logger.logMsg(err,"Error occured while querying mongo");
		callback(err,null);
	}
	else
	{
		//logger.logMsg("res",res[0]);
		callback(null,res);
	}
});

}


function getNonAcFareAvgForOperator(operatorId,doj,callback)
{
	matchString = { IsNAc: true, OpId : parseInt(operatorId) };
	queryMongo.getFareData(operatorId,matchString,function(err,res)
{
	if(err)
	{
		logger.logMsg(err,"Error occured while querying mongo");
		callback(err,null);
	}
	else
	{
		//logger.logMsg("res",res[0]);
		callback(null,res);
	}
});

}


function getSlprFareAvgForOperator(operatorId,doj,callback)
{
	matchString = { IsSlpr: true, OpId : parseInt(operatorId) };
	queryMongo.getFareData(operatorId,matchString,function(err,res)
{
	if(err)
	{
		logger.logMsg(err,"Error occured while querying mongo");
		callback(err,null);
	}
	else
	{
		//logger.logMsg("res",res[0]);
		callback(null,res);
	}
});

}

function getStrFareAvgForOperator(operatorId,doj,callback)
{
	var matchString = { IsSlpr: false, OpId : parseInt(operatorId) };
	queryMongo.getFareData(operatorId,matchString,function(err,res)
{
	if(err)
	{
		logger.logMsg(err,"Error occured while querying mongo");
		callback(err,null);
	}
	else
	{
		//logger.logMsg("res",res[0]);
		callback(null,res);
	}	
});

}
