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

agentData();


/*async.waterfall(

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
		
	});*/

function agentData()
{
	modelName = "operatorsalesfromagents"
	async.waterfall(

	[setModelNameForSales,mongo.createNewModel,setOperatorTicketSalesQuery,setQueryString,queryingMysql,mongo.insertRecords],function(err,res)
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

}

function setQueryString(modelName,queryString,callback)
{	
	var query = queryString;
	//logger.logMsg('queryString',query);
	callback(null,modelName,queryString);
}

function setOperatorTicketSalesQuery(res,callback)
{
	queryString = 'SELECT COUNT(a.account) AS numOfAgents,a.operator  AS operatorId,a.boAccount,a.doj,b.rbMasterId AS source,c.rbMasterId AS destination FROM ticket_itineraryleg a JOIN  sslocation_region b JOIN  sslocation_region c ON (a.sourceCityId = b.id AND a.destinationCityId = c.id) WHERE doj > \'2013-06-01\' GROUP BY a.boAccount,a.sourceCityId,a.destinationCityId,a.doj';
	//logger.logMsg('queryString',queryString);
	callback(null,modelName,queryString);
}


function setGdsCampaignQuery(res,callback)
{
	queryString = 'SELECT a.*,b.fromdate,b.todate,c.source,c.destination,d.rbMasterId AS source,e.rbMasterId AS destination FROM gds_campaign a JOIN gds_campaigndate b  JOIN gds_campaignroute c JOIN  sslocation_region d JOIN  sslocation_region e ON (a.id = c.campaignid AND a.id = b.campaignid AND c.source = d.id AND c.destination = e.id)';
	//logger.logMsg('queryString',queryString);
	callback(null,modelName,queryString);
}

function setModelName(callback)
{
	modelName = 'gdsprodrecords';
	logger.logMsg('modelName',modelName);
	callback(null,modelName);
}


function setModelNameForSales(callback)
{
	modelName = 'operatorsalesfromagents';
	logger.logMsg('modelName',modelName);
	callback(null,modelName);
}



function queryingMysql(modelName,queryString,callback)
{
	logger.logMsg('queryString',queryString);
	mysql.queryMysqlDb(queryString,function(err,res)
	{
		if(err)
		{
			logger.log(err,"Error occured while querying mysql with queryString " + queryString);
		}
		else
		{
			logger.logMsg("Results " , res.length);
			callback(null,modelName,res);
		}
	});
}