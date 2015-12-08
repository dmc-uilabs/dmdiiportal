'use strict';

angular.module('dmc.model.account', [
    'dmc.data',
    'dmc.ajax'
])
.service('AccountModel', ['dataFactory','ajax', function(ajax, dataFactory) {
    this.getModel = function(id) {
        //ajax.on(dataFactory.getAccount(),{id : id},
        //    function(data){
        //        console.log(data);
        //    },function(){
        //        alert("Ajax is failed!");
        //    }
        //);
        return {
            id : id,
            name : "Denis",
            age : 23
        };
    };
}]);