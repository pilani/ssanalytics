var mongoose = require('mongoose'),
logger = require('./logger.js'),
Schema = mongoose.Schema,
cfg = require('./config.js').config;


//Exports
exports.createNewModel = createNewModel;
exports.insertRecords = insertRecords;
exports.upsertRecords = upsertRecords;
exports.renameCollection = renameCollection;
exports.createNewCappedModel = createNewCappedModel;

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
	model.collection.insert(rowsSetToBeInserted,{},function(err)
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

}


function upsertRecords(modelName,updateConditionFieldsArray,rowsSetToBeUpdated,upsertFlag,newColumnsToBeInserted,newColumnsToBeInsertedFlag)
{
	var model = mongoose.model(modelName, schema);
	for( var i = 0 ; i < rowsSetToBeUpdated.length ; i++)
	{
		Step
		(
			function()
			{
				if(newColumnsToBeInsertedFlag == true)
				{
					rowsSetToBeUpdated[i] = insertColumsInTheRequestArray(rowsSetToBeUpdated[i],newColumnsToBeInserted,function(err)
						{
							if(err)
							{
								logger.logMsg(err,"Failed to add new columns" + newColumnsToBeInserted);
							}
							else
							{
								logger.logMsg("","Successfully added new columns" + newColumnsToBeInserted + "into model" + modelName);
							}
						});
				}
			},

			function()
			{
				// forming the update condition string
				var updateConditionFieldsArrayString = {};
				for(var j = 0; j < updateConditionFieldsArray.length ; j++)
				{
					// TODO Write updation logic
					//updateConditionFieldsArrayString 
				}
			},	
			
			function(updateConditionFieldsArrayString)
			{

				model.collection.update(updateConditionFieldsArrayString,rowsSetToBeUpdated[i],{upsert: upsertFlag},function(err)
				{
					if(err)
   					{
    					logger.logMsg(err,"Error upserting the collection :" + newColumnsToBeInserted + "into model" + modelName);
					}
    				else
    				{
    					logger.logMsg("","Successfully upserted new records" + newColumnsToBeInserted + "into model" + modelName);
   					}

				});
			}	
		)	
	}
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


function insertColumsInTheRequestArray(rowToBeInserted,newColumnsToBeInserted)
{

	for(i = 0 ; i< newColumnsToBeInserted.length; i++)
	{
		rowToBeInserted.newColumnsToBeInserted[i] = newColumnsToBeInserted[i];
	}
	return rowToBeInserted;
}


