'use strict';

angular.module('dmc.model.discussion', ['dmc.data'])
 .service('DMCDiscussionModel', ['$http', 'dataFactory', '$q', 'ajax', '$window', function($http, dataFactory, $q, ajax, $window) {

    this.createDiscussion  = function(discussion) {
      var projectId = discussion.projectId;
      var deffered = $q.defer();

        if ($window.apiUrl) {
          ajax.create(
            dataFactory.getUrlCreateDiscussion(projectId),
            discussion,
            function(data){
              deffered.resolve(data)
            },
            function(){
              deffered.reject();
            }
          );
        } else {
          ajax.on(
            dataFactory.getUrlCreateDiscussion(projectId),
            discussion,
            function(data){
              deffered.resolve(data)
            },
            function(){
              deffered.reject();
            },
            "POST"
          );
        }

        return deffered.promise;

    }
}]);