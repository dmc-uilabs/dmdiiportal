'use strict';
angular.module('dmc.add_project', [
    'dmc.configs.ngmaterial',
    'dmc.add_project.directive',
    'dmc.ajax',
    'dmc.data',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('add_project', {
        url: '',
        abstract: true
    });
    $urlRouterProvider.otherwise('/');
})
.service('projectModel', [
    'ajax', 'dataFactory', '$stateParams', 'toastModel',
    function (ajax, dataFactory, $stateParams, toastModel) {
        this.add_project = function(params, array, callback){
            ajax.get(dataFactory.getProjects(), 
                {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, 
                function(response){  
                    var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                    ajax.create(dataFactory.getCreateProject(),
                        {
                            "id": lastId,
                            "title": params.title,
                            "projectManager": "DMC member",
                            "featureImage": {
                                "thumbnail": "/images/project_relay_controller.png",
                                "large": "/images/project_relay_controller.png"
                            },
                            "description": params.description,
                            "tasks": {
                                "totalItems": 0,
                                "link": "/projects/"+lastId+"/tasks"
                            },
                            "discussions": {
                                "totalItems": 0,
                                "link": "/projects/"+lastId+"/discussions"
                            },
                            "services": {
                                "totalItems": 0,
                                "link": "/projects/"+lastId+"/services"
                            }

                        },
                        function(response){
                            ajax.get(dataFactory.createMembersToProject(), 
                                {
                                    "_limit" : 1,
                                    "_order" : "DESC",
                                    "_sort" : "id"
                                }, 
                                function(response){  
                                    console.info(response);
                                    var lastMemberId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1); 
                                    for(var i in array){
                                        ajax.create(dataFactory.createMembersToProject(),
                                            {
                                                "id": lastMemberId,
                                                "profileId": array[i].id,
                                                "projectId": lastId
                                            },
                                            function(response){
                                            }
                                        );
                                        lastMemberId++;
                                    }
                                }
                            ) 
                            callback(lastId);
                        }
                    );

                },
                function(response){
                    toastModel.showToast("error", "Error." + response.statusText);
                }
            ) 
        };

            
    }
]);