'use strict';

angular.module('dmc.model.company', [
    'dmc.data',
    'dmc.ajax'
])
.service('CompanyModel', ['dataFactory','ajax', function(ajax, dataFactory) {
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
            title : "The Turbine Company"
        };
    };
}]);