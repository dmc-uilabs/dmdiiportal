'use strict';

angular.module('dmc.model.user', ['dmc.data', 'dmc.ajax', 'ngCookies'])
    .service('DMCUserModel', ['$http', 'dataFactory', '$q', '$window', '$rootScope', 'ajax', '$cookies', function($http, dataFactory, $q, $window, $rootScope, ajax, $cookies) {

        var _userName = $window.apiUrl ? $window.givenName : 'DMC User';
        // _userName = ''
        $rootScope.isLogged = _userName == ''  ? false : true;
        //$rootScope.isLogged = false;
        // var _user;

        console.log('this is happening');

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

        this.isFromDMDIISignup = function() {
          var fromSignup =  $cookies.get('fromDMDIISignup') ? true : false;
          $cookies.remove('fromDMDIISignup')
          return fromSignup;
        }

        this.resolver = function() {
            var fromDMDIISignup = this.isFromDMDIISignup();

            var deferred = $q.defer();
            if (this.isLoggedIn()) {
                this.getUserData().then(function(response){
                var data = response.data ? response.data : response;
                    // if (fromDMDIISignup && !data.termsConditions) {
                    //     // deferred.reject('User not created');
                    //     deferred.reject('New user from DMDII Signup');
                    // } else if (!data.termsConditions) {
                    //     deferred.reject('User not created');
                    if (fromDMDIISignup) {
                        deferred.reject('New user from DMDII Signup');
                    } else if (!data.termsConditions) {
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

            console.log("user call is happening");

            if ($rootScope.userData && useCached) {
                return $q.when($rootScope.userData);
            } else {
                console.log('get user url: ' + dataFactory.getUserUrl());
                return $http.get(dataFactory.getUserUrl()).then(
                    function(response) {
                        var data = response.data ? response.data : response;
                        // cache user data
                        $rootScope.userData = data;
                        $rootScope.userData.isDmdiiAdmin = ($rootScope.userData.roles && angular.isDefined($rootScope.userData.roles[0])) ? true : false;

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
