'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabMemberNews', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-member-news.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-memberNews");

                var newsCallbackFunction = function(response) {
                    console.log(response.data);
                };

                $scope.clear = function() {
                    $scope.news = {};
                };

                $scope.$watch('news', function() {
                    if ($scope.noTitle && angular.isDefined($scope.news.news_title) && $scope.news.news_title.trim().length > 0) {
                        $scope.noTitle = false;
                    }

                    if ($scope.noContent && angular.isDefined($scope.news.news_content) && $scope.news.news_content.trim().length > 0) {
                        $scope.noContent = false;
                    }
                }, true);

                $scope.save = function() {
                    if (!$scope.news.news_title) {
                        $scope.noTitle = true;
                    }

                    if (!$scope.news.news_content) {
                        $scope.noContent = true;
                    }

                    if ($scope.noTitle || $scope.noContent) {
                        return;
                    }

                    ajax.create(dataFactory.saveDMDIIMember().news, $scope.news, newsCallbackFunction);
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

            }
        };
    }]);
