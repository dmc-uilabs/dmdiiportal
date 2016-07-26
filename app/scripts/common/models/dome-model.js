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
                //  Commented out to test REST end point to retrieve DOME Model
                // if($window.apiUrl) {
                //     var url = data.domeServer;
                //     delete data.domeServer;
                //     $http({
                //         url: url+'/getModel',
                //         dataType: 'json',
                //         method: 'POST',
                //         data: { data: data ? JSON.stringify(data) : undefined }
                //     }).then(callback, (errorCallback ? errorCallback : error));
                // }else{
                //     data.url = data.domeServer;
                //     ajax.get(dataFactory.getModel(), data, callback,(errorCallback ? errorCallback : error));
                // }

                ajax.get(dataFactory.getModel(), data, callback,(errorCallback ? errorCallback : error));
            };

            this.getChildren = function(data,callback,errorCallback,item,index,back){
                //  Commented out to test REST end point to retrieve DOME interfaces children
                // if($window.apiUrl) {
                //     var url = data.domeServer;
                //     delete data.domeServer;
                //     $http({
                //         url: url+'/getChildren',
                //         dataType: 'json',
                //         method: 'POST',
                //         data: { data: data ? JSON.stringify(data) : undefined }
                //     }).then(function(response){
                //         callback(response, item, index, back);
                //     }, (errorCallback ? errorCallback : error));
                // }else {
                //     data.url = data.domeServer;
                //     ajax.get(dataFactory.getChildren(), data, function (response) {
                //         callback(response, item, index, back);
                //     },(errorCallback ? errorCallback : error));
                // }

                ajax.get(dataFactory.getChildren(), data, function (response) {
                    callback(response, item, index, back);
                },(errorCallback ? errorCallback : error));
            };

            this.runModel = function(data,callback,errorCallback){
                var requestData = {};
                if (data.model) {
                    requestData = $.extend(true,{}, data.model);
                } else {
                    requestData = {
                        interface: data.interface,
                        inParams: null,
                        outParams: null
                    }
                }

                // Commented out to test REST end point
                // var requestData = {};
                // requestData.interface = {
                //     inParams : data.model ? data.model.inParams : null,
                //     outParams : data.model ? data.model.outParams : null,
                //     interFace : data.interface
                // };

                // requestData.url = data.domeServer;
                // if($window.apiUrl) {
                //     $http({
                //         url: requestData.url+'/runModel',
                //         dataType: 'json',
                //         method: 'POST',
                //         data: {
                //             data: data && requestData.interface ? JSON.stringify(requestData.interface) : undefined,
                //             queue : "DOME_Model_Run_TestQueue"
                //         }
                //     }).then(callback, errorCallback);
                // }else {
                //     ajax.get(dataFactory.runModel(), requestData, callback, errorCallback);
                // }

                ajax.create(dataFactory.runModel(), requestData, callback, errorCallback);

            };

            this.pollModel = function(data,callback,errorCallback) {
                ajax.create(dataFactory.pollModel(data.runId), {}, callback, errorCallback);
            }

            var error = function(response){
                toastModel.showToast("error", (response && response.statusText ? response.statusText : "Unknown error!"));
            };
        }
    ]
);