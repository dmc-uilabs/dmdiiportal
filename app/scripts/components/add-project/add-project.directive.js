'use strict';
angular.module('dmc.add_project.directive', [
    'ngMaterial',
    'dmc.ajax',
    'dmc.data',
    'dmc.model.project',
    'dmc.model.member',
    'ngMdIcons',
    'dmc.model.question-toast-model',
    'dmc.widgets.documents',
    'dmc.compare'
]).directive('addProjectTabs', ['$parse', function ($parsel) {
    return {
        restrict: 'A',
        templateUrl: 'templates/components/add-project/ap-index.html',
        controller: ['$scope', 'projectModel', function ($scope, projectModel,questionToastModel) {
            // Specify a list of font-icons with ligatures and color overrides
            var iconData = [
                {name: 'accessibility', color: '#777'},
                {name: 'question_answer', color: 'rgb(89, 226, 168)'}
            ];

            $scope.projectData = {
                tags : []
            };
            $scope.fonts = [].concat(iconData);
            // Create a set of sizes...
            $scope.sizes = [
                {size: 'md-18', padding: 0}
            ];


            $scope.data = {
                secondLocked : true,
                thirdLocked : true,
                fourthLocked : true
            };
            $scope.selectedIndex = 0;
            var newProject = {}
            var setProjectDetails = function(data) {
                newProject = $.extend(true, newProject, data);
            };

            $scope.goSaveProject = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if(!$scope.goSaveProject) {
                    event.preventDefault();
                    questionToastModel.show({
                        question: 'Are you sure you want to leave this page?',
                        buttons: {
                            ok: function(){
                                $(window).unbind('beforeunload');
                                $scope.goSaveProject = true;
                                window.location = next;
                            },
                            cancel: function(){}
                        }
                    }, event);
                }
            });
            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                return '';
            });

            $scope.createNewProject = function(data) {
                $scope.goSaveProject = true;

                if(newProject.dueDate){
                    newProject.dueDate = moment(newProject.dueDate).format('x');
                }else{
                    newProject.dueDate = '';
                }

                $(window).unbind('beforeunload')
                newProject.documents = $scope.documents;

                projectModel.add_project(newProject, data, function(data){
                    document.location.href = 'project.php#/'+data+'/home';
                });
            };

            $scope.goToNextTab = function(number, obj){
                $(window).scrollTop(0);
                if (obj) {
                    setProjectDetails(obj);
                }
                $scope.selectedIndex = number-1;
                if(number == 2){
                    $scope.data.thirdLocked = false;
                }else if(number == 3){
                    $scope.data.fourthLocked = false;
                }
            };

            $scope.disableEnable = function(number,val){
                var v = (val ? false : true);
                switch(number){
                    case 2 :
                        $scope.data.secondLocked = v;
                        break;
                    case 3 :
                        $scope.data.thirdLocked = v;
                        break;
                    case 4 :
                        $scope.data.fourthLocked = v;
                        break;
                }
            };

            $('md-tabs').on('click','md-tab-item',function(){
                $scope.enableNext($(this).index()+2);
            });

            $scope.enableNext = function(number){
                switch(number){
                    case 3 :
                        $scope.data.thirdLocked = false;
                        break;
                    case 4 :
                        $scope.data.fourthLocked = false;
                        break;
                }
            };

            // Documents
            $scope.documents = [];

            // Invitees
            $scope.subject = 'Pat has invited you to join the project.';
            $scope.message = 'We seek a power transformer with improved heat losses relative to a standard iron core transformer. Cost and time to delivery are also critical. The attached documents give detailed specs and the attached Evaluator Service encompasses how we will value the trade-offs among heat loss, cost, and delivery time.';
            $scope.invitees = [];
        }]
    };
}])
    .directive('apTabOne', function () {
        return {
            templateUrl: 'templates/components/add-project/ap-tab-one.html',
            scope : {
                goToTab : '=',
                disableEnableTab : '=',
                documents: '=',
                // user input is save on this object
                projectDetails: '=',
                isUpdate: '='
            },
            controller: function ($scope) {
                if($scope.projectDetails){
                    if($scope.projectDetails.dueDate){
                        $scope.projectDetails.dueDate = new Date($scope.projectDetails.currentDueDate);
                        apply();
                    }
                }
                $scope.$watch('form.$valid', function(current, old){
                    $scope.disableEnableTab(2,current);
                });

                $scope.cancelEdit = function(){
                    document.location.href = 'project.php#/'+$scope.projectDetails.id+'/home';
                };

                $scope.isChanges = false;
                var changedValues = {};
                $scope.changed = function(name){
                    if($scope.projectDetails[name] != $scope.projectDetails[name+'_old']){
                        changedValues[name] = $scope.projectDetails[name];
                    }else if($scope.projectDetails[name] == $scope.projectDetails[name+'_old'] && changedValues[name]){
                        delete changedValues[name];
                    }
                    $scope.isChanges = Object.keys(changedValues).length == 0 ? false : true;
                };

                //$scope.cancelChanges = function(){
                //    if($scope.isUpdate && $scope.isChanges) {
                //        for (var key in changedValues) {
                //            if ($scope.projectDetails[key]) $scope.projectDetails[key] = $scope.projectDetails[key + '_old'];
                //        }
                //        $scope.isChanges = false;
                //        changedValues = {};
                //    }
                //};

                $scope.addTag = function(newTag){
                    $scope.projectDetails.tags.push({
                        name : newTag
                    });
                    $scope.newTag = null;
                };

                $scope.deleteTag = function(index,tag){
                    if(tag.id > 0){
                        tag.deleted = true;
                    }else{
                        $scope.projectDetails.tags.splice(index,1);
                    }
                };

                $scope.$watch(function(){
                    return $('.md-datepicker-calendar-pane.md-pane-open').size();
                },function(newVal,oldVal){
                    if(newVal == null || newVal == 0){
                        $scope.projectDetails.dueDateFocused = false;
                    }else{
                        $scope.projectDetails.dueDateFocused = true;
                    }
                    apply();
                });

                $('.dueDatePicker').on('focus','input',function(){
                    $('.dueDatePicker button').click();
                });

                function apply() {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        }
    })
    .directive('apTabTwo', function (DMCMemberModel) {
        return {
            templateUrl: 'templates/components/add-project/ap-tab-two.html',
            scope : {
                goToTab : '=',
                disableEnableTab : '=',
                invitees : '=',
                submitProjectDetails: '=',
                projectDetails: '=',
                isUpdate: '='
            },
            controller: function ($scope, ajax, dataFactory) {
                DMCMemberModel.getMembers().then(
                    function(data){
                        $scope.allMembers = data;
                        $scope.foundMembers = data;
                        isInvite();
                    },
                    function(data){

                    }
                )

                $scope.compare = [];

                $scope.members = [];

                $scope.favorites = [];
                $scope.showFavoritesFlag = false;

                $scope.$watchCollection('invitees',function(newArray,oldArray){
                    isInvite();
                });

                function isInvite(){
                    for(var i in $scope.foundMembers){
                        var found = false;
                        for(var j in $scope.invitees){
                            if(($scope.invitees[j].id && $scope.foundMembers[i].id === $scope.invitees[j].id) || (!$scope.invitees[j].id && $scope.foundMembers[i].id == $scope.invitees[j].id)){
                                found = true;
                                break;
                            }
                        }
                        $scope.foundMembers[i].isInvite = found;
                    }
                }

                $scope.$watchCollection('compare',function(newArray,oldArray){
                    for(var i in $scope.foundMembers){
                        var found = false;
                        for(var j in newArray){
                            if($scope.foundMembers[i].id == newArray[j].id){
                                found = true;
                                break;
                            }
                        }
                        $scope.foundMembers[i].isCompare = found;
                    }
                });

                $scope.$watchCollection('favorite',function(newArray,oldArray){
                    for(var i in $scope.foundMembers){
                        var found = false;
                        for(var j in newArray){
                            if($scope.foundMembers[i].id == newArray[j].id){
                                found = true;
                                break;
                            }
                        }
                        $scope.foundMembers[i].isCompare = found;
                    }
                });

                $scope.compareMember = function(item){
                    var found = false;
                    for(var i in $scope.compare){
                        if($scope.compare[i].id === item.id) {
                            $scope.compare.splice(i, 1);
                            found = true;
                            break;
                        }
                    }
                    if(!found) $scope.compare.push(item);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                var prevMember;

                $scope.searchMembers = function(){
                    ajax.get(dataFactory.getUserList(), {page: 0, pageSize: 100, userName: $scope.searchModel}, function (response) {
                            $scope.foundMembers = response.data.content || [];
                            isInvite();
                        });
                };

                $scope.resetMembers = function(){
                    $scope.foundMembers = $scope.allMembers;
                    $scope.searchModel = '';
                    isInvite();
                };

                $scope.addToInvitation = function(item){
                    var found = false;
                    for(var i in $scope.invitees){
                        if($scope.invitees[i].id === item.id) {
                            $scope.invitees.splice(i, 1);
                            found = true;
                            break;
                        }
                    }
                    if(!found) $scope.invitees.push(item);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                $scope.addToFavorite = function(item){
                    var found = false;
                    for(var i in $scope.favorites){
                        if($scope.favorites[i].id === item.id) {
                            $scope.favorites.splice(i, 1);
                            found = true;
                            break;
                        }
                    }
                    if(!found) $scope.favorites.push(item);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                $scope.showFavorites = function(){
                    $scope.showFavoritesFlag = !$scope.showFavoritesFlag;
                }
            }
        }
    })
    .directive('apTabThree', function () {
        return {
            templateUrl: 'templates/components/add-project/ap-tab-three.html',
            scope : {
                goToTab : '=',
                disableEnableTab : '=',
                invitees : '=',
                subject: '=',
                message: '='
            },
            controller: function ($scope) {
                $scope.$watchCollection(
                    'invitees',
                    function( newValue, oldValue ) {

                    }
                );
            }
        }
    })
    .directive('inputsOutputs', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/inputs-outputs-tpl.html',
            scope : {
                serviceName: '=',
                totalInputs: '=',
                totalOutputs: '='
            },
            controller: function ($scope) {
                $scope.inputs = new Array($scope.totalInputs);
                $scope.outputs = new Array($scope.totalOutputs);
            }
        }
    }).directive('dmcSelectedInvitees', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/selected-invitees-tpl.html',
            scope:{
                invitees: '='
            },
            controller: function ($scope) {

                $scope.removeInvite = function(item){
                    for(var i in $scope.invitees){
                        if($scope.invitees[i].id === item.id){
                            $scope.invitees.splice(i,1);
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                            break;
                        }
                    }
                };



                $scope.clear = function(){
                    $scope.invitees = [];
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        }
    }).directive('dmcMemberCard', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/member-card-tpl.html',
            scope:{
                compareMember: '=',
                cardSource: '=',
                inviteMember: '=',
                favoriteMember: '=',
                allButtons: '='
            },
            controller: function ($scope,$mdDialog,DMCUserModel,ajax,dataFactory,$rootScope) {
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

                $scope.inviteUserToProject = function(projectId){
                    var project = null;
                    for(var i in $scope.projects){
                        if($scope.projects[i].id == projectId){
                            project = $scope.projects[i];
                            break;
                        }
                    }
                    if(project){
                        ajax.create(dataFactory.createMembersToProject(),
                            {
                                'profileId': $scope.cardSource.id,
                                'projectId': projectId,
                                'fromProfileId': $rootScope.userData.id,
                                'from': $rootScope.userData.displayName,
                                'date': Date.parse(new Date()),
                                'accept': true
                            }, function(response){

                                $rootScope.userData.messages.items.splice($rootScope.userData.messages.items.length-1, 1);
                                $rootScope.userData.messages.items.unshift({
                                    'user_name': $rootScope.userData.displayName,
                                    'image': '/uploads/profile/1/20151222084711000000.jpg',
                                    'text': 'Invited you to a project',
                                    'link': '/project.php#/preview/' + projectId,
                                    'created_at': moment().format('hh:mm A')
                                });


                                $scope.cancelAddToProject();

                                if(!$scope.cardSource.currentStatus) $scope.cardSource.currentStatus = {};
                                if(!$scope.cardSource.currentStatus.project) $scope.cardSource.currentStatus.project = {};
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
                        );
                    }else{
                        toastModel.showToast('error', 'Project not found');
                    }
                };

                $scope.backToAdd = function(){
                    $scope.cardSource.added = false;
                    clearInterval($scope.addedTimeout);
                };

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

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
                };

                $scope.followMember = function(){
                    if($scope.userData) {
                        if (!$scope.cardSource.follow) {
                            ajax.create(dataFactory.followMember(), {
                                accountId: $scope.userData.accountId,
                                profileId: $scope.cardSource.id
                            }, function (response) {
                                $scope.cardSource.follow = response.data;
                                if($rootScope.searchPageTotalFollow) $rootScope.searchPageTotalFollow.add();
                                apply();
                            });
                        } else {
                            ajax.delete(dataFactory.followMember($scope.cardSource.follow.id), {},
                                function (response) {
                                    $scope.cardSource.follow = null;
                                    if($rootScope.searchPageTotalFollow) $rootScope.searchPageTotalFollow.delete();
                                }
                            );
                        }
                    }
                };

                $scope.addToInvitation = function(){
                    $scope.inviteMember($scope.cardSource);
                    $scope.cardSource.isInvite = ($scope.cardSource.isInvite ? false : true);
                };

                $scope.addToCompare = function(){
                    $scope.compareMember($scope.cardSource);
                    $scope.cardSource.isCompare = ($scope.cardSource.isCompare ? false : true);

                };

                $scope.addToFavorite = function(){
                    $scope.favoriteMember($scope.cardSource);
                    $scope.cardSource.favorite = ($scope.cardSource.favorite ? false : true);
                };

            }
        }
    }).directive('dmcCompanyCard', function () {
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
    });
