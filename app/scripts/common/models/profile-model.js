'use strict';

angular.module('dmc.model.profile', ['dmc.data'])
 .service('DMCProfileModel', ['$http', 'dataFactory', '$q', 'ajax', function($http, dataFactory, $q, ajax) {

    this.getProfileModel = function(id) {
        var deffered = $q.defer();

        ajax.on(
          dataFactory.getProfile(id),
          {
            profileId: id,
          },
          function(data){
            var data = dataFactory.get_result(data);
            deffered.resolve(data)
          },
          function(){
            deffered.reject();
          }
        );

        return deffered.promise;
    };

    this.getReviewModel = function(id) {
        var deffered = $q.defer();

        ajax.on(
          dataFactory.getProfileReview(id),
          {
            profileId: id,
          },
          function(data){
            var data = dataFactory.get_result(data);

            deffered.resolve(data)
          },
          function(){
            deffered.reject();
          }
        );

        return deffered.promise;
    };
}]);