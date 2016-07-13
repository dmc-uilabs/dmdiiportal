angular.module('dmc.dmdiiProjects')
.controller('QuickDocController',
	['$scope', '$rootScope', '$mdDialog', 'doc',
	function ($scope, $rootScope, $mdDialog, doc) {
        $scope.doc = doc;
		$scope.cancel = function(){
            $mdDialog.hide();
		}
}]);
