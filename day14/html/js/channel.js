var menuApp = angular.module('menuApp', ['ngRoute']);
var count = 1;
var myChannelList = [];
menuApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: "menu.html",
        controller: 'MenuCtrl'
    }).
    when('/:userName', {
        templateUrl: "all.html",
        controller: 'MenuCtrl'
    }).
    when('/channelChats/:channelName', {
        templateUrl: "all.html",
        controller: 'ChatMessageCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
});


menuApp.factory('channels', function($http) {
    return {
        list: function(userName, callback) {
            $http({
                method: 'GET',
                url: '/channel/' + userName,
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
				data: {message: message, channel: channel, user: user}
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

    });

    $scope.sendMessage = function() {
		console.log('message to add', $scope.msg);
		var user = 'john'; // TODO temp hardcoded!
		var msg = $scope.msg;
		dataService.sendMessage($scope.msg, $routeParams.channelName, user, 
			(response) => {
				var newMessage = {SENDER: user, DATE: new Date().toString(), MESSAGE: msg};
				$scope.channelChats.push(newMessage);
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