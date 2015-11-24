angular.module('dmc.project')
.controller('IdLocatorCtrl', [
    '$stateParams',
    '$state',
function ($stateParams, $state) {
    var projectId = $stateParams.projectId

    if (projectId === "" || !angular.isDefined($stateParams.projectId)) {
        projectId = 1
    }

    $state.go('project.home', {projectId: projectId})
}]);
