'use strict';

angular.module('dmc.widgets.projects',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket'
    ]).
    directive('uiWidgetProjects', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: '/templates/components/ui-widgets/projects.html',
            scope:{
                searchText: "=",
                widgetTitle: "=",
                widgetShowAllBlocks: "=",
                showImage : "=",
                widgetFormat: "=",
                sortProjects: "=",
                limit : "="
            },
            controller: function($scope, $rootScope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel) {
                $scope.projects = [];
                $scope.total = 0;
                $scope.order = 'ASC';
                var limit = ($scope.limit ? $scope.limit : ($scope.widgetShowAllBlocks == true ? null : 2));

                $scope.flexBox = ($scope.widgetShowAllBlocks == true ? 28 : 60);
                $scope.flexDetails = ($scope.widgetShowAllBlocks == true ? 20 : 40);

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                // function for get all projects from DB
                $scope.getProjects = function(){

                    var requestData = {
                        _sort : $scope.sortProjects,
                        _order : $scope.order,
                        title_like: $scope.searchText,
                        _start : 0
                    };
                    ajax.get(dataFactory.getProjects(),requestData,function(response){
                        $scope.projects = response.data;
                        var ids = [];
                        for(var i in $scope.projects) {

                            if($scope.widgetFormat == 'all-projects'){
                                if($scope.projects[i].type != "public" && $scope.projects[i].projectManagerId != $rootScope.userData.accountId){
                                    $scope.projects.splice(i,1);
                                    continue;
                                }
                            }

                            ids.push($scope.projects[i].id);
                            if ($scope.projects[i].dueDate) {
                                var day = 86400000;
                                $scope.projects[i].dueDate = (new Date() - new Date($scope.projects[i].dueDate));
                                if ($scope.projects[i].dueDate <= day) {
                                    $scope.projects[i].dueDate = moment(new Date()).format("MM/DD/YYYY");
                                } else {
                                    $scope.projects[i].dueDate = Math.floor($scope.projects[i].dueDate / day) + " days";
                                }
                            }
                        }
                        isCurrentUserMember(ids);
                        if($scope.widgetFormat == 'all-projects'){
                            isProjectsJoinRequests(ids);
                            getTags(ids);
                        }
                        apply();
                    },function(response){
                        toastModel.showToast("error", "Ajax faild: getProjects");
                    });
                };

                function isProjectsJoinRequests(ids){
                    ajax.get(dataFactory.getProjectsJoinRequests(), {
                        projectId : ids,
                        profileId : $rootScope.userData.profileId
                    },function(response){
                        for(var i in $scope.projects) {
                            for(var j in response.data){
                                if($scope.projects[i].id == response.data[j].projectId && response.data[j].profileId == $rootScope.userData.profileId){
                                    $scope.projects[i].joinRequest = response.data[j];
                                }
                            }
                        }
                    });
                }

                function isCurrentUserMember(ids){
                    ajax.get(dataFactory.getMembersToProject(),{
                        projectId : ids,
                        profileId : $rootScope.userData.profileId
                    },function(response){
                        var isRemove = false;
                        var array = $scope.projects;
                        for(var i=0;i<$scope.projects.length;i++){
                            for(var j in response.data){
                                if($scope.projects[i].id == response.data[j].projectId || $scope.projects[i].projectManagerId == response.data[j].profileId){
                                    $scope.projects[i].isMember = response.data[j];
                                }
                            }
                            // remove project from $scope.projects if project type dose not public,
                            // current user is not member of project and current user not project Manager of project
                            if($scope.widgetFormat == 'all-projects') {
                                if ($scope.projects[i].type != "public" &&
                                    $scope.projects[i].projectManagerId != $rootScope.userData.profileId &&
                                    !$scope.projects[i].isMember) {
                                    isRemove = true;
                                }
                            }else{
                                if($scope.projects[i].projectManagerId != $rootScope.userData.profileId && (!$scope.projects[i].isMember || ($scope.projects[i].isMember && !$scope.projects[i].isMember.accept))){
                                    isRemove = true;
                                }
                            }
                            if(isRemove){
                                $scope.projects.splice(i,1);
                                i--;
                            }
                            isRemove = false;
                        }
                        $scope.total = $scope.projects.length;
                        if(limit && $scope.total > limit) $scope.projects.splice(limit,$scope.total);
                        apply();
                    });
                }

                function getTags(ids){
                    ajax.get(dataFactory.getProjectsTags(),{
                        projectId : ids
                    },function(response){
                        for(var i in $scope.projects){
                            $scope.projects[i].tags = [];
                            for(var j in response.data){
                                if($scope.projects[i].id == response.data[j].projectId) $scope.projects[i].tags.push(response.data[j]);
                            }
                        }
                        apply();
                    });
                }

                $scope.getProjects();

                $rootScope.sortMAProjects = function(sortTag){
                    switch(sortTag) {
                        case "id":
                            $scope.projects.sort(function (a, b) {
                                return a.id - b.id;
                            });
                            break;
                        case "title":
                            $scope.projects.sort(function (a, b) {
                                return a.title > b.title;
                            });
                            break;
                        case "most_recent":
                            $scope.projects.sort(function (a, b) {
                                return b.id - a.id;
                            });
                            break;
                        default:
                            break;
                    }
                };

                $rootScope.filterMAProjects = function(filterTag){

                };

                $scope.join = function(item){
                    if(item.approvalOption == 'all'){
                        ajax.create(dataFactory.createMembersToProject(), {
                                "profileId": $rootScope.userData.profileId,
                                "projectId": item.id,
                                "fromProfileId": $rootScope.userData.profileId,
                                "from": $rootScope.userData.displayName,
                                "date": moment(new Date).format('x'),
                                "accept": true
                        },function(response){
                            item.isMember = response.data;
                            toastModel.showToast("success", "You successfully joined to the project");
                            apply();
                        });
                    }else if(item.approvalOption == 'admin'){
                        ajax.create(dataFactory.addProjectJoinRequest(), {
                            "profileId": $rootScope.userData.profileId,
                            "projectId": item.id
                        },function(response){
                            item.joinRequest = response.data;
                            toastModel.showToast("success", "Request to join successfully sent");
                            apply();
                        });
                    }
                };

                $scope.accept = function(item){
                    ajax.update(dataFactory.updateMembersToProject(item.isMember.id), {
                        "accept": true
                    },function(response){
                        item.isMember = response.data;
                        toastModel.showToast("success", "You successfully joined to the project");
                        apply();
                    });
                };

                $scope.decline = function(item){
                    ajax.delete(dataFactory.removeMembersToProject(item.isMember.id), {},function(response){
                        delete item.isMember;
                        apply();
                    });
                };

                //socketFactory.on(socketFactory.updated().projects, function(item){
                //    $scope.getProjects();
                //});
            }
        };
    }]);