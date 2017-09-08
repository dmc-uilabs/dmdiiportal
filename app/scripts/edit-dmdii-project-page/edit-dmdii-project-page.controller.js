'use strict';

angular.module('dmc.edit-project')
    .controller('DMCEditProjectPageController', [
        '$stateParams',
        '$scope',
        '$state',
        '$q',
        '$timeout',
        '$showdown',
        'ajax',
        'dataFactory',
        '$location',
        'toastModel',
        'questionToastModel',
        'DMCUserModel',
        '$window',
        'fileUpload',
        function ($stateParams,
                $scope,
                $state,
                $q,
                $timeout,
                $showdown,
                ajax,
                dataFactory,
                $location,
                toastModel,
                questionToastModel,
                DMCUserModel,
                $window,
                fileUpload) {


            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.date = {};

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

                $scope.project.projectSummary = $showdown.makeHtml($scope.project.projectSummary);

                var awardedDate = $scope.project.awardedDate.split('-');
                $scope.date.awarded = new Date(awardedDate[0], awardedDate[1]-1, awardedDate[2], 0);

                var endDate = $scope.project.endDate.split('-');
                $scope.date.end = new Date(endDate[0], endDate[1]-1, endDate[2], 0);

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

            $scope.descriptionLimit = 5000;
            $scope.isValid = false;
            $scope.isSaved = false;
            $scope.fieldName = 'Project Summary'

            $scope.$on('isValid', function (event, data) {
                $scope.isValid = data;
            });

            $scope.project = {
                contributingCompanyIds: [],
                primeOrganization: {},
                primaryPointOfContact: {},
                principalInvestigator: {},
                projectStatus: {},
                projectThrust: {},
                projectFocusArea: {},
                projectSummary: ''
            }

            $scope.getDMDIIProject = function(){
                if ($stateParams.projectId) {
                    $scope.title = 'Edit Project';
                    $scope.action = 'Edited';
                    ajax.get(dataFactory.getDMDIIProject($stateParams.projectId).get, responseData(), callbackFunction);
                } else if ($stateParams.eventId) {
                    $scope.isEvent = true;
                    $scope.title = 'Edit Event';
                    $scope.action = 'Edited';
                    ajax.get(dataFactory.getDMDIIProject($stateParams.eventId).get, responseData(), callbackFunction);
                } else if ($state.current.url == '/event') {
                    $scope.isEvent = true;
                    $scope.title = 'Create Event';
                    $scope.action = 'Created';
                } else {
                    $scope.title = 'Create Project';
                    $scope.action = 'Created';
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
                },
                {
                    id: 7,
                    name:'Cyber Security'
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
                },
                {
                    id: 4,
                    name:'Adaptive Vehicle Make',
                    code: 'AVM'
                },
                {
                    id: 5,
                    name:'Digital Manufacturing Commons',
                    code: 'DMC'
                },
                {
                    id: 6,
                    name:'Cost Systems',
                    code: 'CS'
                },
                {
                    id: 7,
                    name:'Design – Process/Product Development – Systems Engineering',
                    code: 'DPS'
                },
                {
                    id: 8,
                    name:'Future Factory',
                    code: 'FF'
                },
                {
                    id: 9,
                    name:'Agile Resilient Supply Chain',
                    code: 'ARS'
                },
                {
                    id: 10,
                    name:'Cyber Security in Manufacturing',
                    code: 'CSM'
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

            $scope.contributors = [];

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
                if (response.status === 200) {
                    toastModel.showToast('success', 'Member Successfully ' + $scope.action + '!')
                    $window.location.href = '/dmdii-project-page.php#/' + response.data.id;
                }
            }

            var convertToMarkdown = function(input) {
                var escaped = toMarkdown(input);
                return escaped;
            };

            $scope.saveChanges = function() {
                $scope.isSaved = true;

                if (!$scope.isValid) {
                    return;
                }

                if ($scope.isEvent || $scope.project.projectStatus.id != 1) {
                    var startDate = new Date($scope.date.awarded);
                    var year = startDate.getFullYear();
                    var month = startDate.getMonth() + 1;
                    month = (month < 10) ? '0' + month : month;
                    var day = startDate.getDate();
                    day = (day < 10) ? '0' + day : day;

                    $scope.project.awardedDate = year + '-' + month + '-' + day;

                    var endDate = new Date($scope.date.end);
                    year = endDate.getFullYear();
                    month = endDate.getMonth() + 1;
                    month = (month < 10) ? '0' + month : month;
                    day = endDate.getDate();
                    day = (day < 10) ? '0' + day : day;

                    $scope.project.endDate = year + '-' + month + '-' + day;
                }

                $scope.project.projectSummary = convertToMarkdown($scope.project.projectSummary);
                $scope.project.projectIdentifier = $scope.project.rootNumber + '-' + $scope.project.callNumber + '-' + $scope.project.projectNumber
                $scope.project.isEvent = $scope.isEvent;

                ajax.create(dataFactory.saveDMDIIProject().project, $scope.project, callbackSaveFunction);
            };

            $scope.cancelChanges = function(){
                if ($scope.project.id) {
                    $window.location.href = '/dmdii-project-page.php#/' + $scope.project.id;
                } else {
                    $window.location.href = '/dmdii-projects.php#/';
                }
            };


            $scope.searchMembers = function(query) {
              return ajax.get(dataFactory.getUserList(), {page: 0, pageSize: 100, displayName: query}).then(function(response) {
                if (response.data.content) {
                  return response.data.content;
                } else {
                  return response.data;
                }
              });
            };

            function filterToUILABSOnly(data) {
              return data.filter(function(contact){
                return contact.email.toUpperCase().indexOf('UILABS') != -1 || contact.companyId == 1;
              })
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
