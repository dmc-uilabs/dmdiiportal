'use strict';
angular.module('dmc.company-profile').
    directive('tabAdminMemberArea', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-admin-member-area.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax,DMCUserModel,toastModel,questionToastModel) {
                $element.addClass("tab-admin-member-area");

                $scope.userData = null;
                DMCUserModel.getUserData().then(function(res){
                    $scope.userData = res;
                    loadMembers();
                    loadRemovedMembers();
                    loadRequestsMembers();
                });

                $scope.members = [];
                $scope.removedMembers = [];
                $scope.requests = [];

                function loadMembers(){
                    ajax.get(dataFactory.companyURL($scope.source.id).profiles,{},function(response){
                        $scope.members = response.data;
                        isFollowed($scope.members);
                    });
                }

                function loadRemovedMembers(){
                    ajax.get(dataFactory.companyURL($scope.source.id).get_removed_members,{},function(response){
                        $scope.removedMembers = response.data;
                        ajax.get(dataFactory.profiles().all,{
                            id : $.map($scope.removedMembers,function(x){ return x.profileId; })
                        },function(res){
                            for(var i in $scope.removedMembers) {
                                for(var j in res.data){
                                    if($scope.removedMembers[i].profileId == res.data[j].id){
                                        $scope.removedMembers[i].member = res.data[j];
                                        break;
                                    }
                                }
                            }
                            apply();
                        });
                    });
                }

                function loadRequestsMembers(){
                    ajax.get(dataFactory.companyURL($scope.source.id).get_member_requests,{},function(response){
                        $scope.requests = response.data;
                        ajax.get(dataFactory.profiles().all,{
                            id : $.map($scope.requests,function(x){ return x.profileId; })
                        },function(res){
                            for(var i in $scope.requests) {
                                for(var j in res.data){
                                    if($scope.requests[i].profileId == res.data[j].id){
                                        $scope.requests[i].member = res.data[j];
                                        break;
                                    }
                                }
                            }
                            apply();
                        });
                    });
                }

                $scope.invite = function(event,member){

                };

                $scope.approve = function(member){
                    var id = member.profileId;
                    ajax.update(dataFactory.profiles(id).update,{
                        companyId : $scope.source.id,
                        company : $scope.source.name
                    },function(response) {
                        $scope.members.push(response.data);
                        apply();
                    });
                    for(var i in $scope.removedMembers) {
                        if($scope.removedMembers[i].profileId == id) {
                            ajax.delete(dataFactory.companyURL($scope.removedMembers[i].id).remove_member_from_removed, {}, function () {
                                $scope.removedMembers.splice(i,1);
                                apply();
                            });
                        }
                    }
                    ajax.delete(dataFactory.companyURL(member.id).approve_member,{},function(){
                        for(var i in $scope.requests){
                            if($scope.requests[i].id == member.id){
                                $scope.requests.splice(i,1);
                                break;
                            }
                        }
                        apply();
                    });
                };

                $scope.decline = function(member){
                    ajax.update(dataFactory.companyURL(member.id).decline_member,{
                        decline : true
                    },function(){
                        member.decline = true;
                        apply();
                    });
                };

                $scope.delete = function(event,member){
                    questionToastModel.show({
                        question: "Are you sure you want to delete "+member.displayName+" from company?",
                        buttons: {
                            ok: function () {
                                ajax.update(dataFactory.profiles(member.id).update,{
                                    companyId : null,
                                    company : null
                                },function(){
                                    ajax.create(dataFactory.companyURL().remove_member, {
                                        profileId : member.id,
                                        companyId : $scope.source.id
                                    }, function (response) {
                                        var data = response.data;
                                        data.member = $.extend(true,{},member);
                                        data.member.company = null;
                                        data.member.companyId = null;
                                        $scope.removedMembers.push(data);
                                        for(var i in $scope.members){
                                            if($scope.members[i].id == data.profileId){
                                                $scope.members.splice(i,1);
                                                break;
                                            }
                                        }
                                        apply();
                                    });
                                });
                            },
                            cancel: function () {
                            }
                        }
                    }, event);
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

                function isFollowed(data) {
                    ajax.get(dataFactory.getAccountFollowedMembers($scope.userData.accountId), {}, function (response) {
                        for (var i in data) {
                            for (var j in response.data) {
                                if (response.data[j].profileId == data[i].id) {
                                    data[i].isFollow = $.extend(true, {}, response.data[j]);
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
        };
    }]);