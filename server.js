var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var controllerBook = require('./controller/book');
var controllerUser = require('./controller/user');
var controllerBookIssued = require('./controller/bookissue');
var controllerRequestBook = require('./controller/requestbook');

// mongoose.connect('mongodb://admin:admin@ds023500.mlab.com:23500/resourcecenter',function(err){
mongoose.connect('mongodb://localhost:27017/resourcecenter',function(err){
	if(err){
		console.log('connection error',err);
	}
	else{
		console.log('Connection Successful');
	}
});

var app = express();	
var http = require('http').Server(app);

app.use(express.static(path.join(__dirname,'angulaApp')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});


app.use(bodyParser.urlencoded({	
  extended: true
}));

app.use(bodyParser.json())

var port=process.env.PORT || 3000
var router = express.Router();

							//////////// BOOK ///////////////////
router.route('/book')
	.post(controllerBook.postnewBook)  
	.get(controllerBook.getallBook);

router.route('/book/:ISBN')
	.get(controllerBook.getspecificBook)
	.put(controllerBook.updateaccessionNumber);	//Perticular ISBN has 5 diffrent accessionNUmber//

							///////////// USER ///////////////////
router.route('/user')
	.post(controllerUser.postnewUser)  
	.get(controllerUser.getallUser);

router.route('/user/:UniqueId')
	.get(controllerUser.getspecificUser);

router.route('/user/security/:UniqueId')
	.get(controllerUser.getsecurity)
	.put(controllerUser.putsecurity)
	.post(controllerUser.putsecurity);

							///////////// IssueBook //////////////
router.route('/bookissue')
	.post(controllerBookIssued.postnewBookIssued)  
	.get(controllerBookIssued.getallBookIssued);

/*router.route('/bookissue/ISBN/:ISBN')
	.get(controllerBookIssued.getIsBookIssued);
*/

router.route('/bookissue/ISBN/:ISBN')
	.get(controllerBookIssued.getAllUsersforIssuedBook);

		////////IS book ISSUED//////////
router.route('/bookissue/:ISBN/:accessionNumber')
	.get(controllerBookIssued.getBookIssued);

router.route('/bookissue/UniqueId/:UniqueId')			
	.get(controllerBookIssued.getAllBookIssuedByUser);

							///////////// RequestBook ////////////
router.route('/requestbook')
	.post(controllerRequestBook.postnewRequestBook)  
	.get(controllerRequestBook.getallRequestBook);

router.route('/requestbook/ISBN/:ISBN')
	.get(controllerRequestBook.getallUserRequestISBN)

router.route('/requestbook/UniqueId/:UniqueId')
	.get(controllerRequestBook.getallISBNRequestByUser)


							//////////// END  ////////////////////

router.get('/',function(req,res){
	res.json('Home page');
});

app.use('/home',router);
app.listen(port);

// console.log('Mongodb is running on localhost:27017/RC');
console.log('Port is running on '+" "+port);
