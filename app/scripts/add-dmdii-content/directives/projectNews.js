'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectNews', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-news.html',
            scope: {
                source : "=",
                projects: "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $window) {
                $element.addClass("tab-projectNews");

                var eventCallback = function(response) {
                    toastModel.showToast('success', 'Project News Saved!');
                    $window.location.reload();
                };

                $scope.clear = function() {
                    $scope.news = {};
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

                $scope.$watch('news', function() {
                    if ($scope.noTitle && angular.isDefined($scope.news.title) && $scope.news.title.trim().length > 0) {
                        $scope.noTitle = false;
                    }

                    if ($scope.noContent && angular.isDefined($scope.news.content) && $scope.news.content.trim().length > 0) {
                        $scope.noContent = false;
                    }
                }, true);

                $scope.save = function() {
                    if (!$scope.news.title) {
                        $scope.noTitle = true;
                    }

                    if (!$scope.news.content) {
                        $scope.noContent = true;
                    }

                    if ($scope.noTitle || $scope.noContent) {
                        return;
                    }

                    if ($scope.selectedItem) {
                        $scope.news.projectId = $scope.selectedItem.id;
                    }

                    ajax.create(dataFactory.saveDMDIIProject().news, $scope.news, eventCallback);
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

            }
        };
    }]);
