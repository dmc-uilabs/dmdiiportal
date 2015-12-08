'use strict';
angular.module('dmc.account')
.controller('BasicsAccountCtr', [ '$stateParams', '$state', "$scope", function ($stateParams, $state, $scope) {
    $scope.accountId = $stateParams.accountId;
    $scope.page = $state.current.name.split('.')[1];
    $scope.title = pageTitles[$scope.page];

    $scope.user = {
        firstName : null,
        lastName : null,
        email : null,
        salutation : null,
        suffix : null,
        location : null
    };

    $scope.suffixes = [
        {
            id : 1,
            title : "Suffix 1"
        },
        {
            id : 2,
            title : "Suffix 2"
        }
    ];

    $scope.salutations = [
        {
            id : 1,
            title : "Salutation 1"
        },
        {
            id : 2,
            title : "Salutation 2"
        },
        {
            id : 3,
            title : "Salutation 3"
        }
    ];
}]);