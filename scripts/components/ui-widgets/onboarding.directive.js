'use strict';

angular.module('dmc.widgets.onboarding',[
    ]).
    directive('uiWidgetOnboarding', function() {
        return {
            restrict: 'A',
            templateUrl: '/templates/components/ui-widgets/onboarding.html',
            scope:{
                widgetTitle: "=",
            },
            controller: ['$scope', '$rootScope',
	            function($scope, $rootScope) {
	            	$rootScope.$watch(function(){
	            		return $rootScope.userData
	            	}, function(){
	            		if ($rootScope.userData){
	            			$scope.data = $rootScope.userData.onboarding;

	            		}
	            	})
	            }],
        };
    });