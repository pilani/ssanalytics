var opr = require('./operatorroutes.js');
var mysql = require('./mysqlDb.js');
var hashes = require('hashes');

var prepStat = "PREPARE stmt1 FROM 'SELECT a.*,b.fromdate,b.todate,c.source,c.destination FROM gds_campaign a JOIN gds_campaigndate b ON a.id = b.campaignid OIN gds_campaignroute c ON a.id = c.campaignid'";
mysql.runPreparedStatement(prepStat);

var queryString = 'SELECT SUM(a.bookedSeats) AS bs,a.source,b.rbMasterId as rbSource,c.destination,d.rbMasterId as rbDestination, LOCALTIME() as lastupdated FROM gds_routesdata a JOIN  sslocation_region b JOIN gds_routesdata c JOIN  sslocation_region d ON (a.source = b.id AND c.destination = d.id AND a.id = c.id) GROUP BY a.source,c.destination ORDER BY bs DESC LIMIT 10';

mysql.queryMysqlDb(queryString);
var myHashSet = new hashes.HashSet();

var obj =new  opr.operatorroutes(100,2);
//obj.OpId = 1;
console.log("obj.OpId",  obj.OpId);
console.log("obj.RtId",  obj.RtId);


var obj2 =new  opr.operatorroutes(101,2);
//obj.OpId = 1;
console.log("obj.OpId",  obj2.OpId);
console.log("obj.RtId",  obj2.RtId);

var obj3 =new  opr.operatorroutes(101,42);
//obj.OpId = 1;


var obj4 =new  opr.operatorroutes(101,2);
//obj.OpId = 1;

var obj5 =new  opr.operatorroutes(100,6);
//obj.OpId = 1;

var objArray = new Array();
objArray[0] = obj;
objArray[1] = obj2;
objArray[2] = obj3;

objArray[3] = obj4;
objArray[4] = obj5;

var distinctArray = new Array();
var count = 0;

var distinctSet = new Object();


for(i = 0 ; i < objArray.length ; i ++ )
{
	distinct = 1;
	console.log("ObjArray [i]" + i + objArray[i].OpId + objArray[i].RtId);
	var key = objArray[i].OpId + '-' + objArray[i].RtId;
	console.log("key",key);
	myHashSet.add(key);

	/*for (j  = i + 1 ; j < objArray.length; j ++) {
		console.log("ObjArray [j]" + j + objArray[j].OpId + objArray[j].RtId);
		if(objArray[i].OpId == objArray[j].OpId && objArray[i].RtId == objArray[j].RtId  )
		{
			distinct = 0;
			console.log("Identical pairs");
		}


	}
	if(distinct)
	{
		console.log("Distinct ObjArray" + j + objArray[i].OpId + objArray[i].RtId);	
		distinctArray[count] = objArray[i];
		count++;
	}*/

}

console.log("HashSet",myHashSet);
var keys = myHashSet.getKeys();

for(i = 0; i < keys.length; i++)
{
	var newkeys = keys[i].split('-');
	console.log("myHashSet"  + i +  newkeys[0]);
	console.log("myHashSet"  + i +  newkeys[1]);
}






