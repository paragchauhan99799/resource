var app = angular.module('rcapp',['ui.router']);

app.config(['$stateProvider','$urlRouterProvider',
	function ($stateProvider,$urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "templates/home.html"
			}).state('search', {
				url: "/search",
				templateUrl: "templates/search.html"
			}).state('profile', {
				url: "/profile",
				templateUrl: "templates/profile.html"
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


app.controller('homeclr',function($scope,$state,$http){
	$scope.search = function(){
		$state.go('search');
	};

	$scope.profile = function(){
		$state.go('profile');
		
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
	$scope.booklist = [];
	$http.get("http://localhost:3000/Home/bookissue").success(function(response){
		if(response.error === 0){
			$scope.booklist = response;
			console.log(booklist);
		}else{
			$scope.booklist = [];
			console.log('Nothing there');
		}
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