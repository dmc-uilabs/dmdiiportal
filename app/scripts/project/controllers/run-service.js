angular.module('dmc.project')
.controller('projectRunServicesCtrl', ['$scope', '$stateParams', 'projectData', 'ajax', 'dataFactory', '$mdToast', 'toastModel', function ($scope, $stateParams, projectData, ajax, dataFactory, $mdToast, toastModel) {
	
	$scope.projectData = projectData;
	$scope.service = null;
	$scope.status = "Not Running";
	$scope.runTime = 0;
	$scope.averageRun = 3;
	$scope.runHistory = false;
	$scope.sort = null;
	$scope.order = false;

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
			runDate: "10-15-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Succesful",
		},
		{
			runDate: "12-15-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
		{
			runDate: "10-19-2015",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Failed",
		},
		{
			runDate: "12-10-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Succesful",
		},
		{
			runDate: "12-11-2015",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Failed",
		},
	]

	ajax.on(
			dataFactory.getUrlAllServices(),
			{
				projectId: projectData.id,
				ids: [$stateParams.ServiceId]
			},
			function(data){
				if(data.count > 0){
					$scope.service = data.result[0];
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
}])