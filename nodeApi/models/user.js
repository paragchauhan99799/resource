var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	Name :{
		type : String,
		required: true
	},
	UniqueId :{
		type : String,
		required: true
	},
	Security :{
		type : String
	}
});

module.exports = mongoose.model('user',UserSchema);