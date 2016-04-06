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


app.controller('homeclr',function($scope,$state,$http,$base64){
	$scope.search = function(){
		$state.go('search');
	};

	$scope.profile = function(){
		var authdata = $base64.encode($scope.username + ':' + $scope.password);
	 		// $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; 
			// $http.get('https://webmail.daiict.ac.in/service/home/~/inbox.rss?limit=1').success(function(data, status, headers, config) {
			// 	console.log('attempted to run');
			// 	console.log(status);
		 	//	$state.go('profile');
			// }).error(function(data, status, headers, config) {
			// 	console.log(status + data);
			// });
			
		//	$http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
		    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
		    $http({method: 'GET', url: 'https://webmail.daiict.ac.in/service/home/~/inbox.rss?limit=1'}).
            success(function(data, status, headers, config) {
                console.log("success " + status);
            }).
            error(function(data, status, headers, config) {
  				console.log("failed " + status);          	
                alert(data);
            });
	};
});


app.controller('searchbookclr',function($scope,$state,$http){
	$scope.profileback = function(){
		$state.go('profile');
	};

	$scope.homeback = function(){
		$state.go('home');
	};
});

app.controller('loginclr',function($scope,$state,$http){
	$scope.profile = function(){
		$state.go('profile');
	};
});

app.controller('profileclr',function($scope,$state,$http){
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

app.controller('otherclr',function($scope,$state,$http){
	$scope.searchstudent = function(){
		$state.go('otherprofile');
	};
	$scope.back = function(){
		$state.go('profile');
	};
});

app.controller('requestbookclr',function($scope,$state,$http){
	$scope.requestbook = function(){
		$state.go('profile');
	};
	$scope.cancell = function(){
		$state.go('profile');
	};
});

app.controller('bookissuelist',function($scope,$http){
	$scope.booklist = {};

	$http.get("http://localhost:3000/home/book").success(function(response){
		if(response.error === 0){
			$scope.booklist = response;
			console.log(booklist);
		}else{
			$scope.booklist = [];
			console.log('Nothing there');
		}
	});
});