var app = angular.module('rcapp',['ui.router', 'ngCookies', 'base64']);

app.config(['$stateProvider','$urlRouterProvider',
	function ($stateProvider,$urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "home.html",
			}).state('login', {
				url: "/login",
				templateUrl: "Login.html",
			//	controller:'searchclr'
				//security :false
			}).state('search', {
				url: "/search",
				templateUrl: "search.html",
			//	controller:'searchclr'
				//security :false
			}).state('profile', {
				url: "/profile",
				templateUrl: "profile.html",
			//	controller:'profileclr'
				//security :true
			}).state('other', {
				url: "/other",
				templateUrl: "other.html",
			//	controller:'otherclr'
				//security :true
			}).state('requestbook', {
				url: "/requestbook",
				templateUrl: "requestbook.html",
			//	controller:'requestclr'
				//security :true
			}).state('otherprofile', {
				url: "/otherprofile",
				templateUrl: "otherprofile.html",
			//	controller:'homeclr'
				//security :true
			}).state('bookdetails', {
				url: "/bookDetails",
				templateUrl: "bookDetails.html"
			}).state('success', {
				url: "/success",
				templateUrl: "success.html"
			}).state('bookdetails2', {
				url: "/bookDetails2",
				templateUrl: "bookDetails2.html"
			}).state('requesthistory', {
				url: "/requesthistory",
				templateUrl: "requesthistory.html"
			}).state('setting', {
				url: "/setting",
				templateUrl: "setting.html"
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
    var temp;
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
	   },
	   settemp: function(data){
	   		this.temp = data;
	   },
	   gettemp :function(){
	   	  return this.temp;
   		}	
	}
});
app.controller('homeclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){

	$scope.result = [];
	console.log("Home cookies:"+ $cookies.username);
	$scope.searchText = "";

	$scope.search = function(){
		$scope.searchText = "Searching...";
		var key = $scope.searchBook.split(' ').join('_');
		var urlnew ='https://www.googleapis.com/books/v1/volumes?q=' + key;
	
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://bingapis.azure-api.net/api/v5/spellcheck?spell', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '7a12e99b0de74fd08ed9bc52312c538d');
		// xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '8951409e87624398829380c787b5c0d4');
		xhr.onload = function () {
		    $scope.autocorrected = $scope.searchBook;
		    console.log("Searched Book is " + $scope.autocorrected);
		    var xyz = JSON.parse(this.responseText);
		    $scope.arr = xyz.flaggedTokens;
		    console.log($scope.arr);
		    angular.forEach($scope.arr, function(value, key) {
			    // console.log(value);
		    	$scope.autocorrected = $scope.autocorrected.replace(value.token,value.suggestions[0].suggestion);
			    // console.log("Corrected search is " + $scope.autocorrected);
		    });
		    console.log("Corrected search is " + $scope.autocorrected);
		    if($scope.arr.length != 0){
    		    Service.settemp($scope.autocorrected);	
		    }
		    else{
    		    Service.settemp("");			    	
		    }

		    $http({
			  method: 'GET',
			  url: urlnew,
			}).then(function successCallback(response) {
				Service.setdata(response.data.items);
				console.log("dtaa : "+Service.getdata());
				$state.go('search');
			  }, function errorCallback(response) {
		  	});
		};
		xhr.send('text=' + $scope.searchBook.split(' ').join('+'));	
	
	};
	$scope.login = function(){
			$state.go('login');
	};
	$scope.profile = function(){
			$state.go('profile');
	};

	$scope.clearText = function(){
			$scope.searchBook="";
	};

}]);


