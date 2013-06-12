var mongoose = require('mongoose'),
logger = require('./logger.js'),
Schema = mongoose.Schema,
cfg = require('./config.js').config;
var ObjectId = mongoose.Types.ObjectId;


//Exports
exports.createNewModel = createNewModel;
exports.insertRecords = insertRecords;
exports.upsertRecords = upsertRecords;
exports.renameCollection = renameCollection;
exports.createNewCappedModel = createNewCappedModel;
exports.queryCollection = queryCollection;
exports.copyRecord = copyRecord;
exports.insertColumns = insertColumns;

// Mongo Db connection
Schema = mongoose.Schema;
db = mongoose.connect('mongodb://'+cfg["MONGO_URL"]);

//default schema
var schema = mongoose.Schema({ key: String});


function createNewModel(modelName)
{
	var newModel = mongoose.model(modelName, schema);

	// insert dummy row
	var newRecord = new newModel({key: "value"});

	newRecord.save(function(err){
 		
 	 if(err)
 		{
 		 	logger.logMsg(err,"MongoDb row insertion error");
 		 	return err;
 		 }
 		 else
 		 {
 		 	logger.logMsg("","Schema" + modelName + "created successfully" );
 		 }
});
	return newModel;

}


function createNewCappedModel(modelName,size,maxNumRows)
{
	var cappedSchema = mongoose.Schema({ key: String},{capped: {size: size, max: maxNumRows }});
	var newModel = mongoose.model(modelName, cappedSchema);

	// insert dummy row
	var newRecord = new newModel({key: "value"});

	newRecord.save(function(err){
 		
 	 if(err)
 		{
 		 	logger.logMsg(err,"MongoDb row insertion error");
 		 	return err;
 		 }
 		 else
 		 {
 		 	logger.logMsg("","Schema" + modelName + "created successfully" );
 		 }
});
	return newModel;

}


function insertRecords(modelName,rowsSetToBeInserted)
{
	console.log(rowsSetToBeInserted);
	var model = mongoose.model(modelName, schema);
	var record = model.collection.insert(rowsSetToBeInserted,{},function(err)
	{
      if(err)
      {
      	logger.logMsg(err,"Error inserting records" + rowsSetToBeInserted + "into model" + modelName);
      }
      else
      {
      	logger.logMsg("","Successfully inserted records into model " + modelName + "records" + rowsSetToBeInserted );
      }
    });  
	return record;
}


// make it more generic 
function insertColumns(modelName,updateCondition,newColumnsToBeInsertedArray,fromRowSet,toRowSet)
{
	logger.logMsg("updateCondition",updateCondition);
	logger.logMsg("newColumnsToBeInsertedArray",newColumnsToBeInsertedArray);
	var model = mongoose.model(modelName, schema);
	
		logger.logMsg("updateCondition",updateCondition);
		model.collection.update(updateCondition,newColumnsToBeInsertedArray,{upsert: true},function(err,res)
			{
			if(err)
   				{
    				logger.logMsg(err,"Error upserting the collection :" + modelName);
				}
    		else
    		{

    			//logger.logMsg("res",res);
    			//logger.logMsg("","Successfully upserted new records" + fromRowSet[i].campaignId + "into model" + modelName + "existing records" + toRowSet );
   			}	

		});
	
}


function upsertRecords(modelName,updateCondition,rowsSetToBeUpdated,upsertFlag)
{
	var model = mongoose.model(modelName, schema);
	console.log("updateCondition", updateCondition + "rowsSetToBeUpdated" + rowsSetToBeUpdated);
	model.collection.update(updateCondition,rowsSetToBeUpdated,{upsert: upsertFlag},function(err)
		{
			if(err)
   				{
    				logger.logMsg(err,"Error upserting the collection :" + modelName);
				}
    		else
    		{
    			//logger.logMsg("","Successfully upserted new records" + rowsSetToBeUpdated + "into model" + modelName);
   			}	

		});
				
}

function renameCollection(oldName, newName)
{
	var model = mongoose.model(oldName, schema);
	model.collection.rename(newName, {dropTarget:true},function (err, collection){
    if(err)
    {
    	logger.logMsg(err,"Error renaming the collection :" + oldName);
    }
    else
    {
    	logger.logMsg("",oldName + "Collection successfully renamed");
    }
});

}

function queryCollection(modelName,queryString,callback)
{
	var model = mongoose.model(modelName, schema);
	logger.logMsg("queryString",queryString);
	//model.where(queryString).exec(function(err,res)
	model.find(queryString,function(err,res)
		{
			if(err)
			{
				logger.logMsg(err,"Error in querying");
			}
			else
			{
				logger.logMsg("Results",res);
				callback(null,res);
			}
		});
}

function copyRecord(modelName,recordToBeCopied)
{
	var model = mongoose.model(modelName, schema);
	logger.logMsg("Record to be copied",recordToBeCopied);
	//recordToBeCopied = recordToBeCopied.clone();
	//logger.logMsg("New obj id",new ObjectId());
	//recordToBeCopied._id = undefined;
	//logger.logMsg("Record to be copied",recordToBeCopied);
	recordToBeCopied._id = new ObjectId();

	//insertRecords(modelName,recordToBeCopied);

	model.collection.save(recordToBeCopied,function(err,res)
		{
			if(err)
			{
				logger.logMsg(err,"Error in copying record");
			}
			else
			{
				logger.logMsg("Results",res);
				callback(null,res);
			}
		});
	
	//var queryString = {id:recordToBeCopied._id};

	//upsertRecords(modelName,queryString,recordToBeCopied,false);
	//insertRecords(modelName,recordToBeCopied);
	/*model.collection.save(recordToBeCopied,function(err,res)
		{
			if(err)
			{
				logger.logMsg(err,"Error in copying record");
			}
			else
			{
				logger.logMsg("Results",res);
				callback(null,res);
			}
		});*/
	//logger.logMsg("Record duplicated",recordToBeCopied._id);
}


//not used
function insertColumsInTheRequestArray(rowToBeInserted,newColumnsToBeInserted)
{

	for(i = 0 ; i< newColumnsToBeInserted.length; i++)
	{
		rowToBeInserted.newColumnsToBeInserted[i] = newColumnsToBeInserted[i];
	}
	return rowToBeInserted;
}


