 
      var menuApp = angular.module('menuApp', ['ngRoute']);
      var count =1;
	  var myChannelList =[];
	  var myDirectList=[];
      menuApp.config(function($routeProvider) {
        $routeProvider.
			when('/', {                                            
				templateUrl: "menu.html",                                               
				controller:'MenuCtrl'  
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
      });

	  menuApp.factory('channels', function($http){
        return {
          list: function (userName, callback){
            $http({
              method: 'GET',
              url:    'http://localhost:8080/channel/'+ userName,
              cache: true
            }).success(callback);
          },
		  directList: function (userName, callback){
				$http({
				  method: 'GET',
				  url:    'http://localhost:8080/direct/'+ userName,
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
				});
            
			}
			
			if (myDirectList.length===0) {
				channels.directList($routeParams.userName, function(channels){
					var directChannelSet = new Set();

					for(var i = 0; i < channels.length; i++) {
						console.log("SENDER="+channels[i].SENDER + ",RECEIVER="+channels[i].RECIEVER);
						if (channels[i].SENDER===$routeParams.userName) {
							directChannelSet.add(channels[i].RECIEVER);
						} else {
							directChannelSet.add(channels[i].SENDER);
						}					
					}
					$scope.directChannels = Array.from(directChannelSet);
					myDirectList= $scope.directChannels;
				});
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
			  console.log ('in ChatMessageCtrl, channelChats=' + channelChats);
		
				channelChats.list($routeParams.channelName, function(channelChats) {
					  $scope.channelChats = channelChats;
					  $scope.channels = myChannelList;
					  $scope.directChannels = myDirectList;
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
	