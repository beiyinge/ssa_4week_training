<!--Search sender, message, popup window-->
 //searchResultAppModule.factory("$svcMessage", ['$modal', svcMessage]);
 //menuApp.controller('SearchCtrl',  ['$scope','$uibModal',function ($scope, $modal) {
	menuApp.controller('SearchCtrl',function ($scope, searchResultsService)  {
	console.log( count +', in SearchCtrl '+  $scope.enteredSearchKeyword);
	
	$scope.searchPopup = function () {
		console.log( count +', opening pop up');
		$scope.searchKeyword = $scope.enteredSearchKeyword;
		
		count = count+1;
			  console.log ( count + ', in getSearchResults, ');
			//  $scope.displayName = $routeParams.channelName;
					
				searchResultsService.getSearchResultList($scope.searchKeyword, function(searchResults) {
					  $scope.searchResults = searchResults;
					 // $scope.channels = myChannelList;
					  console.log ("searchResults=" + searchResults);
					});
					
	
	
	};
}
//]
)
  .filter('highlight', function($sce) {
    return function(item, phrase) {
	  var messageTemp = item.MESSAGE;
	  var userNameTemp = item.SENDER;
      if (phrase) messageTemp = messageTemp.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')
		
	  if (phrase) userNameTemp = userNameTemp.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')

		var formatedSearchResults =
		 "<blockquote>" + item.CHANNELNAME +
						" <br><span class='glyphicon glyphicon-user'></span><B>"+ userNameTemp + "</B> | " + item.DATE +
						" <footer> "+ messageTemp + "</footer>" +
						 "</blockquote>";
						 
      return $sce.trustAsHtml(formatedSearchResults)
    }
  }); //end searchResultAppModule controller 


//var searchResultAppModule = angular.module('searchResultApp', ['ngRoute','ui.bootstrap']);

//searchResultAppModule.factory('searchResults', function($http){
	menuApp.factory('searchResultsService', function($http){
  console.log ( count + ', in searchResultAppModule,');
       //  if ( ! (typeof $routeParams.channelName === "undefined") ) {
        // var cachedData;
  //these functions, are defined inside one function, cacheData retains
		 return {
          getSearchResultList: function (searchKeyword, callback){
		  console.log ('********searchKeyword=' + searchKeyword);
		  console.log ('*******getCookie=' + getCookie("UserName"));
		  
            $http({
              method: 'GET',
              url:    'http://localhost:8080/searchMsg/'+searchKeyword+'/userName/'+getCookie("UserName"),
              cache: false
            }).success(callback);
          }
        };
      });

		getSearchResults = function ($scope, searchResults, $routeParams){
		      count = count+1;
			  console.log ( count + ', in getSearchResults, $routeParams.channelName ');
			  console.log ( count + ', in getSearchResults, ' + $routeParams.channelName);
			  $scope.displayName = $routeParams.channelName;
					
			  searchResults.getSearchResultList($scope.searchKeyword, function(searchResults) {
					  $scope.searchResults = searchResults;
					 // $scope.channels = myChannelList;
					  
					});

				};
				



