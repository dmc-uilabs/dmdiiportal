'use strict';

angular.module('dmc.model.user', ['dmc.data', 'dmc.ajax'])
    .service('DMCUserModel', ['$http', 'dataFactory', '$q', '$window', '$rootScope', 'ajax', function($http, dataFactory, $q, $window, $rootScope, ajax) {

        var _userName = $window.apiUrl ? $window.givenName : 'DMC User';
        $rootScope.isLogged = _userName == ''  ? false : true;
        // var _user;

        this.getUserName = function() {
            return _userName;
        }

        this.logout = function() {
            $rootScope.isLogged = false;
        }

        this.login = function() {
            $rootScope.isLogged = true;
        }

        this.isLoggedIn = function() {
          return $rootScope.isLogged;
        }

        this.resolver = function() {
            var deferred = $q.defer();
            if (this.isLoggedIn()) {
                this.getUserData().then(function(response){
                var data = response.data ? response.data : response;
                    if (!data.termsConditions) {
                        deferred.reject('User not created');
                    } else {
                        deferred.resolve();
                    }
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        this.getUserData = function(useCached) {
            // return user cached data
            if (useCached === undefined) {
                useCached = true;
            }

            if ($rootScope.userData && useCached) {
                return $q.when($rootScope.userData);
            } else {
                return $http.get(dataFactory.getUserUrl()).then(
                    function(response) {
                        var data = response.data.user ? response.data.user : response;
                        // cache user data
                        $rootScope.userData = data;
                        $rootScope.userData.isDmdiiAdmin = true;
                        // ($rootScope.userData.roles && angular.isDefined($rootScope.userData.roles[0])) ? true : false;

                        return data;
                    },
                    function(response) {
                      return response;
                    }
                )
            }
        };

        this.onboardingBasicInformation = function(info, callback, errorCallback) {
            ajax.create(dataFactory.getOnboardingBasicInfoUrl(), info, callback, errorCallback)
        }

        this.UpdateUserData = function(user) {

            var config = {
                url: dataFactory.getUserUrl(),
                dataType: 'json',
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                data: JSON.stringify(user)
            };

            return $http(config).then(function(response) {
                    var data = response.data ? response.data : response;
                    // cache user data
                    $rootScope.userData = data;
                    return data;
                }
            );

        };
}]);
