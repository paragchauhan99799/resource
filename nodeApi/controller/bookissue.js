var BookIssue = require('../models/bookissue');

exports.postnewBookIssued = function(req,res){
	var bookissue = new BookIssue();

	bookissue.ISBN=req.body.ISBN;
	bookissue.accessionNumber=req.body.accessionNumber;
	bookissue.UniqueId=req.body.UniqueId;
	bookissue.DoI=req.body.DoI;
	bookissue.DoExR=req.body.DoExR;
	bookissue.DoR=req.body.DoR;

	bookissue.save(function(err){
		if(err)
			res.send(err);

		res.json({ message : 'New BookIssue added'});
	});
};

				// NOT WORKING //
exports.deleteBookIssued = function(req, res) {		
    BookIssue.findByIdAndRemove({_id : req.params.book_id}, function(err) {
   		if (err)
      		res.send(err);

    	res.json({ message: 'BookIssued removed from the database!' });
  	});
};

exports.getallBookIssued = function(req,res){
	BookIssue.find(function(err,bookissue){
		if(err)
			res.send(err);

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
	// }).select({ISBN:1,accessionNumber:1,UniqueId:1,_id:0});
	BookIssue.find()
	.and([
			{ISBN:req.params.ISBN},
			{DoR:null}
		])
	.exec(function(err,bookissue){
		if(err)
			res.send(err);

		res.json(bookissue);	
	});
};


exports.getAllUsersforIssuedBook = function(req,res){
	BookIssue.find({ ISBN:req.params.ISBN},function(err,bookissue){
		if(err)
			res.send(err);

		res.json('User List  for this ISBN :'+ bookissue);
	}).select({UniqueId:1,_id:0,accessionNumber:1});
};

exports.getAllBookIssuedByUser = function(req,res){
	BookIssue.find({UniqueId:req.params.UniqueId},function(err,bookissue){
		if(err)
			res.send(err);

		res.json('BookIssed list By User: '+bookissue);
	}).select({ISBN : 1,accessionNumber:1,_id :0});
}
