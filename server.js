var http = require('http');
var url = require('url');
var express = require("express");
var api = require("./api.js");
var logger = require("./logger.js");
var app = express();



//http.createServer(function (request, response) {

//if (url.parse(request.url,true).pathname === '/getOccupancyStatus')

app.get('/getRoutesStats*', function(request, response) 
{
	logger.logMsg("retrieving data");
	var url_parts = url.parse(request.url,true);
	var query = url_parts.query;
	response.setHeader("Content-Type", "application/json");
	api.getRoutesStats(parseInt(query.OpId),null,query.doj,function(err,res)
	 	{
	 		if(err)
	 		{
	 			logger.logMsg(err,"Error occured while retrieving data");
	 			response.write("Error occured while retrieving data");

	 		}
	 		else
	 		{
	 			response.send(JSON.stringify(res));
			}
	 	});
});


app.get('/getOccupancyStatus*', function(request, response) 
{
	//logger.logMsg("retrieving data");
	var url_parts = url.parse(request.url,true);
	var query = url_parts.query;
	response.setHeader("Content-Type", "application/json");
	//var queryString = JSON.stringify(query);
	 api.getOccupancyStatus(parseInt(query.OpId),query.doj,function(err,res)
	 	{
	 		if(err)
	 		{
	 			logger.logMsg(err,"Error occured while retrieving data");
	 			response.write("Error occured while retrieving data");

	 		}
	 		else
	 		{
	 			response.send(JSON.stringify(res));
			}
	 	});
	 

});


/*else{
	response.writeHead(200,
    {
            'Content-Type': 'text/plain'
    });
    response.write('Welcome to PSL Analytics \n Append url with some method from the specified List : getOccupancyStatus ');
    response.end();
}*/

app.listen(9000);

//}).listen(9000, '127.0.0.1');

