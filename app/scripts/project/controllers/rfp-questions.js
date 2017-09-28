angular.module('dmc.project')
.controller('RfpQuestionsCtrl',
    function ($scope,$compile,$rootScope, $stateParams,$mdDialog, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

    })