'use strict';

angular.module('dmc.model.task', ['dmc.data'])
 .service('DMCTaskModel', ['$http', 'dataFactory', '$q', 'ajax', function($http, dataFactory, $q, ajax) {

    this.getTasks = function() {

    }

    this.getTaskById = function(id) {

    }

    this.createTask  = function(task) {
      var projectId = task.projectId;
      var deffered = $q.defer();

        ajax.on(
          dataFactory.getUrlCreateTask(task.projectId),
          task,
          function(data){
            deffered.resolve(data)
          },
          function(){
            deffered.reject();
          },
          "POST"
        );

        return deffered.promise;

    }
}]);