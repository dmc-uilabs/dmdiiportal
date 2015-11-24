'use strict';

angular.module('dmc.widgets.questions',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket'
    ]).
    directive('uiWidgetQuestions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/questions.html',
            scope: {
                widgetTitle: "=",
                projectId : "="
            },
            link: function (scope, iElement, iAttrs) {
                iElement.addClass('questions-widget');
            },
            controller: function($scope, $element, $attrs, $mdDialog, socketFactory, dataFactory, ajax) {
                $scope.questions = [{
                    id : 1,
                    text : "Aenean euismod bibendum laoreet. Cum soci?",
                    created_at : new Date("21 May 2015 10:12"),
                    replies : 2,
                    sender : 'Tony Scarfoni',
                    avatar : "/images/avatar-fpo.jpg"
                },{
                    id : 2,
                    text : "Aenean euismod bibendum laoreet. Cum soci?",
                    created_at : new Date("11 Sep 2015 10:12"),
                    replies : 2,
                    sender : 'Tony Scarfoni',
                    avatar : "/images/avatar-fpo.jpg"
                }];
                $scope.questions = [];
            }
        };
    }]);