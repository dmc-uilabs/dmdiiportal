'use strict';
angular.module('dmc.account')
    .controller('ServersAccountCtr', [ '$stateParams', '$state', "$scope","accountData","toastModel","ajax","dataFactory", function ($stateParams, $state, $scope,accountData,toastModel,ajax,dataFactory) {
        $scope.accountData = accountData;
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = $scope.page;

        $scope.isAddingServer = false;
        $scope.isEditingServer = false;
        $scope.isCorrectNewIP = false;
        $scope.isCorrectChangedIP = false;

        $scope.newServer = { name : null, ip : null };
        $scope.editingServer = { name : null, ip : null };

        $scope.servers = [];

        $scope.addServer = function(){
            if($scope.isEditingServer == false) {
                $scope.isAddingServer = true;
            }else{
                toastModel.showToast("error", "At the present time you are editing server.");
            }
        };

        $scope.cancelAdding = function(){
            $scope.newServer = { name : null, ip : null };
            $scope.editingServer = { name : null, ip : null };
            $scope.isAddingServer = false;
            $scope.isEditingServer = false;
        };

        var ipIsValid = function(ip){
            //if (ip != null && ip.trim().length > 0 && ip != '0.0.0.0' && ip != '255.255.255.255' && ip.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)){
            if (ip != null && ip.trim().length > 0){
                return true;
            } else {
                return false;
            }
        };

        $scope.changeIP = function(type){
            if(type == 'new'){
                $scope.isCorrectNewIP = ipIsValid($scope.newServer.ip);
            }else{
                $scope.isCorrectChangedIP = ipIsValid($scope.editingServer.ip);
            }
        };

        $scope.getServers = function(){
            ajax.on(dataFactory.getServers(), {id : 1},
                function (data) {
                    if (!data.error) {
                        $scope.servers = data.result;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    } else {
                        toastModel.showToast("error", data.error);
                    }
                }, function (data) {
                    toastModel.showToast("error", "Error. The problem on the server.");
                }
            );
        };

        $scope.getServers();

        $scope.saveNewServer = function(){
            if($scope.newServer.ip && $scope.newServer.ip.trim().length > 0 && $scope.newServer.name != null && $scope.newServer.name.trim().length > 0){
                ajax.on(dataFactory.addNewServer(), $scope.newServer,
                    function (data) {
                        if (!data.error) {
                            $scope.servers.unshift(data.result);
                            $scope.cancelAdding();
                            toastModel.showToast("success", "New server successfully added!");
                        } else {
                            toastModel.showToast("error", data.error);
                        }
                    }, function (data) {
                        toastModel.showToast("error", "Error. The problem on the server.");
                    }
                );
            }else{
                if($scope.newServer.name == null || $scope.newServer.name.trim().length == 0 ) {
                    toastModel.showToast("error", "Please enter Server Name");
                }else{
                    toastModel.showToast("error", "Please enter Server Host/IP");
                }
            }
        };

        $scope.saveChanges = function(){
            if($scope.newServer.ip && $scope.newServer.ip.trim().length > 0 && $scope.editingServer.name != null && $scope.editingServer.name.trim().length > 0){
                ajax.on(dataFactory.saveChangeServer(), $scope.editingServer,
                    function (data) {
                        if (!data.error) {
                            for(var i=0;i<$scope.servers.length;i++){
                                if($scope.servers[i].id == data.result.id){
                                    $scope.servers[i] = data.result;
                                    break;
                                }
                            }
                            $scope.cancelAdding();
                            toastModel.showToast("success", "Server successfully updated!");
                        } else {
                            toastModel.showToast("error", data.error);
                        }
                    }, function (data) {
                        toastModel.showToast("error", "Error. The problem on the server.");
                    }
                );
            }else{
                if($scope.editingServer.name == null || $scope.editingServer.name.trim().length == 0 ) {
                    toastModel.showToast("error", "Server Name can not be empty.");
                }else{
                    if($scope.editingServer.ip == null || $scope.editingServer.ip.trim().length == 0){
                        toastModel.showToast("error", "Server Host/IP can not be empty.");
                    }else{
                        toastModel.showToast("error", "Server Host/IP has wrong format");
                    }
                }
            }
        };

        $scope.editServer = function(item){
            if($scope.isAddingServer == false) {
                $scope.editingServer = $.extend(true, {}, item);
                $scope.isCorrectChangedIP = ipIsValid($scope.editingServer.ip);
                $scope.isEditingServer = true;
            }else{
                toastModel.showToast("error", "At the present time you are adding server.");
            }
        };

        $scope.deleteServer = function(item){
            ajax.on(dataFactory.deleteServer(), {id : item.id},
                function (data) {
                    if (!data.error) {
                        for(var i=0;i<$scope.servers.length;i++){
                            if(parseInt($scope.servers[i].id) == parseInt(item.id)){
                                $scope.servers.splice(i,1);
                                break;
                            }
                        }
                        toastModel.showToast("success", "Server successfully deleted!");
                    } else {
                        toastModel.showToast("error", data.error);
                    }
                }, function (data) {
                    toastModel.showToast("error", "Error. The problem on the server.");
                }
            );
        };
}]);