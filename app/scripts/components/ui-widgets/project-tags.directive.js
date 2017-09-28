'use strict';

angular.module('dmc.widgets.project-tags',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket',
        'dmc.model.previous-page'
    ]).
    directive('uiWidgetProjectTags', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/project-tags.html',
            scope: {
                widgetTitle: "=",
                tags: "="
            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel, previousPage, $interval) {

            }
        };
    }])