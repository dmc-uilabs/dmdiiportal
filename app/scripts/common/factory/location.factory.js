'use strict';

angular.module('dmc.location',[]).factory('location', function ($http) {
        return {
            get: function(location,ip){
                return $http.get('http://ip-api.com/json'+(ip != null ? '/'+ip : '')).then(
                    function(response){
                        location(true,response.data);
                    }, function(response){
                        location(false,response.data)
                    }
                );
            }
        };
    }
);