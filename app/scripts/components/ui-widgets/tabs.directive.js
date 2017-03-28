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
                console.log($scope.data);
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
			controller: function($scope, $mdDialog) {
				$scope.follow = function(item){
					item.follow = !item.follow;
				}
				$scope.share = function(ev){
		            $mdDialog.show({
		                  controller: "ShareProductCtrl",
		                  templateUrl: "templates/components/product-card/share-product.html",
		                  parent: angular.element(document.body),
		                  targetEvent: ev,
		                  clickOutsideToClose:true,
		                  locals: {
		                      serviceId : $scope.data.serviceId
		                  }
		              }).then(function() {
		              }, function() {
		              });
		          };
			}
		};
	}]);
