'use strict';
/**
* dmc.common.footer Module
*
* Global Footer
*/
angular.module('dmc.common.footer', [])
.directive('dmcFooter', [function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        type: '='
    },
    templateUrl: 'templates/common/footer/footer-tpl.html'
  };
}]);
