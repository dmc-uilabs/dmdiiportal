'use strict';
/**
* dmc.configs.ngmaterial Mod'ngMaterial'ul;
*
* Description
*/
angular.module('dmc.configs.ngmaterial', ['ngMaterial'])
.config(['$mdThemingProvider', function($mdThemingProvider) {
  // Extend the red theme with a few different colors
  var dmcMap = $mdThemingProvider.extendPalette('green', {
    'default': '65AF3F'
  });
  // 400, 300, 800 and A100
  var dmcAccentMap = $mdThemingProvider.extendPalette('green', {
    'A100': '65AF3F'
  });
  // Register the new color palette map with the name <code>neonRed</code>
  $mdThemingProvider.definePalette('dmcTheme', dmcMap);
  $mdThemingProvider.definePalette('dmcAccentTheme', dmcAccentMap);
  // Use that theme for the primary intentions
  $mdThemingProvider.theme('default')
    .primaryPalette('dmcTheme')
    .accentPalette('dmcAccentTheme');
}]);

