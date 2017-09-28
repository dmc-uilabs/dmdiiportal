'use strict';

angular.module('dmc.resource-profile', [
        'dmc.configs.ngmaterial',
        'ngMdIcons',
        'ngMaterial',
        'ngMessages',
        'ngMask',
        'dmc.ajax',
        'ui.router',
        'md.data.table',
        'ngCookies',
        'dmc.common.header',
        'dmc.model.previous-page',
        'dmc.common.footer',
        'ui.autocomplete',
        'ui.sortable',
        'dmc.model.toast-model',
        'dmc.service-marketplace',
        'dmc.component.run-default-button',
        'dmc.widgets.uploadModal',
        'dmc.more-less',
        'dmc.widgets.documents',
        'dmc.utilities'
    ])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider){
        var resolve = {
            serviceData: ['serviceModel', '$stateParams', function (serviceModel, $stateParams) {
                return serviceModel.get_service($stateParams.appId);
            }]
        };
        var resolveStaticJson = {
            documentData: ['dataFactory', 'contentMetaDataService', '$stateParams', '$http', function (dataFactory, contentMetaDataService, $stateParams, $http) {
                return $http.get(dataFactory.documentsUrl($stateParams.documentId).getSingle).then(function (response) {
                    console.log(contentMetaDataService.getDocumentsWithMetaData(response.data));
                    return contentMetaDataService.getDocumentsWithMetaData(response.data);
                });
            }]
        };
        $stateProvider.state('resource-profile-app', {
            url: '/app/:appId',
            controller: 'ResourceProfileAppController',
            templateUrl: 'templates/resource-profile/app.html',
            resolve: resolve
        }).state('resource-profile-document', {
            url: '/document/:documentId',
            controller: 'ResourceProfileDocumentController',
            templateUrl: 'templates/resource-profile/document.html',
            resolve: resolveStaticJson
        });
        $urlRouterProvider.otherwise('/');
    })
    .controller('ResourceProfileAppController', ['$scope', '$http', 'serviceData', 'previousPage', 'serviceModel', '$stateParams', 'DMCUserModel', 'ajax', 'dataFactory', '$timeout', 'toastModel', '$cookieStore',
        function ($scope, $http, serviceData, previousPage, serviceModel, $stateParams, DMCUserModel, ajax, dataFactory, $timeout, toastModel, $cookieStore) {
            
            $scope.documents = [];
            $scope.resource = serviceData;
            
            console.log(serviceData);
    
            $http.get(dataFactory.getUserName($scope.resource.owner), {}).then(function (response) {
                $scope.resource.author = response.data.displayName;
            });
            
            // $scope.resource = {
            //     "id": 406,
            //     "companyId": "318",
            //     "title": "Torque",
            //     "description": "Torque is a measure of how much a force acting on an object causes that object to rotate. The formula that this model is based on is Torque = r*F*sin(theta). The value r is the distance between the axes of rotation and the point where the force is applied. The value F is the magnitude of the force applied at the lever-arm. The value theta (radians) is the angle at which force is applied to the lever-arm. The value F (Newtons), and r (meter). The output value is Torque (Newton * meters). Visit for more information: https:\/\/digitalmfgcommons.atlassian.net\/wiki\/display\/DMDIIDMC\/Torque",
            //     "owner": "206",
            //     "profileId": "206",
            //     "releaseDate": "2017-03-06",
            //     "serviceType": "Fundamental Calculations - Physics",
            //     "tags": [
            //
            //     ],
            //     "specifications": "\/services\/3\/specifications",
            //     "featureImage": {
            //         "thumbnail": "",
            //         "large": ""
            //     },
            //     "currentStatus": {
            //         "percentCompleted": "0",
            //         "startDate": "",
            //         "startTime": ""
            //     },
            //     "projectId": "105",
            //     "from": "project",
            //     "type": "service",
            //     "parent": null,
            //     "published": true,
            //     "averageRun": "",
            //     "service_tags": [{name: "tag1"}, {name: "tag2"}]
            // };
    
            $scope.adHocData = function(dataToGet) {
        
                if (!$scope.resource[dataToGet]) {
                    var id = $scope.resource.id;
                    var endpoints = {
                        'service_tags': dataFactory.services(id).get_tags,
                        'service_reviews': dataFactory.services(id).reviews
                        // 'interfaceModel': dataFactory.services(id).get_interface
                    };
            
                    var extractData = function(response){
                        return response.data ? response.data : response;
                    };
            
                    $http.get(endpoints[dataToGet]).then(function(response){
                        if (dataToGet == 'interfaceModel') {
                            // $scope.product[dataToGet] = (response.data && response.data.length > 0 ? response.data[0] : null);
                        } else {
                            $scope.resource[dataToGet] = extractData(response);
                        }
                
                    });
                };
        
            };
            console.log($stateParams.appId);
       
    }]).controller('ResourceProfileDocumentController', ['$scope', '$http', 'documentData', 'previousPage', 'serviceModel', '$stateParams', 'DMCUserModel', 'ajax', 'dataFactory', '$timeout', 'toastModel', '$cookieStore',
    function ($scope, $http, documentData, previousPage, serviceModel, $stateParams, DMCUserModel, ajax, dataFactory, $timeout, toastModel, $cookieStore) {
        
        console.log(documentData);
        $scope.resource = documentData;
        
        // $http.get(dataFactory.getUserName($scope.resource.owner), {}).then(function (response) {
        //     $scope.resource.author = response.data.displayName;
        // });
        
    }]);

