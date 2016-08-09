'use strict';

angular.module('dmc.edit-project')
    .controller('DMCEditProjectPageController', [
        '$stateParams',
        '$scope',
        '$q',
        '$timeout',
        'ajax',
        'dataFactory',
        '$location',
        'toastModel',
        'questionToastModel',
        'DMCUserModel',
        'fileUpload',
        function ($stateParams,
                $scope,
                $q,
                $timeout,
                ajax,
                dataFactory,
                $location,
                toastModel,
                questionToastModel,
                DMCUserModel,
                fileUpload) {


            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.getOrganizations = function() {
                ajax.get(dataFactory.companyURL().all, {}, function(response) {
                    $scope.organizations = response.data;
                });
            }
            $scope.getOrganizations();

            $scope.queryOrgSearch = function(query) {
                var results = query ? $scope.organizations.filter( createFilterFor(query) ) : $scope.organizations;
                var deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(tag) {
                    return (tag.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
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
                if ($stateParams.projectId) {
                    $scope.title = 'Edit Project';
                    ajax.get(dataFactory.getDMDIIProject($stateParams.projectId).get, responseData(), callbackFunction);
                } else {
                    $scope.title = 'Create Project';

                    $scope.project = {
                        contributingCompanies: [],
                        primeOrganization: {},
                        primaryPointOfContact: {},
                        principalInvestigator: {},
                        projectStatus: {},
                        projectThrust: {},
                        projectFocusArea: {},

                    }
                }
            };
            $scope.getDMDIIProject();

            $scope.focusAreas = {
                1:'Model-Based Design/Enterprise',
                2:'Manufacturing Processes',
                3:'Sensors & Metrology',
                4:'Supply Chain Management',
                5:'Product Lifecycle Management',
                6:'Other'
            }

            $scope.thrustAreas = {
                1:'Advanced Manufacturing Enterprise',
                2:'Intelligent Machining',
                3:'Advanced Analysis'
            }

            $scope.statuses = {
                1:'pre-awarded',
                2:'awarded',
                3:'completed'
            }


            $scope.setPrimeOrg = function(org) {
                $scope.project.primeOrganization = org;
            }

            $scope.addContributor = function(org) {
                $scope.project.contributingCompanies.push(org);
            };

            $scope.removeContributor = function(index) {
                $scope.project.contributingCompanies.splice(index, 1);
            };

            $scope.changedValue = function(){
                $scope.isDataChanged = isChange;
            };

            var callbackSaveFunction = function(response) {
                $location.path('/'+$scope.project.id).search();
            }

            $scope.saveChanges = function() {
                $scope.projectIdentifier = $scope.project.projectRootNumber + '-' + $scope.project.projectCallNumber + '-' + $scope.project.projectNumber
                ajax.update(dataFactory.saveDMDIIProject($scope.project.id).project, $scope.project, callbackSaveFunction);
            };
            $scope.cancelChanges = function(){
                $location.path('/'+$scope.project.id).search();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
