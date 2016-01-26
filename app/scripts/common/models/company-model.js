'use strict';

angular.module('dmc.model.company', [
    'dmc.data'
])
.service('CompanyModel', ['dataFactory','$http', function(dataFactory,$http) {
    this.getModel = function(id) {
        return $http.get(dataFactory.getCompanyUrl(id)).then(
            function(response){
                // if(response.data.result == null || response.data.result.length == 0) {
                //     window.location.href = "/";
                // }
                var data = dataFactory.get_result(response.data).result
                return data;
            },
            function(response){
                return response;
            }
        );
    };

    this.getReviewModel = function(id) {
        return $http.get(dataFactory.getCompanyReviewUrl(id)).then(
            function(response){
                var data = dataFactory.get_result(response.data).result
                return data;
            },
            function(response){
                return response;
            }
        );
    };
}]);