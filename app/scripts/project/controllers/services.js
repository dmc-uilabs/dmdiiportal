angular.module('dmc.project')
.controller('projectServicesCtrl', ['$scope', '$stateParams', 'projectData','$rootScope','$mdDialog', function ($scope, $stateParams, projectData, $rootScope,$mdDialog) {
	
	$scope.projectData = projectData;

	$scope.delete = function(item, index){
		$scope.projectData.services.data.splice(index, 1);
	};
    $rootScope.$on('$stateChangeStart', $mdDialog.cancel);
}])
