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
                ajax.get(dataFactory.getDMDIIMember().full, {}, function(response) {
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

                $scope.project.awardedDate = new Date($scope.project.awardedDate);
                $scope.project.endDate = new Date($scope.project.endDate);

                $scope.contributors = [];
                ajax.get(dataFactory.getDMDIIProject().contributors, {projectId: $scope.project.id}, function(response) {
                    angular.forEach(response.data, function(company) {
                      $scope.contributors.push({
                          id: company.id,
                          name: company.organization.name
                      });
                  })
              });

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
                        contributingCompanyIds: [],
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

            $scope.focusAreas = [
                {
                    id: 1,
                    name: 'Model-Based Design/Enterprise'
                },
                {
                    id: 2,
                    name:'Manufacturing Processes'
                },
                {
                    id: 3,
                    name: 'Sensors & Metrology'
                },
                {
                    id: 4,
                    name:'Supply Chain Management'
                },
                {
                    id: 5,
                    name:'Product Lifecycle Management'
                },
                {
                    id: 6,
                    name:'Other'
                }
            ]

            $scope.thrustAreas = [
                {
                    id: 1,
                    name: 'Advanced Manufacturing Enterprise',
                    code: 'AME'
                },
                {
                    id: 2,
                    name: 'Intelligent Machining',
                    code: 'IM'
                },
                {
                    id: 3,
                    name:'Advanced Analysis',
                    code: 'AA'
                }
            ]

            $scope.statuses = [
                {
                    id: 1,
                    name:'pre-awarded'
                },
                {
                    id: 2,
                    name:'awarded'
                },
                {
                    id: 3,
                    name:'completed'
                }
            ]


            $scope.setPrimeOrg = function(org) {
                $scope.project.primeOrganization = org;
            }

            $scope.addContributor = function(org) {
                $scope.project.contributingCompanyIds.push(org.id);
                $scope.contributors.push(org);
            };

            $scope.removeContributor = function(index) {
                $scope.project.contributingCompanyIds.splice(index, 1);
                $scope.contributors.splice(index, 1);
            };

            $scope.changedValue = function(){
                $scope.isDataChanged = isChange;
            };

            var callbackSaveFunction = function(response) {
                $location.path('/'+$scope.project.id).search();
            }

            $scope.saveChanges = function() {
                var date = new Date($scope.project.awardedDate);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10) ? '0' + month : month;
                var day = date.getDate();

                $scope.project.awardedDate = year + '-' + month + '-' + day;

                var date = new Date($scope.project.endDate);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10) ? '0' + month : month;
                var day = date.getDate();

                $scope.project.endDate = year + '-' + month + '-' + day;

                $scope.project.projectIdentifier = $scope.project.rootNumber + '-' + $scope.project.callNumber + '-' + $scope.project.projectNumber
                ajax.create(dataFactory.saveDMDIIProject().project, $scope.project, callbackSaveFunction);
            };
            $scope.cancelChanges = function(){
                $location.path('/'+$scope.project.id).search();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
