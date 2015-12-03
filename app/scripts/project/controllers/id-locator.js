angular.module('dmc')
.controller('IdLocatorCtrl', [
    '$stateParams',
    '$state',
    '$location',
function ($stateParams, $state, $location) {
    var projectId = $stateParams.projectId;
    if (projectId === "" || !angular.isDefined($stateParams.projectId)) projectId = 1;
    var params = $location.$$path.split('/');
    if(params.length <= 3 || (params.length >= 4 && params[3].trim().length == 0)) {
        $state.go('project.home', {projectId: projectId});
    }
}]);
