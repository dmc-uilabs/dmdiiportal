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
    'dmc.model.fileUpload',
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
        'ajax', 'fileUpload', 'dataFactory', '$stateParams', '$http', '$q', 'toastModel', '$rootScope','DMCUserModel',
        function (ajax, fileUpload, dataFactory, $stateParams, $http, $q, toastModel, $rootScope, DMCUserModel ) {

            function addTagsToPromises(promises,tags,id){
                if(tags) {
                    for (var i in tags) {
                        if (tags[i].id && tags[i].id > 0 && tags[i].deleted == true) {
                            promises["deleteTag" + i] = $http.delete(dataFactory.deleteProjectTag(tags[i].id));
                        } else if (!tags[i].id || tags[i].id <= 0) {
                            promises["addTag" + i] = $http.post(dataFactory.addProjectTag(), {
                                projectId: id,
                                name: tags[i].name
                            });
                        }
                    }
                }
            }

            function addDocumentsToPromises(promises,documents,id){
                console.log(documents);
                for(var i in documents){
                    if(documents[i].id && documents[i].projectId == id){
                        if(!documents[i].deleted) {
                            if(!documents[i].oldTitle || (documents[i].oldTitle && documents[i].title != documents[i].oldTitle)) {
                                promises["updatedDocument" + i] = $http.patch(dataFactory.updateProjectDocument(documents[i].id), {
                                    title: documents[i].title
                                });
                            }
                        }else{
                            promises["deletedDocument" + i] = $http.delete(dataFactory.deleteProjectDocument(documents[i].id));
                        }
                    }else{
                        (function(doc){
                            promises[doc.title] = fileUpload.uploadFileToUrl(doc.file, {}, doc.title + doc.type).then(function(response) {
                                var docData = {
                                    parentId:id,
                                    parentType:"PROJECT",
                                    documentUrl: response.file.name,
                                    documentName: doc.title + doc.type,
                                    ownerId: $rootScope.userData.accountId,
                                    docClass: 'SUPPORT',
                                    accessLevel: doc.accessLevel
                                };

                                return ajax.create(dataFactory.documentsURL().save, docData, function(resp){});
                            });
                        })(documents[i]);


                        /*
                        var fd = new FormData();
                        fd.append('file', documents[i].file);
                        fd.append('projectId', id);
                        fd.append('title', documents[i].title);
                        fd.append('type', documents[i].type);

                        promises["newDocument"+i] = $http.post(dataFactory.documentUpload(), fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        });
                        */
                    }
                }
            }

            this.update_project = function(id,params, array, currentMembers, callback){
                ajax.update(dataFactory.updateProject(id),{
                    title : params.title,
                    type : params.type,
                    approvalOption : params.approvalOption,
                    dueDate : params.dueDate,
                    description : params.description
                },function(response){
                    var promises = {};

                    // add tags to request
                    addTagsToPromises(promises,params.tags,id);

                    // add documents to request
                    addDocumentsToPromises(promises,params.documents,id);

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
                            promises["addMember"+i] = $http.post(dataFactory.createMembersToProject(), {
                                    "profileId": array[i].id,
                                    "projectId": id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": false
                                }
                            );
                        }
                    }
                    if(currentMembers.length > 0) {
                        for (var i in currentMembers) {
                            promises["deleteMember"+i] = $http.delete(dataFactory.deleteProjectMember(currentMembers[i].id));
                        }
                    }

                    $q.all(promises).then(function(){
                            callback();
                        }, function(res){
                            toastModel.showToast("error", "Error." + res.statusText);
                        }
                    );

                    callback();
                });
            };

            this.add_project = function(params, array, callback){

                ajax.create(dataFactory.getCreateProject(),
                    {
                        "title": params.title,
                        "type": params.type,
                        "dueDate": params.dueDate,
                        "projectManager": $rootScope.userData.displayName,
                        "projectManagerId" : $rootScope.userData.profileId,
                        "companyId" : $rootScope.userData.companyId,
                        "approvalOption": params.approvalOption,
                        "featureImage": {
                            "thumbnail": "/images/project_relay_controller.png",
                            "large": "/images/project_relay_controller.png"
                        },
                        "description": params.description
                    },
                    function(response){

                        var promises = {
                            "update": $http.patch(dataFactory.updateProject(response.data.id),{
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
                            }),
                            "addCurrentMemberToTheProject" : $http.post(dataFactory.createMembersToProject(),
                                {
                                    "profileId": $rootScope.userData.profileId,
                                    "projectId": response.data.id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": true
                                })
                        };

                        // add members to request
                        for(var i in array){
                            promises["addMember"+i] = $http.post(dataFactory.createMembersToProject(),
                                {
                                    "profileId": array[i].id,
                                    "projectId": response.data.id,
                                    "fromProfileId": $rootScope.userData.profileId,
                                    "from": $rootScope.userData.displayName,
                                    "date": moment(new Date).format('x'),
                                    "accept": false
                                });
                        }

                        // add tags to request
                        addTagsToPromises(promises,params.tags,response.data.id);

                        // add documents to request
                        addDocumentsToPromises(promises,params.documents,response.data.id);

                        $q.all(promises).then(function(){
                                callback(response.data.id);
                            }, function(res){
                                toastModel.showToast("error", "Error." + res.statusText);
                            }
                        );

                    }
                );
            };

        }
    ]);
