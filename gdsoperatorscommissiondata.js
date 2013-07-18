//var mysql = require('./mysqlDb.js');
var mongo = require('./mongoDb.js');
var logger = require('./logger.js');
var async = require('async');
var pg = require('pg'); 

//var time = require('time')(Date);
//var gdsreq = require('./gdscommissionrequest.js');
//dumpGdsData();


exports.getAverageAgentCountForOthers =getAverageAgentCountForOthers;
exports.getAverageAgentCount =getAverageAgentCount;
exports.operatorCommission = operatorCommission;
exports.otherOperatorCommission = otherOperatorCommission;

/*var src=3;
var dest= 6;
var doj = '2013-06-15';
// default fromdate is 2012-01-01
var fromdate = '2012-06-01';
// default todate is 2013-12-31
var todate = Date.now(); */

/*async.waterfall(

	[setModelName,consolidatedOperatorCommissionQuery],function(err,res)
	{
		if(err)
		{
			logger.logMsg("err" +  err);
		}
		else
		{
			logger.logMsg("Max Commission",res[0].bonusCommission);
			logger.logMsg("Res length",res.length);
			//console.log("Res :%j", res[0]);
		}
		
	});*/

/*
function consolidatedOperatorCommissionQuery(modelname,src,dest,doj,fromdate,todate,callback)
{
	
	var consQuery = { '$and': [src == null? {source : -1} : { source: { '$in': [ -1, src ] } }, dest == null?  {destination : -1} : { destination : { '$in': [ -1, dest] } },  todate == null?  {todate:{ '$lt': new Date('2013-12-31')}} : {todate:{ '$lt' : new Date(todate)} }, fromdate == null?  {fromdate:{ '$gte': new Date('2013-06-01')}} : {fromdate:{ '$gte' : new Date(fromdate)} }  ] };
	var optionParam =  {sort: { 'bonusCommission': -1} ,limit: 1 };
	mongo.queryAndSortCollection(modelName,consQuery,optionParam,function(err,res)
		{
			if(err)
			{

			}
			else
			{
				//logger.logMsg("Results",res.length);
				callback(null,res);
				//mongo.connection.close();
			}
		});


}*/


//consolidatedOperatorCommissionQuery(4663,'2013-06-27',null,null);
//operatorCommission(4794,new Date('2013-07-06'),null,null);
function operatorCommission(OperatorId,dateofjourney,from_date,to_date,callback)
{
	logger.logMsg("OperatorId",OperatorId);
	//logger.logMsg("dateofjourney",dateofjourney);
	var model = mongo.returnModel("gdsprodrecords");
    var matchString = {todate : { $gte : new Date(dateofjourney)}, fromdate:{ $lt : new Date(dateofjourney)}, operatorId:OperatorId };
    //logger.logMsg("matchString",matchString);
    var groupByString =  {
            _id: {
                "source" : "\$source",
                "destination": "\$destination"
            },
            bonusCommission: {$push: '$bonusCommission'},
        };

   	model.aggregate([
	    { $match : matchString},
	    { $group : groupByString}

	    ], function (err, res) {
	        if (err) {
	            logger.logMsg(err);
	        } else {
	           logger.logMsg("Res",JSON.stringify(res));
	           callback(null,res);
	        }
	    });


  }


  function otherOperatorCommission(OperatorId,dateofjourney,from_date,to_date,callback)
{
	var model = mongo.returnModel("gdsprodrecords");
	var toDate = new Date(dateofjourney);
	toDate.setDate(toDate.getDate() + 1);
	 //,fromDate:{ $lte : new Date(dateofjourney)}  
    var matchString = {todate : { $gte : new Date(dateofjourney)}, fromdate:{ $lt : new Date(dateofjourney)}, operatorId:{$ne : OperatorId} };
    var groupByString =  {
            _id: {
                "source" : "\$source",
                "destination": "\$destination"
            },
            bonusCommission: {$push: '$bonusCommission'},
        };

	model.aggregate([
	    { $match : matchString},
	    { $sort : { bonusCommission : -1}},
	    { $group : groupByString}

	    ], function (err, res) {
	        if (err) {
	            logger.logMsg(err);
	        } else {
	            //logger.logMsg("Res",JSON.stringify(res));
	           callback(null,res);
	        }
	    });


  }


//getAverageAgentCount(4794,'2013-07-07');

function getAverageAgentCount(OperatorId,dateofjourney,callback)
{
	var toDate = new Date(dateofjourney);
	toDate.setDate(toDate.getDate() + 1);
    var matchString = { operatorId:OperatorId,doj : { $gte : new Date(dateofjourney), $lt : new Date(toDate) }  };
    var groupByString =  {
            _id: {
                "source" : "\$source",
                "destination": "\$destination",
                "doj" : "\$doj",
            },
            opAgentCount: { $sum: '$numOfAgents'},
        }



    mongo.aggregateRecords("operatorsalesfromagents",matchString,groupByString, null,function (err, res) {
        if (err) {
            logger.logMsg(err);
        } else {
            logger.logMsg("countAvg",res);
          	callback(null,res);
        }
    });
   
}

function getAverageAgentCountForOthers(OperatorId,dateofjourney,callback)
{
	var toDate = new Date(dateofjourney);
	toDate.setDate(toDate.getDate() + 1);
    var matchString = { operatorId: {$ne : OperatorId},doj : { $gte : new Date(dateofjourney), $lt : new Date(toDate) }  };
    var groupByString =  {
            _id: {
                "source" : "\$source",
                "destination": "\$destination",
                "doj" : "\$doj",
            },
            otherAgentSum: { $sum: '$numOfAgents'},
        }



    mongo.aggregateRecords("operatorsalesfromagents",matchString,groupByString, null,function (err, res) {
        if (err) {
            logger.logMsg(err);
        } else {
            
            //mongo.closeConnection();
            //logger.logMsg("countAvg",res);
          callback(null,res);
        }
    });
   
}


/*
function setModelName(callback)
{
	modelName = 'gdsprodrecords';
	logger.logMsg('modelName',modelName);
	callback(null,modelName);
}*/

