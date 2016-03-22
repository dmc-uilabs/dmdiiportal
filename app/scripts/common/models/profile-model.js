'use strict';

angular.module('dmc.model.profile', ['dmc.data'])
    .service('DMCProfileModel', [
        '$http',
        'dataFactory',
        '$q',
        'ajax',
        'DMCUserModel',
        function($http,
                 dataFactory,
                 $q,
                 ajax,
                 DMCUserModel) {

            this.getProfileModel = function(id) {
                return ajax.get(dataFactory.profiles(id), {}, function(response){
                        var data = response.data;
                        return data
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