'use strict';

angular.module('dmc.project', [
        'dmc.configs.ngmaterial',
        'ngMdIcons',
        'dmc.ajax',
        'dmc.data',
        'ngtimeago',
        'dmc.widgets.services',
        'dmc.widgets.tasks',
        'dmc.widgets.discussions',
        'dmc.widgets.documents',
        'dmc.widgets.components',
        'dmc.widgets.questions',
        'dmc.widgets.submissions',
        'dmc.widgets.invited-users',
        'ui.router',
        'md.data.table',
        'ngCookies',
        'dmc.common.header',
        'dmc.common.footer',
        'dmc.model.project',
        'ui.autocomplete'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('project', {
        url: '/:projectId',
        templateUrl: 'templates/project/project.html',
        controller: 'DMCProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                return DMCProjectModel.getModel($stateParams.projectId);
            }]
        }
    }).state('preview', {
        url: '/preview/:projectId',
        templateUrl: 'templates/project/project.html',
        controller: 'DMCPreviewProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('blank_submission', {
        url: '/submission/blank/:projectId',
        templateUrl: 'templates/project/blank-submission.html',
        controller: 'DMCBlankSubmissionProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('submission', {
        url: '/submission/:projectId',
        templateUrl: 'templates/project/project.html',
        controller: 'DMCSubmissionProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('submissions', {
        url: '/submissions/:projectId',
        templateUrl: 'templates/project/submissions.html',
        controller: 'DMCSubmissionsProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('project_rfp_blank', {
        url: '/rfp/blank/:projectId',
        templateUrl: 'templates/project/rfp-home-blank.html',
        controller: 'DMCRfpBlankHomeProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('project_rfp', {
        url: '/rfp/:projectId',
        templateUrl: 'templates/project/rfp-home.html',
        controller: 'DMCRfpHomeProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('submit', {
        url: '/submit/:projectId',
        templateUrl: 'templates/project/submit.html',
        controller: 'DMCSubmitProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('submitted', {
        url: '/submitted/:projectId',
        templateUrl: 'templates/project/submitted.html',
        controller: 'DMCSubmittedProjectController as projectCtrl',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('project.home', {
        url: '/home',
        controller: 'HomeCtrl as vm',
        templateUrl: 'templates/project/home.html'
    })
        .state('project.workspace', {
            url: '/workspace',
            controller: 'WorkspaceCtrl',
            template: 'workspace'
        })
        .state('project.documents', {
            url: '/documents',
            controller: 'DocumentsCtrl',
            template: 'documents'
        })
        .state('project.tasks', {
            url: '/tasks',
            controller: 'TasksCtrl',
            template: 'tasks'
        })
        .state('project.team', {
            url: '/team',
            controller: 'TeamCtrl',
            template: 'team'
        })
        .state('project.discussions', {
            url: '/discussions',
            controlelr: 'DiscussionsCtrl',
            template: 'discussions'
        });
    $urlRouterProvider.otherwise('/1');
})
    .controller('DMCProjectController', ['$stateParams', 'projectData', function ($stateParams, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;
    }])
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
    .controller('DMCSubmissionsProjectController', ['$compile','$scope','$stateParams', 'projectData', function ($compile,$scope, $stateParams, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $scope.compare = [];
        $scope.submissions = [{
            id : 1,
            title : "SAM",
            date : moment(new Date("15 Sep 2015 15:12:48")).format("MM/DD/YY HH:mm:ss A"),
            success : 97,
            inputs : 2,
            select : false,
            letter: "We propose to develop and deliver a low heat loss Transformer based on our novel material. It will meet all of the environmental and Compliance requirements in your specification. The attached document summarizes Performance relative to an iron core transformer. Please let us know how you would like to proceed."
        },{
            id : 2,
            title : "WYIV Co.",
            date : moment(new Date("11 Sep 2015 10:16:11")).format("MM/DD/YY HH:mm:ss A"),
            success : 91,
            inputs : 2,
            select : false,
            letter: "Lorem ipsum dolor sit amet."
        },{
            id : 3,
            title : "RCJ Co.",
            date : moment(new Date("12 Sep 2015 06:55:33")).format("MM/DD/YY HH:mm:ss A"),
            success : 90,
            inputs : 1,
            select : false,
            letter: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
        }];

        $(".tableSubmissions").on("click",".table-line",function(){
            var item = null;
            var id = parseInt($(this).find(".idSubmission").val());
            for(var i in $scope.submissions){
                if($scope.submissions[i].id === id){
                    item = $scope.submissions[i];
                    break;
                }
            }
            $("#inputs-outputs").remove();
            if($(this).hasClass("opened")){
                $(".opened").removeClass("opened");
            }else{
                $(".opened").removeClass("opened");
                $(this).addClass("opened");
                var id = parseInt($(this).find(".idSubmission").val());
                $($compile('<tr id="inputs-outputs" submission-inputs-outputs submission-letter="\'' + item.letter + '\'" total-inputs="'+item.inputs+'" submission-name="\'' + item.title + '\'"></tr>')($scope)).insertAfter($(this));
            }
        });

        $scope.compareSubmission = function(ev,item){
            if(item.select) {
                for(var i in $scope.compare){
                    if($scope.compare[i].id == item.id){
                        $scope.compare.splice(i,1);
                        break;
                    }
                }
            }else{
                $scope.compare.push(item);
            }
        };
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
                $location.url('/submitted/'+projectCtrl.currentProjectId);
            }
        };

        // var getServices = function(){
        //     ajax.on(dataFactory.getUrlAllServices(projectCtrl.currentProjectId),{
        //         projectId : projectCtrl.currentProjectId,
        //         sort : sort,
        //         order : order,
        //         limit : 5,
        //         offset : 0
        //     },function(data){
        //         $scope.services = data.result;
        //         if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        //     },function(){
        //         alert("Ajax faild: getServices");
        //     });
        // };
        var getServices = function() {
            $scope.services = [
                {
                    "id": 1,
                    "title": 'Run #1',
                    "releaseDate": "01-04-2015",
                    "currentStatus": {
                      "percentCompleted": "33",
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
                      "percentCompleted": "66",
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
                      "percentCompleted": "78",
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
                      "percentCompleted": "77",
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
                      "percentCompleted": "65",
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
                      "percentCompleted": "43",
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
        }
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
    }]).directive('inputsOutputs', function () {
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
    });