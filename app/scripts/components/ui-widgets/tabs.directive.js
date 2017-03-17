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
			},
      controller: function($scope) {
        $scope.formatDate = function(date) {
          if(date){
            return moment(1000*date).format('MMM D YYYY, h:mm a');
          }else{
            return "";
          }
        };
        $scope.formatRuntime = function(runtime){
          if(!isNaN(runtime)){
            return parseFloat(runtime).toFixed(2) + 's';
          }else{
            return "";
          }
        };
        $scope.generateGraph = function() {
          return "/images/statistics_graph.png"
        };
        function formatData(data) {
          data.average_runtime = $scope.formatRuntime(data.average_runtime);
          data.last_run.date = $scope.formatDate(data.last_run.date);
          data.last_run.runtime = $scope.formatRuntime(data.last_run.runtime);
          data.my_last_run.date = $scope.formatDate(data.my_last_run.date);
          data.my_last_run.runtime = $scope.formatRuntime(data.my_last_run.runtime);
        };
        formatData($scope.data);
        $scope.graph = $scope.generateGraph();
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
