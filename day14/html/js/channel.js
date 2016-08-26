var menuApp = angular.module('menuApp', ['ngRoute','ngFileUpload','ngScrollable']);
var count = 1;
var teamList =[];
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
    when('/login', {
        templateUrl: "logon.html",
        controller: 'loginCtrl'
    }).
	when('/logout/', {
        templateUrl: "logon.html",
        controller: 'logoutCtrl'
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
        redirectTo: '/login'
    });
}, ['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode = true;
}]);


menuApp.factory('logout', function($http) {
    return {
        list: function(userName, callback) {
            console.log(userName +" loggingout");
            $http({
                method: 'GET',
                url: 'http://localhost:8080/' + userName,
                cache: true
            }).success(callback);
        }
    };
});

var setUserID = function($scope, logout, $location) {
	console.log("when logging out the page " + getCookie("UserName"));
      
    deleteCookie("UserName");
	myChannelList = [];
	myDirectList=[];
    $location.path("/login");
};


menuApp.controller('logoutCtrl', setUserID);

menuApp.factory('logon', function($http) {
    return {
        list: function(userName, callback) {
            console.log(userName +" logging in");
            $http({
                method: 'GET',
                url: 'http://localhost:8080/login/' + userName,
                cache: false
            }).success(callback);
        }
    };
});

var getUserID = function($scope, logon, $location,$window) {
	console.log("when refreshing the page " + getCookie("UserName"));
	
		
    $scope.loginUser = function() {
        logon.list($scope.username, function(logon) {
			console.log("login data" + $scope.username);
			
            var logonlist = [];
            $scope.users = logon;
            logonlist = logon;
            var loggedin = false;
			console.log("totalUsers" + $scope.users.length);
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
				$window.alert('Invalid Username /Password');
				$scope.username='';
				$scope.password='';
                $location.path("/login");
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
                cache: false
            }).success(callback);

        },
		directList: function (userName, callback){
			$http({
			  method: 'GET',
			  url:    'http://localhost:8080/direct/'+ userName,
			  cache: false
			}).success(callback);
		}
    };
});

menuApp.factory('dataService', function($http) {
	//console.log("entering menuApp.factory.dataService");
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
        },
		sendDirectMessage : function(message, sender, receiver, success, failure) {
			$http({
                method: 'POST',
                url: '/saveDirectMessage/',
                data: {
                    message: message,
                    sender: sender,
                    receiver: receiver
                }
            }).then(success, failure);
			
			
		}
    };
});





var getMenuCtrl = function($scope, channels, $routeParams) {
    count = count + 1;
    console.log(count + ', in getMenu function, userName=' + getCookie("UserName"));
	console.log(myChannelList.length);
	
    if (myChannelList.length === 0) {
        channels.list(getCookie("UserName"), function(channels) {
            $scope.channels = channels;
            console.log("***$scope.channels, " + $scope.channels);
            myChannelList = $scope.channels;
            //  $scope.subviewChannelChats= "channelChats.html";
			
			var teamSet = new Set();
			for(var i = 0; i < channels.length; i++) {				
				teamSet.add(channels[i].TEAMNAME);
			}
			$scope.teams = Array.from(teamSet);
			teamList = $scope.teams;
        });
		
		
    }
	
	
	if (myDirectList.length===0) {
		channels.directList(getCookie("UserName"), function(channels){
			var directChannelSet = new Set();

			for(var i = 0; i < channels.length; i++) {
				console.log("SENDER="+channels[i].SENDER + ",RECEIVER="+channels[i].RECIEVER);
				if (channels[i].SENDER===getCookie("UserName")) {
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

}

menuApp.controller('MenuCtrl', getMenuCtrl);


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
                cache: false
            }).success(callback);
        }
    };
});


