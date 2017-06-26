'use strict';

angular.module('dmc.widgets.projects', [
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ng-showdown',
    'dmc.model.previous-page'
]).filter('projectsFilter', function () {
    return function (projects, filters) {
        var out = [];
        if (filters.public || filters.private) {
            angular.forEach(projects, function (value, key) {

                if (filters.public && value.isPublic) {
                    out.push(value);
                }

                if (filters.private && !value.isPublic) {
                    out.push(value);
                }
            });
        } else {
            return projects;
        }
        return out;
    }
})
    .directive('uiWidgetProjects', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: '/templates/components/ui-widgets/projects.html',
            scope: true,
            bindToController: {
                searchText: '=',
                widgetTitle: '=',
                widgetShowAllBlocks: '=',
                showImage: '=',
                widgetFormat: '=',
                sortProjects: '=',
                limit: '=',
                getProjectsFlag: '=',
                getProjectsOnReady: '=',
                filters: '=',
                activeFilter: '=',
                activeTab: '=',
                searchTerm: '='
            },
            controller: UiWidgetProjectsController,
            controllerAs: '$ctrl'
        };

        function UiWidgetProjectsController($scope, $rootScope, $element, $attrs, $window, socketFactory, dataFactory, ajax, toastModel, DMCUserModel, $showdown, previousPage) {
            var vm = this;

            vm.projects = [];
            vm.total = 0;
            vm.order = 'DESC';
            vm.start = 0;
            vm.currentPage = 1;
            vm.filterTag = null;
            vm.userCompany = null;
            vm.pageSize = 10;
            vm.previousPage = previousPage;
            vm.userCompanyId = '';

            $scope.$watch(function () {
                return vm.getProjectsFlag;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue || vm.getProjectsOnReady === true || (newValue === oldValue && vm.widgetFormat === 'my-projects')) {
                    vm.activeFilter = null;
                    vm.searchTerm = null;
                    vm.getProjects();
                }
            }, true);

            $scope.$watch(function () {
                return vm.searchTerm;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue && vm.widgetFormat === vm.activeTab && vm.searchTerm === null) {
                    vm.getProjects();
                }
            }, true);

            $scope.$watch(function () {
                return vm.sortProjects;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue && vm.widgetFormat === vm.activeTab) {
                    vm.start = 0;
                    vm.currentPage = 1;
                    vm.getProjects();
                }
            }, true);

            $scope.$watch(function () {
                return vm.activeFilter;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue && vm.widgetFormat === vm.activeTab) {
                    vm.start = 0;
                    vm.currentPage = 1;
                    vm.getProjects();
                }
            }, true);

            $scope.$on('searchProjects', function(event) {
                vm.getProjects();
            });

            var limit = (vm.limit ? vm.limit : (vm.widgetShowAllBlocks === true ? null : 2));

            vm.flexBox = (vm.widgetShowAllBlocks == true ? 28 : 60);
            vm.flexDetails = (vm.widgetShowAllBlocks == true ? 20 : 40);

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            // function for get all projects from DB
            vm.getProjects = function () {

                var requestData = {
                    _sort: vm.sortProjects,
                    _order: vm.order,
                    _start: vm.start,
                    _limit: vm.limit,
                    _page: vm.currentPage,
                    _filter: vm.activeFilter,
                    _search: vm.searchTerm
                };
                var getProjectsUrl = '';

                if (vm.filterTag == 'from_company') requestData.companyId = $rootScope.userData.companyId;
                if (vm.widgetFormat === 'my-projects') {
                    getProjectsUrl = dataFactory.getMyProjects();
                } else {
                    getProjectsUrl = dataFactory.getPublicProjects();
                }
                ajax.get(getProjectsUrl, requestData, function (response) {
                    vm.userCompanyId = $rootScope.userData.companyId;
                    vm.projects = response.data.content;
                    // vm.projects = response.data;
                    vm.last = response.data.last;
                    vm.first = response.data.number == 1 || response.data.first ? true : false;
                    vm.totalItems = response.data.length;
                    var ids = [];
                    for (var i in vm.projects) {

                        if (vm.widgetFormat == 'all-projects') {
                            if (!vm.projects[i].isPublic && vm.projects[i].projectManagerId != $rootScope.userData.accountId) {
                                if (vm.projects[i].companyId != $rootScope.userData.companyId) {
                                    vm.projects.splice(i, 1);
                                    continue;
                                }
                            }
                        }

                        ids.push(vm.projects[i].id);
                        if (vm.projects[i].dueDate) {
                            var day = 86400000;
                            var dueDateCompare = (new Date() - new Date(vm.projects[i].dueDate));
                            if (dueDateCompare <= day) {
                                vm.projects[i].dueDate = moment(vm.projects[i].dueDate).format('MM/DD/YYYY');
                            } else {
                                vm.projects[i].dueDate = Math.floor(dueDateCompare / day) + ' days';
                            }
                        }

                        vm.projects[i].description = $showdown.stripHtml($showdown.makeHtml(vm.projects[i].description));

                    }
                    isCurrentUserMember(ids);

                    isProjectsJoinRequests(ids);
                    getTags(ids);
                    apply();
                }, function (response) {
                    toastModel.showToast('error', 'Ajax faild: getProjects');
                });
            };

            function isProjectsJoinRequests(ids) {
                ajax.get(dataFactory.getProjectsJoinRequests(), {
                    projectId: ids,
                    profileId: $rootScope.userData.profileId
                }, function (response) {
                    for (var i in vm.projects) {
                        for (var j in response.data) {
                            if (vm.projects[i].id == response.data[j].projectId && response.data[j].profileId == $rootScope.userData.profileId) {
                                vm.projects[i].joinRequest = response.data[j];
                            }
                        }
                    }
                });
            }

            function isCurrentUserMember(ids) {
                ajax.get(dataFactory.getMembersToProject(), {
                    projectId: ids,
                    profileId: $rootScope.userData.profileId
                }, function (response) {
                    var isRemove = false;
                    var array = vm.projects;
                    for (var i = 0; i < vm.projects.length; i++) {
                        if (vm.projects[i].projectManagerId == $rootScope.userData.profileId) {
                            vm.projects[i].isMember = {accept: true};
                        } else {
                            for (var j in response.data) {
                                if (vm.projects[i].id == response.data[j].projectId) {
                                    vm.projects[i].isMember = response.data[j];
                                }
                            }
                        }
                        // remove project from vm.projects if project type dose not public,
                        // current user is not member of project and current user not project Manager of project
                        if (vm.widgetFormat == 'all-projects') {
                            if (!vm.projects[i].isPublic &&
                                vm.projects[i].projectManagerId != $rootScope.userData.profileId &&
                                !vm.projects[i].isMember) {
                                isRemove = true;
                            }
                        } else if (vm.projects[i].projectManagerId != $rootScope.userData.profileId && (!vm.projects[i].isMember || (vm.projects[i].isMember && !vm.projects[i].isMember.accept))) {
                            isRemove = true;
                        }
                        if (vm.projects[i].companyId != $rootScope.userData.companyId) {
                            if (isRemove) {
                                vm.projects.splice(i, 1);
                                i--;
                            }
                        }
                        isRemove = false;
                    }
                    vm.total = vm.projects.length;
                    if (limit && vm.total > limit) vm.projects.splice(limit, vm.total);
                    apply();
                });
            }

            function getTags(ids) {
                ajax.get(dataFactory.getProjectsTags(), {
                    projectId: ids
                }, function (response) {
                    for (var i in vm.projects) {
                        vm.projects[i].tags = [];
                        for (var j in response.data) {
                            if (vm.projects[i].id == response.data[j].projectId) vm.projects[i].tags.push(response.data[j]);
                        }
                    }
                    apply();
                });
            }

            vm.join = function (item) {
                if (!item.requiresAdminApprovalToJoin) {
                    ajax.create(dataFactory.joinProject(), {
                        'profileId': $rootScope.userData.profileId,
                        'projectId': item.id
                        // 'fromProfileId': $rootScope.userData.profileId,
                        // 'from': $rootScope.userData.displayName,
                        // 'date': moment(new Date).format('x'),
                        // 'accept': true
                    }, function (response) {
                        item.isMember = response.data;
                        toastModel.showToast('success', 'You have successfully become a member of the project');
                        document.location.href = 'project.php#/' + item.id + '/home';
                        apply();
                    }, function (response) {
                        toastModel.showToast('error', 'Failed to Join project.');
                    });
                } else if (item.requiresAdminApprovalToJoin) {
                    ajax.create(dataFactory.joinProjectRequests(item.id), {
                    }, function (response) {
                        item.joinRequest = response.data;
                        toastModel.showToast('success', 'Request to join successfully sent');
                        apply();
                    }, function (response) {
                        toastModel.showToast('error', 'Request to join project failed.');
                    });
                }
            };

            vm.accept = function (item) {
                ajax.update(dataFactory.updateMembersToProject(item.id), {}, function (response) {
                    item.isMember = response.data;
                    toastModel.showToast('success', 'You successfully joined to the project');
                    apply();
                });
            };

            vm.decline = function (item) {
                ajax.delete(dataFactory.removeMembersToProject(item.id), {}, function (response) {
                    delete item.isMember;
                    apply();
                });
            };

            vm.getNextPage = function () {
                vm.start += vm.limit;
                vm.currentPage = vm.currentPage + 1;
                vm.getProjects();
                $window.scrollTo(0, 0);
            };

            vm.getPreviousPage = function () {
                vm.start -= vm.limit;
                vm.currentPage = vm.currentPage - 1;
                vm.getProjects();
                $window.scrollTo(0, 0);
            };
        }

    }]);
