'use strict';
angular.module('dmc.company-profile').
    directive('tabVpc', ['$parse', 'toastModel', 'questionToastModel', function ($parse, toastModel) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-vpc.html',
            scope: {
                source: '='
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, questionToastModel) {
                $element.addClass("tab-vpc");

                $scope.vpc = {};

                $scope.$watch(function () {
                    return $scope.source.productionCapabilities;
                }, function (newValue, oldValue) {
	                if ($scope.source.productionCapabilities) {
                        $scope.vpc = formatCategories(JSON.parse($scope.source.productionCapabilities));
                        console.log($scope.vpc);
                    }
                }, true);

                function formatCategories(constantsJSON) {
                    var groupedCats = {};

                    for (var i=0; i<constantsJSON.length; i++) {
                        var name = constantsJSON[i].name;
                        var breakPoint = name.indexOf("::");
                        var category = name.substring(0,breakPoint).trim();
                        constantsJSON[i].name = name.substring(breakPoint+3,name.length);

                        if (!groupedCats[category] && category.length > 0) {
                            groupedCats[category] = [constantsJSON[i]];
                        } else if (groupedCats[category] && category.length > 0) {
                            groupedCats[category].push(constantsJSON[i]);
                        }
                    }

                    return groupedCats;

                }

                function unFormatCategories(vpc) {
                	var unFormattedArray = [];
                	for (var item in vpc) {
                		console.log(item);
                		console.log(vpc[item]);
                		for (var i = 0; i < vpc[item].length; i++) {
			                var objectToAdd = {};
			                objectToAdd.name = item + ' :: ' + vpc[item][i].name;
			                objectToAdd.value = vpc[item][i].value;
			                objectToAdd.unit = vpc[item][i].unit;
			                objectToAdd.help = vpc[item][i].help;
			                unFormattedArray.push(objectToAdd);
		                }
	                }
	                return unFormattedArray;
                }

                $scope.defaults=false;
                $scope.machining =false;
                $scope.casting =false;
                $scope.invCasting=false;
                $scope.genLabor = false;
                $scope.welding=false;
                $scope.plating=false;
                $scope.painting=false;
                $scope.xray=false;
                $scope.material=false;
                $scope.addMachiningItem = false;
                $scope.addCastingItem = false;
                $scope.addInvCastingItem = false;
                $scope.addWeldingItem = false;
                $scope.addGeneralLaborItem = false;
                $scope.addPlatingItem = false;
                $scope.addPaintingItem = false;
                $scope.addXRayMachineItem = false;
                $scope.addMaterialCostItem = false;

                $scope.addForm=function(formName){
                    switch (formName) {
	                    case 'machining':
	                    	$scope.addMachiningItem = !$scope.addMachiningItem;
	                    	break;
                        case 'casting':
                            $scope.addCastingItem = !$scope.addCastingItem;
                            break;
                        case 'invCasting':
                            $scope.addInvCastingItem = !$scope.addInvCastingItem;
                            break;
                        case 'welding':
                            $scope.addWeldingItem = !$scope.addWeldingItem;
                            break;
                        case 'generalLabor':
                            $scope.addGeneralLaborItem = !$scope.addGeneralLaborItem;
                            break;
                        case 'plating':
                            $scope.addPlatingItem = !$scope.addPlatingItem;
                            break;
                        case 'painting':
                            $scope.addPaintingItem = !$scope.addPaintingItem;
                            break;
                        case 'xRayMachine':
                            $scope.addXRayMachineItem = !$scope.addXRayMachineItem;
                            break;
                        case 'materialCost':
                            $scope.addMaterialCostItem = !$scope.addMaterialCostItem;
                            break;
	                    default:
	                    	break;
                    }
                	$scope.newForm=!$scope.newForm;
                };

                $scope.toggleCategory=function(category){
                  if(category=='machining'){
                    $scope.machining=!$scope.machining;
                  }
                  else if (category=='casting'){
                    $scope.casting=!$scope.casting;
                  }
                  else if (category=='invCasting'){
                    $scope.invCasting=!$scope.invCasting;
                  }
                  else if (category =='genLabor'){
                    $scope.genLabor=!$scope.genLabor;
                  }
                  else if (category == 'welding'){
                    $scope.welding =!$scope.welding;
                  }
                  else if (category == 'plating'){
                    $scope.plating =!$scope.plating;
                  }
                  else if (category =='painting'){
                    $scope.painting =!$scope.painting;
                  }
                  else if (category == 'xray'){
                    $scope.xray =!$scope.xray;
                  }
                  else {
                    $scope.material =!$scope.material;
                  }
                };

                $scope.toggleDefaults = function() {
                	$scope.defaults = !$scope.defaults;
		        };

                $scope.addItem = function(vpcCategory, name, value, unit, help) {
                    var objectToAdd = {
                        name: name,
                        value: value,
                        unit: unit,
                        help: help
                    };

                    if ($scope.vpc[vpcCategory]) {
                        var found = false;
                    	for (var i = 0; i < $scope.vpc[vpcCategory].length; i++) {
                            if ($scope.vpc[vpcCategory][i].name === vpcCategory + ' :: ' + name) {
                                found = true;
                            }
                        }
                        if (!found) {
                            $scope.vpc[vpcCategory].push(objectToAdd);
                        }
                    } else {
                    	$scope.vpc[vpcCategory] = [objectToAdd];
                    }

                };

                $scope.deleteFromVPC = function(category, index) {
                    if ($scope.vpc[category]) {
                        $scope.vpc[category].splice(index, 1);
                        $scope.source.productionCapabilities = JSON.stringify(unFormatCategories($scope.vpc));
                    }
                };

                var closeCategories = function() {
                    $scope.machining =false;
                    $scope.casting =false;
                    $scope.invCasting=false;
                    $scope.genLabor = false;
                    $scope.welding=false;
                    $scope.plating=false;
                    $scope.painting=false;
                    $scope.xray=false;
                    $scope.material=false;
                };

                $scope.submit = function(){

                  $scope.source.productionCapabilities = JSON.stringify(unFormatCategories($scope.vpc));
                  console.log($scope.source.productionCapabilities);
                  toastModel.showToast('success', 'VPC submitted, Save organization to complete.');
                  closeCategories();

                };

                $scope.resetVpcToDefault = function() {
                  questionToastModel.show({
                      question: 'Are you sure you want to reset your VPC to default settings?',
                      buttons: {
                          ok: function () {
                            var defaultVPCString = '[{  "name" : "Machining :: Labor Rate",  "value" : 59,  "unit" : "dollars / hour"},{  "name" : "Machining :: Setup Time",  "value" : 5,  "unit" : "minutes"},{  "name" : "Machining :: Program Time",  "value" : 2,  "unit" : "minutes",  "help" : "per cubic inch of removal volume - as a proxy for part complexity"},{  "name" : "Machining :: Run Time",  "value" : 25,  "unit" : "seconds",  "help" : "per cubic inch of removal volume - as a proxy for part complexity"},{  "name" : "Machining :: Inspect Time",  "value" : 5,  "unit" : "seconds",  "help" : "per cubic inch of removal volume - as a proxy for part complexity"},{  "name" : "Casting :: Labor Rate",  "value" : 30,  "unit" : "dollars / hour"},{  "name" : "Casting :: Melting Time",  "value" : 2,  "unit" : "seconds",  "help" : "per cubic inch of material"},{  "name" : "Casting :: Molding Time",  "value" : 90,  "unit" : "seconds",  "help" : "per cubic inch of material, investment casting only"},{  "name" : "Casting :: Holding Time",  "value" : 90,  "unit" : "seconds",  "help" : "per cubic inch of material, non-cored greensand casting only"},{  "name" : "Casting :: Shakeout Time",  "value" : 1,  "unit" : "minute",  "help" : "per part"},{  "name" : "Casting :: Cooling Time",  "value" : 10,  "unit" : "seconds",  "help" : "per cubic inch of material"},{  "name" : "Casting :: Finishing Time",  "value" : 5,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Investment Casting :: Batch Volume",  "value" : 5,  "unit" : "feet**3",  "help" : "to estimate the number of castings performed in a single batch"},{  "name" : "General Labor :: Labor Rate",  "value" : 25,  "unit" : "dollars / hour"},{  "name" : "General Labor :: Bolt Time",  "value" : 30,  "unit" : "seconds"},{  "name" : "General Labor :: Order Time",  "value" : 5,  "unit" : "minutes",  "help" : "time to place a single or bulk order"},{  "name" : "General Labor :: Receive Time",  "value" : 10,  "unit" : "minutes",  "help" : "time to receive a single or bulk order at the facility (unload truck, check manifest, etc.)"},{  "name" : "General Labor :: Unbox Time",  "value" : 15,  "unit" : "minutes",  "help" : "time to unbox a single or bulk order"},{  "name" : "Welding :: Labor Rate",  "value" : 40,  "unit" : "dollars / hour"},{  "name" : "Welding :: Prepare Time",  "value" : 30,  "unit" : "seconds",  "help" : "per inch of weld"},{  "name" : "Welding :: Weld Time",  "value" : 2,  "unit" : "minutes",  "help" : "per inch of weld",  "todo" : "possibly have different weld times for different weld processes"},{  "name" : "Welding :: Visual Inspection Time",  "value" : 2,  "unit" : "seconds",  "help" : "per inch of weld"},{  "name" : "Plating :: Labor Rate",  "value" : 30,  "unit" : "dollars / hour"},{  "name" : "Plating :: Setup Time",  "value" : 5,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Plating :: Stripping Time",  "value" : 30,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Plating :: Blasting Time",  "value" : 20,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Plating :: Plating Time",  "value" : 60,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Plating :: Phosphate Coating :: Preparation Time",  "value" : 15,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Plating :: Phosphate Coating :: Cleaning Time",  "value" : 10,  "unit" : "minutes",  "help" : "per part"},  {  "name" : "Plating :: Phosphate Coating :: Activation Time",  "value" : 20,  "unit" : "minutes",  "help" : "per part"},  {  "name" : "Plating :: Phosphate Coating :: Phosphating Time",  "value" : 60,  "unit" : "minutes",  "help" : "per part"},  {  "name" : "Plating :: Phosphate Coating :: Treatment Time",  "value" : 20,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Labor Rate",  "value" : 30,  "unit" : "dollars / hour"},{  "name" : "Painting :: Washing Time",  "value" : 6,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Painting :: Masking Time",  "value" : 6,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Painting :: Apply Time",  "value" : 3,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Painting :: Curing Time",  "value" : 30,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Drying Time",  "value" : 60,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Inspecting Time",  "value" : 10,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Finishing Time",  "value" : 30,  "unit" : "minutes",  "help" : "per part"},{  "name" : "X-Ray Machine :: Cost",  "value" : 10,  "unit" : "dollars",  "help" : "per usage"},{  "name" : "X-Ray Machine :: Setup Time",  "value" : 10,  "unit" : "minutes",  "help" : "per usage"},{  "name" : "X-Ray Machine :: Scan Time",  "value" : 5,  "unit" : "seconds",  "help" : "per inch of weld"},{  "name" : "Material :: Steel :: Cost",  "value" : 0.5,  "unit" : "dollars / inch**3"},{  "name" : "Material :: Aluminum :: Cost",  "value" : 0.8,  "unit" : "dollars / inch**3"},{  "name" : "Material :: Paint :: Cost",  "value" : 0.2,  "unit" : "dollars / inch**2"},{  "name" : "Material :: Powder :: Cost",  "value" : 0.3,  "unit" : "dollars / inch**2"},{  "name" : "Material :: Weld Filler :: Cost",  "value" : 2,  "unit" : "dollars / inch"}]'
                            $scope.vpc = formatCategories(JSON.parse(defaultVPCString));
                          },
                          cancel: function () {
                          }
                      }
                  }, event);
                  // var defaultVPCString = '[{  "name" : "Machining :: Labor Rate",  "value" : 59,  "unit" : "dollars / hour"},{  "name" : "Machining :: Setup Time",  "value" : 5,  "unit" : "minutes"},{  "name" : "Machining :: Program Time",  "value" : 2,  "unit" : "minutes",  "help" : "per cubic inch of removal volume - as a proxy for part complexity"},{  "name" : "Machining :: Run Time",  "value" : 25,  "unit" : "seconds",  "help" : "per cubic inch of removal volume - as a proxy for part complexity"},{  "name" : "Machining :: Inspect Time",  "value" : 5,  "unit" : "seconds",  "help" : "per cubic inch of removal volume - as a proxy for part complexity"},{  "name" : "Casting :: Labor Rate",  "value" : 30,  "unit" : "dollars / hour"},{  "name" : "Casting :: Melting Time",  "value" : 2,  "unit" : "seconds",  "help" : "per cubic inch of material"},{  "name" : "Casting :: Molding Time",  "value" : 90,  "unit" : "seconds",  "help" : "per cubic inch of material, investment casting only"},{  "name" : "Casting :: Holding Time",  "value" : 90,  "unit" : "seconds",  "help" : "per cubic inch of material, non-cored greensand casting only"},{  "name" : "Casting :: Shakeout Time",  "value" : 1,  "unit" : "minute",  "help" : "per part"},{  "name" : "Casting :: Cooling Time",  "value" : 10,  "unit" : "seconds",  "help" : "per cubic inch of material"},{  "name" : "Casting :: Finishing Time",  "value" : 5,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Investment Casting :: Batch Volume",  "value" : 5,  "unit" : "feet**3",  "help" : "to estimate the number of castings performed in a single batch"},{  "name" : "General Labor :: Labor Rate",  "value" : 25,  "unit" : "dollars / hour"},{  "name" : "General Labor :: Bolt Time",  "value" : 30,  "unit" : "seconds"},{  "name" : "General Labor :: Order Time",  "value" : 5,  "unit" : "minutes",  "help" : "time to place a single or bulk order"},{  "name" : "General Labor :: Receive Time",  "value" : 10,  "unit" : "minutes",  "help" : "time to receive a single or bulk order at the facility (unload truck, check manifest, etc.)"},{  "name" : "General Labor :: Unbox Time",  "value" : 15,  "unit" : "minutes",  "help" : "time to unbox a single or bulk order"},{  "name" : "Welding :: Labor Rate",  "value" : 40,  "unit" : "dollars / hour"},{  "name" : "Welding :: Prepare Time",  "value" : 30,  "unit" : "seconds",  "help" : "per inch of weld"},{  "name" : "Welding :: Weld Time",  "value" : 2,  "unit" : "minutes",  "help" : "per inch of weld",  "todo" : "possibly have different weld times for different weld processes"},{  "name" : "Welding :: Visual Inspection Time",  "value" : 2,  "unit" : "seconds",  "help" : "per inch of weld"},{  "name" : "Plating :: Labor Rate",  "value" : 30,  "unit" : "dollars / hour"},{  "name" : "Plating :: Setup Time",  "value" : 5,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Plating :: Stripping Time",  "value" : 30,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Plating :: Blasting Time",  "value" : 20,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Plating :: Plating Time",  "value" : 60,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Plating :: Phosphate Coating :: Preparation Time",  "value" : 15,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Plating :: Phosphate Coating :: Cleaning Time",  "value" : 10,  "unit" : "minutes",  "help" : "per part"},  {  "name" : "Plating :: Phosphate Coating :: Activation Time",  "value" : 20,  "unit" : "minutes",  "help" : "per part"},  {  "name" : "Plating :: Phosphate Coating :: Phosphating Time",  "value" : 60,  "unit" : "minutes",  "help" : "per part"},  {  "name" : "Plating :: Phosphate Coating :: Treatment Time",  "value" : 20,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Labor Rate",  "value" : 30,  "unit" : "dollars / hour"},{  "name" : "Painting :: Washing Time",  "value" : 6,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Painting :: Masking Time",  "value" : 6,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Painting :: Apply Time",  "value" : 3,  "unit" : "seconds",  "help" : "per square inch of surface area"},{  "name" : "Painting :: Curing Time",  "value" : 30,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Drying Time",  "value" : 60,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Inspecting Time",  "value" : 10,  "unit" : "minutes",  "help" : "per part"},{  "name" : "Painting :: Finishing Time",  "value" : 30,  "unit" : "minutes",  "help" : "per part"},{  "name" : "X-Ray Machine :: Cost",  "value" : 10,  "unit" : "dollars",  "help" : "per usage"},{  "name" : "X-Ray Machine :: Setup Time",  "value" : 10,  "unit" : "minutes",  "help" : "per usage"},{  "name" : "X-Ray Machine :: Scan Time",  "value" : 5,  "unit" : "seconds",  "help" : "per inch of weld"},{  "name" : "Material :: Steel :: Cost",  "value" : 0.5,  "unit" : "dollars / inch**3"},{  "name" : "Material :: Aluminum :: Cost",  "value" : 0.8,  "unit" : "dollars / inch**3"},{  "name" : "Material :: Paint :: Cost",  "value" : 0.2,  "unit" : "dollars / inch**2"},{  "name" : "Material :: Powder :: Cost",  "value" : 0.3,  "unit" : "dollars / inch**2"},{  "name" : "Material :: Weld Filler :: Cost",  "value" : 2,  "unit" : "dollars / inch"}]'
                  // $scope.vpc = formatCategories(JSON.parse(defaultVPCString));
                };
            }
        };
    }]);
