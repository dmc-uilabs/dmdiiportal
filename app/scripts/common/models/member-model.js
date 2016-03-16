'use strict';

angular.module('dmc.model.member', ['dmc.data'])
 .service('DMCMemberModel', ['$http', 'dataFactory','DMCUserModel', '$q', 'ajax', function($http, dataFactory,DMCUserModel, $q, ajax) {

    this.getMembers = function() {
        var userData = DMCUserModel.getUserData();
        return userData.then(function(res){
            return $http.get(dataFactory.getMembersUrl(res.profileId)).then(
                function(response) {
                    var data = response.data ? response.data : response;
                    return data;
                }
            );
        });
    };
}]);