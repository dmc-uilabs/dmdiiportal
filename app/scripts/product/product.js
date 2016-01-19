'use strict';

angular.module('dmc.product', [
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
	'dmc.model.toast-model',
	'dmc.component.carousel',
    'dmc.compare'
])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
		//$locationProvider.html5Mode(true).hashPrefix('#');
		$stateProvider.state('product', {
			url: '/:typeProduct/:productId',//
			templateUrl: 'templates/product/product.html',
			controller: 'ProductController'
		});
		$urlRouterProvider.otherwise('/services/1');
	})
	.controller('ProductController', ['$stateParams', '$scope', 'ajax', 'dataFactory', '$mdDialog', '$mdToast', 'toastModel','$timeout','$cookies', function ($stateParams, $scope, ajax, dataFactory, $mdDialog, $mdToast, toastModel,$timeout,$cookies) {
	
			$scope.product = [];  //array product
			$scope.number_of_comments = 0; // number of 
			$scope.LeaveFlag = false;  //flag for visibility form Leave A Review
			$scope.submit_rating = 0;  //
			$scope.not_found = false;  //product not fount
			$scope.products_card = [];  //products card
			$scope.limit_reviews = true;  //limit reviews
			$scope.precentage_stars = [0,0,0,0,0]; //precentage stars
			$scope.average_rating = 0;  //average rating$scope.products = [];   //included services
			$scope.editFlag = false;  //flag edit page
			$scope.allServices = [];
			$scope.Specifications = ['Height', 'Length', 'Weight'];
			$scope.UserLogin = "DMC Member";
			$scope.adding_to_project = false;
	
			$scope.currentImage = 1;
			$scope.images = [];
			$scope.indexImages = 0;

            // get data from cookies
            var updateCompareCount = function(){
                var arr = $cookies.getObject('compareProducts');
                return arr == null ? {services : [], components : []} : arr;
            };
            $scope.compareProducts = updateCompareCount();

            // catch updated changedCompare variable form $cookies
            $scope.$watch(function() { return $cookies.changedCompare; }, function(newValue) {
                $scope.compareProducts = updateCompareCount();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });
	

			
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
					typeProduct: $stateParams.typeProduct,
					productId: $stateParams.productId
				},
				function(data){
					if(data.result.id) {
						$scope.product = data.result;
						//$scope.product.specificationsData.special = []
						$scope.number_of_comments = $scope.product.rating.length;
						if($scope.number_of_comments != 0) {
							calculate_rating();
						}
					$scope.qqq = $scope.product;
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
	
			//get included services
			ajax.on(
				dataFactory.getUrlAllServices(),
				{
					limit: 8
				},
				function(data){
					$scope.products = data.result;
				},
				function(){
					alert("Ajax fail: getAllServices");
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
	
			//get all services
			ajax.on(
				dataFactory.getUrlAllProducts(),
				{},
				function(data){
					$scope.allServices = data.result;  
					for(var i in $scope.allServices){
						$scope.allServices[i].average_rating = 0;
						var number_of_comments = $scope.allServices[i].rating.length;
						if(number_of_comments != 0) {
							var average_rating = 0;
							for (var k in $scope.allServices[i].rating) {
								average_rating += $scope.allServices[i].rating[k];
							}
							$scope.allServices[i].average_rating = (average_rating / number_of_comments).toFixed(1);
						}
					}
				},
				function(){
					console.error("Ajax fail! getAllProducts()");
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
						productType: $stateParams.typeProduct,
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
					typeProduct: $stateParams.typeProduct,
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
	
//edit
			//Edit product
			$scope.editPage = function () {
				$scope.editFlag = true;
                // auto focus for edit product's title
                $timeout(function() {
                    $("#editTitleProduct").focus();
                });
			}
	
			//query services
			$scope.querySearch = function(query) {
				var results = query ? $scope.allServices.filter( createFilterFor(query) ) : $scope.allServices;
					return results;
			}
	
			//query specifications
			$scope.specificationsSearch = function(query) {
				var results = query ? $scope.Specifications.filter( createFilterForSpecifications(query) ) : $scope.Specifications;
					return results;
			}
	
			//Add services to included services
			$scope.AddServices = function(item, text){
				if(!item)return;
				$scope.products.push(item);
				this.$$childHead.$mdAutocompleteCtrl.clear();
			}
	
			//Add specifications to product
			$scope.AddSpecifications = function(item, text){
				if(!item)return;
				for(var i in $scope.product.specificationsData.special){
					if($scope.product.specificationsData.special[i].specification == item){
						this.$$childHead.$mdAutocompleteCtrl.clear();
						return;
				 }
				}
				$scope.product.specificationsData.special.push({
					specification: item,
					data: ""
				})
				this.$$childHead.$mdAutocompleteCtrl.clear();
			}
	
			//Create filter function for a query string
			function createFilterFor(query) {
				var lowercaseQuery = angular.lowercase(query);
				return function filterFn(state) {
					return (angular.lowercase(state.title).indexOf(lowercaseQuery) === 0);
				};
			}
	
			//Create filter function
			function createFilterForSpecifications(query) {
				var lowercaseQuery = angular.lowercase(query);
				return function filterFn(state) {
					return (angular.lowercase(state).indexOf(lowercaseQuery) === 0);
				};
			}
	
			//Remove included services
			$scope.deleteIncluded = function(index){
				$scope.products.splice(index, 1);
			}
	
			//add tag to product
			$scope.addTag = function(inputTag){
				if(!inputTag)return;
				$scope.product.tags.push(inputTag);
				this.inputTag = null;
			}
	
			//remove tag
			$scope.deleteTag = function(index){
				$scope.product.tags.splice(index,1);
			}

			//remove specifications
			$scope.deleteSpecifications = function(index){
				$scope.product.specificationsData.special.splice(index,1);
			}
	
			//save edit product
			$scope.saveEdit = function(){
				for(var i in $scope.product.specificationsData.special){
					delete $scope.product.specificationsData.special[i]['$$hasKey'];
				}
				ajax.on(
					dataFactory.editProduct(),
					{
						typeProduct: $scope.product.type,
						productId: $scope.product.id,
						title: $scope.product.title,
						tags: $scope.product.tags,
						description: $scope.product.description,
						specification: $scope.product.specificationsData.special,
						outputs: $scope.product.specificationsData.output,
						inputs: $scope.product.specificationsData.input,
						specificationId: $scope.product.specificationsData.id
					},
					function(data){
					},
					function(){
						console.error("Ajax fail! editProduct()");
					},
					"POST"
				);
				$scope.editFlag = false;
			}
	
			//cancel edit product
			$scope.cancelEdit = function(){
				$scope.editFlag = false;
				//get product
				ajax.on(
					dataFactory.getProduct(),
					{
						typeProduct: $stateParams.typeProduct,
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
						$scope.qqq = $scope.product;
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
						}else{
							$scope.not_found = true;
						}

						toastModel.showToast("error", "Edit Profile Canceled");
					},
					function(){
						alert("Ajax fail: getProduct");
					}
				);
	
				ajax.on(
					dataFactory.getUrlAllServices(),
					{
						limit: 8
					},
					function(data){
						$scope.products = data.result;
					},
					function(){
						alert("Ajax fail: getAllServices");
					}
				);
			}

//functional
			$scope.addToFavorite = function(){
				return ajax.on(dataFactory.addProductToFavorite(),{
					productId : $scope.product.id,
					productType : $scope.product.type
				},
				function(data){
					console.info("Favorite", data);
					$scope.product.favorite = data.favorite;
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				},
				function(){
					toastModel.showToast("error", "Failed Add To Favorite");
				});
			};

			$scope.toProject = function(){
				$scope.adding_to_project = true;
			};

			$scope.btnCanselToProject = function(){
				$scope.adding_to_project = false;
			}

			$scope.btnAddToProject = function(id){
				console.info("project", id);
				ajax.on(dataFactory.getUrlAddToProject($scope.product.id),{
					id : $scope.product.id,
					projectId : id,
					type : $scope.product.type
				},function(data){
					$scope.adding_to_project = false;
					console.info("data", data);
					toastModel.showToast("success", "Product added to "+data.result.currentStatus.project.title);
				},function(){
					toastModel.showToast("error", "Failed Add To Project");
				}, 'POST');
			}
	
			$scope.treeMenuModel = {
					title: 'BROWSE BY',
					data: [
							{
									'id': 1,
									'title': 'All',
									'tag' : 'all',
									'items': 0,
									'opened' : $scope.currentPage == 'all' ? true : false,
									'onClick' : function(){
											$location.url('/all');
									},
									'categories': []
							},
							{
									'id': 2,
									'title': 'Components',
									'tag' : 'components',
									'items': 0,
									'opened' : $scope.currentPage == 'components' ? true : false,
									'onClick' : function(){
											$location.url('/components');
									},
									'categories': []
							},
							{
									'id': 3,
									'title': 'Services',
									'tag' : 'services',
									'items': 0,
									'opened' : $scope.currentPage == 'services' ? true : false,
									'onClick' : function(){
											$location.url('/services');
									},
									'categories': [
											{
													'id': 31,
													'title': 'Analytical Services',
													'tag' : 'analytical',
													'items': 0,
													'opened' : $scope.currentPageType == 'analytical' ? true : false,
													'onClick' : function(){
															$location.url('/services?type=analytical');
													},
													'categories': []
											},
											{
													'id': 32,
													'title': 'Solid Services',
													'tag' : 'solid',
													'items': 0,
													'opened' : $scope.currentPageType == 'solid' ? true : false,
													'onClick' : function(){
															$location.url('/services?type=solid');
													},
													'categories': []
											},
											{
													'id': 33,
													'title': 'Data Services',
													'tag' : 'data',
													'items': 0,
													'opened' : $scope.currentPageType == 'data' ? true : false,
													'onClick' : function(){
															$location.url('/services?type=data');
													},
													'categories': []
											}
									]
							}
					]
			};
	
		}])
		.controller("ViewIncludedController", ['$scope', 'ajax', 'dataFactory', '$mdDialog', '$location', 'products', function ($scope, ajax, dataFactory, $mdDialog, $location, products) {
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
				}]);
