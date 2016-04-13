var mongoose = require('mongoose');

var RequestBookSchema = new mongoose.Schema({
	
	BookName : {
		type : String,
	},
	ISBN : {
		type :String,
	},
	UniqueId :{
		type : String,
	},
	comment : {
		type : String,
		default : null
	}

});

module.exports = mongoose.model('requestbook',RequestBookSchema);