'use strict';

angular.module('dmc.ajax',[
    'dmc.model.toast-model'
]).factory('ajax', ["$http","toastModel", function ($http,toastModel) {
        var errorCallback = function(response){
            toastModel.showToast("error", response.statusText);
        };

        var request = function(urlAddress,dataObject,successFunction,errorFunction,method){
            var config = {
                url: urlAddress,
                dataType: 'json',
                method: method,
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            };
            if(method == "GET"){
                config.params = dataObject;
            }else{
                config.data = JSON.stringify(dataObject);
            }
            return $http(config).then(successFunction, (errorFunction ? errorFunction : errorCallback));
        };

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
            },
            update: function(urlAddress,dataObject,successFunction,errorFunction){
                return request(urlAddress,dataObject,successFunction,errorFunction,"PATCH");
            },
            delete: function(urlAddress,dataObject,successFunction,errorFunction){
                return request(urlAddress,dataObject,successFunction,errorFunction,"DELETE");
            },
            get: function(urlAddress,dataObject,successFunction,errorFunction){
                return request(urlAddress,dataObject,successFunction,errorFunction,"GET");
            },
            create: function(urlAddress,dataObject,successFunction,errorFunction){
                return request(urlAddress,dataObject,successFunction,errorFunction,"POST");
            }
        };
    }]
);