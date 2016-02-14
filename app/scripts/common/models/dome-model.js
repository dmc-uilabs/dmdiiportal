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
                if($window.apiUrl) {
                    var url = data.domeServer;
                    delete data.domeServer;
                    $http({
                        url: url+'/getModel',
                        dataType: 'json',
                        method: 'POST',
                        data: { data: data ? JSON.stringify(data) : undefined }
                    }).then(callback, (errorCallback ? errorCallback : error));
                }else{
                    data.url = data.domeServer;
                    ajax.get(dataFactory.getModel(), data, callback,(errorCallback ? errorCallback : error));
                }
            };

            this.getChildren = function(data,callback,errorCallback,item,index,back){
                if($window.apiUrl) {
                    var url = data.domeServer;
                    delete data.domeServer;
                    $http({
                        url: url+'/getChildren',
                        dataType: 'json',
                        method: 'POST',
                        data: { data: data ? JSON.stringify(data) : undefined }
                    }).then(function(response){
                        callback(response, item, index, back);
                    }, (errorCallback ? errorCallback : error));
                }else {
                    data.url = data.domeServer;
                    ajax.get(dataFactory.getChildren(), data, function (response) {
                        callback(response, item, index, back);
                    },(errorCallback ? errorCallback : error));
                }
            };

            this.runModel = function(data,callback,errorCallback){
                var requestData = {};
                requestData.interface = {
                    inParams : data.model.inParams,
                    outParams : data.model.outParams,
                    interFace : data.interface
                };
                requestData.url = data.domeServer;
                if($window.apiUrl) {
                    $http({
                        url: requestData.url+'/runModel',
                        dataType: 'json',
                        method: 'POST',
                        data: {
                            data: data && requestData.interface ? JSON.stringify(requestData.interface) : undefined,
                            queue : "DOME_Model_Run_TestQueue"
                        }
                    }).then(callback, errorCallback);
                }else {
                    ajax.get(dataFactory.runModel(), requestData, callback, errorCallback);
                }
            };

            var error = function(response){
                toastModel.showToast("error", (response && response.statusText ? response.statusText : "Unknown error!"));
            };
        }
    ]
);