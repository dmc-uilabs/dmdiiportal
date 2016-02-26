'use strict';

angular.module('dmc.model.profile', ['dmc.data'])
 .service('DMCProfileModel', ['$http', 'dataFactory', '$q', 'ajax', function($http, dataFactory, $q, ajax) {

    this.getProfileModel = function(id) {
        return ajax.get(dataFactory.profiles(id), {}, function(response){
            return response.data;
          }
        );
    };

    this.getReviewModel = function(id) {
        return ajax.get(dataFactory.profiles(id).reviews, {},
          function(response){
            return response.data;
          }
        );
    };
}]);