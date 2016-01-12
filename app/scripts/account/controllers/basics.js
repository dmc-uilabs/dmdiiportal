'use strict';
angular.module('dmc.account')
    .controller('BasicsAccountCtr', [ '$stateParams', '$state', "$scope","$timeout", "$q", "ajax", "location","accountData","accountUpdate", function ($stateParams, $state, $scope,$timeout,$q, ajax, location,accountData,accountUpdate) {
        $scope.accountData = accountData;
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

        $scope.user = $.extend(true,{},accountData);
        var callback = function(success,data){
            if(success) {
                $scope.user.dataLocation = data;
                $scope.user.location = $scope.user.dataLocation.city + ", " + $scope.user.dataLocation.region;
                $scope.ctrl.searchText = $scope.user.dataLocation.timezone;
                $scope.user.timezone = $scope.user.dataLocation.timezone;
                $scope.changedValue('timezone',$scope.user.timezone);
                $scope.changedValue('location',$scope.user.location);
            }
        };

        $scope.getLocation = function(){
            location.get(callback);
        };

        $scope.zones = [];
        $scope.ctrl = {};
        $scope.ctrl.simulateQuery = false;
        $scope.ctrl.isDisabled    = false;
        // list of `state` value/display objects
        $scope.ctrl.states        = loadAll();
        $scope.ctrl.querySearch   = querySearch;
        $scope.ctrl.selectedItemChange = selectedItemChange;
        $scope.ctrl.searchTextChange   = searchTextChange;

        $scope.ctrl.searchText = $scope.user.timezone;

        function querySearch (query) {
            var results = query ? $scope.ctrl.states.filter( createFilterFor(query) ) : $scope.ctrl.states,
                deferred;
            if ($scope.ctrl.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }
        function searchTextChange(text) {
            if(text.trim().length == 0){
                $scope.user.timezone = null;
                $scope.changedValue('timezone',$scope.user.timezone);
            }
        }
        function selectedItemChange(item) {
            if(!item || !item.display) {
                $scope.user.timezone = null;
            }else {
                $scope.user.timezone = item.display;
            }
            $scope.changedValue('timezone',$scope.user.timezone);
        }

        function loadAll() {
            if($scope.zones.length == 0) {
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
            return $scope.zones.map( function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }
        /**
         * Create filter function for a query string
         */
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
        $scope.changedValue = function(name,value){
            if(!$scope.changedValues) $scope.changedValues = {};
            $scope.changedValues[name] = value;
        };

        $scope.cancelChanges = function(){
            for(var item in $scope.changedValues){
                $scope.user[item] = $scope.accountData[item];
                if(item == 'timezone'){
                    $scope.ctrl.searchText = $scope.accountData[item];
                }
            }
            $scope.changedValues = null;
        };

        $scope.saveChanges = function(){
            if(!validateEmail($scope.user.email)) {
                $scope.user.email = $scope.accountData.email;
            }
            accountUpdate.update($scope.user);
            $scope.changedValues = null;
        };

        $scope.suffixes = [
            {
                id : 1,
                title : "S1"
            },
            {
                id : 2,
                title : "S2"
            }
        ];

        $scope.salutations = [
            {
                id : 1,
                title : "T1"
            },
            {
                id : 2,
                title : "T2"
            },
            {
                id : 3,
                title : "T3"
            }
        ];
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
}]);