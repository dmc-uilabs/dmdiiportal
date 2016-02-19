'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc.dashboard')
    .controller("DashboardController",[
        "$scope",
        "mobileFactory",
        function(
            $scope,
            mobileFactory) {

            $scope.isMobile = mobileFactory.any();

        }
    ]
);
