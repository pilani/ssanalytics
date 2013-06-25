var mysql = require('./mysqlDb.js');
var mongo = require('./mongoDb.js');
var logger = require('./logger.js');
var async = require('async');
var gdsreq = require('./gdscommissionrequest.js');
//dumpGdsData();

var modelName = "" ;
var newQueryString='';
var findQuery = "";
var queryString = "";


async.waterfall(

	[ setModelName,setSourceFindQueryString,setQueryString,mongo.queryCollection],function(err,res)
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

function setSourceFindQueryString(res,callback)
{

	if(gdsreq.getGdsSrc == null)
	{
		queryString = {source : -1};
	}
	else
	{
		queryString = { source: { '$in': [ -1, gdsreq.getGdsSrc() ] } };
	}
	//logger.logMsg('queryString',queryString);
	callback(null,modelName,queryString);

}


function setModelName(callback)
{
	modelName = 'gdsoperatorcommissions';
	logger.logMsg('modelName',modelName);
	callback(null,modelName);
}

function dumpGdsData()
{
	logger.logMsg("Entered dumpGdsData");
	var queryString = 'SELECT a.*,b.fromdate,b.todate,c.source,c.destination FROM gds_campaign a JOIN gds_campaigndate b ON a.id = b.campaignid JOIN gds_campaignroute c ON a.id = c.campaignid';
	mysql.queryMysqlDb(queryString,function(err,res)
	{
		if(err)
		{
			logger.logMsg(err,"Error getting gds campaign data");
		}
		else
		{
			//mongo.createNewModel('gdsoperatorcommissions');
			mongo.insertRecords('gdsoperatorcommissions',res,function(err,res)
				{
					if(err)
					{
						logger.logMsg(err,"Error inserting gds campaign data");
					}
					else
					{
						//logger.logMsg("Inserting gds campaign data",res);
						formQuery(3,null,null,null,null,56884488);
				}
				});
			
		}
	});
}






function formQuery(src,destination,doj,fromDate,toDate,operatorId)
{
	
	var queryString = "";
	var srcQuery = "";
	var paramArray = new Array();
	if(src != null)
	{
		//srcQuery = {source: {$in : [-1,src]}}
		paramArray.push(-1);
		paramArray.push(src);
		//queryString = queryString + 'source:-1' + '\t' + 'OR' + '\t' + 'source:' + src;
	}
	srcQuery = mongo.formInQuery(paramArray,'source',false);
	//queryString = queryString + '{' + srcQuery + '}';
	logger.logMsg("srcQuery",srcQuery);
	var str ={source: {$in : [paramArray[0],paramArray[1],]}};
	logger.logMsg("str",str);
	mongo.queryCollection('gdsoperatorcommissions',srcQuery,function(err,res)
		{
			if(err)
			{
				logger.logMsg(err, "Error occured while querying");
			}
			else
			{
				logger.logMsg("Query Results sources",res.length);
			}
		});


}

