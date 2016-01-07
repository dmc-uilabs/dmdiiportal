'use strict';

angular.module('dmc.community.discussions',[]).
    directive('communityDiscussions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/community/directives/discussions.html',
            scope: {
                widgetTitle: "="
            },
            controller: ["$scope", "dataFactory", "ajax" ,"toastModel", function($scope, dataFactory, ajax, toastModel) {
                $scope.discussionsFollow = [
                    {
                        id : 1,
                        text : "Aenean euismod bibendum laoreet. Cim soci?",
                        created_at : "2016-06-01 15:59:33",
                        full_name : "Tony Scarfoni",
                        image : "/images/carbone.png",
                        replies : 2
                    },{
                        id : 2,
                        text : "Aenean euismod bibendum laoreet. Cim soci?",
                        created_at : "2016-06-01 15:59:33",
                        full_name : "Tony Scarfoni",
                        image : "/images/carbone.png",
                        replies : 5
                    }
                ];
            }]
        };
    }]);
