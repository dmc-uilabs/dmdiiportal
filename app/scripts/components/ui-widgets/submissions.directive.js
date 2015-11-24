'use strict';

angular.module('dmc.widgets.submissions',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket'
    ]).
    directive('uiWidgetSubmissions', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/submissions.html',
            scope: {
                widgetTitle: "=",
                projectId : "="
            },
            link: function (scope, iElement, iAttrs) {
                iElement.addClass('submissions-widget');
            },
            controller: function($scope, $element, $attrs, $mdDialog, socketFactory, dataFactory, ajax) {
                $scope.submissions = [{
            id : 1,
            title : "SAM",
            date : moment(new Date("15 Sep 2015 15:12:48")).format("MM/DD/YY HH:mm:ss A"),
            success : 97,
            inputs : 2,
            select : false,
            letter: "We propose to develop and deliver a low heat loss Transformer based on our novel material. It will meet all of the environmental and Compliance requirements in your specification. The attached document summarizes Performance relative to an iron core transformer. Please let us know how you would like to proceed."
        },{
            id : 2,
            title : "WYIV Co.",
            date : moment(new Date("11 Sep 2015 10:16:11")).format("MM/DD/YY HH:mm:ss A"),
            success : 91,
            inputs : 2,
            select : false,
            letter: "Lorem ipsum dolor sit amet."
        },{
            id : 3,
            title : "RCJ Co.",
            date : moment(new Date("12 Sep 2015 06:55:33")).format("MM/DD/YY HH:mm:ss A"),
            success : 90,
            inputs : 1,
            select : false,
            letter: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
        }];
                // $scope.submissions = [];

                $scope.onOrderChange = function(){

                };
            }
        };
    }]);