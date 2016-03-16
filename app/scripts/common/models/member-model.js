'use strict';

angular.module('dmc.model.member', ['dmc.data'])
 .service('DMCMemberModel', ['$http', 'dataFactory','DMCUserModel', '$q', 'ajax', function($http, dataFactory,DMCUserModel, $q, ajax) {

    this.getMembers = function() {
        var userData = DMCUserModel.getUserData();
        return userData.then(function(res){
            return $http.get(dataFactory.getMembersUrl()).then(
                function(response) {
                    var data = response.data ? response.data : response;
                    for(var i in data){
                        if(data[i].id == res.profileId){
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