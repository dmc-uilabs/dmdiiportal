'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiProj')
    .controller('DMCDmdiiProjectPageController',[
        '$state',
        '$stateParams',
        '$scope',
        '$rootScope',
        '$cookies',
        'ajax',
        'dataFactory',
        'socketFactory',
        '$location',
        'is_search',
        'DMCUserModel',
        '$window',
        function($state,
                 $stateParams,
                 $scope,
                 $rootScope,
                 $cookies,
                 ajax,
                 dataFactory,
                 socketFactory,
                 $location,
                 is_search,
                 DMCUserModel,
                 $window){

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
            });

            $scope.projectLoading = true;

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };


            // callback for project
            var callbackFunction = function(response){
                $scope.project = response.data;
				$scope.projectLoading = false;
            };

            var responseData = function(){
                var data = {};
                return data;
            };

            $scope.getDMDIIProject = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIProject($stateParams.projectId).get, responseData(), callbackFunction);
            };
            $scope.getDMDIIProject();
		}
    ]
);
