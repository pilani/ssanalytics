var http = require('http');
var url = require('url');
var express = require("express");
var api = require("./api.js");
var logger = require("./logger.js");
var app = express();



//http.createServer(function (request, response) {

//if (url.parse(request.url,true).pathname === '/getOccupancyStatus')
app.get('/getOccupancyStatus*', function(request, response) 
{
	//logger.logMsg("retrieving data");
	var url_parts = url.parse(request.url,true);
	var query = url_parts.query;
	response.setHeader("Content-Type", "application/json");
	//var queryString = JSON.stringify(query);
	 api.getOccupancyStatus(query.OpId,query.doj,function(err,res)
	 	{
	 		if(err)
	 		{
	 			logger.logMsg(err,"Error occured while retrieving data");
	 			response.write("Error occured while retrieving data");

	 		}
	 		else
	 		{
	 			response.send(JSON.stringify(res));

	 			//res.each(function(err, record) {
	 				//response.send(JSON.stringify(res));
	 				/*for(i=0;i<res.length;i++)
	 				{
	 					response.send(JSON.stringify(res[i]));
	 					for(j=0;j<res[i].length;j++)
					   	{
					   		logger.logMsg("Res",res[i][j]);
					   		//response.send(JSON.stringify(res[i]));
					    }
			      
			          /*if(i== res.length-1)
			          {
			          	response.end();
			          }

			        }*/
			}
			   
	 			//logger.logMsg("Res",res);
	 			//response.write(JSON.stringify(res));	
	 		

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

