'use strict';

angular.module('dmc.model.project', ['dmc.data'])
    .service('DMCProjectModel', [
        '$http',
        'ajax',
        '$q',
        'dataFactory',
        'toastModel',
        function($http,
                 ajax,
                 $q,
                 dataFactory,
                 toastModel) {

            this.getModel = function(id) {
                var promises = {
                    "project": $http.get(dataFactory.getProject(id)),
                    "tags": $http.get(dataFactory.getProjectTags(id))
                };

                function extractData(response){
                    return response.data ? response.data : response;
                }

                return $q.all(promises).then(function(responses){
                        var project = extractData(responses.project);
                        project.tags = extractData(responses.tags);

                        if(project.dueDate){
                            var day = 86400000;
                            project.currentDueDate = project.dueDate;
                            project.dueDate = (new Date() - new Date(project.dueDate));
                            if(project.dueDate <= day){
                                project.dueDate = moment(new Date()).format("MM/DD/YYYY");
                            }else{
                                project.dueDate = Math.floor(project.dueDate / day)+" days";
                            }
                        }

                        return project;
                    },
                    function(response){
                        toastModel.showToast("error", "Error." + response.statusText);
                    }
                );
            };

            this.createProject = function(project) {
                ajax.create(
                    dataFactory.getCreateProject(),
                    project,
                    function(response){
                        var data = response.data ? response.data : response;
                        deffered.resolve(data)
                    },
                    function(){
                        deffered.reject();
                    }
                );
            }
        }]);