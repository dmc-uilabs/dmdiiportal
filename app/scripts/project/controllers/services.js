angular.module('dmc.project')
.controller('projectServicesCtrl', ['$scope', '$stateParams', 'ajax', 'dataFactory', 'projectData', 'serviceData', '$rootScope','$mdDialog', 
    function ($scope, $stateParams, ajax, dataFactory, projectData, serviceData, $rootScope,$mdDialog) {

        $scope.projectData = projectData;
        $scope.projectData.services.data = serviceData;
        for(var item in $scope.projectData.services.data){
            $scope.projectData.services.data[item].releaseDate = moment($scope.projectData.services.data[item].releaseDate,"DD/MM/YYYY").format("MM/DD/YYYY");
        }

        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };


        $scope.delete = function(item, index){
            ajax.get(dataFactory.services(item.id).get,{},
                function(response){
                    var services = response.data;
                    services['projectId'] = null;
                    services['currentStatus'] = {};

                    ajax.update(dataFactory.services(item.id).update, services,
                        function(response){
                            $scope.projectData.services.data.splice(index, 1);
                        }
                    );
                }
            );
        };

        //$scope.getServices();
        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

}])
