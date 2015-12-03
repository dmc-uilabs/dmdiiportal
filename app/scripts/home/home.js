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
            href : "dashboard.php",
            img : "home-dashboard-icon.png"
        },
        {
            name : "Marketplace",
            text : "Find Solutions",
            href : "marketplace.php",
            img : "home-market-icon.png"
        },
        {
            name : "Community",
            text : "Find People",
            href : "community.php",
            img : "home-community-icon.png"
        }
    ];
}]);
