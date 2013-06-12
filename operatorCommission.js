var mysql = require('./mysqlDb.js');
var mongo = require('./mongoDb.js');
var hashes = require('hashes');
var logger = require('./logger.js');
getGdsCampaigns(56884488);


function getGdsCampaigns(operatorId,callback)
{
	var gdsCampaignQuery =  'Select * from gds_campaign where account =';
	mysql.queryMysqlDbWithKey(gdsCampaignQuery,false,operatorId,function(err,res)
		{
			if(err)
			{

			}
			else
			{
				mongo.createNewModel('operatorcommissions');
				mongo.insertRecords('operatorcommissions',res);
				getGdsCampaignRoutesData(56884488,res,callback);
				getGdsCampaignsDateRange(56884488,res,callback);
				//console.log("res",res);
			}
		});
}

function getGdsCampaignsDateRange(operatorId,rows,callback)
{
	console.log("entering getGdsCampaignsDateRange" + rows.id);

	var condArray = {id:rows.id,account:operatorId};

	var gdsCampaignQuery =  'SELECT * FROM gds_campaigndate WHERE campaignid IN (SELECT id FROM gds_campaign WHERE account =' ;
		mysql.queryMysqlDbWithKey(gdsCampaignQuery,true,56884488,function(err,res)
			{
				if(err)
				{

				}
				else
				{
					var distinctCampaigns = new hashes.HashSet();
					for(i = 0; i < res.length ; i ++)
					{
						var key = res[i].campaignId;
						logger.logMsg("Key",key);
						var condArray = {id:res[i].campaignId};
						console.log("res.campaignId",res[i].campaignId);

						var insertColArray = { $set: {fromDate: res[i].fromDate ,toDate: res[i].toDate } };
						if(distinctCampaigns.get(key) == null)
						{
							distinctCampaigns.add(key);
							updatedRecord = mongo.insertColumns('operatorcommissions',condArray,insertColArray,res[i],rows);
							console.log("res",res[i]);

							//adding just to check if stack size exceeded
							//mongo.copyRecord('operatorcommissions',rows);
						}


						else
						{
							mongo.queryCollection('operatorcommissions',condArray,function(err,results)
								{
									if(err)
									{
										logger.logMsg(err,"failed to get the results");
									}
									else
									{
										logger.logMsg("result of campaigns",results);
										if(results.length > 0)
										{
										var campaign = results[0];
										logger.logMsg("campaign to be duplicated",campaign);
										mongo.copyRecord('operatorcommissions',campaign);
										}

										
									}
								});
							
							
							//result.fromDate = res[i].fromDate;
							//result.toDate = res[i].toDate;
							//var rowid = mongo.insertRecords('operatorcommissions',result)._id;
							//logger.logMsg("rowid",rowid);

						}
						
					}
					
				}	
			});

	
}

function getGdsCampaignRoutesData(operatorId,rows,callback)
{
	console.log("entering getGdsCampaignRoutesData");

	var gdsCampaignQuery =  'SELECT * FROM gds_campaignroute WHERE campaignid IN (SELECT id FROM gds_campaign WHERE account =' ;
		mysql.queryMysqlDbWithKey(gdsCampaignQuery,true,56884488,function(err,res)
			{
				if(err)
				{

				}
				else
				{
					for(i = 0; i < res.length ; i ++)
					{
					var condArray = {id:res[i].campaignId};
					console.log("res.campaignId",res[i].campaignId);

					var insertColArray = { $set: {destination: res[i].destination ,source: res[i].source } };
					mongo.insertColumns('operatorcommissions',condArray,insertColArray,res,rows);
					//mongo.upsertRecords('operatorcommissions',condArray,res,true);
					//mongo.createNewModel('operatorcommissions');
					//mongo.insertRecords('operatorcommissions',res);
					//getGdsCampaignsDateRange(56884488,res,callback);
					console.log("res",res);
					}
				}
			});

	
}


