var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
	ISBN : {
		type :String,
		require : true
	},
	accessionNumber : {
		type : String,
		require : true
	},
	place : {
		type : String,
		require : true
	}		
});

module.exports = mongoose.model('book',BookSchema);