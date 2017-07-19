'use strict';
angular.module('dmc.add_project.directive', [
    'ngMaterial',
    'dmc.ajax',
    'dmc.data',
    'dmc.model.project',
    'dmc.add_members',
    'dmc.model.member',
    'ngMdIcons',
    'dmc.model.question-toast-model',
    'dmc.widgets.documents',
    'dmc.compare'
]).directive('addProjectTabs', ['$parse', function ($parsel) {
    return {
        restrict: 'A',
        templateUrl: 'templates/components/add-project/ap-index.html',
        // scope : {
        //     projectDetails: '='
        // },
        controller: ['$scope', '$mdDialog','projectModel', function ($scope, $mdDialog,projectModel,questionToastModel) {
            // Specify a list of font-icons with ligatures and color overrides
            var iconData = [
                {name: 'accessibility', color: '#777'},
                {name: 'question_answer', color: 'rgb(89, 226, 168)'}
            ];

            $scope.hello="hello baby";
            $scope.invitees = [];


            $scope.currentMembers=[]
            $scope.addMembersWp = function(ev){
              $mdDialog.show({
                  controller: 'AddMembersController',
                  templateUrl:'templates/components/add-project/ap-tab-two.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  locals:{dataToPass: $scope.invitees},
                  fullscreen:true,
                  clickOutsideToClose:true
              }).then(function(invitees){
                $scope.invitees= invitees;
                $scope.invitees.map(function(a) {
                  var newMember = a.displayName;
                  if ($scope.currentMembers.indexOf(newMember)==-1){
                    $scope.currentMembers.push(newMember);
                  }
                });
              })

            }

            $scope.projectState = "CREATE WORKSPACE";
            $scope.editState = false;

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

            $scope.accessLevels = {
                'Public': 'PUBLIC',
                'Members': 'MEMBER',
                'Admin': 'ADMIN'
            }

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

            $scope.createNewProject = function(details) {

                setProjectDetails(details);
                var invitees = $scope.invitees;


                $scope.goSaveProject = true;
                newProject.tags  = $scope.projectData.tags;

                if(newProject.dueDate){
                    newProject.dueDate = moment(newProject.dueDate).format('x');
                }else{
                    newProject.dueDate = '';
                }


                $(window).unbind('beforeunload')
                newProject.documents = $scope.documents;

                projectModel.add_project(newProject, invitees, function(data){
                    document.location.href = 'project.php#/'+data+'/home';
                });
            };


                $scope.addTag = function(newTag){
                    $scope.projectData.tags.push({
                        name : newTag
                    });
                    $scope.newTag = null;
                };

                $scope.deleteTag = function(index,tag){
                    if(tag.id > 0){
                        tag.deleted = true;
                    }else{
                        $scope.projectData.tags.splice(index,1);
                    }
                };



            // Documents
            $scope.documents = [];

            // Invitees
            $scope.subject = 'Pat has invited you to join the project.';
            $scope.message = 'We seek a power transformer with improved heat losses relative to a standard iron core transformer. Cost and time to delivery are also critical. The attached documents give detailed specs and the attached Evaluator Service encompasses how we will value the trade-offs among heat loss, cost, and delivery time.';

        }]
    };
}])
    .controller('AddMembersController', [
        '$scope',
        'DMCMemberModel',
        'projectModel',
        '$stateParams',
        'toastModel',
        'ajax',
        '$mdDialog',
        'dataToPass',
        'dataFactory',
        '$cookieStore',
        function ($scope,
                  DMCMemberModel,
                  projectModel,
                  $stateParams,
                  toastModel,
                  ajax,
                  $mdDialog,
                  dataToPass,
                  dataFactory,
                  $cookieStore) {
            DMCMemberModel.getMembers().then(
                function(data){
                    $scope.foundMembers = data;
                    isInvite();
                },
                function(data){}
            );


            $scope.compare = [];
            $scope.favorites = [];
            $scope.showFavoritesFlag = false;

            $scope.invitees=dataToPass;

            function isInvite(){
                for(var i in $scope.foundMembers){
                    var found = false;
                    for(var j in $scope.invitees){
                        if(($scope.invitees[j].profileId && $scope.foundMembers[i].id == $scope.invitees[j].profileId) || (!$scope.invitees[j].profileId && $scope.foundMembers[i].id == $scope.invitees[j].id)){
                            found = true;
                            break;
                        }
                    }
                    $scope.foundMembers[i].isInvite = found;
                }
            }

            $scope.selectedTab = 0;
            var askLeave = true;
            $scope.$on('$locationChangeStart', function (event, next, current) {
                if(askLeave) {
                    event.preventDefault();
                    questionToastModel.show({
                        question: 'Are you sure you want to leave this page?',
                        buttons: {
                            ok: function () {
                                askLeave = false;
                                $(window).unbind('beforeunload');
                                window.location = next;
                            },
                            cancel: function () {
                            }
                        }
                    }, event);
                }
            });

            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                return '';
            });

            $scope.$watchCollection('invitees',function(newArray,oldArray){
                isInvite();
            });

            var currentMembersId = [];
            $scope.getMembers = function () {
                ajax.get(dataFactory.projectMembers($stateParams.projectId), {}, function (response) {
                    var profileIds = $.map(response.data, function (x) {
                        return x.profileId;
                    });
                    currentMembersId = $.map(response.data, function (x) {
                        return {
                            id : x.id,
                            profileId : x.profileId
                        };
                    });


                    if(profileIds.length > 0) {
                        ajax.get(dataFactory.profiles().all, {
                            id: profileIds
                        }, function (res) {
                            $scope.invitees=$scope.invitees||[]
                            $scope.invitees.concat(res.data);
                            apply();
                        });
                    }
                });
            };

            $scope.getMembers();

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
                apply();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }


            $scope.searchMembers = function(){
                ajax.get(dataFactory.getUserList(), {
                    page: 0,
                    pageSize: 100,
                    displayName: $scope.searchModel
                }, function(response) {
                    $scope.foundMembers = response.data.content;
                    isInvite();
                })
            };

            $scope.NextTab = function(){
                $scope.selectedTab = 1;
            }

            $scope.BackTab = function(){
                $scope.selectedTab = 0;
            }

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
                apply();
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
                apply();
            };

            $scope.showFavorites = function(){
                $scope.showFavoritesFlag = !$scope.showFavoritesFlag;
            };


            $scope.exit = function(invitees){
              $scope.invitees = invitees;
              $mdDialog.hide($scope.invitees);
            }



            $scope.send = function(){
                projectModel.add_members_to_project($scope.invitees,currentMembersId, function(){
                    $cookieStore.put('toast', 'Invitations Sent');
                    $(window).unbind('beforeunload');
                    $scope.$on('$locationChangeStart', function (event, next, current) {});
                    document.location.href = 'project.php#/'+$stateParams.projectId+'/home';
                })
            }
        }])
