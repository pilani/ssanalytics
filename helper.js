var queryMongo = require("./queryMongoForData.js");
var logger = require("./logger.js");
var commission = require("./gdsoperatorscommissiondata.js");

exports.getAcFareAvgForOperator = getAcFareAvgForOperator;
exports.getNonAcFareAvgForOperator = getNonAcFareAvgForOperator;
exports.getSlprFareAvgForOperator = getSlprFareAvgForOperator;
exports.getStrFareAvgForOperator = getStrFareAvgForOperator;
exports.getOperatorCommission = getOperatorCommission;
exports.getOtherOperatorCommission = getOtherOperatorCommission;
exports.getAverageAgentCountForOthers = getAverageAgentCountForOthers;
exports.getAverageAgentCount = getAverageAgentCount;


/*function processMap(key,record,type,operatorId,doj)
{
	var key  = record._id.source + "_" + record._id.destination + "_" + doj + "_" + operatorId;
   	if(map.get(key) == null)
   	{

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
   		else if(type == "OpCOM")
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


    logger.logMsg("map_key",key);
   	logger.logMsg("map_value",map.get(key));
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
   		else if(type == "OpCOM")
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
   	logger.logMsg("map_key",key);
   	logger.logMsg("map_value",map.get(key));
   }
}*/

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
		logger.logMsg("res_Ac",JSON.stringify(res));
		callback(null,res);
		//logger.logMsg("res",res[0]);
		/*for(i=0;i<res.length;i++)
		{
		    key  = res[i]._id.source + "_" + res[i]._id.destination + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"AC",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
					callback(null,map,res);
			}
		}*/
	
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
		logger.logMsg("res_NAc",JSON.stringify(res));
		callback(null,res);
		/*for(i=0;i<res.length;i++)
		{
			key  = res[i]._id.source + "_" + res[i]._id.destination + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"NAC",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
					callback(null,map,res);
			}
		}*/
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
		callback(null,res);
		/*for(i=0;i<res.length;i++)
		{
			key  = res[i]._id.source + "_" + res[i]._id.destination + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"Slpr",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
				callback(null,map,res);
			}
		}*/
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
		callback(null,res);
		/*for(i=0;i<res.length;i++)
		{
			key  = res[i]._id.source + "_" + res[i]._id.destination + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"Str",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
					callback(null,map,res);
			}
		}*/
	}	
});

}


function getOperatorCommission(operatorId,doj,fromDate,toDate,callback)
{
	commission.operatorCommission(operatorId,doj,null,null,function(err,res)
	{
	if(err)
	{
		logger.logMsg(err,"Error occured while getting commission data");
		callback(err,null);
	}
	else
	{
		logger.logMsg(res,"res");
		callback(null,res);
		/*for(i=0;i<res.length;i++)
		{
			key  = res[i]._id.source + "_" + res[i]._id.destination + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"OpCOM",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
				callback(null,map,res);
			}
		}*/
	}	
});

}

function getOtherOperatorCommission(operatorId,doj,fromDate,toDate,callback)
{
	commission.otherOperatorCommission(operatorId,doj,null,null,function(err,res)
	{
	if(err)
	{
		logger.logMsg(err,"Error occured while getting commission data");
		callback(err,null);
	}
	else
	{
		callback(null,res);
		/*for(i=0;i<res.length;i++)
		{
			key  = res[i]._id.source + "_" + res[i]._id.destination + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"OtOpCOM",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
				callback(null,map,res);
			}
		}*/
	}	
});

}

function getAverageAgentCountForOthers(operatorId,doj,callback)
{
	commission.getAverageAgentCountForOthers(operatorId,doj,function(err,res)
	{
	if(err)
	{
		logger.logMsg(err,"Error occured while getting AverageAgentCountForOthers data");
		callback(err,null);
	}
	else
	{
		callback(null,res);
		/*for(i=0;i<res.length;i++)
		{
			key  = res[i]._id.sourceCity + "_" + res[i]._id.destinationCity + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"OtAvgAgtSum",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
				callback(null,map,res);
			}
		}*/
	}	
});

}

function getAverageAgentCount(operatorId,doj,callback)
{
	commission.getAverageAgentCount(operatorId,doj,function(err,res)
	{
	if(err)
	{
		logger.logMsg(err,"Error occured while getting AverageAgentCount data");
		callback(err,null);
	}
	else
	{
		callback(null,res);
		/*for(i=0;i<res.length;i++)
		{
			key  = res[i]._id.sourceCity + "_" + res[i]._id.destinationCity + "_" + doj + "_" + operatorId;
			processMap(key,res[i],"AvgAgtSum",operatorId,doj);
			// exit loop once all the records are retrieved
			if(i == res.length-1)
			{
				callback(null,map,res);
			}
		}*/
	}	
});

}

