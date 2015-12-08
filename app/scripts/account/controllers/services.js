'use strict';
angular.module('dmc.account')
    .controller('ServicesAccountCtr', [ '$stateParams', '$state', "$scope", function ($stateParams, $state, $scope) {
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

}]);