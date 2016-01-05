angular.module('dmc.project')
.controller('projectServicesCtrl', ['$scope', '$stateParams', 'projectData', function ($scope, $stateParams, projectData) {
	
	$scope.projectData = projectData;

	$scope.delete = function(item, index){
		$scope.projectData.services.data.splice(index, 1);
	}
	
}])
