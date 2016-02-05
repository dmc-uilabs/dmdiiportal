angular.module('dmc.project')
.controller('projectServicesCtrl', ['$scope', '$stateParams', 'ajax', 'dataFactory', 'projectData','$rootScope','$mdDialog', function ($scope, $stateParams, ajax, dataFactory, projectData, $rootScope,$mdDialog) {

        $scope.projectData = projectData;

        // get project services
        $scope.getServices = function(){
            ajax.get(dataFactory.getServices($scope.projectData.id),{},function(response){
                $scope.projectData.services.data = response.data;
                for(var item in $scope.projectData.services.data){
                    $scope.projectData.services.data[item].releaseDate = moment($scope.projectData.services.data[item].releaseDate,"DD/MM/YYYY").format("MM/DD/YYYY");
                }
                apply();
            });
        };

        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };


        $scope.delete = function(item, index){
            
            ajax.get(dataFactory.services(item.id).get,{},
                function(response){
                    var services = response.data;
                    services['projectId'] = 0;
                    services['currentStatus']['project']['id'] = 0;
                    services['currentStatus']['project']['title'] = "";

                    ajax.update(dataFactory.services(item.id).update, services,
                        function(response){
                            $scope.projectData.services.data.splice(index, 1);
                        }
                    );
                }
            );
        };

        $scope.getServices();
        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

}])