app.controller('loginclr', [ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
			
	}
	else{
			$state.go('profile');
	}


	$scope.profile = function(){
		$scope.authString="";
		if (($scope.username===undefined || $scope.username=="") && ($scope.password===undefined||$scope.password=="")) {
			$scope.authString="Enter ID and password";
		}
		else if(($scope.username===undefined || $scope.username=="")){
			$scope.authString="Enter ID";
		}
		else if(($scope.password===undefined|| $scope.password=="")){
			$scope.authString="Enter password";
		}
		else{
			var authdata = $base64.encode($scope.username + ':' + $scope.password);
			$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

		var authdata = $base64.encode($scope.username + ':' + $scope.password);
	 	$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; 
		
		$http.get('https://bangle.io/api/email').success(function(data,status,header,config) {
		 		$cookies.username = $scope.username;
		 		console.log("successfully LogIn:"+ $cookies.username);
		 		$http({                                               //verify
	                url: "http://localhost:3000/home/user",
	                method: "POST",
	                data: {Name: "xyz",UniqueId: $scope.username,Security: true}
               	}).success(function(data){
               		console.log(data);
			 		$state.go('profile',{ reload: true });
                	// alert('success post');
               	}).error(function(){
                	// alert('error');
                	console.log(err);
            	});
			}).error(function(data, status, headers, config) {
				console.log("Enable to auth webmail");
				$scope.authString="Incorrect ID or password";
				$scope.password="";
			});
		}
	};

	$scope.back = function(){
			$state.go('home');
	};

}]);

app.controller('indexclr', function($scope,$state,$http){

	$scope.login = function(){
			$state.go('login');
	};

	$scope.profile = function(){
			$state.go('profile');
	};
});



app.controller('profileclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies',function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}
	$(".dropdown-button").dropdown();

	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;

	console.log("Profile cookies:"+$cookies.username);
	console.log("Profile userid:"+userid);


	$scope.booklist = [];
	$scope.extbooklist = [];
	$scope.currentissuedbooklist = [];
	$scope.currentissuedextbooklist = [];
	$scope.days = [];

	$http.get("http://localhost:3000/home/bookissue").success(function(response){
			angular.forEach(response, function(value, key) {
				if (value.UniqueId==userid) {
					var key = value.ISBN;
					var urlnew ='https://www.googleapis.com/books/v1/volumes?q=isbn:' + key;
					console.log(urlnew);
					$http({
					  method: 'GET',
					  url: urlnew,
					  headers: {
					  'Authorization': undefined
					}
					}).then(function successCallback(response) {
						if(response.data.totalItems!=0){
							console.log("Not Added");
							//////////// Do Something Here ////////////////
							/*$scope.booklist.push(value);
							$scope.extbooklist.push(response.data.items[0]);*/
							//$scope.extbooklist.push(value);

				 			if(value.DoR==null){
						    	$scope.currentissuedbooklist.push(value);
						    	$scope.currentissuedextbooklist.push(response.data.items[0]);
						    	$scope.tempxyz = new Date();
							    $scope.firstdate = value.DoExR.substring(0, 10);
					    		$scope.seconddate = $scope.tempxyz.getDate()+"-"+($scope.tempxyz.getMonth()+1)+"-"+$scope.tempxyz.getFullYear();
							    $scope.data_before = [];
							    var dt1 = $scope.firstdate.split('-'),
							        dt2 = $scope.seconddate.split('-'),
							        one = new Date(dt1[0], dt1[1]-1, dt1[2]),
							        two = new Date(dt2[2], dt2[1]-1, dt2[0]);

							var millisecondsPerDay = 1000 * 60 * 60 * 24;
							var millisBetween = two.getTime() - one.getTime();
							var days = millisBetween / millisecondsPerDay;

						    console.log("ansdjiabsjdbjadjijin sjdjiajidnj");
							    if (Math.floor(days)>=1) {
								    $scope.days.push(Math.floor(days)-1);      
							    }
							    else{
								    $scope.days.push(0);      
							    }
							}
							else{
								$scope.booklist.push(value);
								$scope.extbooklist.push(response.data.items[0]);								
							}
						    console.log($scope.firstdate+" "+$scope.seconddate);
						
						}
					}, function errorCallback(response) {
				
					});	
					
				}
			});
	});

	$scope.book = function(index){
		Service.setbook($scope.currentissuedextbooklist[index]);
		$state.go("bookdetails2");	
	};

	$scope.book2 = function(index){
		Service.setbook($scope.extbooklist[index]);
		$state.go("bookdetails2");	
	};

	$scope.search = function(){
		var key = $scope.searchBook.split(' ').join('_');
		var urlnew ='https://www.googleapis.com/books/v1/volumes?q=' + key;
	
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://bingapis.azure-api.net/api/v5/spellcheck?spell', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '7a12e99b0de74fd08ed9bc52312c538d');
		// xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '8951409e87624398829380c787b5c0d4');
		xhr.onload = function () {
		    $scope.autocorrected = $scope.searchBook;
		    console.log("Searched Book is " + $scope.autocorrected);
		    var xyz = JSON.parse(this.responseText);
		    $scope.arr = xyz.flaggedTokens;
		    console.log($scope.arr);
		    angular.forEach($scope.arr, function(value, key) {
			    // console.log(value);
		    	$scope.autocorrected = $scope.autocorrected.replace(value.token,value.suggestions[0].suggestion);
			    // console.log("Corrected search is " + $scope.autocorrected);
		    });
		    console.log("Corrected search is " + $scope.autocorrected);
		    if($scope.arr.length != 0){
    		    Service.settemp($scope.autocorrected);	
		    }
		    else{
    		    Service.settemp("");			    	
		    }

		    $http({
			  method: 'GET',
			  url: urlnew,
			}).then(function successCallback(response) {
				Service.setdata(response.data.items);
				console.log("dtaa : "+Service.getdata());
				$state.go('search');
			  }, function errorCallback(response) {
		  	});
		};
		xhr.send('text=' + $scope.searchBook.split(' ').join('+'));	
	
	};
	$scope.other = function(){
		$state.go('other');
	};	
	$scope.requesthistory = function(){
		var userid =$cookies.username;
		$state.go('requesthistory');
	};

	$scope.logout = function(){
		$cookies.username='';
		console.log("Logout cookies:"+$cookies.username);
		$state.go('home');
	};
	$scope.back = function(){
		$state.go('other');
	};

	$scope.setting = function(){
		$state.go('setting');
	};	
}]);




