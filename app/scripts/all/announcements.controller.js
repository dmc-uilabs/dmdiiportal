'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllAnnouncementsController', [
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

            $("title").text("View All Announcements");

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : null;

            
            $scope.announcements = [];
            $scope.order = "DESC";
            $scope.sort = "text";

            $scope.types = [
                {
                    tag: "announcements",
                    name: "Announcements"
                }
            ];

            var getUser = function(announcement){
            	ajax.get(dataFactory.getAccount(announcement.accountId), {},
            		function(response){
            			announcement['full_name'] = response.data.displayName;
            		}
            	);
            };

            var getCreated_By = function(announcement, id){
            	ajax.get(dataFactory.getAccount(announcement.accountId), {},
            		function(response){
            			announcement['latest-post']['created-by'] = response.data.displayName;
            		}
            	);
            };

            var getComments = function(announcement){
				ajax.get(dataFactory.getAnnouncementsComments(announcement.id), {
					"_sort": "created_at",
					"_order": "DESC"
				},
            		function(response){
            			announcement['replies'] = response.data.length;
            			if (response.data.length !== 0) {
            				announcement['latest-post']= {}
            				announcement['latest-post']['created-at'] = moment(response.data[0].created_at).format("MM/DD/YYYY hh:mm A");
							getCreated_By(announcement, response.data[0].id);
            			};
            		}
            	);
            }

            $scope.getAnnouncements = function () {
                ajax.get(dataFactory.getAnnouncements(), {
                        _sort: ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort),
                        _order: $scope.order,
                        title_like: $scope.searchModel,
                        _type: $scope.typeModel
                    }, function (response) {
                        $scope.announcements = response.data;
                        for(var a in $scope.announcements){
                        	getUser($scope.announcements[a]);
                        	getComments($scope.announcements[a]);
                            $scope.announcements[a].created_at = moment($scope.announcements[a].created_at).format("MM/DD/YYYY hh:mm A");
                        }
                        apply();
                    }
                );
            };
            $scope.getAnnouncements();

            $scope.onOrderChange = function (order) {
                $scope.sort = order;
                $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                $scope.getAnnouncements();
            };

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.text = $scope.searchModel;
                $state.go('announcements', dataSearch, {reload: true});
            };

            $scope.changedType = function (type) {
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.type = type;
                $state.go('announcements', dataSearch, {reload: true});
            };
        }
    ]
);