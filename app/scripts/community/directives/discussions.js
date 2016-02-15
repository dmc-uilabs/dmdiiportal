'use strict';

angular.module('dmc.community.discussions',[
    'ngCookies'
]).
    directive('communityDiscussions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/community/directives/discussions.html',
            scope: {
                widgetTitle: "=",
                widgetType: "="
            },
            controller: ["$scope", "dataFactory", "ajax" ,"toastModel", "$cookies","$location", function($scope, dataFactory, ajax, toastModel, $cookies, $location) {
                $scope.limit = 3;

                $scope.discussions = [];
                $scope.totalDiscussions = 0;

                $scope.getDiscussions = function(){
                        ajax.get(dataFactory.getDiscussions(null,$scope.widgetType), {
                            _limit: $scope.limit,
                            _sort: "created_at",
                            _order: "DESC"
                        }, function (response) {
                            $scope.discussions = response.data;
                            $scope.totalDiscussions = $scope.discussions.length;
                            for (var index in $scope.discussions) {
                                $scope.discussions[index].created_at = moment($scope.discussions[index].created_at, 'DD-MM-YYYY HH:mm:ss').format("MM/DD/YY hh:mm A");
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        });
                };

                $scope.getDiscussions();

                $scope.openDiscussion = function(e){
                    e.preventDefault();
                    $cookies.put('previousPage', $location.$$absUrl);
                    window.location = location.origin+$(e.currentTarget).attr("href");
                };
            }]
        };
    }]);
