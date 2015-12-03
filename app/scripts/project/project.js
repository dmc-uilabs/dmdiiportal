'use strict';

angular.module('dmc')
    .directive('inputsOutputs', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/rfp-invite/inputs-outputs-tpl.html',
            scope : {
                serviceName: '=',
                totalInputs: '=',
                totalOutputs: '='
            },
            controller: function ($scope) {
                $scope.inputs = new Array($scope.totalInputs);
                $scope.outputs = new Array($scope.totalOutputs);
            }
        }
    })
    .controller('DMCPreviewProjectController', ['$scope','$stateParams', 'projectData', function ($scope, $stateParams, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $scope.isPreview = true;
    }])
    .controller('DMCBlankSubmissionProjectController', ['$scope','$stateParams', 'projectData', function ($scope, $stateParams, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $scope.isSubmission = true;
        $scope.isBlankSubmission = true;
    }])
    .controller('DMCSubmissionProjectController', ['$scope','$stateParams', 'projectData', function ($scope, $stateParams, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $scope.isSubmission = true;
    }])
    .directive('submissionInputsOutputs', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/project/inputs-outputs-tpl.html',
            scope : {
                submissionName: '=',
                totalInputs: '=',
                submissionLetter: '='
            },
            controller: function ($scope) {
                $scope.inputs = new Array($scope.totalInputs);
            }
        }
    })
    .controller('DMCRfpBlankHomeProjectController', ['$scope','$stateParams', 'projectData','ajax','dataFactory','$compile', function ($scope, $stateParams, projectData,ajax,dataFactory,$compile) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;
    }])
    .controller('DMCRfpHomeProjectController', ['$scope','$stateParams', 'projectData','ajax','dataFactory','$compile', function ($scope, $stateParams, projectData,ajax,dataFactory,$compile) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;
    }])
    .controller('DMCSubmittedProjectController', ['$cookies','$scope','$stateParams','projectData', function ($cookies,$scope, $stateParams,projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $scope.submittedItems = $cookies.getObject('submittedItems');
        $scope.inputs = ($scope.submittedItems && $scope.submittedItems.service ? new Array($scope.submittedItems.service.specificationsData.input) : []);
        $scope.outputs = ($scope.submittedItems && $scope.submittedItems.service ? new Array($scope.submittedItems.service.specificationsData.output) : []);
    }])
    .controller('DMCSubmitProjectController', ['$location','$cookies','$scope','$stateParams', 'projectData','ajax','dataFactory','$compile', function ($location,$cookies,$scope, $stateParams, projectData,ajax,dataFactory,$compile) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;
        $scope.services = [];
        var sort = 'status';
        var order = 'DESC';
        $scope.latter = 'We propose to develop and deliver a low heat loss Transformer based on our novel material. It will meet all of the environmental and Compliance requirements in your specification. The attached document summarizes Performance relative to an iron core transformer. Please let us know how you would like to proceed.';
        $scope.submitProject = function(){
            var selectedService = null;
            for(var i in $scope.services) {
                if($scope.services[i].select){
                    selectedService = $scope.services[i];
                    break;
                }
            }
            if(selectedService && $scope.latter.trim().length > 0) {
                var submittedItems = {
                    service : selectedService,
                    latter : $scope.latter
                };
                $cookies.putObject('submittedItems', submittedItems);
                $location.path('/project/'+projectCtrl.currentProjectId+'/submitted');
            }
        };
        var getServices = function() {
            $scope.services = [
                {
                    "id": 1,
                    "title": 'Run #1',
                    "releaseDate": "01-04-2015",
                    "currentStatus": {
                      "percentCompleted": "33"
                    },
                    "specificationsData": {
                        "serviceId": 25,
                        "description": "Estimates Mu for materials with simple structures and known saturation polarization",
                        "input": 2,
                        "output": 1,
                        "usageStats": {
                          "added": 130,
                          "members": 20
                        },
                        "runStats": {
                          "success": 108,
                          "fail": 12
                        }
                      }
                },
                {
                    "id": 2,
                    "title": 'Run #2',
                    "releaseDate": "10-04-2015",
                    "currentStatus": {
                      "percentCompleted": "66"
                    },
                    "specificationsData": {
                        "serviceId": 25,
                        "description": "Estimates Mu for materials with simple structures and known saturation polarization",
                        "input": 2,
                        "output": 1,
                        "usageStats": {
                          "added": 130,
                          "members": 20
                        },
                        "runStats": {
                          "success": 108,
                          "fail": 12
                        }
                      }
                },
                {
                    "id": 3,
                    "title": 'Run #3',
                    "releaseDate": "12-04-2015",
                    "currentStatus": {
                      "percentCompleted": "78"
                    },
                    "specificationsData": {
                        "serviceId": 25,
                        "description": "Estimates Mu for materials with simple structures and known saturation polarization",
                        "input": 2,
                        "output": 1,
                        "usageStats": {
                          "added": 130,
                          "members": 20
                        },
                        "runStats": {
                          "success": 108,
                          "fail": 12
                        }
                      }
                },
                {
                    "id": 4,
                    "title": 'Run #4',
                    "releaseDate": "06-05-2015",
                    "currentStatus": {
                      "percentCompleted": "77"
                    },
                    "specificationsData": {
                        "serviceId": 25,
                        "description": "Estimates Mu for materials with simple structures and known saturation polarization",
                        "input": 2,
                        "output": 1,
                        "usageStats": {
                          "added": 130,
                          "members": 20
                        },
                        "runStats": {
                          "success": 108,
                          "fail": 12
                        }
                      }
                },
                {
                    "id": 5,
                    "title": 'Run #5',
                    "releaseDate": "08-05-2015",
                    "currentStatus": {
                      "percentCompleted": "65"
                    },
                    "specificationsData": {
                        "serviceId": 25,
                        "description": "Estimates Mu for materials with simple structures and known saturation polarization",
                        "input": 2,
                        "output": 1,
                        "usageStats": {
                          "added": 130,
                          "members": 20
                        },
                        "runStats": {
                          "success": 108,
                          "fail": 12
                        }
                      }
                },
                {
                    "id": 6,
                    "title": 'Run #6',
                    "releaseDate": "10-05-2015",
                    "currentStatus": {
                      "percentCompleted": "43"
                    },
                    "specificationsData": {
                        "serviceId": 25,
                        "description": "Estimates Mu for materials with simple structures and known saturation polarization",
                        "input": 2,
                        "output": 1,
                        "usageStats": {
                          "added": 130,
                          "members": 20
                        },
                        "runStats": {
                          "success": 108,
                          "fail": 12
                        }
                      }
                }
            ]
        };
        getServices();

        $(".submitServices").on("click",".table-line",function(ev){
            var tr = $(this);
            var item = null;
            var id = parseInt($(this).find(".idItem").val());
            for(var i in $scope.services){
                if($scope.services[i].id == id){
                    $scope.services[i].select = true;
                    item = $scope.services[i];
                    break;
                }
            }
            for(var i in $scope.services){
                if($scope.services[i].select && $scope.services[i].id !== item.id) $scope.services[i].select = false;
            }
            tr.parents(".tableServices").find(".opened").removeClass('opened');
            $("#inputs-outputs").remove();
            $scope.isSelect = false;
            if(item.select) {
                $scope.isSelect = true;
                tr.addClass('opened');
                $($compile('<tr id="inputs-outputs" inputs-outputs total-outputs="'+item.specificationsData.output+'" total-inputs="'+item.specificationsData.input+'" service-name="\'' + item.title + '\'"></tr>')($scope)).insertAfter(tr);
            }
        });

        $scope.isSelect = false;
        $scope.selectModel = function(ev,item,select){
            for(var i in $scope.services){
                if($scope.services[i].select && $scope.services[i].id !== item.id) $scope.services[i].select = false;
            }
            $(ev.target).parents(".tableServices").find(".opened").removeClass('opened');
            $("#inputs-outputs").remove();
            $scope.isSelect = false;
            if(!select) {
                $scope.isSelect = true;
                var tr = $(ev.target).parents(".table-line");
                tr.addClass('opened');
                $($compile('<tr id="inputs-outputs" inputs-outputs total-outputs="'+item.specificationsData.output+'" total-inputs="'+item.specificationsData.input+'" service-name="\'' + item.title + '\'"></tr>')($scope)).insertAfter(tr);
            }
        };
        $scope.onOrderChange = function(){

        };
    }])
