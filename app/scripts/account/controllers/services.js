'use strict';
angular.module('dmc.account')
    .controller('ServicesAccountCtr', [ '$stateParams', '$state', "$scope","accountData", function ($stateParams, $state, $scope,accountData) {
        $scope.accountData = accountData;
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

}]);