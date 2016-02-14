angular.module('dmc.onboarding')
.controller('StorefrontController', 
	['$scope', '$rootScope', '$state', 'ajax', 'dataFactory',
	function ($scope, $rootScope, $state, ajax, dataFactory) {
		if($state.current.name == "onboarding.storefront"){
			$state.go($scope.storefront[0].state);
		}
        $scope.activePage = $state;

        $scope.next = function(index){
        	$scope.storefront[index].done = true;
            $(window).scrollTop(0);
        	$state.go('^' + $scope.storefront[index+1].state);
        }

        $scope.finish = function(index){
            $scope.storefront[index].done = true;
            $(window).scrollTop(0);
            $state.go('^.^.home');
        }
}]);