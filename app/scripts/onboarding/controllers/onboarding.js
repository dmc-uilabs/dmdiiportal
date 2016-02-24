angular.module('dmc.onboarding')
.controller('onboardingController', ['$scope', 'onboardingModel', 'userData', 'DMCUserModel', '$rootScope',
    function($scope, onboardingModel, userData, DMCUserModel, $rootScope){
//profile
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
    				/*
    				for(var i in $scope.profile){
    					$scope.profile[i].done = true;
			    		for(var item in $scope.profile[i].data){
			    			if(!$scope.profile[i].data[item] || !$scope.profile[i].data[item].length){
			    				console.info($scope.profile[i].data[item]);
			    				$scope.profile[i].done = false;
			    			}
			    		}
			    	};
			    	*/
			    	callback();
    			}
    		);
    	};

//account
        $scope.account = [
        	{
        		state: ".public",
        		name: "Public Information",
        		done: false,
        		data: {
        			public:{
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
        		}
        	},
        	{
        		state: ".private",
        		name: "Private Information",
        		done: false,
        		data: {
        			private:{
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
        		}
        	},
        	{
        		state: ".web",
        		name: "Web Notifications",
        		done: true,
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
        		done: true,
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
        		data: {
        			servers: []
        		}
        	}
        ];
    	onboardingModel.get_account(userData.accountId, function(data){
    		$scope.account[0].data.public = data.privacy.public;
    		$scope.account[1].data.private = data.privacy.private;
			$scope.account[0].done = true
    		for(var item in $scope.account[0].data.public){
    			if($scope.account[0].data.public[item].enable && !$scope.account[0].data.public[item].value){
    				$scope.account[0].done = false
    			}
    		};
    		$scope.account[1].done = true
    		for(var item in $scope.account[1].data.private){
    			if($scope.account[1].data.private[item].enable && !$scope.account[1].data.private[item].value){
    				$scope.account[1].done = false
    			}
    		}
    	});

    	onboardingModel.get_account_notfications(userData.accountId, function(data){
    		$scope.account[2].done = true
    		$scope.account[3].done = true
    		for(var i in data){
    			if(data[i].section == "website"){
    				$scope.account[2].data[data[i]['account-notification-category-itemId']] = data[i];
    			}else{
    				$scope.account[3].data[data[i]['account-notification-category-itemId']] = data[i];
    			}
    		}
    	});

    	onboardingModel.get_servers(userData.accountId, function(data){
    		$scope.account[4].done = true;
    		$scope.account[4].data.servers = data;
			if(!$scope.account[4].data.servers.length){
				$scope.account[4].done = false;
			}
    	})

    	$scope.saveAccount = function(params, section, callback){
    		if(section == "privacy"){
	    		onboardingModel.update_account(userData.profileId, params, 
	    			function(data){
	    				/*
						$scope.account[0].done = true
			    		for(var item in $scope.account[0].data.public){
			    			if($scope.account[0].data.public[item].enable && !$scope.account[0].data.public[item].value){
			    				$scope.account[0].done = false
			    			}
			    		};
			    		$scope.account[1].done = true
			    		for(var item in $scope.account[1].data.private){
			    			if($scope.account[1].data.private[item].enable && !$scope.account[1].data.private[item].value){
			    				$scope.account[1].done = false
			    			}
			    		}
			    		*/
				    	callback();
	    			}
	    		);
	    	}else if(section == "notifications"){
	    		for(var i in params){
	    			onboardingModel.update_notfications(params[i].id, params[i].selected, callback);
	    		}
	    	}
    	};

//company
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
        		data: {
        			featureImage: {
				        thumbnail: "",
				        large: ""
			      	}
        		}
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
        		data: {
        			images: [],
        			videos: []
        		}
        	},
        	{
        		state: ".tool",
        		name: "Skills & Tools",
        		done: false,
        		data: {
        			technicalExpertise: "",
        			toolsSoftwareEquipmentMachines: "",
        			skills: [],
        			skillsImages: []
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
        			zipCode: "",
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
        		data: {
        			keyContacts: []
        		}
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
        ];

    	$scope.saveCompany = function(params, callback){
    		onboardingModel.update_company(userData.companyId, params, 
    			function(data){

    				/*
		        	for(var i in $scope.company){
		    			$scope.company[i].done = true;
		    			switch(i){
		    				case '1':
			    				if(!$scope.company[i].data.featureImage.thumbnail || !$scope.company[i].data.featureImage.large){
									$scope.company[i].done = false
			    				};
			    				break;
			    			case '4':
			    			case '5':
			    			case '9':
				    			for(var item in $scope.company[i].data){
					    			if(!$scope.company[i].data[item] || !$scope.company[i].data[item].length){
					    				$scope.company[i].done = false
					    			}
					    		};
			    				break;
		    				case '7': 
		    					for(var item in $scope.company[i].data){
		    						if(!$scope.company[i].data[item] && item != 'phone' && item != 'email'){
					    				$scope.company[i].done = false
					    			}
					    		};
					    		break;
					    	default:
		    					for(var item in $scope.company[i].data){
		    						if(!$scope.company[i].data[item]){
					    				$scope.company[i].done = false
					    			}
					    		};
		    			}
			    	}
			    	*/
			    	callback();
    			}
    		);
    	};

//storefront
        $scope.storefront = [
        	{
        		state: ".cover",
        		name: "Cover Image",
        		done: true,
        		data: {
        			featureImage: {
				        thumbnail: "",
				        large: ""
			      	}
        		}
        	},
        	{
        		state: ".description",
        		name: "Description",
        		done: true,
        		data: {
        			description: ""
        		},
        	},
        	{
        		state: ".logo",
        		name: "Logo",
        		done: true,
        		data: {
        			logoImage: ""
        		}
        	}
        ];

    	$scope.saveStorefront = function(params, callback){
    		onboardingModel.update_company(userData.companyId, params, 
    			function(data){
    				/*
    				for(var i in $scope.storefront){
		    			$scope.storefront[i].done = true;
			    		for(var item in $scope.storefront[i].data){
			    			if(!$scope.storefront[i].data[item]){
			    				$scope.storefront[i].done = false
			    			}else if($scope.storefront[i].data.featureImage){
			    				if(!$scope.storefront[i].data.featureImage.thumbnail || !$scope.storefront[i].data.featureImage.large){
									$scope.storefront[i].done = false
			    				}
			    			}
			    		}
			    	}
			    	*/
			    	callback();
    			}
    		);
    	};

		onboardingModel.getImages(userData.companyId, function(data){
        	$scope.company[4].data.images = data;
        	if($scope.company[4].data.images.length && $scope.company[4].data.videos.length){
        		$scope.company[4].done = true;
        	}else{
        		$scope.company[4].done = false;
        	}
		});

		onboardingModel.getVideos(userData.companyId, function(data){
        	$scope.company[4].data.videos = data;
        	if($scope.company[4].data.images.length && $scope.company[4].data.videos.length){
        		$scope.company[4].done = true;
        	}else{
        		$scope.company[4].done = false;
        	}
		});

		onboardingModel.getSkills(userData.companyId, function(data){
        	$scope.company[5].data.skills = data;
        	if($scope.company[5].data.skills.length){
        		$scope.company[5].done = true;
        	}
		});

		onboardingModel.getSkillsImages(userData.companyId, function(data){
        	$scope.company[5].data.skillsImages = data;
        	if(!$scope.company[5].data.skillsImages.length){
        		$scope.company[5].done = false;
        	}
		});

		onboardingModel.getKeyContacts(userData.companyId, function(data){
        	$scope.company[9].data.keyContacts = data;
        	if(!$scope.company[9].data.keyContacts.length){
        		$scope.company[9].done = false;
        	}
		});

        onboardingModel.get_company(userData.companyId, function(data){
    		$scope.storefront[0].data.featureImage.thumbnail = data.featureImage.thumbnail;
    		$scope.storefront[0].data.featureImage.large = data.featureImage.large;
    		$scope.storefront[1].data.description = data.description;
    		$scope.storefront[2].data.logoImage = data.logoImage;
    		for(var i in $scope.storefront){
    			$scope.storefront[i].done = true;
	    		for(var item in $scope.storefront[i].data){
	    			if(!$scope.storefront[i].data[item]){
	    				$scope.storefront[i].done = false
	    			}else if($scope.storefront[i].data.featureImage){
	    				if(!$scope.storefront[i].data.featureImage.thumbnail || !$scope.storefront[i].data.featureImage.large){
							$scope.storefront[i].done = false
	    				}
	    			}
	    		}
	    	}

	    	$scope.company[0].data.name = data.name;
	    	$scope.company[0].data.division = data.division;
	    	$scope.company[0].data.industry = data.industry;
        	$scope.company[0].data.NAICSCode = data.NAICSCode;
        	$scope.company[0].data.description = data.description;

        	$scope.company[1].data.featureImage.thumbnail = data.featureImage.thumbnail;
    		$scope.company[1].data.featureImage.large = data.featureImage.large;
    		
    		$scope.company[2].data.RDFocus = data.RDFocus;

        	$scope.company[3].data.customers = data.customers;
        	$scope.company[3].data.awardsReceived = data.awardsReceived;

        	$scope.company[5].data.technicalExpertise = data.technicalExpertise;
        	$scope.company[5].data.toolsSoftwareEquipmentMachines = data.toolsSoftwareEquipmentMachines;

        	$scope.company[6].data.pastCollaborations = data.pastCollaborations;
			$scope.company[6].data.pastProjects = data.pastProjects;
        	$scope.company[6].data.collaborationInterests = data.collaborationInterests;
        	$scope.company[6].data.upcomingProjectInterests = data.upcomingProjectInterests;

        	$scope.company[7].data.address = data.address;
        	$scope.company[7].data.city = data.city;
        	$scope.company[7].data.state = data.state;
        	$scope.company[7].data.zipCode = data.zipCode;
        	$scope.company[7].data.methodCommunication = data.methodCommunication;
        	$scope.company[7].data.email = data.email;
        	$scope.company[7].data.phone = data.phone;
        			

        	$scope.company[8].data.twitter = data.twitter;
        	$scope.company[8].data.linkedIn = data.linkedIn;
        	$scope.company[8].data.website = data.website;

        	$scope.company[10].data.categoryTier = data.categoryTier;
        	$scope.company[10].data.dateJoined = moment(data.dateJoined).format('MM/DD/YYYY');
        	$scope.company[10].data.reasonJoining = data.reasonJoining;

        	for(var i in $scope.company){
    			$scope.company[i].done = true;
    			switch(i){
    				case '1':
	    				if(!$scope.company[i].data.featureImage.thumbnail || !$scope.company[i].data.featureImage.large){
							$scope.company[i].done = false
	    				};
	    				break;
	    			case '4':
	    			case '5':
	    			case '9':
		    			for(var item in $scope.company[i].data){
			    			if(!$scope.company[i].data[item] || !$scope.company[i].data[item].length){
			    				$scope.company[i].done = false
			    			}
			    		};
	    				break;
    				case '7': 
    					for(var item in $scope.company[i].data){
    						if(!$scope.company[i].data[item] && item != 'phone' && item != 'email'){
			    				$scope.company[i].done = false
			    			}
			    		};
			    		break;
			    	default:
    					for(var item in $scope.company[i].data){
    						if(!$scope.company[i].data[item]){
			    				$scope.company[i].done = false
			    			}
			    		};
    			}
	    	}
    	});



        $scope.saveFinish = function(section){
        	var allDone = true;
        	for(var i in $scope[section]){
        		if(!$scope[section][i].done){
        			allDone = false;
        			break;
        		}
        	}
        	DMCUserModel.getUserData().then(function(result){
		      	$rootScope.userData.onboarding[section] = allDone;
		      	DMCUserModel.UpdateUserData($rootScope.userData);
			});
        }
    }])