var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
	ISBN : {
		type :String,
		required : true
	},
	accessionNumber : {
		type : String,
		unique : true
	}		
});

module.exports = mongoose.model('RC',BookSchema);