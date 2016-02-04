'use strict';

angular.module('dmc.service-marketplace')
    .controller('ServiceMarketplaceEditController', [
        'serviceData',
        'serviceModel',
        '$state',
        '$stateParams',
        '$scope',
        'ajax',
        'dataFactory',
        '$mdDialog',
        '$timeout',
        '$cookies',
        function (serviceData,
                  serviceModel,
                  $state,
                  $stateParams,
                  $scope,
                  ajax,
                  dataFactory,
                  $mdDialog,
                  $timeout,
                  $cookies) {

            $scope.product = serviceData;  //array product
            $scope.not_found = false;  //product not fount
            $scope.products_card = [];  //products card
            $scope.allServices = [];
            $scope.removeTags =[];
            $scope.addTags =[];
            $scope.removeAuthors = [];
            $scope.addAuthors = [];
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
                    if (!answer) event.preventDefault();
                }
            });

            $(window).bind('beforeunload', function () {
                if($state.current.name == "service-marketplace-edit") {
                    return "Are you sure you want to leave this page without saving?";
                }
            });

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            // get favorites count ------------------
            $scope.favoritesCount = 0;
            var getFavoriteCount = function(){
                ajax.get(dataFactory.getFavoriteProducts(),{
                    accountId : 1
                },function(response){
                    $scope.favoritesCount = response.data.length;
                    apply();
                });
            };
            getFavoriteCount();

            //functions for carousel
            $scope.carouselFunctions = {
                openImage : function(index){
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
                    apply();
                },
                selected: function(index){
                    return index == $scope.indexImages;
                }
            };

            //Search products
            $scope.submitSearch = function(text){
                window.location.href = '/marketplace.php#/search/' + $stateParams.typeProduct +'s?text=' + text;
            };

//edit
            //Edit product
            $scope.editPage = function () {
                // auto focus for edit product's title
                $timeout(function() {
                    $("#editTitleProduct").focus();
                });
            };

            //query specifications
            $scope.specificationsSearch = function(query) {
                var results = query ? $scope.Specifications.filter( createFilterForSpecifications(query) ) : $scope.Specifications;
                return results;
            };

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
                });
                this.$$childHead.$mdAutocompleteCtrl.clear();
            };

            //Create filter function
            function createFilterForSpecifications(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(state) {
                    return (angular.lowercase(state).indexOf(lowercaseQuery) === 0);
                };
            }

            //remove specifications
            $scope.deleteSpecifications = function(index){
                $scope.product.specifications[0].special.splice(index,1);
            };

            //add tag to product
            $scope.addTag = function(inputTag){
                if(!inputTag)return;
                $scope.addTags.push(inputTag);
                $scope.product.service_tags.push({name: inputTag});
                this.inputTag = null;
            };

            //remove tag
            $scope.deleteTag = function(index, id){
                if(id || id === 0) $scope.removeTags.push(id);
                $scope.product.service_tags.splice(index,1);
            };

            //remove athors
            $scope.deleteAthors = function(index, id){
                $scope.removeAuthors.push(id);
                $scope.product.service_authors.splice(index, 1);
            };

            //save edit product
            $scope.saveEdit = function(){
                for(var i in $scope.product.specifications[0].special){
                    delete $scope.product.specifications[0].special[i]['$$hasKey'];
                }

                serviceModel.remove_services_tags($scope.removeTags);
                serviceModel.add_services_tags($scope.addTags);
                serviceModel.remove_services_authors($scope.removeAuthors);

                serviceModel.edit_service({
                        title: $scope.product.title,
                        tags: $scope.product.tags,
                        description: $scope.product.description,
                        specification: $scope.product.specifications[0]
                    },
                    function(data){
                        $scope.save = true;
                        $scope.isChangingPicture = false;
                        $state.go('service-marketplace', {serviceId: $scope.product.id});
                    });
            };

            var updateCompareCount = function () {
                var arr = $cookies.getObject('compareProducts');
                return arr == null ? {services: [], components: []} : arr;
            };
            $scope.compareProducts = updateCompareCount();

            $scope.$watch(function() { return $cookies.changedCompare; }, function(newValue) {
                $scope.compareProducts = updateCompareCount();
                apply();
            });
        }
    ]
);