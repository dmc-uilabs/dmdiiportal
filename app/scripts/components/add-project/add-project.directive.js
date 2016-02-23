'use strict';
angular.module('dmc.add_project.directive', [
        'ngMaterial',
        'dmc.ajax',
        'dmc.data',
        'dmc.model.project',
        'dmc.model.member',
        'ngMdIcons',
        'dmc.widgets.documents',
        'dmc.compare'
    ]).directive('addProjectTabs', ['$parse', function ($parsel) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/ap-index.html',
            controller: ['$scope', 'projectModel', function ($scope, projectModel) {
                // Specify a list of font-icons with ligatures and color overrides
                var iconData = [
                    {name: 'accessibility', color: "#777"},
                    {name: 'question_answer', color: "rgb(89, 226, 168)"}
                ];

                $scope.projectData = {};
                $scope.fonts = [].concat(iconData);
                // Create a set of sizes...
                $scope.sizes = [
                    {size: "md-18", padding: 0}
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
                }
                $scope.createNewProject = function(data) {
                    if(newProject.dueDate){
                        newProject.dueDate = moment(newProject.dueDate).format("x");
                    }else{
                        newProject.dueDate = "";
                    }
                    projectModel.add_project(newProject, data, function(data){
                        document.location.href = "project.php#/"+data+"/home";
                    })
                }
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

                $("md-tabs").on("click","md-tab-item",function(){
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

                // Invitees
                $scope.subject = "Pat has invited you to join the project.";
                $scope.message = "We seek a power transformer with improved heat losses relative to a standard iron core transformer. Cost and time to delivery are also critical. The attached documents give detailed specs and the attached Evaluator Service encompasses how we will value the trade-offs among heat loss, cost, and delivery time.";
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
              // user input is save on this object
              projectDetails: '='
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
            controller: function ($scope) {
                DMCMemberModel.getMembers().then(
                    function(data){
                         $scope.foundMembers = data;
                    },
                    function(data){

                    }
                )

                $scope.compare = [];

                $scope.members = [];

                $scope.favorites = [];
                $scope.showFavoritesFlag = false;

                $scope.$watchCollection('invitees',function(newArray,oldArray){
                    for(var i in $scope.foundMembers){
                        var found = false;
                        for(var j in newArray){
                            if($scope.foundMembers[i].id == newArray[j].id){
                                found = true;
                                break;
                            }
                        }
                        $scope.foundMembers[i].isInvite = found;
                    }
                });

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
                    "invitees",
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
                addToProject: '=',
                allButtons: '='
            },
            controller: function ($scope,$mdDialog,DMCUserModel,ajax,dataFactory,$rootScope) {
                $scope.userData = DMCUserModel.getUserData();
                $scope.userData.then(function(res){
                    $scope.userData = res;
                });

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                $scope.showMembers = function(id, ev){
                    console.info('index', id);
                    $(window).scrollTop();
                    $mdDialog.show({
                        controller: "showMembers",
                        templateUrl: "templates/components/members-card/show-members.html",
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        locals: {
                            "id" : id
                        }
                    }).then(function() {
                        $(window).scrollTop();
                    }, function() {
                        $(window).scrollTop();
                    });
                }

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
                favoriteCompany: '=',
                addToProject: '='
            },
            controller: function ($scope,$rootScope,ajax,dataFactory,DMCUserModel) {

                $scope.userData = DMCUserModel.getUserData();
                $scope.userData.then(function(res){
                    $scope.userData = res;
                });

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

