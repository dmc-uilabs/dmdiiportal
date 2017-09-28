angular.module('dmc.select-project',[])
    .controller('SelectProjectController',function($scope,$rootScope,ajax,$mdDialog){

        if(!$rootScope.projects) ajax.loadProjects();

        $scope.addTask = function(project){
            location.href = "/project.php#/"+project+"/add-task";
        };

        $scope.cancel = function(){
            $mdDialog.cancel();
        };

    });