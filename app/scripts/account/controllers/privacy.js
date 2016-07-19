'use strict';
angular.module('dmc.account')
    .controller('PrivacyAccountCtr', [
        '$stateParams',
        '$state',
        "$scope",
        "location",
        "accountData",
        "AccountModel",
        "$timeout",
        "questionToastModel",
        function ($stateParams,
                  $state,
                  $scope,
                  location,
                  accountData,
                  AccountModel,
                  $timeout,
                  questionToastModel) {
            $scope.accountData = accountData;
            $scope.accountId = $stateParams.accountId;
            $scope.page = $state.current.name.split('.')[1];
            $scope.title = pageTitles[$scope.page];

            $scope.userBasics = $.extend(true,{},accountData);
            if($scope.userBasics.email && $scope.userBasics.email.indexOf('@') != -1) {
                if (!$scope.userBasics.privacy.public.email.value || $scope.userBasics.privacy.public.email.value.length == 0) $scope.userBasics.privacy.public.email.value = $scope.userBasics.email;
                if (!$scope.userBasics.privacy.private.email.value || $scope.userBasics.privacy.private.email.value.length == 0) $scope.userBasics.privacy.private.email.value = $scope.userBasics.email;
            }
            if($scope.userBasics.location && $scope.userBasics.location.length != 0) {
                if (!$scope.userBasics.privacy.public.location.value || $scope.userBasics.privacy.public.location.value.length == 0) $scope.userBasics.privacy.public.location.value = $scope.userBasics.location;
                if (!$scope.userBasics.privacy.private.location.value || $scope.userBasics.privacy.private.location.value.length == 0) $scope.userBasics.privacy.private.location.value = $scope.userBasics.location;
            }
            var currentContainer = null;
            var callback = function(success,data){
                if(success == true) {
                    $scope.userBasics.privacy[currentContainer].location.value = data.city+", "+data.region;
                    $scope.changedValue(currentContainer,'location',$scope.userBasics.privacy[currentContainer].location.value);
                }
            };

            $scope.getLocation = function(container){
                currentContainer = container;
                location.get(callback);
            };

            var information_ = {
                email : {
                    title : "Email",
                    icon : "email"
                },
                phone : {
                    title : "Phone",
                    icon : "phone"
                },
                location : {
                    title : "Location",
                    icon : "gps_fixed"
                }
            };

            // auto focus for edit first input
            $timeout(function() {
                $(".information-item:first input").focus();
            });

            $scope.changedCheckbox = function(block,name,value){
                if(!$scope.changedValues) $scope.changedValues = {};
                if(!$scope.changedValues.changedCheckbox) $scope.changedValues.changedCheckbox = {};
                if(!$scope.changedValues.changedCheckbox[block]) $scope.changedValues.changedCheckbox[block] = {};
                $scope.changedValues.changedCheckbox[block][name] = value;
                $timeout(function() {
                    $("#edit_"+block+"_"+name+" input").focus();
                });
            };

            $scope.changedValue = function(block,name,value){
                if(!$scope.changedValues) $scope.changedValues = {};
                if(!$scope.changedValues.changedValue) $scope.changedValues.changedValue = {};
                if(!$scope.changedValues.changedValue[block]) $scope.changedValues.changedValue[block] = {};
                $scope.changedValues.changedValue[block][name] = value;
                apply();
            };

            $scope.cancelChanges = function(){
                for(var category in $scope.changedValues){
                    for(var block in $scope.changedValues[category]) {
                        for(var key in $scope.changedValues[category][block]) {
                            var item = (category === "changedCheckbox" ? "enable" : "value");
                            $scope.userBasics.privacy[block][key][item] = $scope.accountData.privacy[block][key][item];
                            if(item == "enable") $scope.userBasics.privacy[block][key][item] = ($scope.userBasics.privacy[block][key][item] == true || $scope.userBasics.privacy[block][key][item] == "true" ? true : false);
                        }
                    }
                }
                $scope.changedValues = null;
            };

            $scope.saveChanges = function(){
                AccountModel.update($scope.userBasics);
                $scope.changedValues = null;
            };

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if ($scope.changedValues && current.match("\/privacy")) {
                    event.preventDefault();
                    questionToastModel.show({
                        question: "Are you sure you want to leave this page without saving?",
                        buttons: {
                            ok: function(){
                                $scope.changedValues = null;
                                window.location = next;
                                $scope.$apply();
                            },
                            cancel: function(){}
                        }
                    }, event);
                }
            });

            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                if($scope.changedValues) return "";
            });

            $scope.keyDown = function(type, container, $event){
                return false;
            };

            $scope.information = {
                public : $.extend(true,{},information_),
                private : $.extend(true,{},information_),
                memberPortal: $.extend(true,{},information_)

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
            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            }
        }]);
