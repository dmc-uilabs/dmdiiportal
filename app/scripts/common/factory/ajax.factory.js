'use strict';

angular.module('dmc.ajax',[]).factory('ajax', function () {
        return {
            on: function(urlAddress,dataObject,successFunction,errorFunction, method){
                $.ajax({
                    type: method ? method : "GET",
                    url: urlAddress,
                    dataType: "json",
                    encoding: "UTF-8",
                    data: $.param(dataObject),
                    success: function (data, status) {
                        successFunction(data, status);
                    },
                    error: function (data, status) {
                        errorFunction()
                    }
                });
            }
        };
    }
);