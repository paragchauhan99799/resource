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
			})
		}
]);

app.run(function ($rootScope,$cookies) {
        $rootScope.userid = null;
        $rootScope.otheruserid = null;
    });

app.service('Service', function(){
	var result;
   
   return{
	   setdata :function(data) {
		  this.result= data;
	   },
	   getdata :function(){
	   	  return this.result;
	   }
   }
});

app.controller('homeclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	console.log("Home cookies:"+ $cookies.username);
	
	$scope.search = function(){
		console.log('function searchBook');
		
		var key = $scope.searchBook.split(' ').join('_');
		var urlnew ='https://www.googleapis.com/books/v1/volumes?q=' + key;
		console.log(urlnew);
		$http({
		  method: 'GET',
		  url: urlnew,
		}).then(function successCallback(response) {
			Service.setdata(response.data.items);
			console.log("get success");
			$state.go('search');

		  }, function errorCallback(response) {
		  		console.log("Fail!");
		});
		console.log("compleer");
			
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
	$http.get("http://localhost:3000/home/bookissue").success(function(response){
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

	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;

	console.log("requestbook cookies:"+$cookies.username);
	
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

	$scope.cancell = function(){
		$state.go('profile');
	};
}])
