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
            website : {
                title : "Website",
                data : {
                    general : {
                        title : "General",
                        data : [
                            { text : "User messages me" },
                            { text : "DMC posts an event" },
                            { text : "DMC posts an update" },
                            { text : "DMC system updates" }
                        ]
                    },
                    community : {
                        title : "Community",
                        data : [
                            { text : "User requests to be a contact" },
                            { text : "User accepts contact request" },
                            { text : "User reviews you" },
                            { text : "User follows you" },
                            { text : "User you follow publishes a new dicussion" },
                            { text : "User comments on your Discussion" }
                        ]
                    },
                    marketplace : {
                        title : "Marketplace",
                        data : [
                            { text : "Your component/service is reviewed" },
                            { text : "Your component/service is favorited" },
                            { text : "Component/service is shared with you" }
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
                            { text : "You receive a question on your project" },
                            { text : "You receive a submission for your project" }
                        ]
                    }
                }
            },
            email : {
                title : "Email",
                data : {
                    general : {
                        title : "General",
                        data : [
                            { text : "User messages me" },
                            { text : "DMC posts an event" },
                            { text : "DMC posts an update" },
                            { text : "DMC system updates" }
                        ]
                    },
                    community : {
                        title : "Community",
                        data : [
                            { text : "User requests to be a contact" },
                            { text : "User accepts contact request" },
                            { text : "User reviews you" },
                            { text : "User follows you" },
                            { text : "User you follow publishes a new dicussion" },
                            { text : "User comments on your Discussion" }
                        ]
                    },
                    marketplace : {
                        title : "Marketplace",
                        data : [
                            { text : "Your component/service is reviewed" },
                            { text : "Your component/service is favorited" },
                            { text : "Component/service is shared with you" }
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
                            { text : "You receive a question on your project" },
                            { text : "You receive a submission for your project" }
                        ]
                    }
                }
            }
        };
}]);