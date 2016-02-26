'use strict';

angular.module('dmc.widgets.invited-users',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket'
    ]).
    directive('uiWidgetInvitedUsers', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/invited-users.html',
            scope: {
                widgetTitle: "=",
                projectId : "="
            },
            link: function (scope, iElement, iAttrs) {
                iElement.addClass('invited-users-widget');
            },
            controller: function($scope, $element, $attrs, $mdDialog, socketFactory, dataFactory, ajax) {
                $scope.invitees = [{
                    id : 1,
                    name : "Wade Goodwin",
                    avatar : "/images/logo-wyiv.png",
                    company : "WYIV Co.",
                    date : moment(new Date("23 Sep 2015 10:12")).format("MM/DD/YYYY")
                },{
                    id : 2,
                    name : "Belinda Cole",
                    avatar : "/images/logo-rjc.png",
                    company : "RCJ Co.",
                    date : moment(new Date("23 Sep 2015 10:12")).format("MM/DD/YYYY")
                },{
                    id : 3,
                    name : "Andrew Bailey",
                    avatar : "/images/logo-sam.png",
                    company : "SAM",
                    date : moment(new Date("23 Sep 2015 10:12")).format("MM/DD/YYYY")
                }];

            }
        };
    }]);