'use strict';
angular.module('dmc.account')
    .controller('ProfileAccountCtr', [ '$stateParams', '$state', "$scope", "$cookies", "location", function ($stateParams, $state, $scope, $cookies, location) {
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

        var userBasics = $cookies.getObject('userBasics');

        var callback = function(success,data){
            if(success == true) {
                $scope.profile.dataLocation = data;
                $scope.profile.location = $scope.profile.dataLocation.city + ", " + $scope.profile.dataLocation.region;
            }
        };

        $scope.getLocation = function(container){
            location.get(callback);
        };

        $scope.profile = {
            skills : [
                {
                    id : 1,
                    name : 'AngularJS'
                },{
                    id : 2,
                    name : 'Java'
                },{
                    id : 3,
                    name : 'jQuery'
                },{
                    id : 4,
                    name : 'CSS3'
                },{
                    id : 5,
                    name : 'Ruby on Rails'
                }
            ],
            location : (userBasics.location ? userBasics.location : null)
        };

        $scope.deleteSkill = function(id){
            for(var s=0;s<$scope.profile.skills.length;s++){
                if(parseInt($scope.profile.skills[s].id) == parseInt(id)){
                    $scope.profile.skills.splice(s,1);
                    break;
                }
            }
        };

        $scope.addSkill = function(name){
            var max = 0;
            for(var s=0;s<$scope.profile.skills.length;s++) {
                if(max < $scope.profile.skills[s].id) max = $scope.profile.skills[s].id;
            }
            $scope.profile.skills.push({
                id : max+1,
                name : name
            });
        };
}]);