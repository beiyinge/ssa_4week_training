 
      var menuApp = angular.module('menuApp', ['ngRoute']);
      var count =1;
	  var myChannelList =[];
      menuApp.config(function($routeProvider) {
        $routeProvider.
		   when('/', {                                            
              templateUrl: "logon.html",                                               
              controller:'loginCtrl'  
             }).
		   when('/:userName', {                                              
		      templateUrl: "all.html",                                               
              controller:'MenuCtrl'  
             }).
		   when('/channelChats/:channelName', {
		   templateUrl: "all.html",
           controller: 'ChatMessageCtrl'
          }).
		   otherwise({
            redirectTo: '/'
          })
		  ;
      },[ '$locationProvider', function($locationProvider) {
			$locationProvider.html5Mode = true;
		}]
	  );
	    
	  menuApp.factory('logon',function($http){
		  return {
		   list: function (userName,callback){
			   console.log(userName);
			$http({
              method: 'GET',
              url:    'http://localhost:8080/'+ userName,
              cache: true
            }).success(callback);
          }
        };
      }
	  );
	  
	  var getUserID = function ($scope,logon,$location){
			  $scope.loginUser = function(){
				  logon.list($scope.username,function (logon){
			      var logonlist=[];
			      $scope.users = logon;
			      logonlist = logon;
				  var loggedin = false;
				  var totalUsers = $scope.users.length;
				  var usernameTyped = $scope.username;
				  var passwordTyped = $scope.password;
				  for( i=0; i < totalUsers; i++ ) {
					if (( $scope.users[i].username === usernameTyped )&&($scope.users[i].password === passwordTyped)) {
							loggedin = true;
							break;
						}
					}
				  if( loggedin === true ) {
					$location.path("/"+ $scope.users[i].username );
					} else {
						$location.path("/");
					}

		  });
		  }
		  
				
      }
		  
		  
		 
		 
		  
      menuApp.controller('loginCtrl', getUserID);

	  menuApp.factory('channels', function($http){
        return {
          list: function (userName, callback){
            $http({
              method: 'GET',
              url:    'http://localhost:8080/channel/'+ userName,
              cache: true
            }).success(callback);
          }
        };
      });
	  
     
      var getMenu = function ($scope, channels, $routeParams){
	  count = count+1;
    	    console.log ( count + ', in getMenu function, userName=' + $routeParams.userName);
			if (myChannelList.length === 0) {
				channels.list($routeParams.userName, function(channels) {
				  $scope.channels = channels;
				  console.log ("***$scope.channels, " + $scope.channels);
				  myChannelList = $scope.channels;
				//  $scope.subviewChannelChats= "channelChats.html";
				}
            );
			}	
				
          }
		  
      menuApp.controller('MenuCtrl', getMenu);
      
        
      menuApp.factory('channelChats', function($http){
  
       //  if ( ! (typeof $routeParams.channelName === "undefined") ) {
        // var cachedData;
  //these functions, are defined inside one function, cacheData retains
		 return {
          list: function (channelName, callback){
		  console.log ('channelName='+channelName);
            $http({
              method: 'GET',
              url:    'http://localhost:8080/channelChats/'+channelName,
              cache: true
            }).success(callback);
          }
        };
      });

		getChannelChat = function ($scope, channelChats, $routeParams, $rootScope){
		count = count+1;
			  console.log ( count + ', in ChatMessageCtrl, ' + $routeParams.channelName);
			  $scope.displayName = $routeParams.channelName;
			  /*
			  if ( ($routeParams.channelName).length > 0) {
				$scope.msgBoxshowBL = true;
			  }
			  else
				  $scope.msgBoxshowBL = false;
			  */
			  console.log ('in ChatMessageCtrl, myChannelList=' + myChannelList);
		
				channelChats.list($routeParams.channelName, function(channelChats) {
					  $scope.channelChats = channelChats;
					  $scope.channels = myChannelList;
					  
					});

				};
				
      menuApp.controller('ChatMessageCtrl', getChannelChat );
		  
    // menuApp.controller('AllCtrl', getMenu,getChannelChat );
	 /*
	 app.controller('SaveChannelMsgCtrl', function($scope) {
		 count = count+1;
		 console.log ( count + ', in SaveChannelMsgCtrl, ');
    $scope.channelMsg = "";
   
    $scope.channelMsg = function() {
        return $scope.channelMsg;
    }
});
*/
	