menuApp.factory('teamService', function($http) {
	console.log("entering menuApp.factory.teamService");
    return {
        update: function(name, desc, user, success, failure) {
            $http({
                method: 'POST',
                url: '/createTeam/',
                data: {
                    name: name,
                    desc: desc,
                    user: user
                }
            }).then(success, failure);
        }
    };
});

menuApp.controller('teamCtrl', function ($scope, $routeParams, teamService){
	console.log('teamCtrl:teamName=' + $scope.name + ',desc=' + $scope.desc);

	$scope.isDisabled = false;
	$scope.success = false;
	$scope.failure = false;
	
	$scope.update = function() {
		console.log('update team: ' + $scope.name);
		teamService.update($scope.name, $scope.desc, getCookie("UserName"),
		(response) => {
			console.log('teamService call successful: ' + response.data);
			//$scope.name = '';
			//$scope.desc = '';
			$scope.isDisabled = true;
			$scope.serverMsg = response.data;
		},
		(error) => {
			$scope.serverMsg = error.data;
			console.log("Error: server failed to add team " + $scope.name + ":" + error.data);
		});
	};

});