angular.module('dmc.project')
    .controller('projectUploadServicesCtrl', [
        '$scope',
        '$state',
        'projectData',
        'serviceModel',
        'DMCUserModel',
        function ($scope,
                  $state,
                  projectData,
                  serviceModel,
                  DMCUserModel) {

            $scope.projectData = projectData;
            $scope.page1 = true;
            $scope.edit = false;
            $scope.flagAddServer = false;
            $scope.serverModel = null;
            $scope.allServices = null;
            $scope.NewService = {
                serviceName: null,
                parentComponent: null,
                serviceDescription: null
            };
            $scope.documents = [];

            $scope.addTags = [];
            $scope.removeTags = [];

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
                $scope.allServices.unshift({id: 0, title: "None"});
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
                serviceModel.add_servers({
                    ip: server.ip,
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
                serviceModel.upload_services({
                    title: $scope.NewService.serviceName,
                    description: $scope.NewService.serviceDescription,
                    from: 'project',
                    pojectId: projectData.id,
                    pojectTitle: projectData.title,
                    parent: $scope.NewService.parentComponent
                },$scope.addTags,$scope.selectedInterface.interFace);
            }

        }
    ]
);
