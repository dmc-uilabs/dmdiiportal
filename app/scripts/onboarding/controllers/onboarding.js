angular.module('dmc.onboarding')
.controller('onboardingController', ['$scope', 'onboardingModel', 'userData', 'DMCUserModel', '$rootScope',
    function($scope, onboardingModel, userData, DMCUserModel, $rootScope){
        $scope.profile = [
        	{
        		state: ".basic",
        		name: "Basic Information",
        		done: true,
        		data: {
        			displayName: "",
        			jobTitle: "",
        			location: ""
        		}
        	},
        	{
        		state: ".image",
        		name: "Profile Image",
        		done: true,
        		data: {
        			image: ""
        		}
        	},
        	{
        		state: ".skill",
        		name: "Skills",
        		done: true,
        		data: {
        			skills: [],
        			description: ""
        		}
        	}
        ];
    	onboardingModel.get_profile(userData.profileId, function(data){
    		$scope.profile[0].data.displayName = data.displayName;
    		$scope.profile[0].data.jobTitle = data.jobTitle;
    		$scope.profile[0].data.location = data.location;
    		$scope.profile[1].data.image = data.image;
    		$scope.profile[2].data.skills = data.skills;
    		$scope.profile[2].data.description = data.description;
    		for(var i in $scope.profile){
	    		for(var item in $scope.profile[i].data){
	    			if(!$scope.profile[i].data[item] || !$scope.profile[i].data[item].length){
	    				$scope.profile[i].done = false
	    			}
	    		}
	    	}
    	});

    	$scope.saveProfile = function(params, callback){
    		onboardingModel.update_profile(userData.profileId, params, 
    			function(data){
    				for(var i in $scope.profile){
    					$scope.profile[i].done = true;
			    		for(var item in $scope.profile[i].data){
			    			if(!$scope.profile[i].data[item] || !$scope.profile[i].data[item].length){
			    				console.info($scope.profile[i].data[item]);
			    				$scope.profile[i].done = false;
			    			}
			    		}
			    	};
			    	callback();
    			}
    		);
    	}


        $scope.account = [
        	{
        		state: ".public",
        		name: "Public Information",
        		done: false,
        		data: {
					email: {
						enable: true,
						value: ""
					},
					phone: {
						enable: true,
						value: ""
					},
					location: {
						enable: true,
						value: ""
					}
        		}
        	},
        	{
        		state: ".private",
        		name: "Private Information",
        		done: false,
        		data: {
					email: {
						enable: true,
						value: ""
					},
					phone: {
						enable: true,
						value: ""
					},
					location: {
						enable: true,
						value: ""
					}
        		}
        	},
        	{
        		state: ".web",
        		name: "Web Notifications",
        		done: false,
        		data: {
					1: {
						section: "website",
						"account-notification-category-itemId": 1,
						selected: false
					},
					2: {
						section: "website",
						"account-notification-category-itemId": 2,
						selected: false
					},
					3: {
						section: "website",
						"account-notification-category-itemId": 3,
						selected: false
					},
					4: {
						section: "website",
						"account-notification-category-itemId": 4,
						selected: false
					},
					5: {
						section: "website",
						"account-notification-category-itemId": 5,
						selected: false
					},
					6: {
						section: "website",
						"account-notification-category-itemId": 6,
						selected: false
					},
					7: {
						section: "website",
						"account-notification-category-itemId": 7,
						selected: false
					},
					8: {
						section: "website",
						"account-notification-category-itemId": 8,
						selected: false
					},
					9: {
						section: "website",
						"account-notification-category-itemId": 9,
						selected: false
					},
					10: {
						section: "website",
						"account-notification-category-itemId": 10,
						selected: false
					},
					11: {
						section: "website",
						"account-notification-category-itemId": 11,
						selected: false
					},
					12: {
						section: "website",
						"account-notification-category-itemId": 12,
						selected: false
					},
					13: {
						section: "website",
						"account-notification-category-itemId": 13,
						selected: false
					},
					14: {
						section: "website",
						"account-notification-category-itemId": 14,
						selected: false
					},
					15: {
						section: "website",
						"account-notification-category-itemId": 15,
						selected: false
					},
					16: {
						section: "website",
						"account-notification-category-itemId": 16,
						selected: false
					},
					17: {
						section: "website",
						"account-notification-category-itemId": 17,
						selected: false
					},
					18: {
						section: "website",
						"account-notification-category-itemId": 18,
						selected: false
					},
					19: {
						section: "website",
						"account-notification-category-itemId": 19,
						selected: false
					},
					20: {
						section: "website",
						"account-notification-category-itemId": 20,
						selected: false
					},
					21: {
						section: "website",
						"account-notification-category-itemId": 21,
						selected: false
					}
        		}
        	},
        	{
        		state: ".email",
        		name: "Email Notifications",
        		done: false,
        		data: {
					1: {
						section: "email",
						"account-notification-category-itemId": 1,
						selected: false
					},
					2: {
						section: "email",
						"account-notification-category-itemId": 2,
						selected: false
					},
					3: {
						section: "email",
						"account-notification-category-itemId": 3,
						selected: false
					},
					4: {
						section: "email",
						"account-notification-category-itemId": 4,
						selected: false
					},
					5: {
						section: "email",
						"account-notification-category-itemId": 5,
						selected: false
					},
					6: {
						section: "email",
						"account-notification-category-itemId": 6,
						selected: false
					},
					7: {
						section: "email",
						"account-notification-category-itemId": 7,
						selected: false
					},
					8: {
						section: "email",
						"account-notification-category-itemId": 8,
						selected: false
					},
					9: {
						section: "email",
						"account-notification-category-itemId": 9,
						selected: false
					},
					10: {
						section: "email",
						"account-notification-category-itemId": 10,
						selected: false
					},
					11: {
						section: "email",
						"account-notification-category-itemId": 11,
						selected: false
					},
					12: {
						section: "email",
						"account-notification-category-itemId": 12,
						selected: false
					},
					13: {
						section: "email",
						"account-notification-category-itemId": 13,
						selected: false
					},
					14: {
						section: "email",
						"account-notification-category-itemId": 14,
						selected: false
					},
					15: {
						section: "email",
						"account-notification-category-itemId": 15,
						selected: false
					},
					16: {
						section: "email",
						"account-notification-category-itemId": 16,
						selected: false
					},
					17: {
						section: "email",
						"account-notification-category-itemId": 17,
						selected: false
					},
					18: {
						section: "email",
						"account-notification-category-itemId": 18,
						selected: false
					},
					19: {
						section: "email",
						"account-notification-category-itemId": 19,
						selected: false
					},
					20: {
						section: "email",
						"account-notification-category-itemId": 20,
						selected: false
					},
					21: {
						section: "email",
						"account-notification-category-itemId": 21,
						selected: false
					}
				}
        	},
        	{
        		state: ".servers",
        		name: "Servers",
        		done: false,
        		data: {}
        	}
        ];

        $scope.storefront = [
        	{
        		state: ".cover",
        		name: "Cover Image",
        		done: false,
        		data: {}
        	},
        	{
        		state: ".description",
        		name: "Description",
        		done: false,
        		data: {
        			description: ""
        		},
        	},
        	{
        		state: ".logo",
        		name: "Logo",
        		done: false,
        		data: {}
        	}
        ];

        $scope.company = [
        	{
        		state: ".describe",
        		name: "Company",
        		done: false,
        		data: {
        			name: "",
        			division: "",
        			industry: "",
        			NAICSCode: "",
        			description: ""
        		}
        	},
        	{
        		state: ".image",
        		name: "Company Image",
        		done: false,
        		data: {}
        	},
        	{
        		state: ".focus",
        		name: "R&D Focus",
        		done: false,
        		data: {
        			RDFocus: ""
        		}
        	},
        	{
        		state: ".accomplishments",
        		name: "Accomplishments",
        		done: false,
        		data: {
        			customers: "",
        			awardsReceived: ""
        		}
        	},
        	{
        		state: ".media",
        		name: "Media",
        		done: false,
        		data: {}
        	},
        	{
        		state: ".tool",
        		name: "Skills & Tools",
        		done: false,
        		data: {
        			technicalExpertise: "",
        			toolsSoftwareEquipmentMachines: "",
        			skills: []
        		}
        	},
        	{
        		state: ".projects",
        		name: "Projects",
        		done: false,
        		data: {
        			pastCollaborations: "",
					pastProjects: "",
        			collaborationInterests: "",
        			upcomingProjectInterests: ""
        		}
        	},
        	{
        		state: ".contact",
        		name: "Contact",
        		done: false,
        		data: {
        			address: "",
        			city: "",
        			state: "",
        			"zip-code": "",
        			methodCommunication: "",
        			email: "",
        			phone: ""
        		}
        	},
        	{
        		state: ".social",
        		name: "Social Media",
        		done: false,
        		data: {
        			twitter: "",
        			linkedIn: "",
        			website: ""
        		}
        	},
        	{
        		state: ".key",
        		name: "Key Contacts",
        		done: false,
        		data: {}
        	},
        	{
        		state: ".membership",
        		name: "Membership",
        		done: false,
        		data: {
        			categoryTier: "",
        			dateJoined: "",
        			reasonJoining: ""
        		}
        	}
        ]

        $scope.saveFinish = function(section){
        	var allDone = true;
        	for(var i in $scope[section]){
        		console.info($scope[section][i]);
        		if(!$scope[section][i].done){
        			allDone = false;
        			break;
        		}
        	}
        	DMCUserModel.getUserData().then(function(result){
        		console.info(result, allDone);
		      	$rootScope.userData.onboarding[section] = allDone;
		      	DMCUserModel.UpdateUserData($rootScope.userData);
		});
        }
    }])