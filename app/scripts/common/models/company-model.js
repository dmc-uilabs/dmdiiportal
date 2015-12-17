'use strict';

angular.module('dmc.model.company', [
    'dmc.data'
])
.service('CompanyModel', ['dataFactory','$http', function(dataFactory,$http) {
    this.getModel = function(id) {
        return $http.get(dataFactory.getCompanyUrl(id)+"&id="+id).then(
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