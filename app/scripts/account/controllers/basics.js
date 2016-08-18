'use strict';
angular.module('dmc.account')
    .controller('BasicsAccountCtr', [
        '$stateParams',
        '$state',
        "$scope",
        "$timeout",
        "$q",
        "$mdDialog",
        "ajax",
        "location",
        "$location",
        "accountData",
        "AccountModel",
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
                $scope.activatedText = (!$scope.deactivated ? "Deactivate Account?" : "Activate Account?");
                $scope.user = $.extend(true, {}, accountData);

                var roleCallback = function(response) {
                    if (response.data.roles) {
                        $scope.role = response.data.roles[$scope.user.companyId];
                    } else {
                        $scope.role = null;
                    }
                };

                ajax.get(dataFactory.userAccount($scope.accountId).get, {}, roleCallback);

                var callback = function (success, data) {
                    if (success) {
                        $scope.user.dataLocation = data;
                        $scope.user.location = $scope.user.dataLocation.city + ", " + $scope.user.dataLocation.region;
                        $scope.ctrl.searchText = $scope.user.dataLocation.timezone;
                        $scope.user.timezone = $scope.user.dataLocation.timezone;
                        $scope.changedValue('timezone', $scope.user.timezone);
                        $scope.changedValue('location', $scope.user.location);
                    }

                };

                $scope.getLocation = function () {
                    location.get(callback);
                };

                // auto focus for First Name input
                $timeout(function () {
                    $("#editFirstName").focus();
                });

                $scope.blurInput = function () {
                    if ($scope.user.displayName == null || $scope.user.displayName.trim().length == 0) {
                        $scope.user.displayName = $scope.user.displayName = $scope.user.firstName + ' ' + $scope.user.lastName;
                    }
                };

                $scope.$on('$locationChangeStart', function (event, next, current) {
                    if ($scope.changedValues && current.match("\/basics")) {
                        event.preventDefault();
                        questionToastModel.show({
                            question: "Are you sure you want to leave this page without saving?",
                            buttons: {
                                ok: function(){
                                    $scope.changedValues = null;
                                    window.location = next;
                                    $scope.$apply();
                                },
                                cancel: function(){}
                            }
                        }, event);
                    }
                });


                $(window).unbind('beforeunload');
                $(window).bind('beforeunload', function (event) {
                    if($scope.changedValues) return "";
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

                $scope.changedValue = function (name, value) {
                    if (!$scope.changedValues) $scope.changedValues = {};
                    $scope.changedValues[name] = value;
                    if (name == "firstName" || name == "lastName") {
                        $scope.user.displayName = $scope.user.displayName = $scope.user.firstName + ' ' + $scope.user.lastName;
                    }
                };

                $scope.cancelChanges = function () {
                    for (var item in $scope.changedValues) {
                        $scope.user[item] = $scope.accountData[item];
                        if (item == 'timezone') {
                            $scope.ctrl.searchText = $scope.accountData[item];
                        }
                    }
                    $scope.changedValues = null;
                };

                $scope.saveChanges = function () {
                    if ($scope.changedValues) {
                        if (!validateEmail($scope.user.email)) {
                            $scope.user.email = $scope.accountData.email;
                        }
                        AccountModel.update($scope.user);
                        $scope.changedValues = null;
                    }
                };

                $scope.openModal = function() {
                    console.log($scope.user);
                    $mdDialog.show({
                        contentElement: '#addToken',
                        parent: angular.element(document.body)
                    });
                }
                var tokenCallback = function(response) {
                    $scope.res = response.data;

                    if($scope.res.responseCode === 0) {
                        $scope.user.isVerified = true;
                    } else {
                        $scope.error = $scope.res.responseDescription;
                    }
                }
                $scope.verifyToken = function() {
                    if ($scope.token && $scope.token.trim().length > 0) {
                        $scope.error = '';
                        ajax.create(dataFactory.verifyToken($scope.userId), {token: $scope.token}, tokenCallback);
                    } else {
                        $scope.error = "You MUST enter a token";
                    }
                }

                $scope.suffixes = [
                    {
                        id: 1,
                        title: "S1"
                    },
                    {
                        id: 2,
                        title: "S2"
                    }
                ];

                $scope.salutations = [
                    {
                        id: 1,
                        title: "T1"
                    },
                    {
                        id: 2,
                        title: "T2"
                    },
                    {
                        id: 3,
                        title: "T3"
                    }
                ];

                $scope.actionYes = function () {
                    $scope.accountData.deactivated = ($scope.deactivated ? false : true);
                    ajax.update(dataFactory.deactivateAccount($scope.accountData.id), {
                            deactivated: $scope.accountData.deactivated
                        }, function (response) {
                            if (!$scope.deactivated) {
                                toastModel.showToast('success', "Account successfully deactivated");
                                $scope.activatedText = "Activate My Account";
                                $scope.deactivated = true;
                            } else {
                                toastModel.showToast('success', "Account successfully activated");
                                $scope.activatedText = "Deactivate My Account";
                                $scope.deactivated = false;
                            }
                        }
                    );
                };

                $scope.actionNo = function () {
                    console.log("No");
                };

                $scope.deactivateAccount = function (ev) {
                    questionToastModel.show({
                        question: (!$scope.deactivated ? "Deactivate Account?" : "Activate Account?"),
                        buttons: {
                            ok: $scope.actionYes,
                            cancel: $scope.actionNo
                        }
                    }, ev);
                };
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(state) {
                    return (state.value.indexOf(lowercaseQuery) != -1);
                };
            }

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            function selectedItemChange(item) {
                if (!item || !item.display) {
                    $scope.user.timezone = null;
                } else {
                    $scope.user.timezone = item.display;
                }
                $scope.changedValue('timezone', $scope.user.timezone);
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
                                if (t < 10) t = "0" + t;
                                t = "(UTC -" + t + ":00)";
                            } else if (t < 0) {
                                t *= -1;
                                if (t < 10) t = "0" + t;
                                t = "(UTC +" + t + ":00)";
                            } else {
                                t = "(UTC 00:00)";
                            }
                            $scope.zones.push(t + " " + zones[i]);
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

            function searchTextChange(text) {
                if (text.trim().length == 0) {
                    $scope.user.timezone = null;
                    $scope.changedValue('timezone', $scope.user.timezone);
                }
            }
        }]);
