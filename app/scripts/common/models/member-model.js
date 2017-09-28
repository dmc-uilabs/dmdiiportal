'use strict';

angular.module('dmc.model.member', ['dmc.data'])
 .service('DMCMemberModel', ['$http', 'dataFactory','DMCUserModel', '$q', 'ajax', function($http, dataFactory,DMCUserModel, $q, ajax) {

    this.getMembers = function() {
        var userData = DMCUserModel.getUserData();
        return userData.then(function(res){
            return $http.get(dataFactory.getUserList(), { params: { page: 0, pageSize: 100 } }).then(
                function(response) {
                    var data = response.data ? response.data.content : response;
                    for(var i in data){
                        if(data[i].id === res.accountId){
                            data.splice(i,1);
                            break;
                        }
                    }
                    return data;
                }
            );
        });
    };
}]);
