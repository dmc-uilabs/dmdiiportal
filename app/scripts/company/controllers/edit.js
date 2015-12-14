'use strict';
angular.module('dmc.company')
    .controller('EditStorefrontCompanyCtr', [ '$stateParams', '$state', "$scope", "$cookies", "ajax", function ($stateParams, $state, $scope, $cookies, ajax) {
        $scope.companyId = $stateParams.companyId;
        $scope.page = $state.current.name.split('.')[1];

}]);