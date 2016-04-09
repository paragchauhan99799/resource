var app = angular.module('rcapp',['ui.router', 'base64', 'ngCookies']);

app.config(['$stateProvider','$urlRouterProvider',
	function ($stateProvider,$urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "templates/home.html",
			//	controller:'homeclr'
				//security :false
			}).state('search', {
				url: "/search",
				templateUrl: "templates/search.html",
			//	controller:'searchclr'
				//security :false
			}).state('profile', {
				url: "/profile",
				templateUrl: "templates/profile.html",
			//	controller:'profileclr'
				//security :true
			}).state('other', {
				url: "/other",
				templateUrl: "templates/other.html",
			//	controller:'otherclr'
				//security :true
			}).state('requestbook', {
				url: "/requestbook",
				templateUrl: "templates/requestbook.html",
			//	controller:'requestclr'
				//security :true
			}).state('otherprofile', {
				url: "/otherprofile",
				templateUrl: "templates/otherprofile.html",
			//	controller:'homeclr'
				//security :true
			}).state('bookdetails', {
				url: "/bookDetails",
				templateUrl: "templates/bookDetails.html"
			})
		}
]);

app.run(function ($rootScope,$cookies) {
        $rootScope.userid = null;
        $rootScope.otheruserid = null;
    });

app.service('Service', function(){
	var result;
    var book;
   return{
	   setdata :function(data) {
		  this.result= data;
	   },
	   getdata :function(){
	   	  return this.result;
	   },
	   setbook: function(data){
	   		this.book = data;
//	   		console.log(this.book);
	   },
	   getbook :function(){
	   	  return this.book;
	   }
   }
});

app.controller('homeclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	//$cookies.username='-1';
	$rootScope.result = [];
	console.log("Home cookies:"+ $cookies.username);
	
	$scope.search = function(){
		//		console.log('function searchBook');
		
		var key = $scope.searchBook.split(' ').join('_');
		var urlnew ='https://www.googleapis.com/books/v1/volumes?q=' + key;
	//	console.log(urlnew);
		$http({
		  method: 'GET',
		  url: urlnew,
		}).then(function successCallback(response) {
			Service.setdata(response.data.items);
			$state.go('search');
		  }, function errorCallback(response) {
	//	  		console.log("Fail!");
		  });	
	};

	$scope.profile = function(){
		var authdata = $base64.encode($scope.username + ':' + $scope.password);
	 	$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; 
		
		$http.get('https://webmail.daiict.ac.in/service/home/~/inbox.json').success(function(data,status,header,config) {
		 	function waitcookies(){
		 		$cookies.username = $scope.username;
		 		console.log("successfully LogIn:"+ $cookies.username);
		 		$state.go('profile')
		 	}
		 	waitcookies();
			}).error(function(data, status, headers, config) {
				console.log('Not'+status+data);
			});
		
		console.log("Done");
	};
}]);


app.controller('profileclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies',function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}
	
	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;

	console.log("Profile cookies:"+$cookies.username);
	console.log("Profile userid:"+userid);

	$scope.booklist = {};
	$http.get("http://localhost:3000/home/bookissue/").success(function(response){
			$scope.booklist = response;		
	});

	$scope.search = function(){
		$state.go('search');
	};
	$scope.other = function(){
		$state.go('other');
	};
	$scope.requestbook = function(){
		$state.go('requestbook');
	};
	$scope.logout = function(){
		$cookies.username='-1';
		console.log("Logout cookies:"+$cookies.username);
		$state.go('home');
	};
	$scope.back = function(){
		$state.go('other');
	};
}]);


app.controller('searchbookclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	console.log("searh cookies:"+$cookies.username);
	
	$scope.profileback = function(){
		$state.go('profile');
	};

	$scope.result = Service.getdata();
	$scope.ourResult = [];	
	$scope.requestBooks = [];
		

	angular.forEach($scope.result, function(value, key) {
  	//	console.log(key + ': ' + value.volumeInfo.industryIdentifiers[0].identifier);
  		var urlnew2 = 'http://localhost:3000/home/Book/'+value.volumeInfo.industryIdentifiers[0].identifier;
  	//	console.log("API USR:"+urlnew2);  		
 
 		$http.get(urlnew2).success(function(response){
 			console.log(response);
 			if(response.results[0]==null){
        		$scope.requestBooks.push(value);
 			}
 			else{
        		$scope.ourResult.push(value);
 			}
 		});
	});
	
	$scope.book = function(index){
//		console.log(index);
		Service.setbook($scope.ourResult[index]);
		
		$state.go("bookdetails");
	
	};
	
	$scope.request = function(index){	
		Service.setbook($scope.requestBooks[index]);
		$state.go("requestbook");			
	}
	
	$scope.moredetails = function(){
		//$state.go('bookdetails');
	};


	$scope.homeback = function(){
		$state.go('home');
	};
}]);

app.controller('otherclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}
	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;

	console.log("other cookies:"+$cookies.username);
	
	$scope.searchstudent = function(){
		$rootScope.otheruserid = $scope.searchprofile;
		$state.go('otherprofile');
	};
	$scope.back = function(){
		$state.go('profile');
	};
}]);

app.controller('bookDetailsclr',function($location, $scope,$state,$http, Service){

	$scope.book = Service.getbook();
	var key = $scope.book.volumeInfo.industryIdentifiers[0].identifier;
	$scope.myResult = [];
	var urlnew2 = 'http://localhost:3000/home/Book/'+key;		
	$http.get(urlnew2).success(function(response){
		if(response.results[0]==null){

		}
		else{
    		$scope.myResult=response.results;
		}
	});
	
	$scope.homeback = function(){
		$state.go('search');
	};
});


app.controller('otherprofileclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}

	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;

	console.log("otherprofile cookies:"+$cookies.username);
	var otheruserid = $rootScope.otheruserid;	
	
	$scope.booklist = {};
	$http.get("http://localhost:3000/home/bookissue").success(function(response){
			$scope.booklist = response;		
	});

	$scope.back = function(){
		$state.go('profile');
	};
}]);

app.controller('requestbookclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}
	console.log("requestbook cookies:"+$cookies.username);



	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;
	$scope.book = Service.getbook();
	
	$scope.reqbooklist = {};
	$http.get("http://localhost:3000/home/requestbook").success(function(response){
			$scope.reqbooklist = response;		
	});

	$scope.requestbook = function(){
		$scope.bookdata = {};
		var requestbook = {
			"ISBN":$scope.isbn,
			"UniqueId":$rootScope.userid,
			"DoReq":11/01/2000,
			"comment":$scope.comment
		};
		$http.post("http://localhost:3000/home/requestbook",requestbook).success(function(res){
			if(res.error == 0){	
				console.log('added successfully');
				$state.go("profile");}
			else{
				console.log('Error');
			}

		});
	};
//		$state.go('profile');

	$scope.cancell = function(){
		$state.go('profile');
	};
}])
