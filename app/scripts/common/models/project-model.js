'use strict';

angular.module('dmc.model.project', ['dmc.data'])
 .service('DMCProjectModel', ['$http', 'ajax', 'dataFactory', function($http, ajax, dataFactory) {

    this.getModel = function(id) {
        return ajax.get(dataFactory.getProject(id),{},
            function(response){
                if(response.data.dueDate){
                  response.data.dueDate = moment(response.data.dueDate).format('MM/DD/YYYY')
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