'use strict';

angular.module('dmc.edit-project')
    .controller('DMCEditEventPageController', [
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
            $scope.event = {
              contributingCompanyIds: []
            };

            $scope.getOrganizations = function() {
                ajax.get(dataFactory.getDMDIIMember().all, {}, function(response) {
                    $scope.organizations = response.data.organizations;
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
                $scope.event = response.data.dmdiiEvent;

                $scope.event.description = $showdown.makeHtml($scope.event.description);

                var startDate = $scope.event.date.split('-');
                $scope.date.start = new Date(startDate[0], startDate[1]-1, startDate[2], 0);

                var endDate = $scope.event.endDate.split('-');
                $scope.date.end = new Date(endDate[0], endDate[1]-1, endDate[2], 0);

                $scope.contributors = [];
                ajax.get(dataFactory.getDMDIIEvents($scope.event.id).contributors, {}, function(response) {
                    angular.forEach(response.data.contributingOrganizations, function(company) {
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
            $scope.fieldName = 'Event Description (Required)'

            $scope.$on('isValid', function (event, data) {
                $scope.isValid = data;
            });

            $scope.getDMDIIEvent = function(){
                if ($stateParams.eventId) {
                    $scope.isEvent = true;
                    $scope.title = 'Edit Event';
                    $scope.action = 'Edited';
                    ajax.get(dataFactory.getDMDIIEvents($stateParams.eventId).get, responseData(), callbackFunction);
                } else if ($state.current.url == '/event') {
                    $scope.isEvent = true;
                    $scope.title = 'Create Event';
                    $scope.action = 'Created';
                }
            };
            $scope.getDMDIIEvent();

            $scope.contributors = [];

            $scope.addContributor = function(org) {
                $scope.event.contributingCompanyIds.push(org.id);
                $scope.contributors.push(org);
            };

            $scope.removeContributor = function(index) {
                $scope.event.contributingCompanyIds.splice(index, 1);
                $scope.contributors.splice(index, 1);
            };

            $scope.changedValue = function(){
                $scope.isDataChanged = isChange;
            };

            var callbackSaveFunction = function(response) {
                if (response.status === 200) {
                    toastModel.showToast('success', 'Member Successfully ' + $scope.action + '!')
                    if (response.data.isEvent) {
                      $window.location.href = '/dmdii-project-page.php#/event/' + response.data.id;
                    }
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

                  var startDate = new Date($scope.date.start);
                  var year = startDate.getFullYear();
                  var month = startDate.getMonth() + 1;
                  month = (month < 10) ? '0' + month : month;
                  var day = startDate.getDate();
                  day = (day < 10) ? '0' + day : day;

                  $scope.event.startDate = year + '-' + month + '-' + day;

                  var endDate = new Date($scope.date.end);
                  year = endDate.getFullYear();
                  month = endDate.getMonth() + 1;
                  month = (month < 10) ? '0' + month : month;
                  day = endDate.getDate();
                  day = (day < 10) ? '0' + day : day;

                  $scope.event.endDate = year + '-' + month + '-' + day;

                $scope.event.description = convertToMarkdown($scope.event.description);
                if($scope.event.principalPointOfContact) {
                  $scope.event.principalPointOfContactId = $scope.event.principalPointOfContact.id;
                }

                ajax.create(dataFactory.saveDMDIIEvent(), $scope.event, callbackSaveFunction);
            };

            $scope.cancelChanges = function(){
                if ($scope.event.id) {
                    $window.location.href = '/dmdii-events.php#/event/' + $scope.event.id;
                } else {
                    $window.location.href = '/dmdii-events.php#/';
                }
            };

            $scope.searchMembers = function(query) {
              return ajax.get(dataFactory.getUserList(), {page: 0, pageSize: 100, displayName: query}).then(function(response) {
                if (response.data.content) {
                  return response.data.content;
                } else {
                  return response.data.users;
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
