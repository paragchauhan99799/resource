var mongoose = require('mongoose');

var BookIssueSchema = new mongoose.Schema({
	ISBN : {
		type :String,
		requireed : true
	},
	accessionNumber : {
		type : String,
		required: true
	},
	UniqueId :{
		type : String,
		required: true
	},
	DoI : {
		type : Date,
		required: true
	},
	DoExR :{
		type : Date,
		required : true
	},
	DoR : {
		type : Date,
		default : null
	}

});

module.exports = mongoose.model('bookissue',BookIssueSchema);