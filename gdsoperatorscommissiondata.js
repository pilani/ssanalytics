//var mysql = require('./mysqlDb.js');
var mongo = require('./mongoDb.js');
var logger = require('./logger.js');
var async = require('async');
var pg = require('pg'); 

//var time = require('time')(Date);
//var gdsreq = require('./gdscommissionrequest.js');
//dumpGdsData();

var modelName = "" ;
var newQueryString='';
var findQuery = "";
var queryString = "";
var srcQuery,destQuery;

var src=3;
var dest= 6;
var doj = '2013-06-15';
// default fromdate is 2012-01-01
var fromdate = '2012-06-01';
// default todate is 2013-12-31
var todate = Date.now(); 





async.waterfall(

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
		
	});


function consolidatedOperatorCommissionQuery(modelname,callback)
{
	
	var consQuery = { '$and': [src == null? {source : -1} : { source: { '$in': [ -1, src ] } }, dest == null?  {destination : -1} : { destination : { '$in': [ -1, dest] } },  todate == null?  {todate:{ '$lt': new Date('2013-12-31')}} : {todate:{ '$lt' : new Date(todate)} }, fromdate == null?  {fromdate:{ '$gte': new Date('2012-01-01')}} : {fromdate:{ '$gte' : new Date(fromdate)} }  ] };
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


}

function setModelName(callback)
{
	modelName = 'gdsprodrecords';
	logger.logMsg('modelName',modelName);
	callback(null,modelName);
}

