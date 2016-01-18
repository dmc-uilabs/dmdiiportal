'use strict';

angular.module('dmc.service-marketplace', [
	'dmc.configs.ngmaterial',
	'ngMdIcons',
	'ngtimeago',
	'ui.router',
	'md.data.table',
	'dmc.ajax',
	'dmc.data',
	'dmc.socket',
	'dmc.widgets.stars',
	'dmc.widgets.documents',
	'dmc.widgets.review',
	'dmc.widgets.tabs',
	'dmc.component.treemenu',
	'dmc.component.productcard',
	'dmc.common.header',
	'dmc.common.footer',
	'dmc.component.carousel'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
	$stateProvider.state('service-marketplace', {
		url: '/:productId',//
		templateUrl: 'templates/service-marketplace/service-marketplace.html',
		controller: 'ServiceMarketplaceController'
	});
	$urlRouterProvider.otherwise('/1');
	})
	.controller('ServiceMarketplaceController', function ($stateParams, $scope, ajax, dataFactory, $mdDialog) {

	$scope.product = [];  //array product
	$scope.number_of_comments = 0; // number of 
	$scope.LeaveFlag = false;  //flag for visibility form Leave A Review
	$scope.submit_rating = 0;  //
	$scope.not_found = false;  //product not fount
	$scope.products_card = [];  //products card
	$scope.limit_reviews = true;  //limit reviews
	$scope.precentage_stars = [0,0,0,0,0]; //precentage stars
	$scope.average_rating = 0;  //average rating
	$scope.UserLogin = "DMC Member";

	$scope.currentImage = 1;
	$scope.images = [];
	$scope.indexImages = 0;

	$scope.statistics = [
		{
			title: "",
			"SuccessfulRuns": {
				"Today": 8,
				"Week": 10,
				"AllTime": 12
			},
			"IncompleteRuns": {
				"Today": 1,
				"Week": 3,
				"Month": 3
			},
			"UnavailableRuns": {
				"Today": 1,
				"Week": 2,
				"Month": 2
			},
			"RunsByUsers": {
				"Today": 10,
				"Week": 15,
				"AllTime": 17
			},
			"UniqueUsers": {
				"Today": 10,
				"Week": 2,
				"Month": 5
			},
			"AverageTime": {
				"Today": 10.1,
				"Week": 11,
				"Month": 22.2
			}
		}
	]

	$scope.history = {
		leftColumn: {
			title: "Marketplace",
			viewAllLink: "",
			list:[
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				}
			]
		},
		rightColumn: {
			title: "Your Projects",
			viewAllLink: "",
			list:[
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					date: "July 31",
				},
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					date: "July 30",
				},
				{
					icon: "file_upload",
					title: "Jhon Smith uploaded the service.",
					date: "June 30",
				},
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					date: "June 30",
				},
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					date: "June 30",
				},
				{
					icon: "file_upload",
					title: "Jhon Smith uploaded the service.",
					date: "June 30",
				},
			]
		}
	}


	$scope.inputs = [
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
	];
	$scope.outputs = [
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
		"Height",
		"Length",
	];


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
		val: "highest", 
		name: "Highest to Lowest Rating"
		},
		{
		id: 3,
		val: "lowest", 
		name: "Lowest to Highest Rating"
		},
		{
		id: 4,
		val: "verified",
		name: "Verified Users"
		}
	];

	$scope.sortListModel = 0;
	$scope.selectItemDropDown = function(value){
		if(value != 0) {
			var item = $scope.sortList[value];
			$scope.sortList.splice(value, 1);
			$scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
			if ($scope.sortList.unshift(item)) this.sortListModel = 0;
		}
		$scope.SortingReviews($scope.sortList[0].val);
	};

	//functions for carousel
	$scope.carouselFunctions = {
		openImage : function(index){
		console.info("this", this);
		$scope.indexImages = index;

		},
		deleteImage: function(index){
		$scope.images.splice(index, 1);
		if ($scope.indexImages == index){
			$scope.indexImages = 0;
		}
		if($scope.indexImages > index){
			$scope.indexImages--;
		}
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
		},
		selected: function(index){
		return index == $scope.indexImages;
		}
	};

