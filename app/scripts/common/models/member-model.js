'use strict';

angular.module('dmc.model.member', ['dmc.data'])
 .service('DMCMemberModel', ['$http', 'dataFactory', '$q', 'ajax', function($http, dataFactory, $q, ajax) {

    this.getMembers = function() {
       return $http.get(dataFactory.getMembersUrl()).then(
          function(response) {
              var data = response.data ? response.data : response;
              return data;
            }
          );
    };
}]);