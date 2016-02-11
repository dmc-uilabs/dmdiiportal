'use strict';

angular.module('dmc.product')

.controller('componentEditController', ['componentData', 'serviceModel', '$state', '$stateParams', '$scope', 'ajax', 'dataFactory', '$mdDialog', '$timeout', '$cookies', 
    function (componentData, serviceModel, $state, $stateParams, $scope,   ajax,   dataFactory,   $mdDialog,  $timeout,   $cookies) {
	
	$scope.product = componentData;  //array product
	$scope.not_found = false;  //product not fount
	$scope.products_card = [];  //products card
	$scope.allServices = [];
	$scope.includedServices = [];
	$scope.removeIncluded = [];
	$scope.addIncluded = [];
	$scope.addTags =[];
	$scope.removeTags = [];
    $scope.removeImages = [];
	$scope.arraySpecifications = [];

    serviceModel.get_array_specifications(function(data){
        $scope.arraySpecifications = data;
        for(var i in $scope.product.specifications[0].special){
            for(var j in $scope.arraySpecifications){
                if($scope.arraySpecifications[j].id == $scope.product.specifications[0].special[i].specificationId){
                    $scope.arraySpecifications.splice(j,1);
                }
            }
        }
    })

	$scope.currentImage = 1;
	$scope.indexImages = 0;
    $scope.save = false;
    $scope.isChange = false;

    $scope.$on('$stateChangeStart', function (event, next) {
        if(!$scope.save && $scope.isChange){
            var answer = confirm("Are you sure you want to leave this page without saving?");
            if (!answer) {
                event.preventDefault();
            }
        }
    });

    $(window).bind('beforeunload', function () {
        if($state.current.name == "edit" && $scope.isChange)
            return "Are you sure you want to leave this page without saving?";
    });

    $scope.change = function(){
        $scope.isChange = true;
    }

    var apply = function(){
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
    };


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
			$scope.indexImages = index;

		},
		deleteImage: function(index){
            $scope.isChange = true;
			$scope.removeImages.push($scope.product.service_images[index].id);
			$scope.product.service_images.splice(index, 1);
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
	serviceModel.get_included_services(function(data){
		$scope.includedServices = data;
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
		var results = query ? $scope.allServices.filter( createFilterFor(query) ) : $scope.allServices;
			return results;
	}

	//query specifications
	$scope.specificationsSearch = function(query) {
		var results = query ? $scope.arraySpecifications.filter( createFilterForSpecifications(query) ) : $scope.arraySpecifications;
			return results;
	}

	//Add services to included services
	$scope.AddServices = function(item, text){
        $scope.isChange = true;
		if(!item)return;
		$scope.addIncluded.push(item.id);
		$scope.includedServices.push({service: item});
		this.$$childHead.$mdAutocompleteCtrl.clear();
	}

	//Add specifications to product
	$scope.AddSpecifications = function(item, text){
        for(var i in $scope.arraySpecifications){
            if( $scope.arraySpecifications[i].id == item.id ){
                $scope.arraySpecifications.splice(i,1);
                break;
            }
        }
        $scope.product.specifications[0].special.push({
            specification: item.name,
            data: "",
            specificationId: item.id
        });

        this.$$childHead.$mdAutocompleteCtrl.clear();
        $timeout(function() {
            console.info("e", $("#specification0"))
            $("#specification0").focus();
            apply();
        })
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
			return (angular.lowercase(state.name).indexOf(lowercaseQuery) === 0);
		};
	}

	//Remove included services
	$scope.deleteIncluded = function(index, id){
        $scope.isChange = true;
		$scope.removeIncluded.push(id);
		$scope.includedServices.splice(index, 1);
	}

	//remove specifications
	$scope.deleteSpecifications = function(index){
		$scope.arraySpecifications.push({
            id: $scope.product.specifications[0].special[index].specificationId,
            name: $scope.product.specifications[0].special[index].specification,
        });
		$scope.product.specifications[0].special.splice(index,1);
	}
    //add bew sepecifications to system
    $scope.addNewSpecifications = function(text){
        this.$$childHead.$mdAutocompleteCtrl.clear();
        serviceModel.add_array_specifications(text, 
            function(data){
                $scope.product.specifications[0].special.push({
                specification: data.name,
                data: "",
                specificationId: data.id
            });
        });
    }

	//add tag to product
	$scope.addTag = function(inputTag){
        $scope.isChange = true;
		if(!inputTag)return;
		$scope.addTags.push(inputTag);
		$scope.product.service_tags.push({name: inputTag});
		this.inputTag = null;
	}

	//remove tag
	$scope.deleteTag = function(index, id){
        $scope.isChange = true;
		if(id || id === 0){
			$scope.removeTags.push(id);
		}
		$scope.product.service_tags.splice(index,1);
	}

	//save edit product
	$scope.saveEdit = function(){
		for(var i in $scope.product.specifications[0].special){
			delete $scope.product.specifications[0].special[i]['$$hasKey'];
		}

		serviceModel.remove_services_tags($scope.removeTags);
		serviceModel.add_services_tags($scope.addTags);
        serviceModel.remove_services_images($scope.removeImages);
		serviceModel.remove_included_services($scope.removeIncluded);
		serviceModel.add_included_services($scope.addIncluded);
		
		serviceModel.edit_component({
			title: $scope.product.title,
			description: $scope.product.description,
			specification: $scope.product.specifications[0]
		},

        function(data){
            $scope.save = true;
            $scope.isChangingPicture = false;
            $state.go('component', {typeProduct: $scope.product.type+'s', productId: $scope.product.id});
        });
	}

    $scope.cancelEdit = function(){
        $scope.save = true;
        $scope.isChangingPicture = false;
        $state.go('component', {typeProduct: $scope.product.type+'s', productId: $scope.product.id});
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