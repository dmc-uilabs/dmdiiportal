'use strict';

angular.module('dmc.model.user', ['dmc.data'])
 .service('DMCUserModel', ['$http', 'dataFactory', '$q', function($http, dataFactory, $q) {

    var _user;
    this.getUserData = function(id) {
        // return user cached data
        if (_user) {
          return $q.when(_user);
        } else {
          return $http.get(dataFactory.getUserUrl()).then(
          function(response) {
              var data = response.data ? response.data : response;
              // cache user data
              _user = data;
              return data;
            }
          )
        }
    };
}]);