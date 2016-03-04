'use strict';
angular.module('dmc.account')
    .controller('ServersAccountCtr', [
        '$stateParams',
        '$state',
        "$scope",
        "accountData",
        "toastModel",
        "ajax",
        "dataFactory",
        "$timeout",
        "questionToastModel",
        "byParameter",
        function ($stateParams,
                  $state,
                  $scope,
                  accountData,
                  toastModel,
                  ajax,
                  dataFactory,
                  $timeout,
                  questionToastModel,
                  byParameter) {

            $scope.accountData = accountData;
            $scope.accountId = $stateParams.accountId;
            $scope.page = $state.current.name.split('.')[1];
            $scope.title = $scope.page;

            $scope.isAddingServer = false;
            $scope.isCorrectNewIP = false;

            $scope.newServer = { name : null, ip : null };

            $scope.servers = [];
            $scope.sort = 'name';
            $scope.order = 'DESC';

            $scope.addServer = function(e){
                var isEditing = false;
                for(var i=0;i<$scope.servers.length;i++){
                    if($scope.servers[i].isChanging){
                        isEditing = true;
                        break;
                    }
                }
                if(!$scope.currentEditingServer || ($scope.currentEditingServer.changedIp == $scope.currentEditingServer.ip && $scope.currentEditingServer.changedName == $scope.currentEditingServer.name)) {
                    if($scope.currentEditingServer) $scope.cancelEditServer();
                    $scope.isAddingServer = true;
                    // auto focus for create Server Alias input
                    $timeout(function() {
                        $("#createServerAlias").focus();
                    },300);
                }else{
                    questionToastModel.show({
                        question : "Do you want to save the previous changes?",
                        buttons: {
                            ok: function(){
                                $scope.saveChanges($scope.currentEditingServer,null,e);
                            },
                            cancel: function(){
                                $scope.cancelEditServer();
                                $scope.addServer(e);
                            }
                        }
                    },e);
                }
            };

            $scope.cancelAdding = function(){
                $scope.newServer = { name : null, ip : null };
                $scope.isCorrectNewIP = false;
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

            $scope.currentEditingServer = null;

            $scope.cancelEditServer = function(){
                $scope.currentEditingServer.changedIp = $scope.currentEditingServer.ip;
                $scope.currentEditingServer.changedName = $scope.currentEditingServer.name;
                $scope.currentEditingServer.isChanging = false;
                $scope.currentEditingServer = null;
            };

            $scope.editServer = function(item,e){
                if(!$scope.currentEditingServer || ($scope.currentEditingServer.changedIp == $scope.currentEditingServer.ip && $scope.currentEditingServer.changedName == $scope.currentEditingServer.name)) {
                    if($scope.currentEditingServer) $scope.cancelEditServer();

                    $scope.currentEditingServer = item;
                    $scope.currentEditingServer.isChanging = true;
                    if ($scope.isAddingServer) $scope.cancelAdding();
                    $timeout(function () {
                        console.log(e);
                        $(e.currentTarget).parents(".one-server").find(".nameEditInput").focus();
                    },300);
                }else{
                    questionToastModel.show({
                        question : "Do you want to save the previous changes?",
                        buttons: {
                            ok: function(){
                                $scope.saveChanges($scope.currentEditingServer, {item : item, e : e});
                            },
                            cancel: function(){
                                $scope.cancelEditServer();
                                $scope.editServer(item,e);
                            }
                        }
                    },e);
                }
            };

            $scope.onOrderChange = function(order){
                $scope.order = (order[0] == '-' ? 'ASC' : 'DESC');
                $scope.getServers();
            };

            // function for get account servers
            $scope.getServers = function(){
                ajax.get(dataFactory.getAccountServersUrl($scope.accountId), {
                        _sort : ($scope.sort[0] == '-' ? $scope.sort.substring(1,$scope.sort.length) : $scope.sort),
                        _order : $scope.order
                    }, function (response) {
                        $scope.servers = response.data;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }, function (response) {
                        toastModel.showToast("error", response.statusText);
                    }
                );
            };

            $scope.getServers(); // get servers

            // create new server in DB
            $scope.saveNewServer = function(){
                if($scope.newServer.ip && $scope.newServer.ip.trim().length > 0 &&
                    $scope.newServer.name != null && $scope.newServer.name.trim().length > 0){
                    // send request
                    var data = $.extend(true,{},$scope.newServer);
                    data.accountId = $scope.accountId;
                    data.status = "offline";
                    ajax.create(dataFactory.serverURL().create, data,
                        function (response) {
                            $scope.servers.unshift(response.data);
                            $scope.cancelAdding();
                            toastModel.showToast("success", "New server successfully added!");
                        }, function (response) {
                            toastModel.showToast("error", response.statusText);
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

            // update changed server
            $scope.saveChanges = function(item, nextForChange, addServer){
                ajax.update(dataFactory.serverURL(item.id).update, {
                        name : item.changedName,
                        ip :  item.changedIp
                    },
                    function (response) {
                        item.name = item.changedName;
                        item.ip = item.changedIp;
                        $scope.cancelEditServer();
                        if(nextForChange) $scope.editServer(nextForChange.item, nextForChange.e);
                        if(addServer) $scope.addServer(addServer);
                        toastModel.showToast("success", "Server successfully updated!");
                    }, function (response) {
                        toastModel.showToast("error", response.statusText);
                    }
                );
            };

            // delete server
            $scope.deleteServer = function(item){
                ajax.delete(dataFactory.serverURL(item.id).delete, {},
                    function (response) {
                        byParameter.delete($scope.servers, "id", item.id);
                        toastModel.showToast("success", "Server successfully deleted!");
                    }, function (response) {
                        toastModel.showToast("error", response.statusText);
                    }
                );
            };

            function isExistChangedItem(){
                for(var i in $scope.servers){
                    if($scope.servers[i].isChanging &&
                        ($scope.servers[i].name != $scope.servers[i].changedName ||
                        $scope.servers[i].ip != $scope.servers[i].changedIp)) return true;
                }
                return false;
            }

            $scope.$on('$locationChangeStart', function (event, next, current) {
                var isChangedItem = isExistChangedItem();
                if ((isChangedItem || ($scope.newServer.ip && $scope.newServer.ip.length > 0) || ($scope.newServer.name && $scope.newServer.name.length > 0)) && current.match("\/servers")) {
                    var answer = confirm("Are you sure you want to leave this page without saving?");
                    if (!answer){
                        event.preventDefault();
                    }
                }
            });

            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                var isChangedItem = isExistChangedItem();
                if((isChangedItem || ($scope.newServer.ip && $scope.newServer.ip.length > 0) || ($scope.newServer.name && $scope.newServer.name.length > 0))) {
                    return "Are you sure you want to leave this page without saving?";
                }
            });
}]);