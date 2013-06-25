// File to push MySql Data into Mongo Db


var mysql = require('./mysqlDb.js');
var mongo = require('./mongoDb.js');
var logger = require('./logger.js');
var async = require('async');
// gdsreq = require('./gdscommissionrequest.js');
//dumpGdsData();

var modelName = "" ;
var newQueryString='';
var findQuery = "";
var queryString = "";


async.waterfall(

	[ setModelName,mongo.createNewModel,setGdsCampaignQuery,setQueryString,queryingMysql,mongo.insertRecords],function(err,res)
	{
		if(err)
		{
			console.log("err" +  err);
		}
		else
		{
			console.log("Res length",res.length);

			//console.log("Res :%j", res[0]);
		}
		
	});


function setQueryString(modelName,queryString,callback)
{	
	var query = queryString;
	//logger.logMsg('queryString',query);
	callback(null,modelName,queryString);
}


function setGdsCampaignQuery(res,callback)
{
	queryString = 'SELECT a.*,b.fromdate,b.todate,c.source,c.destination FROM gds_campaign a JOIN gds_campaigndate b ON a.id = b.campaignid JOIN gds_campaignroute c ON a.id = c.campaignid';
	//logger.logMsg('queryString',queryString);
	callback(null,modelName,queryString);
}

function setModelName(callback)
{
	modelName = 'gdsprodrecords';
	logger.logMsg('modelName',modelName);
	callback(null,modelName);
}



function queryingMysql(modelName,queryString,callback)
{
	mysql.queryMysqlDb(queryString,function(err,res)
	{
		if(err)
		{
			logger.log(err,"Error occured while querying mysql with queryString " + queryString);
		}
		else
		{
			logger.logMsg("Results " + res);
			callback(null,modelName,res);
		}
	});
}