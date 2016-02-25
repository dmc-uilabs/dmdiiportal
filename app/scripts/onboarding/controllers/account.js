angular.module('dmc.onboarding')
.controller('AccountController', 
	['$scope', '$rootScope', '$state', 'ajax', 'dataFactory', 'location', 
	function ($scope, $rootScope, $state, ajax, dataFactory, location) {
		if($state.current.name == "onboarding.account"){
			$state.go($scope.account[0].state);
		}
        $scope.activePage = $state;
		
        $scope.newServer = { 
            name: null, 
            ip: null, 
            status: "offline",
            accountId: $scope.userData.accountId
        };

        var indexLocation = 0;
        $scope.getLocation = function (index) {
            console.info('location', index);
            indexLocation = index
            location.get(callback);
        };

        var callback = function (success, data) {
            console.info('callback', success, data);
            var section = (indexLocation==0)? 'public': 'private';
            if (success) {
                $scope.account[indexLocation].data[section].location.value = data.city + ", " + data.region;
            }
        };

		$scope.getNotifications = function(){
            ajax.get(dataFactory.getAccountNotifications(),{
                    _sort : "position",
                    _order : "ASC"
                }, function(response){
                    $scope.notificationCategories = response.data;
                    ajax.get(dataFactory.getAccountNotificationCategoryItems(),{},function(res){
                        for(var i in res.data){
                            for(var j in $scope.notificationCategories){
                                if(res.data[i]["account-notification-categoryId"] == $scope.notificationCategories[j].id) {
                                    if (!$scope.notificationCategories[j]["account-notification-category-items"]) $scope.notificationCategories[j]["account-notification-category-items"] = [];
                                    $scope.notificationCategories[j]["account-notification-category-items"].push(res.data[i]);
                                }
                            }
                        }
                        $scope.getUserNotifications();
                    });
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
            ajax.create(
                dataFactory.serverURL().create, 
                $scope.newServer,
                function (response) {
                    $scope.newServer = { 
                        name: null, 
                        ip: null, 
                        status: "offline",
                        accountId: $scope.userData.accountId
                    };
                    $scope.account[4].data.servers.unshift(response.data);
                }
            );
        }

        // delete server
        $scope.deleteServer = function(item, index){
            ajax.delete(dataFactory.serverURL(item.id).delete, {},
                function (response) {
                    $scope.account[4].data.servers.splice(index, 1);
                }
            );
        };

        $scope.scrollTop = function(){
        	$(window).scrollTop(0);
        }

        $scope.next = function(index){
            $scope.account[index].done = true;
            var section;
            if(index == 0 || index == 1){
                section = "privacy";
            }else{
                section = "notifications";
            }
            $scope.saveAccount($scope.account[index].data, section, function(){
                $(window).scrollTop(0);
                $state.go('^' + $scope.account[index+1].state);
            });
        }

        $scope.finish = function(index){
            $scope.account[index].done = true;
            $scope.saveFinish('account');
        	$(window).scrollTop(0);
        	$state.go('^.^.home');
        }

}]);