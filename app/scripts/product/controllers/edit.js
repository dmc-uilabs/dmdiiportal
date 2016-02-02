'use strict';

angular.module('dmc.product')

.controller('componentEditController', ['componentData', 'serviceModel', '$state', '$stateParams', '$scope', 'ajax', 'dataFactory', '$mdDialog', '$timeout', '$cookies', 
    function (componentData, serviceModel, $state, $stateParams, $scope,   ajax,   dataFactory,   $mdDialog,  $timeout,   $cookies) {
	
	console.info('edit');
	$scope.product = componentData;  //array product
	$scope.not_found = false;  //product not fount
	$scope.products_card = [];  //products card
	$scope.allServices = [];
	$scope.Specifications = ['Height', 'Length', 'Weight'];

	$scope.currentImage = 1;
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
	$scope.indexImages = 0;
    $scope.save = false;

    $scope.$on('$stateChangeStart', function (event, next) {
        if(!$scope.save){
            var answer = confirm("Are you sure you want to leave this page without saving?");
            if (!answer) {
                event.preventDefault();
            }
        }
    });

    $(window).bind('beforeunload', function () {
        if($state.current.name == "edit")
            return "Are you sure you want to leave this page without saving?";
    });


    // get favorites count ------------------
    $scope.favoritesCount = 0;
    var getFavoriteCount = function(){
        ajax.on(dataFactory.getFavoriteProducts(),{
            accountId : 1
        },function(data){
            $scope.favoritesCount = data.length;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        },function(){
            alert("Error getFavoriteCount");
        });
    };
    getFavoriteCount();
    // ---------------------------------------

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
	serviceModel.get_all_component({"_limit": 8}, function(data){
		$scope.products = data;
	    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
	});

	serviceModel.get_all_component({}, function(data){
		$scope.allServices = data;
	    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
	});






	//Search products
	$scope.submitSearch = function(text){
		window.location.href = '/marketplace.php#/search/' + $stateParams.typeProduct +'s?text=' + text;
	}

//edit
	//Edit product
	$scope.editPage = function () {
        // auto focus for edit product's title
        $timeout(function() {
            $("#editTitleProduct").focus();
        });
	}

	//query services
	$scope.querySearch = function(query) {
		console.info("querySearch");
		var results = query ? $scope.allServices.filter( createFilterFor(query) ) : $scope.allServices;
			return results;
	}

	//query specifications
	$scope.specificationsSearch = function(query) {
		console.info("specificationsSearch");
		var results = query ? $scope.Specifications.filter( createFilterForSpecifications(query) ) : $scope.Specifications;
			return results;
	}

	//Add services to included services
	$scope.AddServices = function(item, text){
		console.info("AddServices");
		if(!item)return;
		$scope.products.push(item);
		this.$$childHead.$mdAutocompleteCtrl.clear();
	}

	//Add specifications to product
	$scope.AddSpecifications = function(item, text){
		console.info("AddSpecifications", this);
		if(!item)return;
		for(var i in $scope.product.specifications[0].special){
			if($scope.product.specifications[0].special[i].specification == item){
				this.$$childHead.$mdAutocompleteCtrl.clear();
				return;
		 }
		}
		$scope.product.specifications[0].special.push({
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

	//remove specifications
	$scope.deleteSpecifications = function(index){
		$scope.product.specificationsData.special.splice(index,1);
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

	//save edit product
	$scope.saveEdit = function(){
		for(var i in $scope.product.specifications[0].special){
			delete $scope.product.specifications[0].special[i]['$$hasKey'];
		}
		serviceModel.edit_component({
			title: $scope.product.title,
			tags: $scope.product.tags,
			description: $scope.product.description,
			specification: $scope.product.specifications[0],
		},
        function(data){
            console.info(data);
            $scope.save = true;
            $scope.isChangingPicture = false;
            $state.go('component', {typeProduct: $scope.product.type+'s', productId: $scope.product.id});
        });
	}



	var updateCompareCount = function () {
	    var arr = $cookies.getObject('compareProducts');
	    return arr == null ? {services: [], components: []} : arr;
	};
	$scope.compareProducts = updateCompareCount();

	$scope.$watch(function() { return $cookies.changedCompare; }, function(newValue) {
	    $scope.compareProducts = updateCompareCount();
	    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
	});


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