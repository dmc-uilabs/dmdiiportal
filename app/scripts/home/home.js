'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc').controller('HomeCtr',['$scope',function($scope){
    $scope.pageName = "home";
    $scope.pages = [
        {
            name : "My Dashboard",
            text : "Design Solutions",
            href : "#/dashboard",
            img : "home-dashboard-icon.png"
        },
        {
            name : "Marketplace",
            text : "Find Solutions",
            href : "#/marketplace/services",
            img : "home-market-icon.png"
        },
        {
            name : "Community",
            text : "Find People",
            href : "#/community",
            img : "home-community-icon.png"
        }
    ];
}]);
