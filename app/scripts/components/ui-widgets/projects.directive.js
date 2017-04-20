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
            scope: true,
            bindToController: {
                searchText: '=',
                widgetTitle: '=',
                widgetShowAllBlocks: '=',
                showImage : '=',
                widgetFormat: '=',
                sortProjects: '=',
                limit : '=',
                getProjectsFlag : '='
            },
            controller: UiWidgetProjectsController,
            controllerAs: '$ctrl'
        };
    
        function UiWidgetProjectsController($scope, $rootScope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel, DMCUserModel) {
            var vm = this;
            
            vm.projects = [];
            vm.total = 0;
            vm.order = 'ASC';
            vm.filterTag = null;
            vm.userCompany = null;
            
            $scope.$watch(function () { return vm.getProjectsFlag; }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    vm.getProjects();
                }
            }, true);
            
            var limit = (vm.limit ? vm.limit : (vm.widgetShowAllBlocks === true ? null : 2));
            
            vm.flexBox = (vm.widgetShowAllBlocks == true ? 28 : 60);
            vm.flexDetails = (vm.widgetShowAllBlocks == true ? 20 : 40);
            
            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };
            
            // function for get all projects from DB
            vm.getProjects = function(){
                var requestData = {
                    _sort : vm.sortProjects,
                    _order : vm.order,
                    title_like: vm.searchText,
                    _start : 0
                };
                if(vm.filterTag == 'from_company') requestData.companyId = $rootScope.userData.companyId;
                ajax.get(dataFactory.getProjects(vm.widgetFormat),requestData,function(response) {
                    vm.projects = response.data;
                    var ids = [];
                    for (var i in vm.projects) {
                        if (vm.widgetFormat == 'all-projects') {
                            if (!vm.projects[i].isPublic && vm.projects[i].projectManagerId != $rootScope.userData.accountId) {
                                if (vm.projects[i].companyId != $rootScope.userData.companyId) {
                                    console.log(vm.projects[i]);
                                    console.log('splicing for not public or not manager and not company');
                                    vm.projects.splice(i, 1);
                                    continue;
                                }
                            }
                        }
        
                        ids.push(vm.projects[i].id);
                        if (vm.projects[i].dueDate) {
                            var day = 86400000;
                            vm.projects[i].dueDate = (new Date() - new Date(vm.projects[i].dueDate));
                            if (vm.projects[i].dueDate <= day) {
                                vm.projects[i].dueDate = moment(new Date()).format('MM/DD/YYYY');
                            } else {
                                vm.projects[i].dueDate = Math.floor(vm.projects[i].dueDate / day) + ' days';
                            }
                        }
                    }
                    isCurrentUserMember(ids);
                    if (vm.widgetFormat == 'all-projects') {
                        isProjectsJoinRequests(ids);
                        getTags(ids);
                    }
                    apply();
                },function(response){
                    toastModel.showToast('error', 'Ajax faild: getProjects');
                });
            };
            
            DMCUserModel.getUserData().then(function(res){
                //vm.getProjects();
                if(res && res.companyId > 0) getUserCompany(res.companyId);
            });
            
            function getUserCompany(companyId){
                ajax.get(dataFactory.companyURL(companyId).get, {},function(response){
                    vm.userCompany = response.data;
                    apply();
                });
            }
            
            function isProjectsJoinRequests(ids){
                ajax.get(dataFactory.getProjectsJoinRequests(), {
                    projectId : ids,
                    profileId : $rootScope.userData.profileId
                },function(response){
                    for(var i in vm.projects) {
                        for(var j in response.data){
                            if(vm.projects[i].id == response.data[j].projectId && response.data[j].profileId == $rootScope.userData.profileId){
                                vm.projects[i].joinRequest = response.data[j];
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
                    var array = vm.projects;
                    for(var i=0;i<vm.projects.length;i++){
                        if(vm.projects[i].projectManagerId == $rootScope.userData.profileId){
                            vm.projects[i].isMember = {accept : true};
                        }else {
                            for (var j in response.data) {
                                if (vm.projects[i].id == response.data[j].projectId) {
                                    vm.projects[i].isMember = response.data[j];
                                }
                            }
                        }
                        // remove project from vm.projects if project type dose not public,
                        // current user is not member of project and current user not project Manager of project
                        if(vm.widgetFormat == 'all-projects') {
                            if (!vm.projects[i].isPublic &&
                                vm.projects[i].projectManagerId != $rootScope.userData.profileId &&
                                !vm.projects[i].isMember) {
                                isRemove = true;
                            }
                        }else if(vm.projects[i].projectManagerId != $rootScope.userData.profileId && (!vm.projects[i].isMember || (vm.projects[i].isMember && !vm.projects[i].isMember.accept))){
                            isRemove = true;
                        }
                        if(vm.projects[i].companyId != $rootScope.userData.companyId) {
                            if (isRemove) {
                                vm.projects.splice(i, 1);
                                i--;
                            }
                        }
                        isRemove = false;
                    }
                    vm.total = vm.projects.length;
                    if(limit && vm.total > limit) vm.projects.splice(limit,vm.total);
                    $rootScope.sortMAProjects(vm.sortProjects);
                    apply();
                });
            }
            
            function getTags(ids){
                ajax.get(dataFactory.getProjectsTags(),{
                    projectId : ids
                },function(response){
                    for(var i in vm.projects){
                        vm.projects[i].tags = [];
                        for(var j in response.data){
                            if(vm.projects[i].id == response.data[j].projectId) vm.projects[i].tags.push(response.data[j]);
                        }
                    }
                    apply();
                });
            }
            
            
            $rootScope.sortMAProjects = function(sortTag){
                switch(sortTag) {
                    case 'id':
                        vm.projects.sort(function (a, b) {
                            return a.id - b.id;
                        });
                        break;
                    case 'title':
                        vm.projects.sort(function (a, b) {
                            return a.title > b.title;
                        });
                        break;
                    case 'most_recent':
                        vm.projects.sort(function (a, b) {
                            return b.id - a.id;
                        });
                        break;
                    default:
                        break;
                }
                apply();
            };
            
            $rootScope.filterMAProjects = function(filterTag){
                vm.filterTag = filterTag;
                console.log(filterTag);
                vm.getProjects();
            };
            
            vm.join = function(item){
                if(item.approvalOption == 'all'){
                    ajax.create(dataFactory.createMembersToProject(), {
                        'profileId': $rootScope.userData.profileId,
                        'projectId': item.id,
                        'fromProfileId': $rootScope.userData.profileId,
                        'from': $rootScope.userData.displayName,
                        'date': moment(new Date).format('x'),
                        'accept': true
                    },function(response){
                        item.isMember = response.data;
                        toastModel.showToast('success', 'You have successfully become a member of the project');
                        document.location.href = 'project.php#/'+item.id+'/home';
                        apply();
                    });
                }else if(item.approvalOption == 'admin'){
                    ajax.create(dataFactory.addProjectJoinRequest(), {
                        'profileId': $rootScope.userData.profileId,
                        'projectId': item.id
                    },function(response){
                        item.joinRequest = response.data;
                        toastModel.showToast('success', 'Request to join successfully sent');
                        apply();
                    });
                }
            };
            
            vm.accept = function(item){
                ajax.update(dataFactory.updateMembersToProject(item.isMember.id), {
                    'accept': true
                },function(response){
                    item.isMember = response.data;
                    toastModel.showToast('success', 'You successfully joined to the project');
                    apply();
                });
            };
            
            vm.decline = function(item){
                ajax.delete(dataFactory.removeMembersToProject(item.isMember.id), {},function(response){
                    delete item.isMember;
                    apply();
                });
            };
            
            //socketFactory.on(socketFactory.updated().projects, function(item){
            //    vm.getProjects();
            //});
        }
    }]);
