angular.module('dmc.project')
.controller('projectServicesCtrl', ['$scope', '$stateParams', 'projectData','$rootScope','$mdDialog', function ($scope, $stateParams, projectData, $rootScope,$mdDialog) {
	
	$scope.projectData = projectData;
    console.log($scope.projectData);
    for(var item in $scope.projectData.services.data){
        $scope.projectData.services.data[item].releaseDate = moment($scope.projectData.services.data[item].releaseDate,"DD/MM/YYYY").format("MM/DD/YYYY");
    }

	$scope.delete = function(item, index){
		$scope.projectData.services.data.splice(index, 1);
	};
    $rootScope.$on('$stateChangeStart', $mdDialog.cancel);
}])
