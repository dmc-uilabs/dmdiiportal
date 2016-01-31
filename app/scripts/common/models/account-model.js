'use strict';

angular.module('dmc.model.account', [
    'dmc.data',
    'dmc.ajax'
])
.service('AccountModel', ['dataFactory','ajax','toastModel', function(dataFactory,ajax,toastModel) {
        // get account
        this.get = function(id) {
            return ajax.get(dataFactory.getAccount(id),{},function(response){
                return response.data;
            },function(response){
                return response.data;
            });
        };

        // update account
        this.update = function(data){
            var params = ['displayName', 'firstName', 'lastName', 'email' , 'location', 'timezone', 'jobTitle', 'description', 'privacy'];
            var updatedParams = {};
            for(var i=0; i<params.length; i++) updatedParams[params[i]] = data[params[i]];
            ajax.update(dataFactory.updateAccount(data.id),updatedParams,
                function(result){
                    if(result.status == 200){
                        toastModel.showToast('success',"Successfully updated!");
                    }
                },function(result){
                    toastModel.showToast('error',"Unable update data");
                }
            );
        }
    }]);