angular.module('dmc.project')
    .controller('projectEditServicesCtrl', [
        '$scope', '$state', 'projectData', 'serviceModel', 'serviceData', '$rootScope',
        function ($scope, $state, projectData, serviceModel, serviceData, $rootScope) {

            $scope.projectData = projectData;
            $scope.page1 = true;
            $scope.edit = true;
            $scope.flagAddServer = false;
            $scope.serverModel = null;
            $scope.allServices = null;
            $scope.NewService = {
                serviceName: serviceData.title,
                parentComponent: 0,
                serviceDescription: serviceData.description,
            };

            $scope.addTags=[];
            $scope.removeTags = [];

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            serviceModel.get_servers(function(data){
                $scope.servers = data;
                apply();
            });

            serviceModel.get_interface(serviceData.id,function(response){
                $scope.interface = response.data ? (response.data.length > 0 ? response.data[0] : null) : null;
                apply();
            });

            $scope.service_tags = serviceData.service_tags;
            $scope.preview = [];

            serviceModel.get_all_service({}, function(data){
                $scope.allServices = data;
                $scope.allServices.unshift({id: 0, title: "None"});
            })

            $scope.selectedInterface = null;
            $scope.getSelectedInterface = function(item, name){
                $scope.selectedInterface = item;
                $scope.NewService.serviceName = name;
                apply();
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
                }
            };

            $scope.saveServer = function(server){

                serviceModel.add_servers({
                    ip: server.ip,
                    name: server.name
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

            //add tag to product
            $scope.addTag = function(inputTag){
                if(!inputTag)return;
                $scope.addTags.push(inputTag);
                $scope.service_tags.push({name: inputTag});
                this.inputTag = null;
            };

            //remove tag
            $scope.deleteTag = function(index, id){
                if(id && id > 0) $scope.removeTags.push(id);
                $scope.service_tags.splice(index,1);
            };

            $scope.next = function(){
                $scope.page1 = false;
            };

            $scope.back = function(){
                $scope.page1 = true;
            };

            $scope.finish = function(){
                serviceModel.edit_service({
                    title: $scope.NewService.serviceName,
                    description: $scope.NewService.serviceDescription,
                    parent: $scope.NewService.parentComponent
                },function(data){
                    console.log($scope.removeTags);
                    serviceModel.remove_services_tags($scope.removeTags);
                    serviceModel.add_services_tags($scope.addTags);

                    if(!$scope.interface) {
                        $scope.selectedInterface.interFace.serviceId = data.id;
                        $scope.selectedInterface.interFace.domeServer = $scope.selectedServerIp;
                        serviceModel.save_service_interface($scope.selectedInterface.interFace);
                    }else{
                        $scope.selectedInterface.interFace = ($scope.selectedInterface.interFace ? $scope.selectedInterface.interFace : $scope.interface);
                        if($scope.selectedServerIp) $scope.selectedInterface.interFace.domeServer = $scope.selectedServerIp;
                        serviceModel.update_service_interface($scope.interface.id, $scope.selectedInterface.interFace);
                    }

                    $state.go('project.services-detail', {ServiceId: data.id});
                });
            };
        }])