app.controller('searchclr', ['$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	console.log("searh cookies:"+$cookies.username);
	console.log(Service.getdata());
	
	$scope.back = function(){
		if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
			$state.go('home');
		}
		else{
			$state.go('profile');
		}
	};

	if(Service.getdata() === undefined){
		$scope.tempText = "Sorry we could not find any book";
		$scope.myValue=true;
    }
	console.log("asdas "+Service.gettemp());
	if(Service.gettemp()!=null && Service.gettemp()!=""){
		$scope.didYouMean = Service.gettemp();
		$scope.tempText = "Did you mean :";
	}

	$scope.result = Service.getdata();
	$scope.ourResult = [];	
	$scope.requestBooks = [];
		

	angular.forEach($scope.result, function(value, key) {
  	//	console.log(key + ': ' + value.volumeInfo.industryIdentifiers[0].identifier);
  		if (value.volumeInfo.industryIdentifiers !== undefined) {
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
 	}
	});
	

	if($scope.ourResult.length==0){
		$scope.myValue2 = true; 
	}


	$scope.book = function(index){
//		console.log(index);
		Service.setbook($scope.ourResult[index]);
		$state.go("bookdetails");
	
	};
	
	$scope.bookMore = function(index){
//		console.log(index);
		Service.setbook($scope.requestBooks[index]);
		$state.go("bookdetails2");
	
	};

	$scope.SuggestionClick = function(){
		console.log("its wokring");
		$scope.myValue=false;
		$scope.myValue2=false;
		$scope.ourResult = [];	
		$scope.requestBooks = [];

		var key = $scope.didYouMean;
		var urlnew ='https://www.googleapis.com/books/v1/volumes?q=' + key;
		$scope.didYouMean="";
		$scope.tempText="";
		$http({
		  method: 'GET',
		  url: urlnew,
		}).then(function successCallback(response) {
			$scope.result = response.data.items;
			// Service.setdata(response.data.items);
			// console.log("dtaa : "+Service.getdata());
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

		}, function errorCallback(response) {
	
		});	

	}


	$scope.request = function(index){	
		if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
			$state.go('login');
		}else{
			Service.setbook($scope.requestBooks[index]);
			$state.go('requestbook');
		}	
	}		
	
	$scope.moredetails = function(){
		//$state.go('bookdetails');
	};


	$scope.homeback = function(){
		$state.go('home');
	};


	$scope.search = function(){
		$state.go('search');
	};

    $scope.bookdetails = function(){
		$state.go('bookdetails');
	};

	$scope.search = function(){
		
		var key = $scope.searchBook.split(' ').join('_');
		var urlnew ='https://www.googleapis.com/books/v1/volumes?q=' + key;
	
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://bingapis.azure-api.net/api/v5/spellcheck?spell', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '7a12e99b0de74fd08ed9bc52312c538d');
		// xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '8951409e87624398829380c787b5c0d4');
		xhr.onload = function () {
		    $scope.autocorrected = $scope.searchBook;
		    console.log("Searched Book is " + $scope.autocorrected);
		    var xyz = JSON.parse(this.responseText);
		    $scope.arr = xyz.flaggedTokens;
		    console.log($scope.arr);
		    angular.forEach($scope.arr, function(value, key) {
			    // console.log(value);
		    	$scope.autocorrected = $scope.autocorrected.replace(value.token,value.suggestions[0].suggestion);
			    // console.log("Corrected search is " + $scope.autocorrected);
		    });
		    console.log("Corrected search is " + $scope.autocorrected);
		    if($scope.arr.length != 0){
    		    Service.settemp($scope.autocorrected);	
		    }
		    else{
    		    Service.settemp("");			    	
		    }

		    $http({
			  method: 'GET',
			  url: urlnew,
			}).then(function successCallback(response) {
				Service.setdata(response.data.items);
				console.log(Service.getdata());
				$state.go('search');
			  }, function errorCallback(response) {
		  	});
		};
		xhr.send('text=' + $scope.searchBook.split(' ').join('+'));	
	};
}]);

