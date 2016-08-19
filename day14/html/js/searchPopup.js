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
					
		/*
		var modalSearchInstance = $modal.open({
			templateUrl: 'searchResults.html'
			,controller: 'ModalSearchInstanceCtl'
			,windowClass: 'large-Modal'
			,resolve: {
				items: function () {
					return $scope.items;
				}
			}
			
		});
		
		 modalSearchInstance.result.then(function (selectedItem) {
		  $scope.selected = selectedItem;
		}, function () {
		  $log.info('Modal dismissed at: ' + new Date());
		});
		*/
	
	};
}
//]
); //end searchResultAppModule controller 


//var searchResultAppModule = angular.module('searchResultApp', ['ngRoute','ui.bootstrap']);

//searchResultAppModule.factory('searchResults', function($http){
	menuApp.factory('searchResultsService', function($http){
  console.log ( count + ', in searchResultAppModule,');
       //  if ( ! (typeof $routeParams.channelName === "undefined") ) {
        // var cachedData;
  //these functions, are defined inside one function, cacheData retains
		 return {
          getSearchResultList: function (searchKeyword, callback){
		  console.log ('searchKeyword=' + searchKeyword);
            $http({
              method: 'GET',
              url:    'http://localhost:8080/searchMsg/'+searchKeyword,
              cache: false
            }).success(callback);
          }
        };
      });

		getSearchResults = function ($scope, searchResults, $routeParams){
		count = count+1;
			  console.log ( count + ', in getSearchResults, ' + $routeParams.channelName);
			  $scope.displayName = $routeParams.channelName;
					
				searchResults.getSearchResultList($scope.searchKeyword, function(searchResults) {
					  $scope.searchResults = searchResults;
					 // $scope.channels = myChannelList;
					  
					});

				};
				
    //  menuApp.controller('ModalSearchInstanceCtl', getSearchResults );
	  
	  
	  menuApp.service('searchResultsServiceNew', function() {
		  var productList = [];

		  var addProduct = function(newObj) {
			  productList.push(newObj);
		  };

		  var getProducts = function(){
			  return productList;
		  };

		  return {
			addProduct: addProduct,
			getProducts: getProducts
		  };

		});