menuApp.controller('ChatMessageCtrl', function($scope, channelChats, $routeParams, $rootScope, dataService,channels) {
    count = count + 1;
    console.log(count + ', in ChatMessageCtrl, ' + $routeParams.channelName);
    $scope.displayName = $routeParams.channelName;
	$scope.directmsg = 'channel';
    console.log('in ChatMessageCtrl, myChannelList=' + myChannelList);
     console.log(myChannelList.length + " chatmessage");
	 if (myChannelList.length === 0)
	 {
		 console.log("inside");
		 console.log("sends from chat controller  "+ getCookie("UserName"));
              getMenuCtrl($scope,channels,$routeParams);
		 console.log("outside");
	 }
    channelChats.list($routeParams.channelName, function(channelChats) {
        $scope.channelChats = channelChats;
		$scope.teams = teamList;
        $scope.channels = myChannelList;
		$scope.userName= getCookie("UserName");
		console.log($scope.userName +" chat  messages");
		$scope.directChannels = myDirectList;
		$scope.isDirectChat=false;
		for(var i =0;i<channelChats.length;i++)
		{
		console.log(channelChats[i].FileName+" array values");
			if (channelChats[i].FileName !=null)
			{
				var cfileext=channelChats[i].FileName.split(".")
				if (cfileext[1]==='txt')
				{
					$scope.cfiletxt=cfileext[1];
					console.log($scope.cfiletxt);
				}
				else if (cfileext[1]==='jpg')
				{
					$scope.cfilejpg=cfileext[1];
					console.log($scope.cfilejpg);
				}
				
				
				console.log(cfileext[1]);
			}
		}
			console.log($scope.channelChats);
		
		console.log('isDirectChat='+$scope.isDirectChat);

    });

    $scope.sendMessage = function() {
        console.log('message to add', $scope.msg);
		console.log('getcookie ', getCookie("UserName"));
		
        var user = getCookie("UserName"); //replaced the hardcoded username withe the getcookie method
		
		console.log(user + " cookie username for sendmessage");
		
        var msg = $scope.msg;
        dataService.sendMessage($scope.msg, $routeParams.channelName, user,
            (response) => {
				console.log('  dataService call successful: ' + response);
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
		  cache: false
		}).success(callback);
	  }
	};
});
	  
		
		

menuApp.controller('getDirectChatsCtrl', function ($scope, messages, $routeParams, dataService){
	console.log('getDirectChatsCtrl:channelName=' + $routeParams.channelName + ',userName=' + $routeParams.userName);
	$scope.directmsg = 'direct';
	$scope.displayName = $routeParams.channelName;
	messages.list($routeParams.channelName, $routeParams.userName,function(messages) {

		  console.log('messages.length=' + messages.length);
		  
		  $scope.messages = messages;
		  $scope.teams = teamList;
		  $scope.channels = myChannelList;
		  $scope.userName= getCookie("UserName");
		  console.log($scope.userName +" direct chat messages");
		  $scope.directChannels = myDirectList;
		  $scope.isDirectChat=true;		
		for(var i =0;i<messages.length;i++)
		{
		console.log(messages[i].FileName +" array values");
		
			if (messages[i].FileName !=null)
			{
				var dfileext=messages[i].FileName.split(".")
				if (dfileext[1]==='txt')
				{
					$scope.dfiletxt=dfileext[1];
					console.log($scope.dfiletxt);
				}
				else if (dfileext[1]==='jpg')
				{
					$scope.dfilejpg=dfileext[1];
					console.log($scope.dfilejpg);
				}
			}
		}
				  
		  console.log('isDirectChat='+$scope.isDirectChat);		  

	});
	
	$scope.sendDirectMessage = function() {
        console.log('direct message to add', $scope.msg);
		console.log('getcookie ', getCookie("UserName"));
		
         //replaced the hardcoded username withe the getcookie method
		var user = getCookie("UserName");
		console.log(user + " cookie username for sendDirectMessage");
		
        var msg = $scope.msg;
		
        dataService.sendDirectMessage($scope.msg, user, $routeParams.channelName,
            (response) => {
				console.log('sendDirectMessage,  dataService call successful: ' + response);
                var newMessage = {					
                    SENDER: user,
					RECEIVER: $routeParams.channelName,
                    DATE: new Date().toString(),
                    MESSAGE: msg
                };
                $scope.messages.push(newMessage);
            },
            (error) => {
                console.log("Error: server failed to add message.");
            }
        );
		$scope.msg = '';
    };

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