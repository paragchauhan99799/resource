var RequestBook = require('../models/requestbook');

exports.postnewRequestBook = function(req,res){
	var requestbook = new RequestBook();

	requestbook.ISBN=req.body.ISBN;
	requestbook.UniqueId=req.body.UniqueId;
	requestbook.DoReq=req.body.DoReq;
	requestbook.comment=req.body.comment;

	requestbook.save(function(err){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json({ message : 'New Book Request added'});
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