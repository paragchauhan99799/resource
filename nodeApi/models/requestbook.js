var mongoose = require('mongoose');

var RequestBookSchema = new mongoose.Schema({
	ISBN : {
		type :String,
		requireed : true
	},
	UniqueId :{
		type : String,
		required: true
	},
	DoReq : {
		type : Date,
		required: true,
		default : null
	},
	comment : {
		type : String,
		default : null
	}

});

module.exports = mongoose.model('requestbook',RequestBookSchema);