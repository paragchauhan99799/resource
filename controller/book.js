var Book = require('../models/book');

exports.postnewBook = function(req,res){
	var book = new Book();	
	book.ISBN = req.body.ISBN;
	book.accessionNumber = req.body.accessionNumber;
	book.place = req.body.place;

	book.save(function(err){
		if(err)
			return res.json({message:'some thing wrong'});

		res.json({ message:'New Book added:'+ book});
	});
};

exports.getallBook = function(req,res){
	
	Book.find(function(err,book) {
		if(err)
			return res.json({message:'some thing'});
		
		var resp={ 
			results:book
		};
		res.json(resp);
	});
};

exports.getspecificBook = function(req,res){
	
	Book.find({ISBN : req.params.ISBN },function(err,book){
		if(err)
			res.send(err);

		var resp={results:book};
		res.json(resp);
	});
};

				// ERROR //
exports.updateaccessionNumber = function(req,res){					
	Book.find({ISBN : req.params.ISBN},function(err,book){
		if(err)
			return res.json({message:'some thing wrong:'});

		book.accessionNumber = req.body.accessionNumber;

		book.save(function(err){
		if(err)
			return res.json({message:'some thing wrong:'});

		res.json({message : 'Update book accessionNumber'});
		});
	});
}