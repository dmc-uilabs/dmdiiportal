'use strict';

angular.module('dmc.widgets.interfaces',[
        'dmc.ajax',
        'dmc.data',
        'RecursionHelper'
    ])
    .directive('dmcInterfaces', function(RecursionHelper) {
        return {
            restrict: 'A',
            scope: {
                serverIp: '=',
                selectedInterface: '=',
                update: '='
            },
            templateUrl: 'templates/components/ui-widgets/interfaces.tmpl.html',
            controller: function($scope,ajax,domeModel,dataFactory,toastModel){
                $scope.interfaces = [];
                $scope.currentFolder = null;
                $scope.isLoading = false;
                $scope.track = [];
                $scope.current = null;

                var nameModel = null;

                $scope.exitFolder = function(index){
                    $scope.getInterfaces($scope.track[index],index,true);
                };

                function callbackGetModel(response){
                    if(response.status != "error") {
                        $scope.selectedInterface(response.data.pkg, nameModel);
                        apply();
                    }else{
                        toastModel.showToast('error', response.msg);
                    }
                }

                function callbackGetChildren(response,index,back,item){
                    if (response && response.data && response.data.status != "error") {
                        if (response.data.pkg && response.data.pkg.children) {
                            if(response.data.pkg.type == "model"){
                                if(response.data.pkg.children) {
                                    $scope.current = index;
                                    nameModel = response.data.pkg.name;
                                    $scope.getModel(response.data.pkg.children[0]);
                                }
                            }else {
                                $scope.interfaces = response.data.pkg.children;
                                if (back) {
                                    $scope.track.splice(index + 1, $scope.track.length);
                                } else if (item) {
                                    $scope.track.push(item);
                                }
                                $scope.currentFolder = $scope.track.length - 1;
                            }
                        }
                    } else {
                        $scope.interfaces = [];
                        if(!response || !response.data) {
                            toastModel.showToast('error', "Unknown server");
                        }else{
                            toastModel.showToast('error', response.data.msg);
                        }
                    }
                    $scope.isLoading = false;
                    apply();
                }

                function errorCallback(){
                    $scope.isLoading = false;
                }

                $scope.getInterfaces = function(item,index,back){
                    $scope.isLoading = true;
                    var dataRequest = {};
                    for (var key in item) {
                        if (key != 'interfaces') dataRequest[key] = item[key];
                    }
                    dataRequest.domeServer = $scope.serverIp;
                    $scope.current = null;
                    domeModel.getChildren(dataRequest,function(response){
                        callbackGetChildren(response,index,back,item);
                    },errorCallback,item,index,back);
                };
                $scope.getInterfaces();

                $scope.$watch("update",function(newVal,oldVal){
                    if(newVal && newVal != oldVal) $scope.getInterfaces();
                });

                $scope.getModel = function(item){
                    var dataRequest = {};
                    for(var key in item){
                        if(key != 'interfaces') dataRequest[key] = item[key];
                    }
                    dataRequest.domeServer = $scope.serverIp;
                    domeModel.getModel(dataRequest,callbackGetModel,errorCallback);
                };

                $scope.selectInterface = function(item,index,event){
                    event.stopPropagation();
                    if(item.type == 'folder' || item.type == 'model') {
                        $scope.getInterfaces(item, index, false);
                    }else{
                        $scope.getModel(item, index);
                    }
                };

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        };
    }
)