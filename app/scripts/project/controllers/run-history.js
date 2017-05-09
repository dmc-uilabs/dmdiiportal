angular.module('dmc.project')
.controller('projectServicesRunHistoryDetailCtrl', ['$scope', 'serviceModel', 'runHistory', 'projectData', '$stateParams', 'serviceData', '$mdDialog',
    function ($scope, serviceModel, runHistory, projectData, $stateParams, serviceData, $mdDialog) {

    	$scope.from = $stateParams.from;
        $scope.history = runHistory;
        $scope.projectData = projectData;
		$scope.service = serviceData;

        $scope.order = "DESC";
        $scope.sort = "date";

		$scope.onOrderChange = function (order) {
            $scope.sort = order;
            $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
            serviceModel.get_service_run_history(
            	$scope.service.id,
            	{
            		_sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                    _order: $scope.order
            	}
            ).then (function(data){
                    $scope.history = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                });
        };
        $scope.openResults = function(history, ev){
            $(window).scrollTop(0);
            $mdDialog.show({
                controller: "ModalResultsController",
                templateUrl: "templates/project/pages/modal-results.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    history: history
                },
                clickOutsideToClose:true
            })
            .then(function() {
                $state.go('project.run-services', {ServiceId : $scope.service.id});
            }, function() {
            });
        }
}])
.controller("ModalResultsController", [
        '$scope',
        '$state',
        '$mdDialog',
        '$http',
        '$stateParams',
        'dataFactory',
        'history',
        function (
            $scope,
            $state,
            $mdDialog,
            $http,
            $stateParams,
            dataFactory,
            history) {

            $scope.history = history;


            if($scope.history.interface) $scope.history.interface.inputs = [];
            if($scope.history.interface && $scope.history.interface.inParams) {
                for (var key in $scope.history.interface.inParams) {
                    $scope.history.interface.inParams[key].defaultValue = $scope.history.interface.inParams[key].value;
                    $scope.history.interface.inputs.push($scope.history.interface.inParams[key]);
                }
            }

            $scope.cancel = function(){
                $mdDialog.cancel();
            };
            $scope.rerun = function(){
                $scope.cancel();
                var dataSearch = $stateParams;
                dataSearch.rerun = history.id;
                $state.go('project.run-services', dataSearch);
            };

            $http.get(dataFactory.services($scope.history.serviceId).get_position_inputs).then(function(response){
                if(response.data && response.data.length > 0){
                    $scope.history.position_inputs = response.data[0];
                    updatePositionInputs();
                }
            });

            function updatePositionInputs(){
                if( $scope.history.position_inputs ) {
                    var autoSetPosition = $scope.history.interface.inputs.length;
                    for (var i = 0; i < $scope.history.interface.inputs.length; i++) {
                        for (var j = 0; j < $scope.history.position_inputs.positions.length; j++) {
                            if($scope.history.interface.inputs[i].name == $scope.history.position_inputs.positions[j].name){
                                $scope.history.interface.inputs[i].position = $scope.history.position_inputs.positions[j].position;
                                break;
                            }
                        }
                        if(!$scope.history.interface.inputs[i].position){
                            autoSetPosition++;
                            $scope.history.interface.inputs[i].position = autoSetPosition;
                        }
                    }
                    console.log($scope.history.interface);
                    $scope.history.interface.inputs.sort(function(a, b){return a.position - b.position});
                    apply();
                }
            }

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

        }
    ]
);