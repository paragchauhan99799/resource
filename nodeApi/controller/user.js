var User = require('../models/user');

//POST API
exports.postnewUser = function(req,res){
	var user = new User();

	user.Name = req.body.Name;
	user.UniqueId = req.body.UniqueId;
	user.Security = req.body.Security;

	user.save(function(err){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json({ message : 'New User added'});
	});
};

exports.getsecurity = function(req,res){
	User.find({UniqueId : req.params.UniqueId},function(err,user){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json(user);
	}).select({_id:0,__v:0,Name:0,UniqueId:0});
};

//GET API
exports.getallUser = function(req,res){
	User.find(function(err,user){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json(user);
	});
};

exports.getspecificUser = function(req,res){
	User.find({UniqueId : req.params.UniqueId},function(err,user){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json(user);
	});
}