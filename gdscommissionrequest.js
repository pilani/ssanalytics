var mongo = require('./mongoDb.js');
var src = 3;
var dest = 6;
var doj = '2013-06-15';
var fromDate = '2013-06-01';
var toDate = '2013-06-31';

exports.getGdsSrc = getGdsSrc;

function getGdsSrc()
{
	return src;
}

function getAllCampaigns(operatorId,modelName,queryString)
{
	var queryString = 'select '
	//mongo.queryCollection(modelName,queryString);
}
