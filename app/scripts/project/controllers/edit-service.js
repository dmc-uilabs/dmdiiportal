angular.module('dmc.project')
    .controller('projectEditServicesCtrl', [
        '$scope','ajax', '$state','domeModel','DMCUserModel', 'projectData', 'serviceModel', 'serviceData', '$rootScope','dataFactory',
        function ($scope,ajax, $state, domeModel, DMCUserModel, projectData, serviceModel, serviceData, $rootScope,dataFactory) {

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
            $scope.existingDocuments = serviceData.service_docs;
            $scope.existingImages = serviceData.service_images;

            $scope.docsToDelete = [];

            $scope.documents = [];
            $scope.images = [];

            $scope.selectedInterface = null;
            $scope.addTags=[];
            $scope.removeTags = [];
            var getServiceTypes = function() {
                ajax.get(dataFactory.getStaticJSON('serviceTypes.json'), {}, function(response){
                    $scope.serviceTypes = response.data;

                });
            }
            getServiceTypes();

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
                    $scope.allServices.unshift({id: 0, title: 'None'});
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
                if($scope.NewService[name] != $scope.NewService[name+'_old']){
                    changedValues[name] = $scope.NewService[name];
                }else if($scope.NewService[name] == $scope.NewService[name+'_old'] && changedValues[name]){
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


            // save new server
            $scope.saveServer = function(server){
                server.ip=server.ip.substr(0,7)=='http://'?server.ip:'http://'+server.ip;
                serviceModel.add_servers({
                    server: {
                      ip: server.port != null ? server.ip + ':' + server.port : server.ip,
                      port: server.port,
                      name: server.name,
                      accountId: $scope.userData.accountId,
                      status: 'offline'
                    },
                    isPub:server.public
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

            $scope.deleteDoc = function(doc) {
                $scope.docsToDelete.push(doc.id);
                doc.hide = true;
            }
            $scope.next = function(){
                $scope.page1 = false;
            };

            $scope.back = function(){
                $scope.page1 = true;
            };

            $scope.finish = function(){
                var interfaceId = !$scope.interface ? null : $scope.interface.id;
                var newDomeInterface = {};

                if(!$scope.interface) {
                    newDomeInterface.domeServer = $scope.selectedServerIp;
                }else{

                    if ($scope.selectedInterface.interFace) {
                        newDomeInterface = $.extend(true, {
                        'inParams': $scope.selectedInterface.inParams,
                        'outParams': $scope.selectedInterface.outParams
                        }, $scope.selectedInterface.interFace);

                    } else {
                        newDomeInterface = $.extend(true, {}, $scope.interface);
                    }

                    if($scope.selectedServerIp) newDomeInterface.domeServer = $scope.selectedServerIp;
                }
                serviceModel.edit_service({
                    title: $scope.NewService.serviceName,
                    description: $scope.NewService.serviceDescription,
                    serviceType: $scope.NewService.serviceType,
                    parent: $scope.NewService.parentComponent,
                    documents: $scope.documents,
                    images: $scope.images,
                    docsToDelete: $scope.docsToDelete
                },$scope.removeTags,$scope.addTags,newDomeInterface, interfaceId);
            };

        }])
