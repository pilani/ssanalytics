var mysql = require('./mysqlDb.js');
var mongo = require('./mongoDb.js');
var logger = require('./logger.js');
var async = require('async');
var gdscampaign = require('./gdscommissionrequest.js');
dumpGdsData();

/*var modelName = "" ;
//var newQueryString='';
var findQuery = "";

function setQueryString(res,callback)
{	
	console.log("Res",res);
	var queryString = 'SELECT a.*,b.fromdate,b.todate,c.source,c.destination FROM gds_campaign a JOIN gds_campaigndate b ON a.id = b.campaignid JOIN gds_campaignroute c ON a.id = c.campaignid';
	callback(null,queryString);
}


function setModelName(callback)
{
	modelName = 'gdsoperatorcommissions';
	callback(null,modelName);
}

function queryMongo(callback)
{
	findQuery();

}

async.waterfall(

	[ setModelName,mongo.createNewModel,setQueryString,queryingMysql,mongo.insertRecords],function(err,res)
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


function queryingMysql(queryString,callback)
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
}*/


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
				//logger.logMsg("Query Results sources",res);
			}
		});


}

