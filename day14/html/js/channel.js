var menuApp = angular.module('menuApp', ['ngRoute']);
var count = 1;
var myChannelList = [];
var myDirectList=[];


//Get cookie method
function getCookie(cname) {
	console.log("hi "+cname);
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
	document.cookie = cname + '=; expires=Monday, 19-Aug-1996 05:00:00 GMT";';
	
}




menuApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: "logon.html",
        controller: 'loginCtrl'
    }).
    when('/:userName', {
        templateUrl: "all.html",
        controller: 'MenuCtrl'
    }).
    when('/channelChats/:channelName', {
        templateUrl: "all.html",
        controller: 'ChatMessageCtrl'
    }).
	when('/directChats/:channelName/:userName', {
				templateUrl: "all.html",
				controller: 'getDirectChatsCtrl'
	}).
    otherwise({
        redirectTo: '/'
    });
}, ['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode = true;
}]);

menuApp.factory('logon', function($http) {
    return {
        list: function(userName, callback) {
            console.log(userName);
            $http({
                method: 'GET',
                url: 'http://localhost:8080/' + userName,
                cache: true
            }).success(callback);
        }
    };
});

var getUserID = function($scope, logon, $location) {
	console.log("when refreshing the page " + getCookie("UserName"));
    $scope.loginUser = function() {
        logon.list($scope.username, function(logon) {
            var logonlist = [];
            $scope.users = logon;
            logonlist = logon;
            var loggedin = false;
            var totalUsers = $scope.users.length;
            var usernameTyped = $scope.username;
            var passwordTyped = $scope.password;
            for (i = 0; i < totalUsers; i++) {
                if (($scope.users[i].username === usernameTyped) && ($scope.users[i].password === passwordTyped)) {
                    loggedin = true;
                    break;
                }
            }
            if (loggedin === true) {
				console.log("sends from logon controller  "+ getCookie("UserName"));
                $location.path("/" +  getCookie("UserName"));
            } else {
                $location.path("/");
            }

        });
    }


};


menuApp.controller('loginCtrl', getUserID);

menuApp.factory('channels', function($http) {
    return {
        list: function(userName, callback) {

            $http({
                method: 'GET',
                url: '/channel/' + userName,
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

menuApp.factory('dataService', function($http) {
    return {
        sendMessage: function(message, channel, user, success, failure) {
            $http({
                method: 'POST',
                url: '/message/',
                data: {
                    message: message,
                    channel: channel,
                    user: user
                }
            }).then(success, failure);
        }
    };
});



menuApp.controller('MenuCtrl', function($scope, channels, $routeParams) {
    count = count + 1;
    console.log(count + ', in getMenu function, userName=' + $routeParams.userName);
    if (myChannelList.length === 0) {
        channels.list($routeParams.userName, function(channels) {
            $scope.channels = channels;
            console.log("***$scope.channels, " + $scope.channels);
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
			console.log(getCookie("UserName") +" direct cookie");
			$scope.userName= getCookie("UserName");
			
		    console.log($scope.userName +" direct messages");
			
			myDirectList= $scope.directChannels;
			
			console.log("sends from menu ctrl direct"+ getCookie("UserName"));
		});
	}

});


menuApp.factory('channelChats', function($http) {

    //  if ( ! (typeof $routeParams.channelName === "undefined") ) {
    // var cachedData;
    //these functions, are defined inside one function, cacheData retains
    return {
        list: function(channelName, callback) {
            console.log('channelName=' + channelName);
            $http({
                method: 'GET',
                url: '/channelChats/' + channelName,
                cache: true
            }).success(callback);
        }
    };
});


menuApp.controller('ChatMessageCtrl', function($scope, channelChats, $routeParams, $rootScope, dataService) {
    count = count + 1;
    console.log(count + ', in ChatMessageCtrl, ' + $routeParams.channelName);
    $scope.displayName = $routeParams.channelName;

    console.log('in ChatMessageCtrl, myChannelList=' + myChannelList);

    channelChats.list($routeParams.channelName, function(channelChats) {
        $scope.channelChats = channelChats;
        $scope.channels = myChannelList;
		$scope.userName= getCookie("UserName");
		$scope.directChannels = myDirectList;
		
		console.log($scope.userName +" chat  messages");

    });

    $scope.sendMessage = function() {
        console.log('message to add', $scope.msg);
		console.log('getcookie ', getCookie("UserName"));
		
        var user = getCookie("UserName"); //replaced the hardcoded username withe the getcookie method
		
		console.log(user + " cookie username for sendmessage");
		
        var msg = $scope.msg;
        dataService.sendMessage($scope.msg, $routeParams.channelName, user,
            (response) => {
                var newMessage = {
                    SENDER: user,
                    DATE: new Date().toString(),
                    MESSAGE: msg
                };
                $scope.channelChats.push(newMessage);
            },
            (error) => {
                console.log("Error: server failed to add message.");
            }
        );
        $scope.msg = '';
    };

});

menuApp.factory('messages', function($http){
	 return {
	  list: function (channelName, userName, callback){
	  console.log ('url='+ 'http://localhost:8080/message/' + channelName + '/' + userName);
		$http({
		  method: 'GET',
		  url:    'http://localhost:8080/message/' + channelName + '/' + userName,
		  cache: true
		}).success(callback);
	  }
	};
});
	  
		
		
menuApp.controller('getDirectChatsCtrl', function ($scope, messages, $routeParams){
	console.log('getDirectChatsCtrl:channelName=' + $routeParams.channelName + ',userName=' + $routeParams.userName);
	messages.list($routeParams.channelName, $routeParams.userName,function(messages) {
		  console.log('messages.length=' + messages.length);
		  $scope.messages = messages;
		  $scope.channels = myChannelList;
		  $scope.userName= getCookie("UserName");
		  console.log($scope.userName +" direct chat messages");
		  $scope.directChannels = myDirectList;
	});

});

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