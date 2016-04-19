var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
	ISBN : {
		type :String,
		require : true
	},
	accessionNumber : {
		type : String,
		unique : true
	},
	place : {
		type : String,
		require : true
	},
	title : {
		type : String
	},		
	author : {
		type : String
	}		
});

module.exports = mongoose.model('book',BookSchema);