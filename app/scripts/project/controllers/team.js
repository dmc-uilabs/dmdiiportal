angular.module('dmc.project')
    .controller('TeamCtrl',[
        "$scope",
        "$state",
        "$rootScope",
        "$stateParams",
        "$mdDialog",
        "ajax",
        "dataFactory",
        "DMCUserModel",
        "questionToastModel",
        "projectData",
        function ($scope,
                  $state,
                  $rootScope,
                  $stateParams,
                  $mdDialog,
                  ajax,
                  dataFactory,
                  DMCUserModel,
                  questionToastModel,
                  projectData) {

            var projectCtrl = this;
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;

            $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

            $scope.loading = false;
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "people";
            $scope.members = [];
            $scope.types = [
                {
                    id : 1,
                    name : "All",
                    tag : "all"
                },
                {
                    id : 2,
                    name : "People",
                    tag : "people"
                },
                {
                    id : 3,
                    name : "Companies",
                    tag : "companies"
                }
            ];

            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.text = $scope.searchModel;
                $state.go('project.team', dataSearch, {reload: true});
            };

            $scope.changedType = function (type) {
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.type = type;
                $state.go('project.team', dataSearch, {reload: true});
            };

            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(result) {  // this is only run after $http completes
                $scope.userData = result;
                $scope.getMembers();
            });

            $scope.getMembers = function () {
                $scope.loading = true;
                ajax.get(dataFactory.projectMembers(projectCtrl.currentProjectId), {}, function (response) {
                    var profileIds = $.map(response.data, function (x) {
                        return x.profileId;
                    });
                    $scope.members = response.data;
                    ajax.get(dataFactory.profiles().all, {
                        id: profileIds,
                        displayName_like: $scope.searchModel,
                        _type: $scope.typeModel
                    }, function (res) {
                        $scope.loading = false;
                        for(var i in $scope.members){
                            for(var j in res.data){
                                if($scope.members[i].profileId == res.data[j].id){
                                    $scope.members[i].member = res.data[j];
                                    break;
                                }
                            }
                        }
                        isFollowed($scope.members);
                        apply();
                    });
                });
            };

            $scope.follow = function (member) {
                if (!member.isFollow) {
                    ajax.create(dataFactory.followMember(), {
                        profileId: member.id,
                        accountId: $scope.userData.accountId
                    }, function (response) {
                        member.isFollow = response.data;
                        apply();
                    });
                } else {
                    ajax.delete(dataFactory.followMember(member.isFollow.id), {}, function () {
                        member.isFollow = null;
                        apply();
                    });
                }
            };

            $scope.delete = function(event,member){
                questionToastModel.show({
                    question: "Are you sure you want to delete "+member.member.displayName+" from team?",
                    buttons: {
                        ok: function () {
                            ajax.delete(dataFactory.deleteProjectMember(member.id), {}, function () {
                                for(var i in $scope.members){
                                    if($scope.members[i].id == member.id){
                                        $scope.members.splice(i,1);
                                        break;
                                    }
                                }
                                apply();
                            });
                        },
                        cancel: function () {
                        }
                    }
                }, event);

            };

            function isFollowed(data) {
                var ids = $.map(data, function (user) {
                    return user.member.id;
                });
                ajax.get(dataFactory.getAccountFollowedMembers($scope.userData.accountId), {}, function (response) {
                    for (var i in data) {
                        for (var j in response.data) {
                            if (response.data[j].profileId == data[i].member.id) {
                                data[i].member.isFollow = $.extend(true, {}, response.data[j]);
                                response.data.splice(j, 1);
                                break;
                            }
                        }
                    }
                    apply();
                });
            }

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };
        }
    ]
);