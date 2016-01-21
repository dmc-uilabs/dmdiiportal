angular.module('dmc.project')
.controller('HomeCtrl',
function ($rootScope, $stateParams,$mdDialog, projectData) {
    var projectCtrl = this;
    projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
    projectCtrl.projectData = projectData;

    if(projectCtrl.projectData.description.length > 1000){
        projectCtrl.projectData.description = projectCtrl.projectData.description.substring(0,1000)+'...';
    }

    $rootScope.$on('$stateChangeStart', $mdDialog.cancel);
})
