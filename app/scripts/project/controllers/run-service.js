angular.module('dmc.project')
.controller('projectRunServicesCtrl', ['$scope', '$stateParams', 'projectData', 'ajax', 'dataFactory', '$mdToast', 'toastModel', '$mdDialog', '$state', function ($scope, $stateParams, projectData, ajax, dataFactory, $mdToast, toastModel, $mdDialog, $state) {
	
	$scope.ServiceId = $stateParams.ServiceId;
	$scope.projectData = projectData;
	$scope.service = null;
	$scope.status = "Not Running";
	$scope.runTime = 0;
	$scope.lastStatus = "Success";
	$scope.lastRunTime = 3.1;
	$scope.averageRun = 3;
	$scope.runHistory = false;
	$scope.sort = "runDate";
	$scope.order = true;

	$scope.inputs=[
		{
			left:"Saturation Polarization",
			right:"Tesla (real)",
			models: ""
		},
		{
			left:"Anisotropy",
			right:"Joule per cubic meter (real)",
			models: ""
		},
		{
			left:"Grain Diameter",
			right:"nm (real)",
			models: ""
		},
		{
			left:"Coeffclent",
			right:"permeability coeffclent (real)",
			models: ""
		},
		{
			left:"Exchange Stiffness",
			right:"Newton (real)",
			models: ""
		},
		{
			left:"Permeability Free Space",
			right:"permeability of vacuum (real)",
			models: ""
		},
		{
			left:"Saturation Polarization",
			right:"Tesla (real)",
			models: ""
		},
		{
			left:"Anisotropy",
			right:"Joule per cubic meter (real)",
			models: ""
		},
		{
			left:"Grain Diameter",
			right:"nm (real)",
			models: ""
		},
		{
			left:"Coeffclent",
			right:"permeability coeffclent (real)",
			models: ""
		},
		{
			left:"Exchange Stiffness",
			right:"Newton (real)",
			models: ""
		},
		{
			left:"Permeability Free Space",
			right:"permeability of vacuum (real)",
			models: ""
		},
		{
			left:"Saturation Polarization",
			right:"Tesla (real)",
			models: ""
		},
		{
			left:"Anisotropy",
			right:"Joule per cubic meter (real)",
			models: ""
		},
		{
			left:"Grain Diameter",
			right:"nm (real)",
			models: ""
		},
		{
			left:"Coeffclent",
			right:"permeability coeffclent (real)",
			models: ""
		},
		{
			left:"Exchange Stiffness",
			right:"Newton (real)",
			models: ""
		},
		{
			left:"Permeability Free Space",
			right:"permeability of vacuum (real)",
			models: ""
		},
		{
			left:"Saturation Polarization",
			right:"Tesla (real)",
			models: ""
		},
		{
			left:"Anisotropy",
			right:"Joule per cubic meter (real)",
			models: ""
		},
		{
			left:"Grain Diameter",
			right:"nm (real)",
			models: ""
		},
		{
			left:"Coeffclent",
			right:"permeability coeffclent (real)",
			models: ""
		},
		{
			left:"Exchange Stiffness",
			right:"Newton (real)",
			models: ""
		},
		{
			left:"Permeability Free Space",
			right:"permeability of vacuum (real)",
			models: ""
		},
		{
			left:"Saturation Polarization",
			right:"Tesla (real)",
			models: ""
		},
		{
			left:"Anisotropy",
			right:"Joule per cubic meter (real)",
			models: ""
		},
		{
			left:"Grain Diameter",
			right:"nm (real)",
			models: ""
		},
		{
			left:"Coeffclent",
			right:"permeability coeffclent (real)",
			models: ""
		},
		{
			left:"Exchange Stiffness",
			right:"Newton (real)",
			models: ""
		},
		{
			left:"Permeability Free Space",
			right:"permeability of vacuum (real)",
			models: ""
		},
	]

	$scope.history = [
		{
			runDate: "10/15/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Success",
		},
		{
			runDate: "12/15/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "12:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "12:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "09:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "09:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/09/2015",
			runTimeService: "09:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
	]

	ajax.on(
		dataFactory.getUrlAllServices(),
		{
			projectId: projectData.id,
			ids: [$stateParams.ServiceId]
		},
		function(data){
			console.info(data)
			if(data.count > 0){
				$scope.service = data.result[0];
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
			}else{
				$state.go("project.services")
			}
		},
		function(){
			alert("Ajax fail: getAllServices");
		}
	);

	$scope.run = function(){
		var test = false;
		for(var i in $scope.inputs){
			if($scope.inputs[i].models != ''){
				test = true;
				break;
			}
		}
		if(test == true){
			$scope.runTime = 3;
			toastModel.showToast("success", "Run Completed Succesfully");
		}else{
			toastModel.showToast("error", "Run Failed. Please check your inputs and try again");
		}
	}

	$scope.showHistory = function(){
		$scope.runHistory = !$scope.runHistory;
	}

	$scope.sorting = function(sort){
		$scope.sort = sort;
		$scope.order = !$scope.order;
	}

	$scope.clear = function(){
		for(var i in $scope.inputs){
			$scope.inputs[i].models = "";
		}
	}

	$scope.save = function(){
		var test = false;
		for(var i in $scope.inputs){
			if($scope.inputs[i].models != ''){
				test = true;
				break;
			}
		}
		if(test == true){
			toastModel.showToast("success", "The inputs have been saved");
		}else{
			toastModel.showToast("error", "Save Failed. Please check your inputs and try again");
		}
	}

	$scope.openResults = function(history, ev){
		$(window).scrollTop(0);
		$mdDialog.show({
			controller: "ModalResultsController",
			templateUrl: "templates/project/pages/modal-results.html",
			parent: angular.element(document.body),
			targetEvent: ev,
			locals: {
				history: history
			},
			clickOutsideToClose:true
		})
		.then(function() {
			$scope.runHistory = false;
			$scope.inputs[0].models = "test";
			$scope.inputs[1].models = "test";
			$scope.inputs[2].models = "test";
			//$scope.runTime = 3;
			//toastModel.showToast("success", "Run Completed Succesfully");
		}, function() {
		});
	}
}])
.controller("ModalResultsController", ['$scope', '$mdDialog', 'history', function ($scope, $mdDialog, history) {
	$scope.history = history;

	$scope.inputs = [
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
		"Height: 20ft",
		"Length: 20ft",
	];
	$scope.outputs = [
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
		"Area: 400 square ft",
	];

	$scope.cancel = function(){
		$mdDialog.cancel();
	}
	$scope.rerun = function(){
		$mdDialog.hide();
	}
}]);