'use strict';

angular.module('dmc.account').directive('accountMenu', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/account/menu-tpl.html',
        scope: {
            accountId : "=",
            page : "="
        },
        controller: function($scope, $element, $attrs) {
            $scope.menu = {
                basics : {
                    title : pageTitles.basics,
                    url : "/account.php#/"+$scope.accountId+"/basics",
                    selected : ($scope.page == "basics" ? true : false)
                },
                privacy : {
                    title : pageTitles.privacy,
                    url : "/account.php#/"+$scope.accountId+"/privacy",
                    selected : ($scope.page == "privacy" ? true : false)
                },
                notifications : {
                    title : pageTitles.notifications,
                    url : "/account.php#/"+$scope.accountId+"/notifications",
                    selected : ($scope.page == "notifications" ? true : false)
                },
                //profile : {
                //    title : pageTitles.profile,
                //    url : "/account.php#/"+$scope.accountId+"/profile",
                //    selected : ($scope.page == "profile" ? true : false)
                //},
                servers : {
                    title : pageTitles.servers,
                    url : "/account.php#/"+$scope.accountId+"/servers",
                    selected : ($scope.page == "servers" ? true : false)
                }
            };
        }
    };
}]);