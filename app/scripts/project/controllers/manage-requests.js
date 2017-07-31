angular.module('dmc.project')
    .controller('ManageRequestsCtrl',[
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


            // if(projectCtrl.projectData.type == 'public' && projectCtrl.projectData.approvalOption == 'admin') loadRequests();
            // $scope.joinRequests = [];
            // function loadRequests(){
            //     ajax.get(dataFactory.getProjectJoinRequests(projectCtrl.projectData.id), {}, function (response) {
            //         $scope.joinRequests = response.data;
            //         ajax.get(dataFactory.profiles().all, {
            //             id : $.map(response.data,function(x){ return x.profileId;})
            //         }, function (res) {
            //             for(var i in $scope.joinRequests){
            //                 for(var j in res.data) {
            //                     if ($scope.joinRequests[i].profileId == res.data[j].id) {
            //                         $scope.joinRequests[i].member = res.data[j];
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
                ajax.get(dataFactory.joinProjectRequests(projectCtrl.currentProjectId), {}, function (response) {
					$scope.acceptedRequests = [];
					$scope.pendingRequests = [];
					$scope.declinedRequests = [];

					angular.forEach(response.data, function(member) {
						if (member.status === 'APPROVED') {
							$scope.acceptedRequests.push(member)
						} else if (member.status === 'PENDING') {
							$scope.pendingRequests.push(member)
						} else if (member.status === 'DECLINED') {
							$scope.declinedRequests.push(member)
						}
					});

					isFollowed($scope.acceptedRequests);
					isFollowed($scope.pendingRequests);
					isFollowed($scope.declinedRequests);
                    $scope.loading = false;
                    apply();
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

            $scope.approve = function(item, index){
				ajax.put(dataFactory.manageJoinRequests(item.id).accept, {}, function(response) {
					if (response.status === 200) {
						toastModel.showToast('success', 'Member accepted!');
                        $scope.pendingRequests.splice($index, 1);
                        $scope.acceptedRequests.push(item);
					}
				});
            };

            $scope.decline = function(item, index){
				ajax.put(dataFactory.manageJoinRequests(item.id).decline, {}, function(response) {
					if (response.status === 200) {
						toastModel.showToast('success', 'Member declined!');
                        $scope.pendingRequests.splice($index, 1);
                        $scope.declinedRequests.push(item);
					}
				});
            };

            function isFollowed(data) {
                var ids = $.map(data, function (user) {
                    return user.user.id;
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
