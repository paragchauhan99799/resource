var app = angular.module('rcapp',['ui.router', 'base64']);

app.config(['$stateProvider','$urlRouterProvider',
	function ($stateProvider,$urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "templates/home.html",
				//controller:'homeclr'
			}).state('search', {
				url: "/search",
				templateUrl: "templates/search.html"
			}).state('profile', {
				url: "/profile",
				templateUrl: "templates/profile.html",
				//controller:'profileclr'
			}).state('other', {
				url: "/other",
				templateUrl: "templates/other.html"
			}).state('requestbook', {
				url: "/requestbook",
				templateUrl: "templates/requestbook.html"
			}).state('otherprofile', {
				url: "/otherprofile",
				templateUrl: "templates/otherprofile.html"
			})
		}
]);

app.run(function ($rootScope) {
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

app.controller('homeclr',function($scope,$rootScope,$state,$http,Service,$base64){
	
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
			$state.go('search');
		  }, function errorCallback(response) {
		  		console.log("Fail!");
		});
	};

	$scope.profile = function(){
		$rootScope.userid = $scope.username;
		
		var authdata = $base64.encode($scope.username + ':' + $scope.password);
	 	$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; 
		
		$http.post('https://webmail.daiict.ac.in/service/home/~/inbox.json').success(function(data,status,header,config) {
		 	$state.go('profile');
		}).error(function(data, status, headers, config) {
				console.log('Not'+status+data);
		});
			
		console.log("Done");


	/*	//	$http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
		    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
		    $http({method: 'GET', url: 'https://webmail.daiict.ac.in/service/home/~/inbox.rss?limit=1'}).
            success(function(data, status, headers, config) {
                console.log("success " + status);
            }).
            error(function(data, status, headers, config) {
  				console.log("failed " + status);          	
                alert(data);
            });*/


/*		console.log("Start");
		var authdata = $scope.username + ':' + $scope.password;
        $http({
		  method:'GET',
		  url:'https://webmail.daiict.ac.in/service/home/~/inbox.js',
		  data:authdata,
		 }).then(inputsuccesscallback,inputerrorcallback);

       	var inputsuccesscallback = function (response) {
    		console.log('success');
        };
	
		var inputerrorcallback = function(reason){
			console.log("Try Again");
		};

*/


	};
});


app.controller('searchbookclr',function($scope,$state,$http,Service){
	$scope.profileback = function(){
		$state.go('profile');
	};

	$scope.result = Service.getdata();

	$scope.homeback = function(){
		$state.go('home');
	};
});

app.controller('loginclr',function($scope,$state,$http){
	$scope.profile = function(){
		$state.go('profile');
	};
});

app.controller('profileclr',function($scope,$rootScope,$state,$http){
	var userid=$rootScope.userid;

	$scope.booklist = {};
	$http.get("http://localhost:3000/home/bookissue").success(function(response){
			$scope.booklist = response;		
	});

	$scope.search = function(){
		$state.go('search');
		console.log('search');
	};
	$scope.other = function(){
		$state.go('other');
	};
	$scope.requestbook = function(){
		$state.go('requestbook');
	};
	$scope.logout = function(){
		$state.go('home');
	};
	$scope.back = function(){
		$state.go('other');
	};
});

app.controller('otherclr',function($scope,$rootScope,$state,$http){
	$scope.searchstudent = function(){
		$rootScope.otheruserid = $scope.searchprofile;
		$state.go('otherprofile');
	};
	$scope.back = function(){
		$state.go('profile');
	};
});

app.controller('otherprofileclr',function($scope,$rootScope,$state,$http){
	var otheruserid = $rootScope.otheruserid;	
	$scope.booklist = {};
	$http.get("http://localhost:3000/home/bookissue").success(function(response){
			$scope.booklist = response;		
	});

	$scope.back = function(){
		$state.go('profile');
	};
});

app.controller('requestbookclr',function($scope,$rootScope,$state,$http){
	var userid = $rootScope.userid;
	
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
})
