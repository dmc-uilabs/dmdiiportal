'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectEvents', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-events.html',
            scope: {
                source : "=",
                projects: "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel) {
                $element.addClass("tab-projectEvents");


                $scope.$watch('event', function() {
                    if ($scope.noTitle && angular.isDefined($scope.event.event_title) && $scope.event.event_title.length > 0) {
                        $scope.noTitle = false;
                    }

                    if ($scope.noDateSelected && angular.isDefined($scope.event.event_date)) {
                        $scope.noDateSelected = false;
                    }

                    if ($scope.noDescription && angular.isDefined($scope.event.event_description) && $scope.event.event_description.length > 0) {
                        $scope.noDescription = false;
                    }
                }, true);

                var eventCallback = function(response) {
                    toastModel.showToast('success', 'Project Event Saved!');
                };

                $scope.clear = function() {
                    $scope.event = {};
                };

                $scope.querySearch = function(query) {
                    var results = query ? $scope.projects.filter( createFilterFor(query) ) : $scope.projects,
                        deferred;
                    return results;
                }

                function createFilterFor(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(project) {
                        return (project.projectTitle.toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                }

                $scope.save = function() {

                    if (!$scope.event.event_title) {
                        $scope.noTitle = true;
                    }
                    if (!$scope.event.event_date) {
                        $scope.noDateSelected = true;
                    }
                    if (!$scope.event.event_description) {
                        $scope.noDescription = true;
                    }

                    if ( $scope.noTitle || $scope.noDateSelected || $scope.noDescription) {
                        return;
                    }
                    if ($scope.selectedItem) {
                        $scope.news.project_id = $scope.selectedItem.id;
                    }

                    ajax.create(dataFactory.saveDMDIIProject().events, $scope.event, eventCallback);
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

            }
        };
    }]);
