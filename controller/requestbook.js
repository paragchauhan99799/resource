var RequestBook = require('../models/requestbook');
var mongo = require('mongoose');
var db = mongo.connect("mongodb://localhost:27017/resourcecenter");

exports.postnewRequestBook = function(req,res){
	var requestbook = new RequestBook();
	
	requestbook.BookName=req.body.BookName,
	requestbook.ISBN=req.body.ISBN,
	requestbook.UniqueId=req.body.UniqueId,
	requestbook.comment=req.body.comment
	
	requestbook.save(function(err){
		console.log(err);
		if(err)
			return res.json({error:"0"});

		//link////////
		res.redirect('http://localhost:3000/index.html#/success');
	});
};

exports.getallRequestBook = function(req,res){
	RequestBook.find(function(err,requestbook){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json(requestbook);
		});
};

exports.getallUserRequestISBN = function(req,res){
	RequestBook.find({ISBN:req.params.ISBN},function(err,requestbook){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json('User list for requested ISBN: '+requestbook);
		}).select({UniqueId:1,Doreq:1,_id:0});
};

exports.getallISBNRequestByUser= function(req,res){
	RequestBook.find({UniqueId:req.params.UniqueId},function(err,requestbook){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json('Requested ISBN list : '+requestbook);
		}).select({ISBN:1,Doreq:1,_id:0});
};