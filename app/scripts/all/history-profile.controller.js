'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllHistoryProfileController', [
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
            ajax.get(dataFactory.userAccount($stateParams.profileId).get,{},function(response){
                    $scope.previousPage.title = "Back to The " + response.data.displayName + "'s Profile";
                    apply();
            })


            $("title").text("View All History");


            $scope.history = [];
            $scope.type = $stateParams.type;
            $scope.order = "DESC";
            $scope.sort = "text";

            $scope.getHistory = function () {
                ajax.get(dataFactory.profiles($stateParams.profileId).history,
	                {
	                	_sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                        _order: $scope.order,
		                "section": $stateParams.type
		            },
	                function(response){
	                    for(var i in response.data){
		                    response.data[i].date = moment(response.data[i].date).format("MM/DD/YYYY h:mm A");
                            switch(response.data[i].type){
                                case "completed":
                                    response.data[i].icon = "images/ic_done_all_black_24px.svg";
                                    break;
                                case "added":
                                    response.data[i].icon = "images/ic_group_add_black_24px.svg";
                                    break;
                                case "rated":
                                    response.data[i].icon = "images/ic_star_black_24px.svg";
                                    break;
                                case "worked":
                                    response.data[i].icon = "images/icon_project.svg";
                                    break;
                                case "favorited":
                                    response.data[i].icon = "images/ic_favorite_black_24px.svg";
                                    break;
                                case "shared":
                                    response.data[i].icon = "images/ic_done_all_black_24px.svg";
                                    break;
                                case "discussion":
                                    response.data[i].icon = "images/ic_forum_black_24px.svg";
                                    break;
                            }
		                }
		                $scope.history = response.data;
	                }
	            )
            };
            //uncomment when fixed/implemented
            //$scope.getHistory();

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
