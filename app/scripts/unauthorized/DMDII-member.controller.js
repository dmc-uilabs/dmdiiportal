'use strict';
angular.module('dmc.unauthorized')
    .controller('DMDMemberController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'DMCUserModel',
        '$mdDialog',
        '$rootScope',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    DMCUserModel,
                    $mdDialog,
                    $rootScope,
                    dataFactory) {
            $scope.userData = null;
            $scope.isLoading = false;
            $scope.isSuggest = null;

            DMCUserModel.getUserData().then(function(res){
                $scope.userData = res;
                loadSuggestJoin();
            });

            function loadSuggestJoin(){
                ajax.get(dataFactory.getSuggestJoinCompany($scope.userData.companyId),{
                },function(response){
                    $scope.isSuggest = response.data && response.data.length > 0 ? response.data[0] : null;
                    apply();
                });
            }

            $scope.suggest = function(){
                $scope.isLoading = true;
                ajax.create(dataFactory.addSuggestJoinCompany(),{
                    companyId : $scope.selectedCompany
                },function(response){
                    $scope.isLoading = false;
                    $scope.isSuggest = response.data;
                    apply();
                });
            };

            $scope.cancelSuggest = function(){
                $scope.isLoading = true;
                ajax.delete(dataFactory.cancelSuggestJoinCompany($scope.isSuggest.id),{
                },function(response){
                    $scope.isLoading = false;
                    $scope.isSuggest = null;
                    apply();
                });
            };

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
        }
    ]
);