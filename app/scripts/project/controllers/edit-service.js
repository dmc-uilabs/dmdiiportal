angular.module('dmc.project')
    .controller('projectEditServicesCtrl', [
        '$scope', '$state','domeModel','DMCUserModel', 'projectData', 'serviceModel', 'serviceData', '$rootScope',
        function ($scope, $state, domeModel, DMCUserModel, projectData, serviceModel, serviceData, $rootScope) {

            $scope.projectData = projectData;
            $scope.page1 = true;
            $scope.edit = true;
            $scope.flagAddServer = false;
            $scope.serverModel = null;
            $scope.allServices = null;
            $scope.NewService = {
                serviceName: serviceData.title,
                serviceName_old: serviceData.title,
                serviceType: serviceData.serviceType,
                serviceType_old: serviceData.serviceType,
                parentComponent: 0,
                parentComponent_old: 0,
                serviceDescription: serviceData.description,
                serviceDescription_old: serviceData.description
            };
            $scope.documents = [];

            $scope.selectedInterface = null;
            $scope.addTags=[];
            $scope.removeTags = [];

            $scope.serviceTypes = [{
                tag : "analytical",
                name : "Analytical"
            }, {
                tag: "data",
                name : "Data"
            },{
                tag : "solid",
                name : "Solid"
            }];

            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(result){
                $scope.userData = result;
                serviceModel.get_servers(function(data){
                    $scope.servers = data;
                    checkServer();
                    apply();
                });

                serviceModel.get_interface(serviceData.id,function(response){
                    $scope.interface = response.data ? (response.data.length > 0 ? response.data[0] : null) : null;
                    if($scope.interface) {
                        $scope.selectedServerIp = $scope.interface.domeServer;
                        checkServer();
                        domeModel.getModel($scope.interface,function(response){
                            $scope.selectedInterface = response.data && response.data.pkg ? response.data.pkg : null;
                            //console.log($scope.selectedInterface);
                            $scope.NewService.serviceName = serviceData.title;
                        });
                    }
                    apply();
                });

                serviceModel.get_all_service({}, function(data){
                    $scope.allServices = data;
                    $scope.allServices.unshift({id: 0, title: "None"});
                });
            });

            function checkServer(){
                if(!$scope.serverModel && $scope.interface && $scope.interface.domeServer){
                    for(var i in $scope.servers){
                        if($scope.servers[i].ip == $scope.interface.domeServer){
                            $scope.serverModel = i;
                            break;
                        }
                    }
                    apply();
                }
            }

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };



            $scope.service_tags = serviceData.service_tags;
            $scope.preview = [];


            var isInterfaceChanged = false;
            var changedValues = {};
            var isChangedPage = false;

            $scope.getSelectedInterface = function(item, name){
                var prevId = ($scope.selectedInterface && $scope.selectedInterface.interFace && $scope.selectedInterface.interFace.interfaceId ? $scope.selectedInterface.interFace.interfaceId : null);
                $scope.selectedInterface = item;
                var newId = (item.interFace && item.interFace.interfaceId ? item.interFace.interfaceId : null);
                isInterfaceChanged = prevId == newId ? false : true;
                $scope.NewService.serviceName = name;
                apply();
            };

            $scope.changeValue = function(name){
                if($scope.NewService[name] != $scope.NewService[name+"_old"]){
                    changedValues[name] = $scope.NewService[name];
                }else if($scope.NewService[name] == $scope.NewService[name+"_old"] && changedValues[name]){
                    delete changedValues[name];
                }
                isChangedPage = Object.keys(changedValues).length > 0 ? true : false;
                //console.log(isChangedPage);
            };

            // select server
            $scope.selectedServerIp = null;
            $scope.selectItemDropDown = function(value){
                if(value != 0 || $scope.serverModel !== 0) {
                    var item = $scope.servers[value];
                    $scope.selectedServerIp = item.ip;
                    $scope.servers.splice(value, 1);
                    $scope.servers = $scope.servers.sort(function(a,b){return a.id - b.id});
                    if ($scope.servers.unshift(item)) this.serverModel = 0;
                    $scope.serverModel = 0;
                    $scope.updateDateTime = new Date();
                    apply();
                }
            };

            $scope.saveServer = function(server){

                serviceModel.add_servers({
                    ip: server.port != null ? server.ip + ':' + server.port : server.ip,
                    name: server.name,
                    accountId: $scope.userData.accountId,
                    status: "offline"
                }, function(data){
                    $scope.servers.push(data);
                    $scope.flagAddServer = false;
                    $scope.selectItemDropDown($scope.servers.length-1);
                    apply();
                })
            };

            $scope.cancelServer = function(){
                $scope.flagAddServer = false;
            };

            $scope.selectInterface = function(item){
                $scope.preview = item;
            };

            $scope.startAddServer = function(){
                $scope.flagAddServer = true;
            };

            //add tag to product
            $scope.addTag = function(inputTag){
                if(!inputTag)return;
                $scope.addTags.push(inputTag);
                $scope.service_tags.push({name: inputTag});
                this.inputTag = null;
                //console.log($scope.addTags);
            };

            //remove tag
            $scope.deleteTag = function(index, tag){
                if(tag.id && tag.id > 0){
                    $scope.removeTags.push(tag.id);
                }else{
                    for(var i in $scope.addTags) {
                        if($scope.addTags[i] == tag.name) {
                            $scope.addTags.splice(i, 1);
                            break;
                        }
                    }
                }
                //console.log($scope.addTags);
                $scope.service_tags.splice(index,1);
            };

            $scope.next = function(){
                $scope.page1 = false;
            };

            $scope.back = function(){
                $scope.page1 = true;
            };

            $scope.finish = function(){
                var interfaceId = !$scope.interface ? null : $scope.interface.id;
                if(!$scope.interface) {
                    $scope.selectedInterface.interFace.domeServer = $scope.selectedServerIp;
                }else{
                    $scope.selectedInterface.interFace = ($scope.selectedInterface.interFace ? $scope.selectedInterface.interFace : $scope.interface);
                    if($scope.selectedServerIp) $scope.selectedInterface.interFace.domeServer = $scope.selectedServerIp;
                }
                serviceModel.edit_service({
                    title: $scope.NewService.serviceName,
                    description: $scope.NewService.serviceDescription,
                    serviceType: $scope.NewService.serviceType,
                    parent: $scope.NewService.parentComponent
                },$scope.removeTags,$scope.addTags,$scope.selectedInterface.interFace, interfaceId);
            };

            $scope.$on('$locationChangeStart', function (event, next, current) {
                //console.log(current);
                var answer = confirm("Are you sure you want to leave this page without saving?");
                if ((isInterfaceChanged || isChangedPage || $scope.addTags.length > 0 || $scope.removeTags.length > 0) && current.match("\/edit")) {
                    var answer = confirm("Are you sure you want to leave this page without saving?");
                    if (!answer){
                        event.preventDefault();
                    }
                }
            });

            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                if(isInterfaceChanged || isChangedPage || $scope.addTags.length > 0 || $scope.removeTags.length > 0) {
                    return "Are you sure you want to leave this page without saving?";
                }
            });

        }])
