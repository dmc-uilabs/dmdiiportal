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
    'ajax', 'dataFactory', '$stateParams', 'toastModel', '$rootScope',
    function (ajax, dataFactory, $stateParams, toastModel, $rootScope) {

        this.update_project = function(id,params, array, currentMembers, callback){
            ajax.update(dataFactory.updateProject(id),{
                title : params.title,
                type : params.type,
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

                                    $rootScope.userData.messages.items.splice($rootScope.userData.messages.items.length-1, 1);
                                    $rootScope.userData.messages.items.unshift({
                                        "user_name": $rootScope.userData.displayName,
                                        "image": "/uploads/profile/1/20151222084711000000.jpg",
                                        "text": "Invited you to a project",
                                        "link": "/project.php#/preview/" + id,
                                        "created_at": moment().format("hh:mm A")
                                    });
                                    DMCUserModel.UpdateUserData($rootScope.userData);
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
                            "type": params.type,
                            "dueDate": params.dueDate,
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

                                    ajax.create(dataFactory.createMembersToProject(),
                                        {
                                            "id": lastMemberId,
                                            "profileId": $rootScope.userData.profileId,
                                            "projectId": lastId,
                                            "fromProfileId": $rootScope.userData.profileId,
                                            "from": $rootScope.userData.displayName,
                                            "date": moment(new Date).format('x'),
                                            "accept": true
                                        },
                                        function(response){

                                            $rootScope.userData.messages.items.splice($rootScope.userData.messages.items.length-1, 1);
                                            $rootScope.userData.messages.items.unshift({
                                                "user_name": $rootScope.userData.displayName,
                                                "image": "/uploads/profile/1/20151222084711000000.jpg",
                                                "text": "Invited you to a project",
                                                "link": "/project.php#/preview/" + lastId,
                                                "created_at": moment().format("hh:mm A")
                                            });
                                            DMCUserModel.UpdateUserData($rootScope.userData);
                                        }
                                    );
                                    lastMemberId++;


                                    for(var i in array){
                                        ajax.create(dataFactory.createMembersToProject(),
                                            {
                                                "id": lastMemberId,
                                                "profileId": array[i].id,
                                                "projectId": lastId,
                                                "fromProfileId": $rootScope.userData.profileId,
                                                "from": $rootScope.userData.displayName,
                                                "date": moment(new Date).format('x'),
                                                "accept": false
                                            },
                                            function(response){

                                                $rootScope.userData.messages.items.splice($rootScope.userData.messages.items.length-1, 1);
                                                $rootScope.userData.messages.items.unshift({
                                                    "user_name": $rootScope.userData.displayName,
                                                    "image": "/uploads/profile/1/20151222084711000000.jpg",
                                                    "text": "Invited you to a project",
                                                    "link": "/project.php#/preview/" + lastId,
                                                    "created_at": moment().format("hh:mm A")
                                                });
                                                DMCUserModel.UpdateUserData($rootScope.userData);
                                            }
                                        );
                                        lastMemberId++;
                                    }
                                    callback(lastId);
                                }
                            ) 
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