angular.module('dmc.project')
.controller('DocumentsCtrl',
    function ($rootScope,$scope, $state, $stateParams,$mdDialog, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

        $scope.addDocument = function(){
            $state.go("project.documents-upload");
        };
    })
