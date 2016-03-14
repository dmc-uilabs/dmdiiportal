angular.module('dmc.add_members')
    .controller('AddMembersController', [
        '$scope',
        'DMCMemberModel',
        'projectModel',
        '$stateParams',
        'toastModel',
        '$cookieStore',
        function ($scope,
                  DMCMemberModel,
                  projectModel,
                  $stateParams,
                  toastModel,
                  $cookieStore) {
            DMCMemberModel.getMembers().then(
                function(data){
                    $scope.foundMembers = data;
                },
                function(data){}
            );

            $scope.compare = [];
            $scope.invitees = [];
            $scope.favorites = [];
            $scope.showFavoritesFlag = false;

            $scope.selectedTab = 0;

            $scope.$on('$locationChangeStart', function (event, next, current) {
                var answer = confirm("Are you sure you want to leave this page?");
                if (!answer){
                    event.preventDefault();
                }
            });

            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                return "";
            });

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


            $scope.searchMembers = function(){

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
            };

            $scope.send = function(){
                projectModel.add_members_to_project($scope.invitees, function(){
                    $cookieStore.put("toast", "Invitations Sent");
                    $(window).unbind('beforeunload');
                    $scope.$on('$locationChangeStart', function (event, next, current) {});
                    document.location.href = "project.php#/"+$stateParams.projectId+"/home";
                })
            }
        }])