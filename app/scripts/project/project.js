'use strict';

angular.module('dmc.project', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ngMaterial',
    'ngMessages',
    'ngMask',
    'dmc.ajax',
    'dmc.data',
    'ngtimeago',
    'dmc.model.dome',
    'dmc.widgets.services',
    'dmc.widgets.tasks',
    'dmc.add_project',
    'dmc.widgets.discussions',
    'dmc.widgets.documents',
    'dmc.widgets.components',
    'dmc.widgets.questions',
    'dmc.widgets.submissions',
    'dmc.widgets.invited-users',
    'dmc.widgets.stars',
    'dmc.widgets.review',
    'dmc.widgets.tabs',
    'dmc.compose-discussion',
    'dmc.widgets.interfaces',
    'dmc.component.productcard',
    'dmc.model.question-toast-model',
    'dmc.add_project.directive',
    'ui.router',
    'md.data.table',
    'ngCookies',
    'dmc.common.header',
    'dmc.model.previous-page',
    'dmc.common.footer',
    'dmc.model.project',
    'ui.autocomplete',
    'ui.sortable',
    'dmc.model.toast-model',
    'dmc.model.services',
    'dmc.widgets.project-tags',
    'dmc.sub-nav-menu'
])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider){

        var resolve = {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        };
        $stateProvider.state('project', {
            url: '/:projectId',
            controller: 'IdLocatorCtrl',
            template: '<ui-view />',
            resolve: resolve
        }).state('preview', {
            url: '/preview/:projectId',
            templateUrl: 'templates/project/pages/home.html',
            controller: 'DMCPreviewProjectController as projectCtrl',
            resolve: resolve
        }).state('blank_submission', {
            url: '/submission/blank/:projectId',
            templateUrl: 'templates/project/blank-submission.html',
            controller: 'DMCBlankSubmissionProjectController as projectCtrl',
            resolve: resolve
        }).state('submission', {
            url: '/submission/:projectId',
            templateUrl: 'templates/project/pages/home.html',
            controller: 'DMCSubmissionProjectController as projectCtrl',
            resolve: resolve
        }).state('submissions', {
            url: '/submissions/:projectId',
            templateUrl: 'templates/project/submissions.html',
            controller: 'DMCSubmissionsProjectController as projectCtrl',
            resolve: resolve
        }).state('project_rfp_blank', {
            url: '/rfp/blank/:projectId',
            templateUrl: 'templates/project/rfp-home-blank.html',
            controller: 'DMCRfpBlankHomeProjectController as projectCtrl',
            resolve: resolve
        }).state('project_rfp', {
            url: '/rfp/:projectId',
            templateUrl: 'templates/project/rfp-home.html',
            controller: 'DMCRfpHomeProjectController as projectCtrl',
            resolve: resolve
        }).state('submit', {
            url: '/submit/:projectId',
            templateUrl: 'templates/project/submit.html',
            controller: 'DMCSubmitProjectController as projectCtrl',
            resolve: resolve
        }).state('submitted', {
            url: '/submitted/:projectId',
            templateUrl: 'templates/project/submitted.html',
            controller: 'DMCSubmittedProjectController as projectCtrl',
            resolve: resolve
        }).state('project.home', {
            url: '/home',
            controller: 'HomeCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/home.html',
            resolve: resolve
        }).state('project.workspace', {
            url: '/workspace',
            controller: 'WorkspaceCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/workspace.html'
        }).state('project.edit', {
            url: '/edit',
            controller: 'EditProjectCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/edit.html',
            resolve: resolve
        }).state('project.documents', {
            url: '/documents',
            controller: 'DocumentsCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/documents.html'
        }).state('project.documents-upload', {
            url: '/documents/upload',
            controller: 'DocumentsUploadCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/documents-upload.html'
        }).state('project.tasks', {
            url: '/tasks?text?type',
            controller: 'TasksCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/tasks.html'
        }).state('project.task', {
            url: '/task/:taskId',
            controller: 'TaskCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/task.html'
        }).state('project.add-task', {
            url: '/add-task',
            controller: 'AddTaskCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/add-task.html'
        }).state('project.team', {
            url: '/team?text?type',
            controller: 'TeamCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/team.html'
        }).state('project.discussions', {
            url: '/discussions?text?type',
            controller: 'DiscussionsCtrl as projectCtrl',
            templateUrl: 'templates/project/pages/discussions.html'
        }).state('project.rfp-home', {
            url: '/rfp-home',
            controller: 'RfpHomeCtrl as projectCtrl',
            templateUrl: 'templates/project/rfp/home.html'
        }).state('project.rfp-submissions', {
            url: '/rfp-submissions',
            controller: 'RfpSubmissionsCtrl as projectCtrl',
            templateUrl: 'templates/project/rfp/submissions.html'
        }).state('project.rfp-documents', {
            url: '/rfp-documents',
            controller: 'RfpDocumentsCtrl as projectCtrl',
            templateUrl: 'templates/project/rfp/documents.html'
        }).state('project.rfp-questions', {
            url: '/rfp-questions',
            controller: 'RfpQuestionsCtrl as projectCtrl',
            templateUrl: 'templates/project/rfp/questions.html'
        }).state('project.rfp-people-invited', {
            url: '/rfp-people-invited',
            controller: 'RfpPeopleInvitedCtrl as projectCtrl',
            templateUrl: 'templates/project/rfp/people-invited.html'
        })

            .state('project.services', {
                url: '/services',
                controller: 'projectServicesCtrl as projectCtrl',
                templateUrl: 'templates/project/pages/services.html',
                resolve: {
                    serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_project_services($stateParams.projectId);
                    }]
                }
            }).state('project.upload-services', {
                url: '/upload-service',
                controller: 'projectUploadServicesCtrl as projectCtrl',
                templateUrl: 'templates/project/pages/upload-service.html'

            }).state('project.edit-services', {
                url: '/services/:ServiceId/edit',
                controller: 'projectEditServicesCtrl as projectCtrl',
                templateUrl: 'templates/project/pages/upload-service.html',
                resolve:{
                    serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_service($stateParams.ServiceId);
                    }]
                }
            }).state('project.run-services', {
                url: '/services/:ServiceId/run?rerun',
                controller: 'projectRunServicesCtrl as projectCtrl',
                templateUrl: 'templates/project/pages/run-service.html',
                resolve: {
                    serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_service($stateParams.ServiceId);
                    }]
                }
            }).state('project.services-detail', {
                url: '/services/:ServiceId/detail',
                controller: 'projectServicesDetailCtrl as projectCtrl',
                templateUrl: 'templates/project/pages/services-detail.html',
                resolve: {
                    serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_service($stateParams.ServiceId);
                    }]
                }
            }).state('project.services-run-history', {
                url: '/services/:ServiceId/:from/run-history',
                controller: 'projectServicesRunHistoryDetailCtrl as projectCtrl',
                templateUrl: 'templates/project/pages/run-history.html',
                resolve: {
                    runHistory: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_service_run_history($stateParams.ServiceId);
                    }],
                    serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_service($stateParams.ServiceId);
                    }]
                }
            })

            .state('project.publish-service-marketplace', {
                url: '/services/:ServiceId/publish',
                controller: 'PublishServiceMarketplaceCtrl as projectCtrl',
                templateUrl: 'templates/project/pages/publish-service-marketplace.html',
                resolve: {
                    serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                        return serviceModel.get_service($stateParams.ServiceId);
                    }]
                }
            });
        $urlRouterProvider.otherwise('/1');
    })
    .controller('DMCPreviewProjectController', ['$scope','$stateParams', 'DMCUserModel', 'projectData', 'ajax', 'dataFactory', '$timeout', 'toastModel', '$cookieStore',
        function ($scope, $stateParams, DMCUserModel, projectData, ajax, dataFactory, $timeout, toastModel, $cookieStore) {
            var projectCtrl = this;
            if (projectData.type){
                projectData.type = projectData.type[0].toUpperCase() + projectData.type.slice(1);
            }
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;
            $scope.isPreview = true;
            $scope.invitation = null;
            $scope.userData = DMCUserModel.getUserData();
            $scope.userData.then(function(res){
                $scope.userData = res;
                getInvitation();
            });
            function getInvitation(){
                ajax.get(dataFactory.getMembersToProject(),
                    {
                        "projectId" : $stateParams.projectId,
                        "profileId" : $scope.userData.profileId,
                        "accept" : false
                    },
                    function(response){
                        if(response.data && response.data.length > 0) $scope.invitation = response.data[0];
                        console.log($scope.invitation);
                    }
                );
            }

            $scope.accept = function(){
                ajax.update(dataFactory.acceptProject($stateParams.projectId, $scope.invitation.id), {accept : true},
                    function(response){
                        toastModel.showToast("success", "Invited to "+projectData.type+" Project by " + $scope.invitation.from);
                        document.location.href = "project.php#/"+$stateParams.projectId+"/home";
                    }
                );
            };

            $scope.decline = function(){
                ajax.delete(dataFactory.declineProject($stateParams.projectId, $scope.invitation.id), {},
                    function(response){
                        //toastModel.showToast("success", "You have declined the invitation from " + $scope.invitation.from);
                        $cookieStore.put("toast", "You have declined the invitation from " + $scope.invitation.from);
                        document.location.href = "dashboard.php#/";
                    }
                );
            };
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
                $location.url('/submitted/'+projectCtrl.currentProjectId);
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
    .service('serviceModel', [
        'ajax',
        'dataFactory',
        '$stateParams',
        '$state',
        '$http',
        'DMCUserModel',
        '$rootScope',
        '$q',
        'domeModel',
        'toastModel',
        function (ajax,
                  dataFactory,
                  $stateParams,
                  $state,
                  $http,
                  DMCUserModel,
                  $rootScope,
                  $q,
                  domeModel,
                  toastModel) {
            this.get_service = function(id){
                var promises = {
                    "service": $http.get(dataFactory.services(id).get),
                    "specifications": $http.get(dataFactory.services(id).get_specifications),
                    "service_authors": $http.get(dataFactory.services(id).get_authors),
                    "service_input_output": $http.get(dataFactory.services(id).get_inputs_outputs),
                    "position_inputs": $http.get(dataFactory.services(id).get_position_inputs),
                    "service_tags": $http.get(dataFactory.services(id).get_tags),
                    "services_statistic": $http.get(dataFactory.services(id).get_statistics),
                    "service_reviews": $http.get(dataFactory.services(id).reviews),
                    "service_images": $http.get(dataFactory.services(id).get_images),
                    "interface": $http.get(dataFactory.services(id).get_interface),
                    "currentStatus": $http({method : "GET", url : dataFactory.getServiceStatus(id), params : {
                        _limit : 1,
                        _order : "DESC",
                        _sort : "id",
                        status : 1,
                        accountId : DMCUserModel.getUserData().accountId
                    }}),
                    "lastStatus": $http({method : "GET", url : dataFactory.getServiceStatus(id), params : {
                        _limit : 1,
                        _order : "DESC",
                        _sort : "id",
                        status_ne : 1
                    }})
                };

                var extractData = function(response){
                    return response.data ? response.data : response;
                };

                return $q.all(promises).then(function(responses){
                        var service = extractData(responses.service);
                        service.interface = (responses.interface.data && responses.interface.data.length > 0 ? responses.interface.data[0] : null);
                        if(service.interface){
                            domeModel.getModel(service.interface,function(response){
                                service.interfaceModel = response.data.pkg;
                            });
                        }
                        service.currentStatus = (responses.currentStatus.data && responses.currentStatus.data.length > 0 ? responses.currentStatus.data[0] : null);
                        service.lastStatus = (responses.lastStatus.data && responses.lastStatus.data.length > 0 ? responses.lastStatus.data[0] : null);
                        service.specifications = extractData(responses.specifications);
                        service.specifications = service.specifications.length > 0 ? service.specifications[0] : null;
                        service.service_authors = extractData(responses.service_authors);
                        service.service_input_output = extractData(responses.service_input_output);
                        service.position_inputs = (responses.position_inputs.data && responses.position_inputs.data.length > 0 ? responses.position_inputs.data[0] : null);
                        service.service_tags = extractData(responses.service_tags);
                        service.services_statistic = extractData(responses.services_statistic);
                        service.service_reviews = extractData(responses.service_reviews);
                        service.service_images = extractData(responses.service_images);
                        service.rating = service.service_reviews.map(function(value, index){
                            return value.rating;
                        });
                        service.number_of_comments = service.service_reviews.length;

                        for(var i in service.service_reviews){
                            service.service_reviews[i].date = moment(service.service_reviews[i].date).format("MM/DD/YYYY hh:mm A")
                        }

                        if(service.number_of_comments != 0) {
                            service.precentage_stars = [0, 0, 0, 0, 0];
                            service.average_rating = 0;
                            for (var i in service.rating) {
                                service.precentage_stars[service.rating[i] - 1] += 100 / service.number_of_comments;
                                service.average_rating += service.rating[i];
                            }
                            service.average_rating = (service.average_rating / service.number_of_comments).toFixed(1);

                            for (var i in service.precentage_stars) {
                                service.precentage_stars[i] = Math.round(service.precentage_stars[i]);
                            }
                        }
                        for(var i in service.service_reviews){
                            service.service_reviews[i].replyReviews = [];
                        }
                        return service;
                    },
                    function(response){
                        toastModel.showToast("error", "Error." + response.statusText);
                    }
                );
            };

            this.get_project_services = function(projectId){
                return ajax.get(dataFactory.services(projectId).get_for_project, {},
                    function(response){
                        return response.data;
                    }
                )
            };

            this.get_all_service = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.ServiceId).all, params,
                    function(response){
                        callback(response.data);
                    }
                )
            };

            this.upload_services = function(params, tags, service_interface){
                ajax.create(dataFactory.services($stateParams.ServiceId).add,
                    {
                        "title": params.title,
                        "description": params.description,
                        "owner": $rootScope.userData.displayName,
                        "accountId": $rootScope.userData.accountId,
                        "releaseDate": moment(new Date).format("MM/DD/YYYY"),
                        "serviceType": params.serviceType,
                        "specifications": "/services/3/specifications",
                        "featureImage": {
                            "thumbnail": "images/marketplace-card-image-1.jpg",
                            "large": "images/marketplace-card-image-1.jpg"
                        },
                        "averageRun" : 0,
                        "interface" : params.interface,
                        "currentStatus" : {
                            "project" : {
                                "id" : params.pojectId,
                                "name" : params.pojectTitle
                            }
                        },
                        "serverIp" : params.serverIp,
                        "parent_component": params.parent,
                        "projectId": params.pojectId,
                        "type" : "service",
                        "published" : false,
                        "from": params.from
                    },
                    function(response){
                        var id = response.data.id;
                        var promises = {};
                        if(tags && tags.length > 0) {
                            for (var i in tags) {
                                promises["tag"+i] = $http.post(dataFactory.services(id).add_tags, {
                                    "serviceId": id, "name": tags[i]
                                });
                            }
                        }
                        service_interface.serviceId = id;
                        promises["service_interface"] = $http.post(dataFactory.services().add_interface, service_interface);
                        $q.all(promises).then(
                            function(responses){
                                $state.go('project.services-detail', {ServiceId: id});
                            },
                            function(response){
                                toastModel.showToast("error", "Error." + response.statusText);
                            }
                        );
                    }
                );
            };


            this.get_service_reviews = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.ServiceId).reviews,
                    params,
                    function(response){
                        callback(response.data)
                    }
                )
            };

            this.add_service_reviews = function(params, callback){
                params["id"] = lastId;
                params["productId"] = $stateParams.ServiceId;
                params["productType"] = "service";
                params["reply"] = false;
                params["reviewId"] = 0;
                params["status"] = true;
                params["date"] = moment().format('MM/DD/YYYY');
                params["userRatingReview"] = {
                    "DMC Member": "none"
                };
                params["like"] = 0;
                params["dislike"] = 0;

                return ajax.create(dataFactory.services($stateParams.ServiceId).addReviews,
                    params,
                    function(response){
                        toastModel.showToast("success", "Review added");
                        if(callback) callback(response.data)
                    },
                    function(response){
                        toastModel.showToast("error", "Error." + response.statusText);
                    }
                )
            };

            this.edit_service = function(params, removedTags, newTags, service_interface,interfaceId){
                ajax.get(dataFactory.services($stateParams.ServiceId).get, {},
                    function(response){
                        if(response.data && response.data.id) {
                            var component = response.data;
                            component['title'] = params['title'];
                            component['parent'] = params['parent'];
                            component['description'] = params['description'];
                            component['serviceType'] = params['serviceType'];

                            return ajax.update(dataFactory.services($stateParams.ServiceId).update,
                                component,
                                function () {
                                    var id = $stateParams.ServiceId;
                                    var promises = {};
                                    // add new tags
                                    if(newTags && newTags.length > 0) {
                                        for (var i in newTags) {
                                            promises["tag"+i] = $http.post(dataFactory.services(id).add_tags, {
                                                "serviceId": id, "name": newTags[i]
                                            });
                                        }
                                    }
                                    // delete all removed tags
                                    if(removedTags && removedTags.length > 0) {
                                        for (var i in removedTags) {
                                            promises["removedTag"+i] = $http.post(dataFactory.services(removedTags[i]).remove_tags)
                                        }
                                    }

                                    if(!interfaceId) {
                                        service_interface.serviceId = id;
                                        promises["add_service_interface"] = $http.post(dataFactory.services().add_interface, service_interface);
                                    }else{
                                        promises["update_service_interface"] = $http.patch(dataFactory.services(interfaceId).update_interface, service_interface);
                                    }
                                    $q.all(promises).then(
                                        function(responses){
                                            $state.go('project.services-detail', {ServiceId: id});
                                        },
                                        function(response){
                                            toastModel.showToast("error", "Error." + response.statusText);
                                        }
                                    );
                                },
                                function (response) {
                                    toastModel.showToast("error", "Error." + response.statusText);
                                }
                            )
                        }
                    }
                )
            };

            this.add_services_authors = function(array){
                ajax.get(dataFactory.services($stateParams.ServiceId).get_authors,
                    {
                        "_limit" : 1,
                        "_order" : "DESC",
                        "_sort" : "id"
                    },
                    function(response){
                        var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
                        for(var i in array){
                            ajax.create(dataFactory.services($stateParams.ServiceId).add_authors,
                                {
                                    "id": lastId,
                                    "includeTo": $stateParams.ServiceId,
                                    "serviceId": array[i]
                                },
                                function(response){
                                },
                                function(response){
                                    toastModel.showToast("error", "Error." + response.statusText);
                                }
                            )
                            lastId++;
                        }
                    }
                )
            };

            this.remove_services_authors = function(array){
                for(var i in array){
                    ajax.delete(dataFactory.services(array[i]).remove_authors, {},
                        function(response){}
                    )
                }
            };

            this.save_service_interface = function(interFace) {
                ajax.create(dataFactory.services().add_interface, interFace);
            };

            this.get_interface = function(id,callback){
                return ajax.get(dataFactory.services(id).get_interface, {},callback);
            };

            this.update_service_interface = function(id,data){
                return ajax.update(dataFactory.services(id).update_interface, data);
            };

            this.add_services_tags = function(array, id){
                for(var i in array){
                    ajax.create(dataFactory.services((id)? id : $stateParams.ServiceId).add_tags,
                        {
                            "serviceId": (id)? id : $stateParams.ServiceId,
                            "name": array[i]
                        },
                        function(response){}
                    );
                }
            };

            this.remove_services_tags = function(array){
                for(var i in array){
                    ajax.delete(dataFactory.services(array[i]).remove_tags, {},
                        function(response){}
                    )
                }
            };

            this.get_service_hystory = function(params, callback){
                return ajax.get(dataFactory.services($stateParams.ServiceId).get_history,
                    params,
                    function(response){
                        callback(response.data)
                    }
                )
            };

            function calcRunTime(status){
                var runTime = (status.stopTime ? new Date(status.stopDate+' '+status.stopTime) - new Date(status.startDate+' '+status.startTime) : new Date() - new Date(status.startDate+' '+status.startTime));
                return (runTime/1000).toFixed(2);
            };

            this.get_service_run_history = function(id, params, callback){
                return ajax.get(dataFactory.services(id).get_run_history,
                    (params)? params : {
                        _sort: 'id',
                        _order: "DESC",
                        status_ne : 'running'
                    },
                    function(response){
                        var history = response.data;
                        for(var i in history){
                            history[i].runTime = calcRunTime(history[i]);
                            history[i].date = moment(new Date(history[i].startDate+' '+history[i].startTime)).format("MM/DD/YYYY hh:mm A");
                        }
                        if(callback){
                            callback(history);
                        }else{
                            return history;
                        }
                    }
                )
            };



            this.get_servers = function(callback){
                return ajax.get(dataFactory.getAccountServersUrl($rootScope.userData.accountId),
                    {},
                    function(response){
                        callback(response.data)
                    }
                )
            };

            this.add_servers = function(params,callback){
                return ajax.create(dataFactory.serverURL().create,
                    params,
                    function(response){
                        callback(response.data)
                    }
                )
            };

        }
    ]
).run(['$state', '$rootScope', function($state, $rootScope) {
        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
    }]);
