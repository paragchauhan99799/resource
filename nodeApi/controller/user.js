var User = require('../models/user');

//POST API
exports.postnewUser = function(req,res){
	var user = new User();

	user.UniqueId = req.body.UniqueId;

	user.save(function(err){
		if(err)
			res.send(err);

		res.json({ message : 'New User added'});
	});
};

//GET API
exports.getallUser = function(req,res){
	User.find(function(err,user){
		if(err)
			res.send(err);

		res.json(user);
	});
};

exports.getspecificUser = function(req,res){
	User.find({UniqueId : req.params.UniqueId},function(err,user){
		if(err)
			res.send(err);

		res.json(user);
	});
}