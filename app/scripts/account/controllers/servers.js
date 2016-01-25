'use strict';
angular.module('dmc.account')
    .controller('ServersAccountCtr', [ '$stateParams', '$state', "$scope","accountData","toastModel","ajax","dataFactory","$timeout", function ($stateParams, $state, $scope,accountData,toastModel,ajax,dataFactory,$timeout) {
        $scope.accountData = accountData;
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = $scope.page;

        $scope.isAddingServer = false;
        $scope.isCorrectNewIP = false;
        $scope.isCorrectChangedIP = false;

        $scope.newServer = { name : null, ip : null };

        $scope.servers = [];
        $scope.sort = 'name';
        $scope.order = 'DESC';

        $scope.addServer = function(){
            var isEditing = false;
            for(var i=0;i<$scope.servers.length;i++){
                if($scope.servers[i].isChanging){
                    isEditing = true;
                    break;
                }
            }
            if(!isEditing) {
                $scope.isAddingServer = true;
                // auto focus for create Server Alias input
                $timeout(function() {
                    $("#createServerAlias").focus();
                });
            }else{
                toastModel.showToast("error", "At the present time you are editing server.");
            }
        };

        $scope.cancelAdding = function(){
            $scope.newServer = { name : null, ip : null };
            $scope.isAddingServer = false;
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
            }
        };


        $scope.getServers = function(){
            ajax.on(dataFactory.getServers(), {
                    accountId : 1,
                    _sort : ($scope.sort[0] == '-' ? $scope.sort.substring(1,$scope.sort.length) : $scope.sort),
                    _order : $scope.order
                }, function (data) {
                    if (!data.error) {
                        $scope.servers = data;
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

        $scope.saveChanges = function(item){
            ajax.on(dataFactory.saveChangeServer(item.id), {
                    name : item.changedName,
                    ip :  item.changedIp
                },
                function (data) {
                    if (!data.error) {
                        item.name = item.changedName;
                        item.ip = item.changedIp;
                        $scope.cancelEditServer(item);
                        toastModel.showToast("success", "Server successfully updated!");
                    } else {
                        toastModel.showToast("error", data.error);
                    }
                }, function (data) {
                    toastModel.showToast("error", "Error. The problem on the server.");
                }, "PUT"
            );
        };

        $scope.cancelEditServer = function(item){
            item.isChanging = false;
        };

        $scope.editServer = function(item,e){
            if($scope.isAddingServer) $scope.cancelAdding();
            item.isChanging = true;
            $timeout(function() {
                $(e.currentTarget).parents(".one-server").find(".nameEditInput").focus();
            });
        };

        $scope.onOrderChange = function(order){
            $scope.order = (order[0] == '-' ? 'ASC' : 'DESC');
            $scope.getServers();
        };

        $scope.deleteServer = function(item){
            ajax.on(dataFactory.deleteServer(item.id), {},
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
                }, "DELETE"
            );
        };
}]);