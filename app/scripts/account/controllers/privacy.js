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
		"toastModel",
        "questionToastModel",
		"ajax",
		"dataFactory",
        function ($stateParams,
                  $state,
                  $scope,
                  location,
                  accountData,
                  AccountModel,
                  $timeout,
				  toastModel,
                  questionToastModel,
			  	  ajax,
			  	  dataFactory) {
            // $scope.accountData = accountData;
            $scope.accountId = $stateParams.accountId;
            $scope.page = $state.current.name.split('.')[1];
            $scope.title = pageTitles[$scope.page];

			var getUserCallback = function(response){
				console.log(response.data);
				$scope.userBasics = response.data;
				if ($scope.userBasics.userContactInfo === null) {
					$scope.userBasics.userContactInfo = {
						userPublicContactInfo: {},
						userPrivateContactInfo: {},
						userMemberPortalContactInfo: {}
					}
				}
			}
			$scope.getUser = function() {
				ajax.get(dataFactory.userAccount($scope.accountId).get, {}, getUserCallback);
			}
			$scope.getUser();

            $scope.enabled = {
                private: {
                    email: false,
                    phone: false,
                    location: false
                },
                public: {
                    email: false,
                    phone: false,
                    location: false
                },
                memberPortal: {
                    email: false,
                    phone: false,
                    location: false
                }
            }

            var currentContainer = null;
            var callback = function(success,data){
                if(success == true) {
                    $scope.userBasics.userContactInfo[currentContainer].location.value = data.city+", "+data.region;
                    $scope.changedValue(currentContainer,'location',$scope.userBasics.userContactInfo[currentContainer].location.value);
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
                $scope.userBasics.userContactInfo[block][name] = null;
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
                            $scope.userBasics.userContactInfo[block][key][item] = $scope.accountData.userContactInfo[block][key][item];
                            if(item == "enable") $scope.userBasics.userContactInfo[block][key][item] = ($scope.userBasics.userContactInfo[block][key][item] == true || $scope.userBasics.userContactInfo[block][key][item] == "true" ? true : false);
                        }
                    }
                }
                $scope.changedValues = null;
            };

			var userCallback = function(response) {
				toastModel.showToast('success', 'Successfully saved User!')
			}
            $scope.saveChanges = function(){
				ajax.update(dataFactory.userAccount().save, $scope.userBasics, userCallback);
                // AccountModel.update($scope.userBasics);
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
