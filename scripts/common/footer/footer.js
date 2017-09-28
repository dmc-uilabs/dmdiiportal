'use strict';
/**
* dmc.common.footer Module
*
* Global Footer
*/
angular.module('dmc.common.footer', ['ngSanitize'])
    .directive('dmcFooter', ['$compile',function($compile) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                type: '='
            },
            templateUrl: 'templates/common/footer/footer-tpl.html',
            controller: function($scope,$element){

            }
        };
    }]
);
