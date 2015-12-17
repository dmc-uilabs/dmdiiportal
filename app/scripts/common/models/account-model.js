'use strict';

angular.module('dmc.model.account', [
    'dmc.data',
    'dmc.ajax'
])
.service('AccountModel', ['dataFactory','$http', function(dataFactory,$http) {
        this.getModel = function(id) {
            return $http.get(dataFactory.getAccountUrl(id)+"&id="+id).then(
                function(response){
                    if(response.data.result == null || response.data.result.length == 0) {
                        window.location.href = "/";
                    }
                    return response.data.result;
                },
                function(response){
                    return response;
                }
            );
        };
    }]);