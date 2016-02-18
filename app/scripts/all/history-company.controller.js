'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllHistoryCompanyController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'previousPage',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    dataFactory) {

            // comeback to the previous page
            $scope.previousPage = previousPage.get();

            $("title").text("View All History");

            
            $scope.history = [];
            $scope.type = $stateParams.type;
            $scope.order = "DESC";
            $scope.sort = "text";

            $scope.getHistory = function () {
                ajax.get(dataFactory.companyURL($stateParams.companyId).history,
	                {
	                	_sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                        _order: $scope.order,
		                "section": $stateParams.type
		            },
	                function(response){
	                    for(var i in response.data){
		                    response.data[i].date = moment(response.data[i].date).format("MM/DD/YYYY h:mm A");
		                    if(response.data[i].type == "completed"){
		                        response.data[i].icon = "done_all";
		                    }else if(response.data[i].type == "added"){
		                        response.data[i].icon = "person";
		                    }else if(response.data[i].type == "rated"){
		                        response.data[i].icon = "edit";
		                    }else if(response.data[i].type == "worked"){
		                        response.data[i].icon = "supervisor_account";
		                    };
		                }
		                $scope.history = response.data;
	                }
	            )
            };
            $scope.getHistory();

            $scope.onOrderChange = function (order) {
                $scope.sort = order;
                $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                $scope.getHistory();
            };

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };
        }
    ]
);