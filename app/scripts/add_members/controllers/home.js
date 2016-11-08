angular.module('dmc.add_members')
    .controller('AddMembersController', [
        '$scope',
        'DMCMemberModel',
        'projectModel',
        '$stateParams',
        'toastModel',
        'ajax',
        'dataFactory',
        '$cookieStore',
        function ($scope,
                  DMCMemberModel,
                  projectModel,
                  $stateParams,
                  toastModel,
                  ajax,
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
            $scope.invitees = [];
            $scope.favorites = [];
            $scope.showFavoritesFlag = false;

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

            var currentMembers = [];
            $scope.getMembers = function () {
                ajax.get(dataFactory.projectMembers($stateParams.projectId), {}, function (response) {
                    var profileIds = $.map(response.data, function (x) {
                        return x.profileId;
                    });
                    currentMembers = $.map(response.data, function (x) {
                        return {
                            id : x.id,
                            profileId : x.profileId
                        };
                    });
                    $scope.invitees = response.data;
                    if(profileIds.length > 0) {
                        ajax.get(dataFactory.profiles().all, {
                            id: profileIds
                        }, function (res) {
                            $scope.invitees = res.data;
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
                    userName: $scope.searchModel
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

            $scope.send = function(){
                projectModel.add_members_to_project($scope.invitees,currentMembers, function(){
                    $cookieStore.put('toast', 'Invitations Sent');
                    $(window).unbind('beforeunload');
                    $scope.$on('$locationChangeStart', function (event, next, current) {});
                    document.location.href = 'project.php#/'+$stateParams.projectId+'/home';
                })
            }
        }])
