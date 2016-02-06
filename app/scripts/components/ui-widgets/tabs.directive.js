'use strict';

angular.module('dmc.widgets.tabs',[
])
	.directive('uiWidgetTabsHistory', [function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-history.html',
			//transclude: true,
			scope: {
				data: "="
			}
		};
	}])
	.directive('uiWidgetTabsStatistic', [ function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-statistic.html',
			transclude: true,
			scope: {
				data: "=",
				filter: "="
			}
		};
	}])
	.directive('uiWidgetTabsAuthor', [ function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-author.html',
			transclude: true,
			scope: {
				data: "="
			},
			controller: function($scope) {
				$scope.follow = function(item){
					item.follow = !item.follow;
				}
			}
		};
	}]);