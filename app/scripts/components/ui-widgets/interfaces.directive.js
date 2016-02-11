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
                selectedInterface: '='
            },
            templateUrl: 'templates/components/ui-widgets/interfaces.tmpl.html',
            controller: function($scope,ajax,dataFactory,toastModel){
                $scope.interfaces = [];
                $scope.currentFolder = null;
                $scope.isLoading = false;
                $scope.track = [];
                $scope.current = null;

                $scope.exitFolder = function(index){
                    $scope.getInterfaces($scope.track[index],index,true);
                };

                $scope.getInterfaces = function(item,index,back){
                    $scope.isLoading = true;
                    var dataRequest = {};
                    for (var key in item) {
                        if (key != 'interfaces') dataRequest[key] = item[key];
                    }
                    dataRequest.url = $scope.serverIp;
                    $scope.current = null;
                    ajax.get(dataFactory.getChildren(), dataRequest,
                        function (response) {
                            if (response.data.status != "error") {
                                if (response.data.pkg && response.data.pkg.children) {
                                    if(response.data.pkg.type == "model"){
                                        if(response.data.pkg.children) {
                                            $scope.current = index;
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
                                apply();
                            } else {
                                toastModel.showToast('error', response.data.msg);
                            }
                            $scope.isLoading = false;
                        }
                    );
                };
                $scope.getInterfaces();

                $scope.getModel = function(item){
                    var dataRequest = {};
                    for(var key in item){
                        if(key != 'interfaces') dataRequest[key] = item[key];
                    }
                    dataRequest.url = $scope.serverIp;
                    ajax.get(dataFactory.getModel(), dataRequest,
                        function(response){
                            if(response.status != "error") {
                                $scope.selectedInterface(response.data.pkg);
                                apply();
                            }else{
                                toastModel.showToast('error', response.msg);
                            }
                        }
                    );
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