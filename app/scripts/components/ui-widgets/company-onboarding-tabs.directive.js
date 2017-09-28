'use strict';

angular.module('dmc.widgets.companyonboardingTabs',[])
.directive('signupTabs', function () {
    return {
        restrict: 'E',
        controller: 'uiWidgetCompanyOnboardingTabs',
        templateUrl: 'templates/components/ui-widgets/company-onboarding-tab.html',
        scope: {
            currentStage: '@'
        }
    };
})

.controller('uiWidgetCompanyOnboardingTabs', ['$scope',
    function($scope){
      $scope.steps = [
        {icon:'person_add', content:'Create Account'},
        {icon:'business', content:'Company Information'},
        {icon:'credit_card', content:'Confirm and Pay'}
      ];

}])
