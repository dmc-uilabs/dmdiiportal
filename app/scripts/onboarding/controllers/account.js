angular.module('dmc.onboarding')
.controller('AccountController', 
	['$scope', '$rootScope', '$state', 'ajax', 'dataFactory', 'location', 
	function ($scope, $rootScope, $state, ajax, dataFactory, location) {
		if($state.current.name == "onboarding.account"){
			$state.go($scope.account[0].state);
		}
        $scope.activePage = $state;
		$scope.servers = [
			{
				ip: "",
				name: ""
			}
		];

		$scope.public = {
			email: {
				enable: true,
				value: ""
			},
			phone: {
				enable: true,
				value: ""
			},
			location: {
				enable: true,
				value: ""
			}
		};
		$scope.private = {
			email: {
				enable: true,
				value: ""
			},
			phone: {
				enable: true,
				value: ""
			},
			location: {
				enable: true,
				value: ""
			}
		};

        var indexLocation = 0;
        $scope.getLocation = function (index) {
            indexLocation = index
            location.get(callback);
        };

        var callback = function (success, data) {
            if (success) {
                $scope.account[indexLocation].data.location.value = data.city + ", " + data.region;
            }
        };

		$scope.getNotifications = function(){
            ajax.get(dataFactory.getAccountNotifications(),{
                    _sort : "position",
                    _order : "ASC",
                    _embed : "account-notification-category-items"
                }, function(response){
                    $scope.notificationCategories = response.data;
                }
            );
        };
        $scope.getNotifications();

        $scope.disableAll = function(index){
        	for(var i in $scope.account[index].data){
        		$scope.account[index].data[i].selected = false;
        	}
        }
        $scope.enableAll = function(index){
        	for(var i in $scope.account[index].data){
        		$scope.account[index].data[i].selected = true;
        	}
        }

        $scope.changeIP = function(ip){
            //if (ip != null && ip.trim().length > 0 && ip != '0.0.0.0' && ip != '255.255.255.255' && ip.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)){
            if (ip != null && ip.trim().length > 0){
                return true;
            } else {
                return false;
            }
        };

        $scope.addServer = function(){
        	$scope.servers.push({
				ip: "",
				name: ""
			})
        }

        $scope.scrollTop = function(){
        	$(window).scrollTop(0);
        }

        $scope.next = function(index){
        	$scope.account[index].done = true;
        	$(window).scrollTop(0);
        	$state.go('^' + $scope.account[index+1].state);
        }

        $scope.finish = function(index){
        	$scope.account[index].done = true;
        	$(window).scrollTop(0);
        	$state.go('^.^.home');
        }

}]);