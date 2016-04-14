var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
	ISBN : {
		type :String
	},
	accessionNumber : {
		type : String
	},
	place : {
		type : String
	}		
})
BookSchema.index({ISBN: 1, accessionNumber: 1}, {unique: true});

module.exports = mongoose.model('book',BookSchema);