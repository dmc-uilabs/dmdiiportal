'use strict';
angular.module('dmc.search_v2')
    .controller('SearchV2Controller', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'previousPage',
        'DMCUserModel',
        '$mdDialog',
        '$rootScope',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    DMCUserModel,
                    $mdDialog,
                    $rootScope,
                    dataFactory) {

            $scope.userData = DMCUserModel.getUserData();

            $scope.type = $stateParams.type;

            $scope.searchTextModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.totalItemsPerPage = angular.isDefined($stateParams.limit) ? $stateParams.limit : 10;
            $scope.currentPage = angular.isDefined($stateParams.page) ? $stateParams.page : 1;

            $scope.totalResults = 0;

            $(window).scrollTop(0);

            $scope.showArray = [
                {
                    val:10, name: '10 items'
                },
                {
                    val:25, name: '25 items'
                },
                {
                    val:50, name: '50 items'
                },
                {
                    val:100, name: '100 items'
                }
            ];


            $scope.searchPlaceholder = getPlaceholder();

            $scope.getPage = function(newPage) {
                $scope.currentPage = newPage;
                $scope.getResults();
            }

            $scope.showMembers = function(id, ev){
                $(window).scrollTop();
                $mdDialog.show({
                    controller: 'showMembers',
                    templateUrl: 'templates/components/members-card/show-members.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    locals: {
                        'id' : id
                    }
                }).then(function() {
                    $(window).scrollTop();
                }, function() {
                    $(window).scrollTop();
                });
            }


            // Companies Start ------------------------------------------------------
            $scope.totalFollowing = 0;
            $scope.arrayItems = [];

            $scope.getCompanies = function () {
                ajax.get(dataFactory.getOrganizationList(), {
                    page: $scope.currentPage - 1,
                    pageSize: $scope.totalItemsPerPage,
                    name: $scope.searchTextModel
                }, function (response) {
                    $scope.totalFollowing = 0;
                    $scope.arrayItems = response.data.content;
                    $scope.totalResults = response.data.totalElements;
                    $scope.totalPages = response.data.totalPages;
                    $scope.isFirst = response.data.first;
                    $scope.isLast = response.data.last;

                    isFollowCompany($.map($scope.arrayItems, function (x) {
                        return x.id;
                    }));
                    apply();
                });
            };
            // Companies End --------------------------------------------------------

            // Members Start ------------------------------------------------------
            $scope.getMembers = function () {
                ajax.get(dataFactory.getUserList(), {
                    page: $scope.currentPage - 1,
                    pageSize: $scope.totalItemsPerPage,
                    userName: $scope.searchTextModel
                }, function (response) {
                    $scope.totalFollowing = 0;
                    $scope.arrayItems = response.data.content;
                    $scope.totalResults = response.data.totalElements;
                    $scope.totalPages = response.data.totalPages;
                    $scope.isFirst = response.data.first;
                    $scope.isLast = response.data.last;

                    isFollowMember($.map($scope.arrayItems, function (x) {
                        return x.id;
                    }));

                    apply();
                });
            };
            // Members End --------------------------------------------------------

            $scope.userData.then(function(data){
                $scope.userData = data;
                $scope.getResults();
            });

            $scope.getResults = function() {
                if ($scope.type === 'companies') {
                    $scope.getCompanies();
                } else if ($scope.type === 'members') {
                    $scope.getMembers();
                }
            }

            $rootScope.searchPageTotalFollow = {
                add : function(){
                    $scope.totalFollowing++;
                },
                delete : function(){
                    $scope.totalFollowing--;
                }
            };

            function isFollowMember(ids){
                if(ids.length > 0) {
                    ajax.get(dataFactory.getAccountFollowedMembers($scope.userData.accountId), {
                        profileId: ids
                    }, function (response) {
                        for(var i in $scope.arrayItems){
                            if($scope.arrayItems[i].isMember) {
                                for (var j in response.data) {
                                    if ($scope.arrayItems[i].id == response.data[j].profileId) {
                                        $scope.totalFollowing++;
                                        $scope.arrayItems[i].follow = response.data[j];
                                        break;
                                    }
                                }
                            }
                        }
                        apply();
                    });
                }
            }

            function isFollowCompany(ids){
                if(ids.length > 0) {
                    ajax.get(dataFactory.getFollowCompanies($scope.userData.accountId), {
                        companyId: ids
                    }, function (response) {
                        for(var i in $scope.arrayItems){
                            if($scope.arrayItems[i].isCompany) {
                                for (var j in response.data) {
                                    if ($scope.arrayItems[i].id == response.data[j].companyId) {
                                        $scope.totalFollowing++;
                                        $scope.arrayItems[i].follow = response.data[j];
                                        break;
                                    }
                                }
                            }
                        }
                        apply();
                    });
                }
            }

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            $scope.submit = function(){
                $scope.getResults();
            };

            function getPlaceholder(){
                var placeholder = 'Search';
                switch($scope.type){
                    case 'members':
                        placeholder += ' Members';
                        break;
                    case 'companies':
                        placeholder += ' Companies';
                        break;
                    default:
                        break;
                }
                return placeholder;
            }
        }
    ]
);