app.controller('settingclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	$scope.userID = $cookies.username;
	////////////// If user is not logged in then redirect it to login page /////////// 
	$http({
		method: 'GET',
		url: 'http://localhost:3000/home/user/security/'+$cookies.username
		}).then(function successCallback(response) {
			if(response.data[0].Security=='true'){
				$scope.state=true;
			}
			else if(response.data[0].Security=='false'){
				$scope.state=false;
			}
			console.log(response.data[0].Security);
			}, function errorCallback(response) {
		});
	$scope.change = function(){
		if($scope.state===undefined || $scope.state == false){
			console.log("Praivacy On");
			$http({                                               //verify
                url: "http://localhost:3000/home/user/security/"+$cookies.username,
                method: "POST",
                data: {Security: true}
               }).success(function(data){
               		console.log(data);
                  alert('success post');
               }).error(function(){
                alert('error');
            });
		}
		else{
			console.log("Privacy Off");
			$http({                                               //verify
                url: "http://localhost:3000/home/user/security/"+$cookies.username,
                method: "POST",
                data: {Security: false}
               }).success(function(data){
               		console.log(data);
                  alert('success post');
               }).error(function(){
                alert('error');
            });
		}
	}
}]);


app.controller('otherclr', [ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}
	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;

	$scope.otherprofile = function(){
		$rootScope.otheruserid = $scope.searchprofile;
		$cookies.otheruserid = $scope.searchprofile;
		$state.go('otherprofile');
	};
	
	$scope.back = function(){
		$state.go('profile');
	};

	$scope.logout = function(){
		$cookies.username='';
		console.log("Logout cookies:"+$cookies.username);
		$state.go('home');
	};
}]);

app.controller('bookDetailsclr',function($location, $scope,$state,$http, Service){
	$scope.book = Service.getbook();
	var key = $scope.book.volumeInfo.industryIdentifiers[0].identifier;
	$scope.myResult = [];
	$scope.IsIssued = [];

	var urlnew2 = 'http://localhost:3000/home/Book/'+key;		
	$http.get(urlnew2).success(function(response){
		if(response.results[0]==null){

		}
		else{
    		$scope.myResult=response.results;
		}
	});

	
	$scope.back = function(){
		$state.go('search');
	};
});


