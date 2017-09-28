angular.module('dmc.project')
    .controller('TeamCtrl',[
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$mdDialog',
        'ajax',
        'dataFactory',
        'DMCUserModel',
        'questionToastModel',
        'toastModel',
        'projectModel',
        'projectData',
        function ($scope,
                  $state,
                  $rootScope,
                  $stateParams,
                  $mdDialog,
                  ajax,
                  dataFactory,
                  DMCUserModel,
                  questionToastModel,
                  toastModel,
                  projectModel,
                  projectData) {

            var projectCtrl = this;
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;

            $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

            $scope.loading = false;
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : 'people';
            $scope.members = [];
            $scope.types = [
                {
                    id : 1,
                    name : 'All',
                    tag : 'all'
                },
                {
                    id : 2,
                    name : 'People',
                    tag : 'people'
                },
                {
                    id : 3,
                    name : 'Companies',
                    tag : 'companies'
                }
            ];

            var currentMembersId=[];


            $scope.inviteModal = function(ev){
              $mdDialog.show({
                  controller: 'AddMembersController',
                  templateUrl:'templates/components/add-project/ap-tab-two.html',
                  parent: angular.element(document.body),
                  locals:{dataToPass: $scope.invitees},
                  targetEvent: ev,
                  fullscreen:true,
                  clickOutsideToClose:true
              }).then(function(invitees){
                $scope.invitees= invitees;
                $scope.updateTeam($scope.invitees);

              })
            }

            // if(projectCtrl.projectData.isPublic && projectCtrl.projectData.requiresAdminApprovalToJoin) {
            //     loadRequests();
            // };

            $scope.acceptedRequests = [];
            $scope.pendingRequests = [];
            $scope.declinedRequests = [];

            // function loadRequests(){
            //     ajax.get(dataFactory.getProjectJoinRequests(projectCtrl.projectData.id), {}, function (response) {
            //         var requests = response.data;
            //         ajax.get(dataFactory.profiles().all, {
            //             id : $.map(response.data,function(x){ return x.profileId;})
            //         }, function (res) {
            //             console.log(requests)
            //             for(var i in requests){
            //                 for(var j in res.data) {
            //                     if (requests[i].profileId == res.data[j].id) {
            //                         requests[i].member = res.data[j];
            //                         console.log(requests[i].accept, requests[i].rejected)
            //
            //                         break;
            //                     }
            //                 }
            //             }
            //             apply();
            //         });
            //     });
            // }

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
                $scope.companyNameList = {};
                ajax.get(dataFactory.getProjectMembers(), {projectId: projectCtrl.currentProjectId}, function (response) {
                    var profileIds = $.map(response.data, function (x) {
                        return x.profileId;
                    });
                    // currentMembersId = $.map(response.data, function (x) {
                    //     return {
                    //         id : x.id,
                    //         profileId : x.profileId
                    //     };
                    // });
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
                                    if ($scope.members[i].member.company && !$scope.companyNameList[$scope.members[i].member.company]) {
                                        ajax.get(dataFactory.getOrganization([$scope.members[i].member.company]), {}, function(response) {
                                            if (response.data && response.data.name) {
                                                console.log(response.data)
                                                $scope.companyNameList[$scope.members[i].member.company] = response.data.name;
                                            }
                                        });
                                    }
                                    console.log($scope.companyNameList)
                                    if ($scope.members[i].accept) {
                                        $scope.acceptedRequests.push($scope.members[i]);
                                    } else if  (!$scope.members[i].accept && !$scope.members[i].rejected) {
                                        $scope.pendingRequests.push($scope.members[i]);
                                    } else if ($scope.members[i].rejected) {
                                        $scope.declinedRequests.push($scope.members[i]);
                                    }
                                    break;
                                }
                            }
                        }
                        isFollowed($scope.members);
                        apply();
                    });
                });
            };
                        // $scope.getMembers();

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



            $scope.updateTeam = function(new_invitees) {
                var newProject = {};

                $scope.goSaveProject = true;
                $(window).unbind('beforeunload');

                projectModel.update_project(projectCtrl.currentProjectId, projectCtrl.projectData.directoryId,projectCtrl.projectData,new_invitees,currentMembersId, function(data){
                    document.location.href = 'project.php#/'+projectCtrl.currentProjectId+'/home';
                });
            };


            $scope.delete = function(event, member, index){
                questionToastModel.show({
                    question: 'Are you sure you want to delete '+member.member.displayName+' from team?',
                    buttons: {
                        ok: function () {
                            ajax.delete(dataFactory.updateMembersToProject(member.id), {}, function (response) {
                                toastModel.showToast('success', 'Member removed from project!')
                                $scope.acceptedRequests.splice(index, 1);
                                member.accept = false;
                                member.reject = true;
                                $scope.declinedRequests.push(member);
                                apply();
                            });
                        },
                        cancel: function () {
                        }
                    }
                }, event);
            };

            $scope.invite = function(event,member){
                ajax.update(dataFactory.inviteToProject(projectCtrl.currentProjectId,member.id), {
                    removed : false
                }, function (response) {
                    for(var i in $scope.members){
                        if($scope.members[i].id == response.data.id){
                            $scope.members[i] = response.data;
                            break;
                        }
                    }
                    apply();
                    toastModel.showToast('success', 'User successfully invited to the project');
                });
            };

            $scope.approve = function(item){
                ajax.delete(dataFactory.deleteProjectJoinRequests(item.id), {
                }, function (response) {
                    ajax.create(dataFactory.createMembersToProject(), {
                        'profileId': item.member.id,
                        'projectId': projectCtrl.currentProjectId,
                        'fromProfileId': $rootScope.userData.profileId,
                        'from': $rootScope.userData.displayName,
                        'date': Date.parse(new Date()),
                        'accept': true
                    }, function (response) {
                        for(var i in $scope.joinRequests){
                            if($scope.joinRequests[i].id == item.id){
                                $scope.joinRequests.splice(i,1);
                                break;
                            }
                        }
                        response.data.member = item.member;
                        $scope.members.push(response.data);
                        apply();
                    });
                });
            };

            $scope.decline = function(item){
                ajax.update(dataFactory.updateProjectJoinRequests(item.id), {
                    decline : true
                }, function (response) {
                    item.decline = true;
                    apply();
                });
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

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
        }
    ]
);
