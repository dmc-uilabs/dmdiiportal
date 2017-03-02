angular.module('dmc.project')
    .controller('projectUploadServicesCtrl', [
        '$scope',
        'ajax',
        '$state',
        'projectData',
        'serviceModel',
        'DMCUserModel',
        'dataFactory',
        function ($scope,
                  ajax,
                  $state,
                  projectData,
                  serviceModel,
                  DMCUserModel,
                  dataFactory ) {

            $scope.projectData = projectData;
            $scope.page1 = true;
            $scope.edit = false;
            $scope.flagAddServer = false;
            $scope.serverModel = null;
            $scope.allServices = null;
            $scope.NewService = {
                serviceName: null,
                parentComponent: null,
                serviceDescription: null,
                serviceType: null
            };
            $scope.documents = [];
            $scope.images = [];

            $scope.addTags = [];
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
                getServers();
            });

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.selectedInterface = null;
            $scope.getSelectedInterface = function(item, name){
                $scope.selectedInterface = item;
                $scope.NewService.serviceName = name;
                apply();
            };

            // get servers
            function getServers(){
                serviceModel.get_servers(function(data){
                    $scope.servers = data;
                    apply();
                });
            }

            $scope.service_tags = [];

            // get all services
            serviceModel.get_all_service({}, function(data){
                $scope.allServices = data;
                $scope.allServices.unshift({id: 0, title: 'None'});
            });

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

            $scope.startAddServer = function(){
                $scope.flagAddServer = true;
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

            // cancel add server
            $scope.cancelServer = function(){
                $scope.flagAddServer = false;
            };

            // add tag to service
            $scope.addTag = function(inputTag){
                if(!inputTag)return;
                $scope.addTags.push(inputTag);
                $scope.service_tags.push({name: inputTag});
                this.inputTag = null;
            };

            // delete tag
            $scope.deleteTag = function(index, tag){
                if(tag.id && tag.id > 0) $scope.removeTags.push(tag.id);
                $scope.service_tags.splice(index,1);
            };

            // gor to second page
            $scope.next = function(){
                $scope.page1 = false;
            };

            // come back to first page
            $scope.back = function(){
                $scope.page1 = true;
            };

            // upload service
            $scope.finish = function(){
                $scope.selectedInterface.interFace.domeServer = $scope.selectedServerIp;
                var newDomeInterface = $.extend(true,{
                    'inParams': $scope.selectedInterface.inParams,
                    'outParams': $scope.selectedInterface.outParams
                },$scope.selectedInterface.interFace);
                serviceModel.upload_services({
                    title: $scope.NewService.serviceName,
                    description: $scope.NewService.serviceDescription,
                    serviceType: $scope.NewService.serviceType,
                    from: 'project',
                    projectId: projectData.id,
                    projectTitle: projectData.title,
                    parent: $scope.NewService.parentComponent,
                    images: $scope.images,
                    documents: $scope.documents
                },$scope.addTags,newDomeInterface);
            }

        }
    ]
);
