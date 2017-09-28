'use strict';
angular.module('dmc.unauthorized')
    .controller('CompanyController', [
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

            DMCUserModel.getUserData().then(function(res){
                $scope.userData = res;
                getJoin();
            });
            $scope.isJoin = null;
            $scope.isLoading = null;

            function getAllCompanies(){
                ajax.get(dataFactory.companyURL().all,{},function(response){
                    $scope.companies = response.data;
                    apply();
                });
            }
            getAllCompanies();

            function getJoin(){
                ajax.get(dataFactory.getProfileCompanyJoinRequest($scope.userData.profileId),{},function(response){
                    $scope.isJoin = response.data && response.data.length > 0 ? response.data[0] : null;
                    getCompany($scope.isJoin.companyId);
                });
            }

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            $scope.changedCompany = function(value){
                $scope.selectedCompany = value;
            };

            $scope.join = function(){
                $scope.isLoading = true;
                ajax.create(dataFactory.addCompanyJoinRequest(),{
                    profileId : $scope.userData.profileId,
                    companyId : $scope.selectedCompany
                },function(response){
                    $scope.isLoading = false;
                    $scope.isJoin = response.data;
                    for(var i in $scope.companies){
                        if($scope.companies[i].id == $scope.isJoin.companyId){
                            $scope.isJoin.companyName = $scope.companies[i].name;
                            break;
                        }
                    }
                    apply();
                });
            };

            function getCompany(companyId){
                ajax.get(dataFactory.companyURL(companyId).get,{
                },function(response){
                    $scope.isJoin.companyName = response.data.name;
                    apply();
                });
            }

            $scope.cancelJoin = function(){
                $scope.isLoading = true;
                ajax.delete(dataFactory.cancelCompanyJoinRequest($scope.isJoin.id),{
                },function(response){
                    $scope.isLoading = false;
                    $scope.isJoin = null;
                    $scope.selectedCompany = null;
                    apply();
                });
            };
        }
    ]
);