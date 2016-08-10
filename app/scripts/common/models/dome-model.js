'use strict';

angular.module('dmc.model.dome', ['dmc.data','dmc.ajax'])
    .service('domeModel', [
        '$http',
        'dataFactory',
        'ajax',
        '$window',
        'toastModel',
        '$q',
        function(
            $http,
            dataFactory,
            ajax,
            $window,
            toastModel,
            $q) {

            this.getModel = function(data,callback,errorCallback) {
                ajax.get(dataFactory.getModel(), data, callback,(errorCallback ? errorCallback : error));
            };

            this.getChildren = function(data,callback,errorCallback,item,index,back){
                ajax.get(dataFactory.getChildren(), data, function (response) {
                    callback(response, item, index, back);
                },(errorCallback ? errorCallback : error));
            };

            this.runModel = function(data,callback,errorCallback){
                ajax.create(dataFactory.runModel(), data, callback, errorCallback);

            };

            this.pollModel = function(data,callback,errorCallback) {
                ajax.get(dataFactory.pollModel(data.runId), {}, callback, errorCallback);
            }

            var error = function(response){
                toastModel.showToast("error", (response && response.statusText ? response.statusText : "Unknown error!"));
            };
        }
    ]
);