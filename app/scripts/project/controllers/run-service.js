angular.module('dmc.project')
.controller('projectRunServicesCtrl', [
	'$scope', '$stateParams', 'projectData', 'serviceData', 'ajax', 'dataFactory', '$mdToast', 'toastModel', '$state', 
	function ($scope, $stateParams, projectData, serviceData, ajax, dataFactory, $mdToast, toastModel, $state) {
	
	$scope.ServiceId = $stateParams.ServiceId;
	$scope.projectData = projectData;
	$scope.service = serviceData;

	$scope.status = "Not Running";
	$scope.runTime = 0;
	$scope.lastStatus = "Success";
	$scope.lastRunTime = 3.1;
	$scope.averageRun = 3;


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

	$scope.run = function(){
		$scope.status = "Running";
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
}]);