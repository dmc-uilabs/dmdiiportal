'use strict';
angular.module('dmc.account')
    .controller('NotificationsAccountCtr', [ '$stateParams', '$state', "$scope","accountData", function ($stateParams, $state, $scope,accountData) {
        $scope.accountData = accountData;
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

        $scope.disableAll = function(type){
            for(var block in $scope.notifications[type].data){
                for(var item in $scope.notifications[type].data[block].data){
                    $scope.notifications[type].data[block].data[item].disabled = false;
                }
            }
        };

        $scope.enableAll = function(type){
            for(var block in $scope.notifications[type].data){
                for(var item in $scope.notifications[type].data[block].data){
                    $scope.notifications[type].data[block].data[item].disabled = true;
                }
            }
        };

        $scope.notifications = {
            email : {
                title : "Email",
                data : {
                    marketplace : {
                        title : "Marketplace",
                        data : [
                            { text : "Your component/service is reviewed" },
                            { text : "Your component/service is favorited" },
                            { text : "Component/service is shared with you" }
                        ]
                    },
                    community : {
                        title : "Community",
                        data : [
                            { text : "User requests to be contacts" },
                            { text : "User accepts contact request" },
                            { text : "User reviews you" },
                            { text : "User follows you" },
                            { text : "User you follow publishes a new dicussion" },
                            { text : "User comments on a Discussion you posted" }
                        ]
                    },
                    projects : {
                        title : "Projects",
                        data : [
                            { text : "User invites you to a project" },
                            { text : "User accepts your project invitation" },
                            { text : "Service completes" },
                            { text : "Service fails" },
                            { text : "You are assigned to a task" },
                            { text : "Change in priority status of task" },
                            { text : "You receive a question" },
                            { text : "You receive a project submission" }
                        ]
                    }
                }
            },
            website : {
                title : "Website",
                data : {
                    marketplace : {
                        title : "Marketplace",
                        data : [
                            { text : "Your component/service is reviewed" },
                            { text : "Your component/service is favorited" },
                            { text : "Component/service is shared with you" }
                        ]
                    },
                    community : {
                        title : "Community",
                        data : [
                            { text : "User requests to be contacts" },
                            { text : "User accepts contact request" },
                            { text : "User reviews you" },
                            { text : "User follows you" },
                            { text : "User you follow publishes a new dicussion" },
                            { text : "User comments on a Discussion you posted" }
                        ]
                    },
                    projects : {
                        title : "Projects",
                        data : [
                            { text : "User invites you to a project" },
                            { text : "User accepts your project invitation" },
                            { text : "Service completes" },
                            { text : "Service fails" },
                            { text : "You are assigned to a task" },
                            { text : "Change in priority status of task" },
                            { text : "You receive a question" },
                            { text : "You receive a project submission" }
                        ]
                    }
                }
            }
        };
}]);