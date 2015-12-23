angular.module('dmc.project')
.controller('projectServicesCtrl', ['$scope', '$stateParams', 'projectData', function ($scope, $stateParams, projectData) {
	
	$scope.projectData = projectData;
	
}])
