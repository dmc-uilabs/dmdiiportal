angular.module('dmc.project')
.controller('HomeCtrl',
function ($rootScope, $scope, $stateParams,$mdDialog, projectData, toastModel, $cookieStore, $location) {
    var projectCtrl = this;
    projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
    projectCtrl.projectData = projectData;

    if($cookieStore.get("toast")){
	    toastModel.showToast("success", $cookieStore.get("toast"));
	    $cookieStore.remove("toast");
    }

    if(projectCtrl.projectData.description.length > 1000){
        projectCtrl.projectData.description = projectCtrl.projectData.description.substring(0,1000)+'...';
    }

    var showTask = $location.search().showTask || 0;
    if (showTask != 0 && !(typeof showTask === 'boolean')) {
        $scope.showTaskModal = showTask;
    }

    $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

})
