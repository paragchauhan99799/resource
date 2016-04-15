var BookIssue = require('../models/bookissue');
var dateFormat = require('dateformat');

exports.postnewBookIssued = function(req,res){
	var bookissue = new BookIssue();

	bookissue.ISBN=req.body.ISBN;
	bookissue.accessionNumber=req.body.accessionNumber;
	bookissue.UniqueId=req.body.UniqueId;
	bookissue.DoI = req.body.DoI;
	bookissue.DoExR = req.body.DoExR;
	bookissue.DoR = req.body.DoR;

	//console.log(bookissue.DoI);
	var varDoI = new Date(req.body.DoI);
	var varDoExR = new Date(req.body.DoExR);
	var varDoR = new Date(req.body.DoR);
	// var varDiff= new Date(req.body.DoExR-req.body.DoI);

	var DoIdate = varDoI.getDate()+"/"+(varDoI.getMonth()+1)+"/"+varDoI.getFullYear();
	var DoExRdate = varDoExR.getDate()+"/"+(varDoExR.getMonth()+1)+"/"+varDoExR.getFullYear();
	var DoRdate = varDoR.getDate()+"/"+(varDoR.getMonth()+1)+"/"+varDoR.getFullYear();
	// var Diffdate= varDiff.getDate()+"/"+(varDiff.getMonth()+1)+"/"+varDiff.getFullYear();
	
	/*bookissue.DoI= DoIdate;
	bookissue.DoExR= DoExRdate;
	bookissue.DoR= DoRdate;*/

	console.log(DoIdate);
	console.log(DoExRdate);
	console.log(DoRdate);
	// console.log(Diffdate);
	console.log("Dif in dates is");
	var xy = varDoI - varDoR;
	console.log(xy);

	/*var par = new Date(req.body.DoI);
	var date = par.getDate()+"/"+(par.getMonth()+1)+"/"+par.getFullYear();
	console.log(date);*/
	
	//console.log(dateFormat(bookissue.DoI, "dddd, mmmm dS, yyyy, h:MM:ss TT"));

	bookissue.save(function(err){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json({ message : 'New BookIssue added'});
	});
};

exports.getBookIssued = function(req,res){
	BookIssue.find({ISBN:req.params.ISBN, accessionNumber:req.params.accessionNumber, DoR:null},function(err,bookissue){
		console.log(req.body);
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json(bookissue);
	})
};


exports.getAllUsersforIssuedBook = function(req,res){
	BookIssue.find({ ISBN:req.params.ISBN},function(err,bookissue){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json('User List  for this ISBN :'+ bookissue);
	}).select({UniqueId:1,_id:0,accessionNumber:1});
};



				// NOT WORKING //
exports.deleteBookIssued = function(req, res) {		
    BookIssue.findByIdAndRemove({_id : req.params.book_id}, function(err) {
   		if (err)
      		return res.json({message:'some thing wrong:'});

    	res.json({ message: 'BookIssue removed from the database!' });
  	});
};

exports.getallBookIssued = function(req,res){
	BookIssue.find(function(err,bookissue){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json(bookissue);
	});
};

exports.getIsBookIssued = function(req,res){
	// BookIssue.find({ 
	// 	$and:[
	// 		{ISBN:req.params.ISBN},
	// 		{DoR:null}
	// 		]
	// },function(err,bookissue){		/////AND FUN NOT WORKING////
	// 	if(err)
	// 		res.send(err);

	// 	res.json(bookissue);	
	// }).select({ISBN:1,accessionNumber:1,UniqueId:1,_id:0	});
	
	BookIssue.find()
	.and([
			{ISBN:req.params.ISBN},
			{DoR:null}
		])
	.exec(function(err,bookissue){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json(bookissue);	
	});
};



exports.getAllBookIssuedByUser = function(req,res){
	BookIssue.find({UniqueId:req.params.UniqueId},function(err,bookissue){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json('BookIssed list By User: '+bookissue);
	}).select({ISBN : 1,accessionNumber:1,_id :0});
}
