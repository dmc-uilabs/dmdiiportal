'use strict';

angular.module('dmc.widgets.tabs',[
])
	.directive('uiWidgetTabsHistory', [function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-history.html',
			transclude: true,
			replace: true,
			scope: {
				data: "="
			},
			controller: function($scope) {
			}
		};
	}])
	.directive('uiWidgetTabsStatistic', [function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-statistic.html',
			transclude: true,
			replace: true,
			scope: {
				data: "="
			},
			controller: function($scope) {
				console.info("statistic", $scope.data);
			}
		};
	}]);