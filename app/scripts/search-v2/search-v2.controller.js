'use strict';
angular.module('dmc.search_v2')
.directive('dmcCompanyCard', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/company-card-tpl.html',
            scope:{
                compareCompany: '=',
                cardSource: '=',
                inviteCompany: '=',
                favoriteCompany: '='
            },
            controller: function ($scope,$mdDialog,$rootScope,ajax,dataFactory,DMCUserModel) {

                $scope.userData = DMCUserModel.getUserData();
                $scope.userData.then(function(res){
                    $scope.userData = res;
                });

                $scope.addingToProject = false;

                $scope.addToProject = function(){
                    $scope.addingToProject = true;
                };

                $scope.projects = $rootScope.projects;

                $scope.cancelAddToProject = function(){
                    $scope.addingToProject = false;
                };

                $scope.showCompany = function(id, ev){
                    $(window).scrollTop();
                    $mdDialog.show({
                        controller: 'showCompany',
                        templateUrl: 'templates/components/members-card/show-company.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        locals: {
                            'id' : $scope.cardSource.id
                        }
                    }).then(function() {
                        $(window).scrollTop();
                    }, function() {
                        $(window).scrollTop();
                    });
                };

                $scope.inviteUserToProject = function(projectId){
                    var project = null;
                    for(var i in $scope.projects){
                        if($scope.projects[i].id == projectId){
                            project = $scope.projects[i];
                            break;
                        }
                    }
                    if(project){
                        ajax.get(dataFactory.getUsersByOrganization($scope.cardSource.id),{},
                            function(response){
                                var ids = $.map(response.data,function(x){ return x.id; });
                                var count = ids.length;
                                function callbackAddUser(response, i){
                                    console.log(response, i, count)
                                    if(i === count-1) {
                                        $scope.cancelAddToProject();

                                        if (!$scope.cardSource.currentStatus) $scope.cardSource.currentStatus = {};
                                        if (!$scope.cardSource.currentStatus.project) $scope.cardSource.currentStatus.project = {};
                                        $scope.cardSource.currentStatus.project.id = projectId;
                                        $scope.cardSource.currentStatus.project.title = project.title;
                                        $scope.cardSource.projectId = projectId;
                                        $scope.cardSource.added = true;

                                        $scope.cardSource.lastProject = {
                                            title: project.title,
                                            href: '/project.php#/' + project.id + '/home'
                                        };
                                        $scope.addedTimeout = setTimeout(function () {
                                            $scope.cardSource.added = false;
                                            apply();
                                        }, 10000);
                                        apply();
                                    }
                                }
                                if(count > 0) {
                                    var index = 0;
                                    for (var i in ids) {
                                        ajax.create(dataFactory.createMembersToProject(),
                                            {
                                                'profileId': ids[i],
                                                'projectId': projectId,
                                                'fromProfileId': $rootScope.userData.id,
                                                'from': $rootScope.userData.displayName,
                                                'date': Date.parse(new Date()),
                                                'accept': true
                                            }, function(response){
                                                index++;
                                                $rootScope.userData.messages.items.splice($rootScope.userData.messages.items.length-1, 1);
                                                $rootScope.userData.messages.items.unshift({
                                                    'user_name': $rootScope.userData.displayName,
                                                    'image': '/uploads/profile/1/20151222084711000000.jpg',
                                                    'text': 'Invited you to a project',
                                                    'link': '/project.php#/preview/' + projectId,
                                                    'created_at': moment().format('hh:mm A')
                                                });
                                                callbackAddUser(response, index);
                                            }
                                        );
                                    }
                                }
                            }
                        );
                    }else{
                        toastModel.showToast('error', 'Project not found');
                    }
                };

                $scope.backToAdd = function(){
                    $scope.cardSource.added = false;
                    clearInterval($scope.addedTimeout);
                };

                $scope.followCompany = function(){
                    if($scope.userData) {
                        if (!$scope.cardSource.follow) {
                            ajax.create(dataFactory.followCompany(), {
                                accountId: $scope.userData.accountId,
                                companyId: $scope.cardSource.id
                            }, function (response) {
                                $scope.cardSource.follow = response.data;
                                if($rootScope.searchPageTotalFollow) $rootScope.searchPageTotalFollow.add();
                                apply();
                            });
                        } else {
                            ajax.delete(dataFactory.unfollowCompany($scope.cardSource.follow.id), {},
                                function (response) {
                                    $scope.cardSource.follow = null;
                                    if($rootScope.searchPageTotalFollow) $rootScope.searchPageTotalFollow.delete();
                                }
                            );
                        }
                    }
                };

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        }
    })
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
                    displayName: $scope.searchTextModel
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
