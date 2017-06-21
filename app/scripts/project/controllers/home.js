angular.module('dmc.project')
.controller('HomeCtrl',
function ($rootScope, $scope, $stateParams,$mdDialog, projectData, toastModel, $cookieStore, $location) {
    var projectCtrl = this;
    projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
    projectCtrl.projectData = projectData;

    $scope.pages = [
        {
            id : 1,
            title : 'Home',
            icon : 'home',
            state : 'project.home'
        },
        //{
        //    id : 2,
        //    title : 'Workspace',
        //    icon : 'view_quilt',
        //    state : 'project.workspace'
        //},
        {
            id : 3,
            title : 'Documents',
            icon : 'my_library_books',
            state : 'project.documents'
        },
        {
            id : 7,
            title : 'Services',
            icon : 'icon_service-white',
            location : 'folder',
            state : 'project.services'
        },
        {
            id : 5,
            title : 'Team',
            icon : 'people',
            state : 'project.team'
        },
        {
            id : 6,
            title : 'Discussions',
            icon : 'forum',
            state : 'project.discussions'
        },
        {
            id : 4,
            title : 'Tasks',
            icon : 'list',
            state : 'project.tasks'
        }
        //{
        //    id : 8,
        //    title : 'Components',
        //    icon : 'receipt',
        //    state : 'project.components'
        //}
    ];


    if($cookieStore.get("toast")){
	    toastModel.showToast("success", $cookieStore.get("toast"));
	    $cookieStore.remove("toast");
    }
console.log(projectCtrl)
    if(projectCtrl.projectData.description.length > 1000){
        projectCtrl.projectData.description = projectCtrl.projectData.description.substring(0,1000)+'...';
    }

    var showTask = $location.search().showTask || 0;
    if (showTask != 0 && !(typeof showTask === 'boolean')) {
        $scope.showTaskModal = showTask;
    }

    $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

})
