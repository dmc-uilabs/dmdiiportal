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
    'dmc.component.members-card',
    'dmc.common.header',
    'dmc.common.footer'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider, $mdDateLocaleProvider){
    $stateProvider.state('add_project', {
        url: '',
        abstract: true
    });
    $urlRouterProvider.otherwise('/');

    $mdDateLocaleProvider.formatDate = function(date) {
        if(date){
            return moment(date).format('MM/DD/YYYY');
        }else{
            return "";
        }
    };
})
    .service('projectModel', [
        'ajax', 'dataFactory', '$stateParams', 'toastModel', '$rootScope','DMCUserModel',
        function (ajax, dataFactory, $stateParams, toastModel, $rootScope, DMCUserModel ) {

            this.update_project = function(id,params, array, currentMembers, callback){
                if(params.tags && params.tags.length > 0) saveTags(params.tags,id);
                ajax.update(dataFactory.updateProject(id),{
                    title : params.title,
                    type : params.type,
                    approvalOption : params.approvalOption,
                    dueDate : params.dueDate,
                    description : params.description
                },function(response){
                    for(var i in array){
                        var isFound = false;
                        for(var j in currentMembers){
                            if(array[i].profileId == currentMembers[j].profileId){
                                currentMembers.splice(j,1);
                                isFound = true;
                                break;
                            }
                        }
                        if(!isFound){
                            ajax.create(dataFactory.createMembersToProject(),
                                {
                                    "profileId": $rootScope.userData.profileId,
                                    "projectId": id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": true
                                },
                                function(response){
                                }
                            );
                        }
                    }
                    if(currentMembers.length > 0) {
                        for (var i in currentMembers) {
                            ajax.delete(dataFactory.deleteProjectMember(currentMembers[i].id),{},function(){})
                        }
                    }
                    callback();
                });
            };

            this.add_project = function(params, array, callback){

                ajax.create(dataFactory.getCreateProject(),
                    {
                        "title": params.title,
                        "type": params.type,
                        "dueDate": params.dueDate,
                        "projectManager": "DMC member",
                        "approvalOption": params.approvalOption,
                        "featureImage": {
                            "thumbnail": "/images/project_relay_controller.png",
                            "large": "/images/project_relay_controller.png"
                        },
                        "description": params.description
                    },
                    function(response){

                        // save link in created project
                        ajax.update(dataFactory.updateProject(response.data.id),{
                            "tasks": {
                                "totalItems": 0,
                                "link": "/projects/"+response.data.id+"/tasks"
                            },
                            "discussions": {
                                "totalItems": 0,
                                "link": "/projects/"+response.data.id+"/discussions"
                            },
                            "services": {
                                "totalItems": 0,
                                "link": "/projects/"+response.data.id+"/services"
                            },
                            "tags": {
                                "totalItems": 0,
                                "link": "/projects/"+response.data.id+"/projects_tags"
                            }
                        },function(response){});


                        if(params.tags && params.tags.length > 0) saveTags(params.tags,response.data.id);

                        ajax.create(dataFactory.createMembersToProject(),
                            {
                                "profileId": $rootScope.userData.profileId,
                                "projectId": response.data.id,
                                "fromProfileId": $rootScope.userData.profileId,
                                "from": $rootScope.userData.displayName,
                                "date": moment(new Date).format('x'),
                                "accept": true
                            },
                            function(response){

                            }
                        );


                        for(var i in array){
                            ajax.create(dataFactory.createMembersToProject(),
                                {
                                    "profileId": array[i].id,
                                    "projectId": response.data.id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": false
                                },
                                function(response){
                                }
                            );
                        }
                        callback(response.data.id);
                    }
                );
            };

            function saveTags(tags,id){
                for(var i in tags){
                    if(tags[i].id && tags[i].id > 0 && tags[i].deleted == true){
                        ajax.delete(dataFactory.deleteProjectTag(tags[i].id),{
                        },function(response){});
                    }else if(!tags[i].id || tags[i].id <= 0){
                        ajax.create(dataFactory.addProjectTag(),{
                            projectId : id,
                            name : tags[i].name
                        },function(response){});
                    }
                }
            }
        }
    ]);