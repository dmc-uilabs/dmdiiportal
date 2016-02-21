'use strict';

angular.module('dmc.model.project', ['dmc.data'])
 .service('DMCProjectModel', ['$http', 'ajax', 'dataFactory', function($http, ajax, dataFactory) {

    this.getModel = function(id) {
        return ajax.get(dataFactory.getProject(id),{},
            function(response){
                if(response.data.dueDate){
                    var day = 86400000;
                    response.data.currentDueDate = response.data.dueDate;
                    response.data.dueDate = (new Date() - new Date(response.data.dueDate));
                    if(response.data.dueDate <= day){
                        response.data.dueDate = moment(new Date()).format("MM/DD/YYYY");
                    }else{
                        response.data.dueDate = Math.floor(response.data.dueDate / day)+" days";
                    }
                }
                return response.data;
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