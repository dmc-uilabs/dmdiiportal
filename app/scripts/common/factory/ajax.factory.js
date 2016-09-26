'use strict';

angular.module('dmc.ajax',[
    'dmc.model.toast-model'
])
.config(function($httpProvider){
  $httpProvider.interceptors.push('logoutInterceptor');
})
    .factory('ajax', [
        "$http",
        "dataFactory",
        "$rootScope",
        "toastModel",
        function (
            $http,
            dataFactory,
            $rootScope,
            toastModel) {

            var errorCallback = function(response){
                toastModel.showToast("error", (response && response.statusText ? response.statusText : "Unknown error!"));
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

            var multipartRequest = function(urlAddress, dataObject, successFunction, errorFunction, method) {
                 var fileObject = _.find(dataObject.inParams, _.matchesProperty("type", "File"));

                 var serviceData = JSON.stringify(dataObject);
                 var fd = new FormData();
                 fd.append('file', fileObject.value);
                 fd.append('service', serviceData);

                 var config = {
                    url: urlAddress,
                    method: method,
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined
                    },
                    data: fd
                };

                return $http(config).then(successFunction, (errorFunction ? errorFunction : errorCallback));
            }

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
                },
                put: function(urlAddress,dataObject,successFunction,errorFunction){
                    return request(urlAddress,dataObject,successFunction,errorFunction,"PUT");
                },
                multipart: function(urlAddress, dataObject, successFunction, errorFunction){
                    return multipartRequest(urlAddress,dataObject,successFunction,errorFunction,"POST");
                },
                loadProjects: function(){
                    this.get(
                        dataFactory.getProjects(), {
                            _order: "DESC",
                            _sort: "id"
                        },
                        function(response){
                            $rootScope.projects = response.data;
                        }
                    );
                }
            };
        }
    ]
).factory('logoutInterceptor', ['$q', '$window', function($q, $window) {
  return {
   responseError: function(rejection) {
      if (rejection.status == 403) {
        $window.location.href=$window.location.origin;
      }
      return $q.reject(rejection);
    }
  };
}]);
