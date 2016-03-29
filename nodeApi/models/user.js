var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	UniqueId :{
		type : String,
		required: true,
		unique : true
	}
});

module.exports = mongoose.model('USER',UserSchema);