app.controller('otherprofileclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}

	$rootScope.userid=$cookies.username;
	$rootScope.otheruserid = $scope.searchprofile;
	var userid = $cookies.username;
	var otheruserid = $cookies.otheruserid;

	console.log("Other Cookies:"+$cookies.otheruserid);

	$scope.booklist = [];
	$scope.myValue3;

	$http.get("http://localhost:3000/home/user/security/"+otheruserid).success(function(response){
		console.log("dnwjdiwnjd nwjd weijwef weij");
		console.log(response);
		if(response[0].Security=="true"){
			$scope.myValue3 = false;
			console.log("Yes Security response:"+response);
			$http.get("http://localhost:3000/home/bookissue").success(function(response){
			angular.forEach(response, function(value, key) {
				if (value.UniqueId==otheruserid) {
					var key = value.ISBN;
					var urlnew ='https://www.googleapis.com/books/v1/volumes?q=isbn:' + key;
					console.log(urlnew);
					$http({
					  method: 'GET',
					  url: urlnew,
					}).then(function successCallback(response) {
						if(response.data.totalItems!=0){
							console.log("Not Added");
							//////////// Do Something Here ////////////////
							$scope.booklist.push(response.data.items[0]);
						}
					}, function errorCallback(response) {
				
					});	
					
				}
			});

		});
		}
		else{
			$scope.myValue3 = true;
			console.log("Can't see other's profile");
		}
	});

	$scope.search = function(){
			var otheruserid2 = $scope.searchProfileID;
			$scope.booklist = [];
			$http.get("http://localhost:3000/home/bookissue").success(function(response){
			angular.forEach(response, function(value, key) {
				if (value.UniqueId==otheruserid2) {
					$scope.booklist.push(value);
				}
			});
	});
	}

	$scope.book = function(index){
//		console.log(index);
		Service.setbook($scope.booklist[index]);
		$state.go("bookdetails2");
	
	};
	
	$scope.back = function(){
		$state.go('other');
	};

	$scope.logout = function(){
		$cookies.username='';
		console.log("Logout cookies:"+$cookies.username);
		$state.go('home');
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
	
	$scope.reqbooklist = [];
	$http.get("http://localhost:3000/home/requestbook").success(function(response){		
			angular.forEach(response, function(value, key) {
				if (value.UniqueId==userid) {
					$scope.reqbooklist.push(value);
					
				}
			});
	});

	$scope.requestbook = function(){
		var requestbook = {	
			"BookName":$scope.bookdata.title,
			"ISBN":$scope.bookdata.isbn,
			"UniqueId":userid,
			"comment":$scope.bookdata.comment
		};

		console.log(requestbook.BookName+" "+requestbook.ISBN+" "+requestbook.UniqueId+" "+requestbook.comment);
		
		$http.post("http://localhost:3000/home/requestbook",requestbook).success(function(res){
			console.log(requestbook.BookName+" "+requestbook.ISBN+" "+requestbook.UniqueId+" "+requestbook.comment);
			console.log('added successfully');
			$state.go("profile");
			console.log('Error');
		});


	};
//		$state.go('profile');
	$scope.back = function(){
		$state.go('search');
	};

	$scope.cancell = function(){
		$state.go('search');
	};
}]);

app.controller('requesthistoryclr',[ '$scope', '$rootScope', '$state', '$http', 'Service','$base64', '$cookies', function($scope,$rootScope,$state,$http,Service,$base64,$cookies){
	if($cookies.username == '-1' | $cookies.username==null | $cookies.username==''){
		$state.go('home');
	}

	$rootScope.userid=$cookies.username;
	var userid = $cookies.username;
	$scope.book = Service.getbook();
	
	$scope.reqbooklist = [];
	$http.get("http://localhost:3000/home/requestbook").success(function(response){		
			angular.forEach(response, function(value, key) {
				if (value.UniqueId==userid) {
					$scope.reqbooklist.push(value);
					
				}
			});
	});
	$scope.back = function(){
			$state.go('profile');
	};

}])
