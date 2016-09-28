'use strict';
angular.module('dmc.account')
    .controller('BasicsAccountCtr', [
        '$stateParams',
        '$state',
        '$scope',
        '$timeout',
        '$q',
        '$mdDialog',
        'ajax',
        'location',
        '$location',
        'accountData',
        'AccountModel',
        'questionToastModel',
        '$document',
        'toastModel',
        'dataFactory',
        function ($stateParams,
                  $state,
                  $scope,
                  $timeout,
                  $q,
                  $mdDialog,
                  ajax,
                  location,
                  $location,
                  accountData,
                  AccountModel,
                  questionToastModel,
                  $document,
                  toastModel,
                  dataFactory) {
            $scope.accountData = accountData;
            if($scope.accountData && $scope.accountData.id) {
                $scope.accountId = $stateParams.accountId;
                $scope.page = $state.current.name.split('.')[1];
                $scope.title = pageTitles[$scope.page];
                $scope.deactivated = $scope.accountData.deactivated;
                $scope.activatedText = (!$scope.deactivated ? 'Deactivate Account?' : 'Activate Account?');
                $scope.user = $.extend(true, {}, accountData);

                var roleCallback = function(response) {
                    if (response.data.roles && response.data.roles[$scope.accountData.companyId]) {
                        $scope.role = response.data.roles[$scope.accountData.companyId];
                        $scope.isVerified = true;
                    } else {
                        $scope.role = null;
                    }

                    if($scope.accountData.companyId) {
                        ajax.get(dataFactory.getCompanyUrl($scope.accountData.companyId), {}, function(response) {
                            $scope.ctrl.searchCompany = response.data.name;
                            $scope.ctrl.selectCompany = response.data;
                        });
                    }
                };

                ajax.get(dataFactory.userAccount($scope.accountId).get, {}, roleCallback);

                var callback = function (success, data) {
                    if (success) {
                        $scope.user.dataLocation = data;
                        $scope.user.location = $scope.user.dataLocation.city + ', ' + $scope.user.dataLocation.region;
                        $scope.ctrl.searchText = $scope.user.dataLocation.timezone;
                        $scope.user.timezone = $scope.user.dataLocation.timezone;
                    }

                };

                $scope.getLocation = function () {
                    location.get(callback);
                };

                $scope.resendNotification = function() {
                    ajax.create(dataFactory.requestVerification(), {}, function(response) {
                        console.log(response)
                    });
                }
                // auto focus for First Name input
                $timeout(function () {
                    $('input').each(function(){
                        $(this).trigger('blur');
                        //each input event one by one... will be blured
                    })
                    $('#editFirstName').focus();
                }, 500);

                $scope.blurInput = function () {
                    if ($scope.user.displayName == null || $scope.user.displayName.trim().length == 0) {
                        $scope.user.displayName = $scope.user.displayName = $scope.user.firstName + ' ' + $scope.user.lastName;
                    }
                };

                $(window).unbind('beforeunload');
                $(window).bind('beforeunload', function (event) {
                });

                $scope.zones = [];
                $scope.ctrl = {};
                $scope.ctrl.simulateQuery = false;
                $scope.ctrl.isDisabled = false;
                // list of `state` value/display objects
                $scope.ctrl.states = loadAll();
                $scope.ctrl.querySearch = querySearch;
                $scope.ctrl.selectedItemChange = selectedItemChange;
                $scope.ctrl.searchTextChange = searchTextChange;
                $scope.ctrl.searchText = $scope.user.timezone;
                $scope.ctrl.setCompany = setCompany;
                $scope.ctrl.queryCompanySearch = queryCompanySearch;
                $scope.ctrl.searchCompanyChange = searchCompanyChange;


                $scope.saveChanges = function () {
                    if (!validateEmail($scope.user.email)) {
                        $scope.user.email = $scope.accountData.email;
                    }
                    ajax.update(dataFactory.updateUser(), $scope.user, function(response) {
                        toastModel.showToast('success', 'User updated successfully!');
                    });
                    // AccountModel.update($scope.user);
                };

                var getAllCompanies = function(){
                    ajax.get(dataFactory.companyURL().all,{},function(response){
                        $scope.ctrl.companies = response.data;
                    });
                }
                getAllCompanies();

                $scope.token = {};

                var tokenCallback = function(response) {
                    $scope.res = response.data;

                    if($scope.res.responseCode === 0) {
                        $scope.isVerified = true;
                    } else {
                        $scope.error = $scope.res.responseDescription;
                    }
                }

                $scope.verifyToken = function() {
                    if ($scope.token && $scope.token.token.trim().length > 0) {
                        $scope.error = '';
                        ajax.put(dataFactory.validateToken($scope.user.id), {token: $scope.token.token}, tokenCallback);
                    } else {
                        $scope.error = 'You MUST enter a token';
                    }
                }

                $scope.suffixes = [
                    {
                        id: 1,
                        title: 'S1'
                    },
                    {
                        id: 2,
                        title: 'S2'
                    }
                ];

                $scope.salutations = [
                    {
                        id: 1,
                        title: 'T1'
                    },
                    {
                        id: 2,
                        title: 'T2'
                    },
                    {
                        id: 3,
                        title: 'T3'
                    }
                ];

                $scope.actionYes = function () {
                    $scope.accountData.deactivated = ($scope.deactivated ? false : true);
                    ajax.update(dataFactory.deactivateAccount($scope.accountData.id), {
                            deactivated: $scope.accountData.deactivated
                        }, function (response) {
                            if (!$scope.deactivated) {
                                toastModel.showToast('success', 'Account successfully deactivated');
                                $scope.activatedText = 'Activate My Account';
                                $scope.deactivated = true;
                            } else {
                                toastModel.showToast('success', 'Account successfully activated');
                                $scope.activatedText = 'Deactivate My Account';
                                $scope.deactivated = false;
                            }
                        }
                    );
                };

                $scope.actionNo = function () {
                    console.log('No');
                };

                $scope.deactivateAccount = function (ev) {
                    questionToastModel.show({
                        question: (!$scope.deactivated ? 'Deactivate Account?' : 'Activate Account?'),
                        buttons: {
                            ok: $scope.actionYes,
                            cancel: $scope.actionNo
                        }
                    }, ev);
                };
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(item) {
                    return (item.value.indexOf(lowercaseQuery) != -1);
                };
            }

            function createCompanyFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(item) {
                    return (item.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            }

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            function selectedItemChange(item) {
                if (!item || !item.display) {
                    $scope.user.timezone = null;
                } else {
                    $scope.user.timezone = item.display;
                }
            }

            function loadAll() {
                if ($scope.zones.length == 0) {
                    var zones = moment.tz.names();
                    for (var i = 0; i < zones.length; i++) {
                        var zone = moment.tz.zone(zones[i]);
                        if (Date.UTC(2012, 1, 1)) {
                            var time = Math.round((zone.parse(Date.UTC(2012, 1, 1)) / 60));
                            var t = time;
                            if (t > 0) {
                                if (t < 10) t = '0' + t;
                                t = '(UTC -' + t + ':00)';
                            } else if (t < 0) {
                                t *= -1;
                                if (t < 10) t = '0' + t;
                                t = '(UTC +' + t + ':00)';
                            } else {
                                t = '(UTC 00:00)';
                            }
                            $scope.zones.push(t + ' ' + zones[i]);
                            //$scope.zones.push(zones[i]);
                        }
                    }
                }
                return $scope.zones.map(function (state) {
                    return {
                        value: state.toLowerCase(),
                        display: state
                    };
                });
            }

            function queryCompanySearch(query) {
                console.log($scope.ctrl, query)
                var results = query ? $scope.ctrl.companies.filter( createCompanyFilterFor(query) ) : $scope.ctrl.companies,
                    deferred;
                if ($scope.ctrl.simulateQuery) {
                    deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve(results);
                    }, Math.random() * 1000, false);
                    return deferred.promise;
                } else {
                    return results;
                }
            }

            function setCompany(company) {
                $scope.user.companyId = company.id;
            }

            function querySearch(query) {
                var results = query ? $scope.ctrl.states.filter(createFilterFor(query)) : $scope.ctrl.states,
                    deferred;
                if ($scope.ctrl.simulateQuery) {
                    deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve(results);
                    }, Math.random() * 1000, false);
                    return deferred.promise;
                } else {
                    return results;
                }
            }

            function searchCompanyChange(text) {
                if (text.trim().length == 0) {
                    $scope.user.companyId = null;
                }
            }

            function searchTextChange(text) {
                if (text.trim().length == 0) {
                    $scope.user.timezone = null;
                }
            }
        }]);
