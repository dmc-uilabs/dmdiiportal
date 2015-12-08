'use strict';
angular.module('dmc.account')
    .controller('PrivacyAccountCtr', [ '$stateParams', '$state', "$scope", function ($stateParams, $state, $scope) {
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];


        var information_ = {
            email : {
                checked : false,
                title : "Email",
                value : null,
                icon : "email"
            },
            phone : {
                checked : false,
                title : "Phone",
                value : null,
                icon : "phone"
            },
            location : {
                checked : false,
                title : "Location",
                value : null,
                icon : "gps_fixed"
            }
        };

        $scope.information = {
            public : $.extend(true,{},information_),
            private : $.extend(true,{},information_)
        };

        $scope.blockedUser = [
            {
                id : 1,
                fullName : "John Doe 1"
            },
            {
                id : 2,
                fullName : "John Doe 2"
            },
            {
                id : 3,
                fullName : "John Doe 3"
            },
            {
                id : 4,
                fullName : "John Doe 4"
            }
        ];

        $scope.deleteBlockedUser = function(id){
            for(var index in $scope.blockedUser){
                if($scope.blockedUser[index].id === id){
                    $scope.blockedUser.splice(index,1);
                    break;
                }
            }
        };
}]);