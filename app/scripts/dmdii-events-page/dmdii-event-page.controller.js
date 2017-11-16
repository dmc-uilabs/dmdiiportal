'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiEvents')
    .controller('DMCDmdiiEventPageController',[
        '$state',
        '$stateParams',
        '$scope',
        '$rootScope',
        '$cookies',
        'ajax',
        'dataFactory',
        'socketFactory',
        '$location',
        // 'is_search',
        'DMCUserModel',
        '$window',
        'questionToastModel',
        'toastModel',
        function($state,
                 $stateParams,
                 $scope,
                 $rootScope,
                 $cookies,
                 ajax,
                 dataFactory,
                 socketFactory,
                 $location,
                //  is_search,
                 DMCUserModel,
                 $window,
                 questionToastModel,
                 toastModel){

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
            });

            $scope.eventLoading = true;

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };

            // callback for event
            var callbackFunction = function(response){
                $scope.event = response.data.dmdiiEvent;

                ajax.get(dataFactory.getDMDIIEvents($scope.event.id).contributors, responseData(), function(response) {
                  // if(!$scope.project) {
                  //   $scope.project = {};
                  // }
                  // $scope.project.contributingCompanies = response.data.organizations;
                  $scope.event.contributingCompanies = response.data.organizations;
                  $scope.eventLoading = false;
                });

                // ajax.get(dataFactory.getDMDIIDocuments($scope.event.id).events, responseData(), function(response) {
                //     $scope.documents = response.data.dmdiiDocuments;
                // });

                $scope.documents = [];
            };

            var responseData = function(){
                var data = {};
                return data;
            };

            $scope.getDMDIIEvent = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIEvents($stateParams.eventId).get, responseData(), callbackFunction);
            };
            $scope.getDMDIIEvent();

            // delete server
            $scope.deleteEvent = function(event){
                questionToastModel.show({
                    question: "Are you sure you want to delete this event?",
                    buttons: {
                        ok: function(){
                            ajax.delete(dataFactory.getDMDIIEvents($scope.event.id).delete, {},
                                function (response) {
                                    toastModel.showToast("success", "Event successfully removed!");
                                    $window.location.href='/dmdii-events.php#/dmdii_events';
                                }, function (response) {
                                    toastModel.showToast("error", response.statusText);
                                }
                            );
                        },
                        cancel: function(){}
                    }
                }, event);
            };

		}
    ]
).filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });
