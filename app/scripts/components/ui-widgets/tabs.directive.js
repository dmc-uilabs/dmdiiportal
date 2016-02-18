'use strict';

angular.module('dmc.widgets.tabs',[
    'ngCookies',
    'dmc.model.previous-page'
])
	.directive('uiWidgetTabsHistory', [function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-history.html',
			//transclude: true,
			scope: {
				data: "="
			},
			controller: ["$scope", "previousPage", function($scope, previousPage){
                $scope.previousPage = previousPage;
            }]
		};
	}])
	.directive('uiWidgetTabsStatistic', [function () {
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