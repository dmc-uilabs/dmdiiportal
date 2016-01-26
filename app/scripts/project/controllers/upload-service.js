angular.module('dmc.project')
.controller('projectUploadServicesCtrl', ['$scope', '$state', 'projectData', 'edit', 'DMCServicesModel', function ($scope, $state, projectData, edit, DMCServicesModel) {
	
	$scope.projectData = projectData;
	$scope.page1 = true;
	$scope.edit = edit;
	$scope.flagAddServer = false;
	$scope.serverModel = null;
	$scope.allServices = null;
	$scope.NewService = {
		serviceName: null,
		parentComponent: null,
		serviceDescription: null,
	}

	$scope.servers = [
		{
			id: 0,
			ip: "192.168.1.1",
			name: "server1"
		},
		{
			id: 1,
			ip: "192.168.1.2",
			name: "server2"
		},
		{
			id: 2,
			ip: "192.168.1.3", 
			name: "server3"
		},
		{
			id: 3,
			ip: "192.168.1.4", 
			name: "server4"
		},
		{
			id: 4,
			ip: "192.168.1.5",
			name: "server5"
		}
	];

	$scope.interfeces = [
		{
			id: 0,
			ip: "192.168.1.1",
			name: "test1",
			inputs:[
				"test1",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			],
			outputs:[
				"test1",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			]
		},
		{
			id: 1,
			ip: "192.168.1.2",
			name: "test2",
			inputs:[
				"test2",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			],
			outputs:[
				"test2",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			]
		},
		{
			id: 2,
			ip: "192.168.1.3", 
			name: "test3",
			inputs:[
				"test3",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			],
			outputs:[
				"test3",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			]
		},
		{
			id: 3,
			ip: "192.168.1.4", 
			name: "test4",
			inputs:[
				"test4",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			],
			outputs:[
				"test4",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			]
		},
		{
			id: 4,
			ip: "192.168.1.5",
			name: "test5",
			inputs:[
				"test5",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			],
			outputs:[
				"test5",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
				"Height",
				"Length",
			]
		}
	]

	$scope.tags = []
	$scope.preview = $scope.interfeces[0];

	DMCServicesModel.list().then(function(data){
		$scope.allServices = data;
	})

	$scope.selectItemDropDown = function(value){
		if(value != 0) {
			var item = $scope.servers[value];
			$scope.servers.splice(value, 1);
			$scope.servers = $scope.servers.sort(function(a,b){return a.id - b.id});
			if ($scope.servers.unshift(item)) this.serverModel = 0;
			$scope.serverModel = 0;
		}
	};

	$scope.saveServer = function(server){
		server.id = $scope.servers.length;
		$scope.servers.push(server);
		$scope.selectItemDropDown(server.id);
		$scope.flagAddServer = false;
	}

	$scope.cancelServer = function(){
		$scope.flagAddServer = false;
	}

	$scope.selectInterface = function(item){
		console.info("select",item);
		$scope.preview = item;
	}
	
	//add tag to product
	$scope.addTag = function(inputTag){
		if(!inputTag)return;
		$scope.tags.push(inputTag);
		this.inputTag = null;
	}

	//remove tag
	$scope.deleteTag = function(index){
		$scope.tags.splice(index,1);
	}

	$scope.next = function(){
		$scope.page1 = false;
	}

	$scope.back = function(){
		$scope.page1 = true;
	}

	$scope.finish = function(){
		if(edit){
			DMCServicesModel.create({
				title: $scope.NewService.serviceName,
				description: $scope.NewService.serviceDescription,
				from: 'project',
				pojectId: projectData.id,
				pojectTitle: projectData.title,
				tags: $scope.tags
			}).then(function(data){
				$state.go('project.services-detail', {ServiceId: data});
				console.info("finish save", data);
			});
		}else{
			DMCServicesModel.create({
				title: $scope.NewService.serviceName,
				description: $scope.NewService.serviceDescription,
				from: 'project',
				pojectId: projectData.id,
				pojectTitle: projectData.title,
				tags: $scope.tags
			}).then(function(data){
				$state.go('project.services-detail', {ServiceId: data});
				console.info("finish save", data);
			});
		}
	}
}])