//load data
	//get product
	ajax.on(
		dataFactory.getProduct(),
		{
		typeProduct: "services",
		productId: $stateParams.productId
		},
		function(data){
		if(data.result.id) {
			$scope.product = data.result;
			$scope.product.specificationsData.special = []
			$scope.number_of_comments = $scope.product.rating.length;
			if($scope.number_of_comments != 0) {
				calculate_rating();
			}
		$scope.images = [
			$scope.product.featureImage.thumbnail,
			'images/3d-printing.png',
			'images/project_generator.png',
			'images/plasticity.png',
			'images/project-1-image.jpg',
			'images/project_relay_controller.png',
			'images/project_controller_pg2.png',
			'images/project_capacitor-bank.png',
			'images/project_capacitor_compartment.png',
			'images/ge-fuel-cell.png'
		];
		$scope.SortingReviews($scope.sortList[0].val);
		}else{
			$scope.not_found = true;
		}
		},
		function(){
		alert("Ajax fail: getProduct");
		}
	);

	//get similar product
	ajax.on(
		dataFactory.getUrlAllServices(),
		{
			limit: 4
		},
		function(data){
			$scope.products_card = data.result;
		},
		function(){
			alert("Ajax fail: getAllServices");
		}
	);

	//Calculate Rating
	var calculate_rating = function() {
		$scope.precentage_stars = [0,0,0,0,0];
		$scope.average_rating = 0;
		for (var i in $scope.product.rating) {
		$scope.precentage_stars[$scope.product.rating[i] - 1] += 100 / $scope.number_of_comments;
		$scope.average_rating += $scope.product.rating[i];
		}
		$scope.average_rating = ($scope.average_rating / $scope.number_of_comments).toFixed(1);

		for (var i in $scope.precentage_stars) {
		$scope.precentage_stars[i] = Math.round($scope.precentage_stars[i]);
		}
	};

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
		dataFactory.addProductReview(),
		{
			productId: $scope.product.id,
			productType: "services",
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
		$scope.product.rating.push($scope.submit_rating);
		$scope.submit_rating = 0;
		$scope.LeaveFlag = !$scope.LeaveFlag;
		calculate_rating();
	};

	//sorting Reviews
	$scope.SortingReviews = function(val){
		var sort;
		var order;
		switch(val){
		case "date":
			sort = 'date';
			order = 'DESC';
			break
		case "helpful":
			sort = 'helpful';
			order = 'DESC';
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
			break
		case "2star":
			sort = 'stars';
			order = 2;
			break
		case "3star":
			sort = 'stars';
			order = 3;
			break
		case "4star":
			sort = 'stars';
			order = 4;
			break
		case "5star":
			sort = 'stars';
			order = 5;
			break
		}

		var params = {
		typeProduct: "services",
		productId: $stateParams.productId,
		sort: sort,
		order: order
		};
		if ($scope.limit_reviews){
		params['limit'] = 2;
		}

		ajax.on(
		dataFactory.getProductReview(),
		params,
		function(data){
			$scope.product.reviews = data.result;
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
		},
		function(){
			alert("Ajax fail: getProductReview");
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





	//View All Included
	$scope.ViewIncluded = function(ev){
		$(window).scrollTop(0);
		$mdDialog.show({
		controller: "ViewIncludedController",
		templateUrl: "templates/product/view_included.html",
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: {
			products: $scope.allServices
		},
		clickOutsideToClose:true
		})
		.then(function() {
		}, function() {
		});
	}

	//Search products
	$scope.submitSearch = function(text){
		window.location.href = '/marketplace.php#/search/' + $stateParams.typeProduct +'s?text=' + text;
	}


	})
	.controller("ViewIncludedController", function ($scope, ajax, dataFactory, $mdDialog, $location, products) {
	$scope.products = products;
	$scope.product = null;
	$scope.product = $scope.products[0];
	$scope.index = 0;
	$scope.cancel = function(){
		$mdDialog.cancel();
	}
	$scope.View = function(index){
		$scope.product = $scope.products[index];
		$scope.index = index;
	}
	});
