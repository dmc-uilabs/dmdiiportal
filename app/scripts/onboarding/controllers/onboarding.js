angular.module('dmc.onboarding')
.controller('onboardingController', ['$scope', 
    function($scope){
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

        $scope.profile = [
        	{
        		state: ".basic",
        		name: "Basic Information",
        		done: false,
        		data: {
        			dispalyName: "",
        			jobTitle: "",
        			location: ""
        		}
        	},
        	{
        		state: ".image",
        		name: "Profile Image",
        		done: false,
        		data: {}
        	},
        	{
        		state: ".skill",
        		name: "Skills",
        		done: false,
        		data: {
        			skills: [],
        			skillsDescription: ""
        		}
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
        			email: ""
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

        $scope.first = false;
    }])