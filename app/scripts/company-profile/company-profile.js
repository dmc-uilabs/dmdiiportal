'use strict';

angular.module('dmc.company-profile', [
	'dmc.configs.ngmaterial',
	'ngMdIcons',
	'ngtimeago',
	'ui.router',
	'md.data.table',
	'dmc.ajax',
	'dmc.data',
	'dmc.socket',
	'dmc.widgets.stars',
	'dmc.widgets.review',
	'dmc.component.members-card',
	'dmc.component.contacts-card',
	'dmc.common.header',
	'dmc.common.footer',
   "dmc.location",
	'dmc.model.toast-model',
	'dmc.model.fileUpload',
	'dmc.model.company',
	'flow'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
		$stateProvider.state('company-profile', {
			url: '/:companyId',
			templateUrl: 'templates/company-profile/company-profile.html',
			controller: 'CompanyProfileController',
			resolve: {
	      companyData: ['CompanyModel', '$stateParams',
          function(CompanyModel, $stateParams) {
            return CompanyModel.getModel($stateParams.companyId);
          }
        ]
      }
		});
		$urlRouterProvider.otherwise('/1');
	})
	.controller('CompanyProfileController', function ($stateParams, $scope, ajax, dataFactory, $mdDialog, fileUpload, $location, $anchorScroll, $mdToast, toastModel,$timeout,$q, location, companyData) {
		
		
		$scope.company = companyData;
		$scope.number_of_comments = 0; // number of 
		$scope.LeaveFlag = false;  //flag for visibility form Leave A Review
		$scope.submit_rating = 0;  //
		$scope.limit_reviews = true;  //limit reviews
		$scope.precentage_stars = [0,0,0,0,0]; //precentage stars
		$scope.average_rating = 0;  //average rating$scope.products = [];   //included services
		$scope.editFlag = false;  //flag edit page
		$scope.UserLogin = "DMC Member";  //Login user for reviews
		$scope.sortListModel = 0;  //model for drop down menu "sorting"
		$scope.isChangingPicture = false;  //change profile photo
		$scope.prevPicture = null;  //
		$scope.file = '';  //file picture
		$scope.showflag = false;
		$scope.followFlag = false;
		$scope.selectSortingStar = 0;

		$scope.sortList = [
			{
				id: 0,
				val: "date",
				name: "Most recent"
			},
			{
				id: 1,
				val: "helpful",
				name: "Most Helpful"
			},
			{
				id: 2,
				val: "leasthelpful",
				name: "Least Helpful"
			},
			{
				id: 3,
				val: "highest", 
				name: "Highest to Lowest Rating"
			},
			{
				id: 4,
				val: "lowest", 
				name: "Lowest to Highest Rating"
			},
			{
				id: 5,
				val: "verified",
				name: "Verified Users"
			}
		];

		$scope.contacts = [
			{
				position: "Technical",
				avatar: "/uploads/profile/1/20151222084711000000.jpg",
				display_name: "Bob Smith",
				jobTitle: "Head of Engineering",
				phone: "111-111-1111",
				email: "bobs@gmail.com"
			},
			{
				position: "Legal",
				avatar: "/uploads/profile/1/20151222084711000000.jpg",
				display_name: "Bob Smith",
				jobTitle: "Head of Engineering",
				phone: "111-111-1111",
				email: "bobs@gmail.com"
			},
			{
				position: "Admin",
				avatar: "/uploads/profile/1/20151222084711000000.jpg",
				display_name: "Bob Smith",
				jobTitle: "Head of Engineering",
				phone: "111-111-1111",
				email: "bobs@gmail.com"
			},
			{
				position: "Communication",
				avatar: "/uploads/profile/1/20151222084711000000.jpg",
				display_name: "Bob Smith",
				jobTitle: "Head of Engineering",
				phone: "111-111-1111",
				email: "bobs@gmail.com"
			},
			{
				position: "R&D",
				avatar: "/uploads/profile/1/20151222084711000000.jpg",
				display_name: "Bob Smith",
				jobTitle: "Head of Engineering",
				phone: "111-111-1111",
				email: "bobs@gmail.com"
			},
			{
				position: "General",
				avatar: "/uploads/profile/1/20151222084711000000.jpg",
				display_name: "Bob Smith",
				jobTitle: "Head of Engineering",
				phone: "111-111-1111",
				email: "bobs@gmail.com"
			},
		]

		var calculate_rating = function() {
			$scope.precentage_stars = [0,0,0,0,0];
			$scope.average_rating = 0;
			console.info("rating");
			for (var i in $scope.company.rating) {
				$scope.precentage_stars[$scope.company.rating[i] - 1] += 100 / $scope.number_of_comments;
				$scope.average_rating += $scope.company.rating[i];
			}
			$scope.average_rating = ($scope.average_rating / $scope.number_of_comments).toFixed(1);

			for (var i in $scope.precentage_stars) {
				$scope.precentage_stars[i] = Math.round($scope.precentage_stars[i]);
			}
		};
		$scope.$watch('company',function(){
			console.info("watch");
			if($scope.company){
				console.info("watch if");
				$scope.number_of_comments = $scope.company.rating.length;
				if($scope.number_of_comments != 0) {
					calculate_rating();
				}
				$scope.SortingReviews($scope.sortList[0].val);
			}
		});

//review
		//Show Leave A Review form
		$scope.LeaveAReview = function(){
			$scope.LeaveFlag = !$scope.LeaveFlag;
		};

		//cancel Review form
		$scope.Cancel = function(){
			$scope.LeaveFlag = false;
		};

		//Submit Leave A Review form
		$scope.Submit= function(NewReview){
			ajax.on(
				dataFactory.addCompanyReviewUrl(),
				{
					companyId: $scope.company.id,
					reviewId: 0,
					name: "DMC Member",
					status: true,
					rating: $scope.submit_rating,
					comment: NewReview.Comment
				},
				function(data){
					$scope.SortingReviews('date');
				},
				function(){
					alert("Ajax fail: getProductReview");
				},
				"POST"
			);


			$scope.number_of_comments++;
			$scope.company.rating.push($scope.submit_rating);
			$scope.submit_rating = 0;
			$scope.LeaveFlag = !$scope.LeaveFlag;
			calculate_rating();
		};

		//selected dorp down menu "sorting"
		$scope.selectItemDropDown = function(value){
			if(value != 0) {
					var item = $scope.sortList[value];
					$scope.sortList.splice(value, 1);
					$scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
					if ($scope.sortList.unshift(item)) this.sortListModel = 0;
			}
			$scope.SortingReviews($scope.sortList[0].val);
		};

		//sorting Reviews
		$scope.SortingReviews = function(val){
			var sort;
			var order;
			$scope.selectSortingStar = 0;
			switch(val){
				case "date":
					sort = 'date';
					order = 'DESC';
					break
				case "helpful":
					sort = 'helpful';
					order = 'DESC';
					break
				case "leasthelpful":
					sort = 'leasthelpful';
					order = 'ASC';
					break
				case "lowest":
					sort = 'rating';
					order = 'ASC';
					break
				case "highest":
					sort = 'rating';
					order = 'DESC';
					break
				case "verified":
					sort = 'verified';
					order = 'ASC';
					break
				case "1star":
					sort = 'stars';
					order = 1;
					$scope.selectSortingStar = 1;
					break
				case "2star":
					sort = 'stars';
					order = 2;
					$scope.selectSortingStar = 2;
					break
				case "3star":
					sort = 'stars';
					order = 3;
					$scope.selectSortingStar = 3;
					break
				case "4star":
					sort = 'stars';
					order = 4;
					$scope.selectSortingStar = 4;
					break
				case "5star":
					sort = 'stars';
					order = 5;
					$scope.selectSortingStar = 5;
					break
			}

			var params = {
				companyId: $stateParams.companyId,
				sort: sort,
				order: order
			};
			if ($scope.limit_reviews){
				params['limit'] = 2;
			}

			ajax.on(
				dataFactory.getCompanyReviewUrl(),
				params,
				function(data){
					$scope.company.reviews = data.result;
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				},
				function(){
					alert("Ajax fail: getCompanyReview");
				}

			);
		};

		//Selected rating
		$scope.stars = function(val){
			$scope.submit_rating = val;
		};

		//View All Review
		$scope.ViewAllReview = function(){
			$scope.limit_reviews = !$scope.limit_reviews;
			$scope.SortingReviews($scope.sortList[0].val);
		};

//edit
		//Edit profile
		$scope.editPage = function () {
			$scope.editFlag = true;
		}

		//add skill to profile
		$scope.addSkill = function(inputSkill){
			if(!inputSkill)return;
			$scope.profile.skills.push(inputSkill);
			this.inputSkill = null;
		}

		//remove skill
		$scope.deleteSkill = function(index){
			$scope.profile.skills.splice(index,1);
		}

		//cancel edit profile
		$scope.cancelEdit = function(){
			$scope.editFlag = false;
			$scope.isChangingPicture = false;
			
			//get profile
			ajax.on(
				dataFactory.getProfile(),
				{
					profileId: $stateParams.profileId
				},
				function(data){
					$scope.profile = data.result;
					$scope.number_of_comments = $scope.profile.rating.length;
					if($scope.number_of_comments != 0) {
						calculate_rating();
					}
					$scope.profile.descriptionSmall = $scope.profile.description.slice(0, 1000) + '...';
					if($scope.profile.description.length >= $scope.profile.descriptionSmall.length){
						$scope.showflag = true;
					}
					$scope.SortingReviews($scope.sortList[0].val);
				},
				function(){
					alert("Ajax fail: getProduct");
				}
			);
			toastModel.showToast("error", "Edit Profile Canceled");
		}

		//save edit profile
		$scope.saveEdit = function(){
			ajax.on(
				dataFactory.editProfile(),
				{
					profileId: $scope.profile.id,
					displayName: $scope.profile.displayName,
					jobTitle: $scope.profile.jobTitle,
					location: $scope.profile.location,
					skills: $scope.profile.skills,
					description: $scope.profile.description
				},
				function(data){
				},
				function(){
					console.error("Ajax fail! editProfile()");
				},
				"POST"
			);
			if($scope.file != ''){
				fileUpload.uploadFileToUrl($scope.file.files[0].file,{id : $scope.profile.id},'profile',callbackUploadPicture);
			}
			$scope.isChangingPicture = false;
			$scope.editFlag = false;
		}

//upload profile photo
		//button "Change photo"
		$scope.changePicture = function(){
			$scope.isChangingPicture = true;
		};

		//cancel Change photo
		$scope.cancelChangePicture = function(flow){
			flow.files = [];
			$scope.isChangingPicture = false;
		};

		//success upload photo
		var callbackUploadPicture = function(data){
			$scope.profile.image = data.file.name;
		};

		//Drag & Drop enter
		$scope.pictureDragEnter = function(flow){
			$scope.prevPicture = flow.files[0];
			flow.files = [];
		};

		//Drag & Drop leave
		$scope.pictureDragLeave = function(flow){
			if(flow.files.length == 0 && $scope.prevPicture != null) {
				flow.files = [$scope.prevPicture];
				$scope.prevPicture = null;
			}
		};

		//file added
		$scope.addedNewFile = function(file,event,flow){
			flow.files.shift();
			$scope.file = flow;
		};

///
		$scope.goToReview = function(){
			$location.hash('review');
			$anchorScroll();
		}

		$scope.showMore = function(){
			$scope.showflag = false;
		}

		$scope.follow = function(){
			$scope.followFlag = !$scope.followFlag;
		}


		$scope.searchText="";

		$scope.querySearch = function(query) {
			console.info("selectedItemChange");
			var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
				deferred;
			if ($scope.simulateQuery) {
				deferred = $q.defer();
				$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
				return deferred.promise;
			} else {
				return results;
			}
		}
		$scope.searchTextChange = function(text) {
			if(text.trim().length == 0){
				//$scope.user.timezone = null;
			}
		}
		$scope.selectedItemChange = function(item) {
			if(!item || !item.display) {
				$scope.profile.location = null;
			}else {
				$scope.profile.location = item.display;
			}
		}
		/**
		 * Create filter function for a query string
		 */
		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(state) {
				return (state.value.indexOf(lowercaseQuery) != -1);
			};
		}

		var callback = function(success,data){
			if(success) {
				$scope.profile.location = data.city + ", " + data.region;
				$scope.searchText = data.timezone;
			}
		};

		$scope.getLocation = function(){
			location.get(callback);
		};

  $scope.zones = [];
	function loadAll() {
		if($scope.zones.length == 0) {
			var zones = moment.tz.names();
			for (var i = 0; i < zones.length; i++) {
				var zone = moment.tz.zone(zones[i]);
				if (Date.UTC(2012, 1, 1)) {
					var time = Math.round((zone.parse(Date.UTC(2012, 1, 1)) / 60));
					var t = time;
					if (t > 0) {
						if (t < 10) t = "0" + t;
						t = "(UTC -" + t + ":00)";
					} else if (t < 0) {
						t *= -1;
						if (t < 10) t = "0" + t;
						t = "(UTC +" + t + ":00)";
					} else {
						t = "(UTC 00:00)";
					}
					$scope.zones.push(t + " " + zones[i]);
					//$scope.zones.push(zones[i]);
				}
			}
		}
		return $scope.zones.map( function (state) {
			return {
				value: state.toLowerCase(),
				display: state
			};
		});
	}

	$scope.states = loadAll();
	
	});
