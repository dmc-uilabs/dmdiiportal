angular.module('dmc.onboarding')
.controller('ProfileController', 
	['$scope', '$rootScope', '$state', 'ajax', 'dataFactory', 'location', 
	function ($scope, $rootScope, $state, ajax, dataFactory, location) {
		if($state.current.name == "onboarding.profile"){
			$state.go($scope.profile[0].state);
		}
        $scope.activePage = $state;

        $scope.getLocation = function () {
            location.get(callback);
        };

        var callback = function (success, data) {
            if (success) {
                $scope.profile[0].data.location = data.city + ", " + data.region;
            }
        };

        //add skill to profile
        $scope.addSkill = function (inputSkill) {
            if (!inputSkill)return;
            $scope.profile[2].data.skills.push(inputSkill);
            this.inputSkill = null;
        }

        //remove skill
        $scope.deleteSkill = function (index) {
            $scope.isChange = true;
            $scope.profile[2].data.skills.splice(index, 1);
        }

        $scope.next = function(index){
        	$scope.profile[index].done = true;
            $(window).scrollTop(0);
        	$state.go('^' + $scope.profile[index+1].state);
        }

        $scope.finish = function(index){
            $scope.profile[index].done = true;
            $(window).scrollTop(0);
            $state.go('^.^.home');
        }
}]);