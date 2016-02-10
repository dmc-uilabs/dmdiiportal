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
            	},
            	function(data){
            		$scope.history = data;
            		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            	}
            )
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
        '$stateParams',
        'history',
        function (
            $scope,
            $state,
            $mdDialog,
            $stateParams,
            history) {

            $scope.history = history;

            $scope.cancel = function(){
                $mdDialog.cancel();
            };
            $scope.rerun = function(){
                $scope.cancel();
                var dataSearch = $stateParams;
                dataSearch.rerun = history.id;
                $state.go('project.run-services', dataSearch);
            };

        }
    ]
);