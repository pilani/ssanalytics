
 srcDests= [{srcid:551,destid:462},{srcid:122,destid:124},{srcid:122,destid:123}]
 ndy=7,//no of days from now
m_names = new Array("January", "February", "March", 
"April", "May", "June", "July", "August", "September", 
"October", "November", "December"),rb=require('./rb.js'),async=require('async');

busData=require('./rb.js')



function orchestrate(){

	async.waterfall(getSDfromSS,logsd2mongo,rb.get,insertRoutes2mongo,fincall);
}

function launch(){


 async.each(generateSrcDestDojCombination(),rb.get,finalCallback);
}

function generateSrcDestDojCombination(){
srcDestDojArr = [];
count = 0;
dt = new Date();
doj = new Date();
for(srcDest in srcDests){
	for(n =0;n<ndy;n++){
		combo = new Object();
		combo['srcid']=srcDests[srcDest].srcid;
		combo['destid']=srcDests[srcDest].destid;
		doj.setDate(dt.getDate()+n);
		combo['doj']=doj.getDate()+"-"+m_names[doj.getMonth()]+"-"+doj.getFullYear();
        srcDestDojArr.push(combo);
	
	count++;
  }
}

return srcDestDojArr;
}

function finalCallback(err){
loggit(err);
}

function loggit(msg){
	console.log(msg);
}

launch();	