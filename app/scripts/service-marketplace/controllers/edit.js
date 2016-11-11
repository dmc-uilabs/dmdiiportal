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
        'fileUpload',
        '$mdDialog',
        '$timeout',
        'questionToastModel',
        'DMCUserModel',
        'CompareModel',
        '$cookies',
        function (serviceData,
                  serviceModel,
                  $state,
                  $stateParams,
                  $scope,
                  ajax,
                  dataFactory,
                  fileUpload,
                  $mdDialog,
                  $timeout,
                  questionToastModel,
                  DMCUserModel,
                  CompareModel,
                  $cookies) {

            $scope.product = serviceData;  //array product
            $scope.not_found = false;  //product not fount
            $scope.products_card = [];  //products card
            $scope.allServices = [];

            $scope.removeTags =[];
            $scope.addTags =[];
            $scope.removeAuthors = [];
            $scope.removeImages = [];
            $scope.addImages = [];
            $scope.addAuthors = [];
            $scope.arrAddSpecifications = [];
            $scope.arraySpecifications = [];
            $scope.autocomplete = false;
            $scope.documents = [];

            if(!$scope.product) return false;

            $scope.changes = {};
            $scope.changesSpecifications = $scope.product && $scope.product.specifications && $scope.product.specifications.length > 0 && $scope.product.specifications[0].special ? $scope.product.specifications[0].special.length : 0;

            $scope.newImages = [];
            $scope.removedImages = [];
            $scope.service_images = [];
            ajax.get(dataFactory.documentsUrl().getList, { recent: 10, parentType: 'SERVICE', parentId: $scope.product.id, docClass: 'IMAGE' }, function(response) {
                if (response.data && response.data.data && response.data.data.length) {
                    $scope.service_images = response.data.data;
                    angular.forEach($scope.service_images, function(image, index) {
                        $scope.service_images[index].url = image.documentUrl;
                    });
                    console.log($scope.service_images)
                }
            });

            serviceModel.get_array_specifications(function(data){
                $scope.arraySpecifications = data;
                if (!$scope.product || !$scope.product.specifications || $scope.product.specifications.length === 0) {
                    return;
                }
                for(var i in $scope.product.specifications[0].special){
                    for(var j in $scope.arraySpecifications){
                        if($scope.arraySpecifications[j].id == $scope.product.specifications[0].special[i].specificationId){
                            $scope.arraySpecifications.splice(j,1);
                        }
                    }
                }
            });
            $scope.serviceTypes = [{
                tag : 'analytical',
                name : 'Analytical'
            }, {
                tag: 'data',
                name : 'Data'
            },{
                tag : 'solid',
                name : 'Solid'
            }];

            $scope.currentImage = 1;
            $scope.indexImages = 0;
            $scope.save = false;
            $scope.isChange = false;

            $scope.$on('$stateChangeStart', function (event, next) {
                if(!$scope.save && $scope.isChange){
                    var answer = confirm('Are you sure you want to leave this page without saving?');
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $(window).bind('beforeunload', function () {
                if($state.current.name == 'service-marketplace-edit' && $scope.isChange)
                    return 'Are you sure you want to leave this page without saving?';
            });

            $scope.change = function(){
                $scope.isChange = false;
                for(var key in $scope.changes){
                    if($scope.changes[key] != $scope.product[key]){
                        $scope.isChange = true;
                        return;
                    }
                }


                if($scope.removeTags.length){
                    $scope.isChange = true;
                    return;
                }
                if($scope.addTags.length){
                    $scope.isChange = true;
                    return;
                }
                if($scope.removeAuthors.length){
                    $scope.isChange = true;
                    return;
                }
                if($scope.removeImages.length){
                    $scope.isChange = true;
                    return;
                }
                if($scope.addImages.length){
                    $scope.isChange = true;
                    return;
                }
                if($scope.addAuthors.length){
                    $scope.isChange = true;
                    return;
                }
                if($scope.product && $scope.product.specifications && $scope.product.specifications.length > 0 && $scope.product.specifications[0].special && $scope.product.specifications[0].special.length != $scope.changesSpecifications){
                    $scope.isChange = true;
                    return;
                }
            }

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
                CompareModel.get('services',userData);
                getFavoriteCount();
            });

            // get favorites count ------------------
            $scope.favoritesCount = 0;
            var getFavoriteCount = function(){
                ajax.get(dataFactory.getFavoriteProducts(),{
                    accountId : userData.accountId
                },function(response){
                    $scope.favoritesCount = response.data.length;
                    apply();
                });
            };

            //functions for carousel
            $scope.carouselFunctions = {
                openImage : function(index){
                    $scope.indexImages = index;
                },
                deleteImage: function(index,ev){
                    questionToastModel.show({
                        question : 'Do you want to delete the image?',
                        buttons: {
                            ok: function(){
                                $scope.isChange = true;
                                $scope.removedImages.push($scope.service_images[index].id);
                                $scope.service_images.splice(index, 1);
                                if ($scope.indexImages == index){
                                    $scope.indexImages = 0;
                                }
                                if($scope.indexImages > index){
                                    $scope.indexImages--;
                                }
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
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

            var updateCompareCount = function () {
                var arr = $cookies.getObject('compareProducts');
                return arr == null ? {services: [], components: []} : arr;
            };
            $scope.compareProducts = updateCompareCount();

            $scope.$watch(function() { return $cookies.changedCompare; }, function(newValue) {
                $scope.compareProducts = updateCompareCount();
            });

            //Edit product
            $scope.editPage = function () {
                // auto focus for edit product's title
                $timeout(function() {
                    $('#editTitleProduct').focus();
                });
            };

            //query specifications
            $scope.specificationsSearch = function(query) {
                $scope.autocomplete = this.$$childHead.$mdAutocompleteCtrl;
                var results = query ? $scope.arraySpecifications.filter( createFilterForSpecifications(query) ) : $scope.arraySpecifications;
                return results;
            };

            //Add specifications to product
            $scope.AddSpecifications = function(item, text){
                if(!item)return;
                for(var i in $scope.arraySpecifications){
                    if( $scope.arraySpecifications[i].id == item.id ){
                        $scope.arraySpecifications.splice(i,1);
                        break;
                    }
                }
                $scope.arrAddSpecifications.push({
                    specification: item.name,
                    data: '',
                    specificationId: item.id
                });

                this.$$childHead.$mdAutocompleteCtrl.clear();

                $timeout(function() {
                    $('input[name=\'data\']').focus();
                })
            };

            $timeout(function() {
                $('md-autocomplete').focusout(function(ev){
                    if($scope.autocomplete){
                        $timeout(function() {
                            $scope.autocomplete.scope.selectedItem = null;
                            $scope.autocomplete.scope.searchText = null;
                         },500)
                    }
                })
            });

            $scope.pushSpecifications = function(index){
                $scope.isChange = true;
                $scope.product.specifications[0].special.push($scope.arrAddSpecifications[index]);
                $scope.arrAddSpecifications.splice(index,1);
            };

            $scope.cancelPushSpecifications = function(index){
                $scope.arrAddSpecifications.splice(index,1);
            }

            //Create filter function
            function createFilterForSpecifications(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(state) {
                    return (angular.lowercase(state.name).indexOf(lowercaseQuery) === 0);
                };
            };

            //remove specifications
            $scope.deleteSpecifications = function(index,ev){
                questionToastModel.show({
                    question : 'Do you want to delete the specification?',
                    buttons: {
                        ok: function(){
                            $scope.arraySpecifications.push({
                                id: $scope.product.specifications[0].special[index].specificationId,
                                name: $scope.product.specifications[0].special[index].specification
                            });
                            $scope.product.specifications[0].special.splice(index,1);
                            $scope.change();
                        },
                        cancel: function(){}
                    }
                },ev);
            };

            //add bew sepecifications to system
            $scope.addNewSpecifications = function(text){
                this.$$childHead.$mdAutocompleteCtrl.clear();
                serviceModel.add_array_specifications(text,
                    function(data){
                        $scope.arrAddSpecifications.push({
                        specification: data.name,
                        data: '',
                        specificationId: data.id
                    });
                    $timeout(function() {
                        $('input[name=\'data\']').focus();
                    });
                });
            }

            //add tag to product
            $scope.addTag = function(inputTag){
                if(!inputTag)return;
                $scope.isChange = true;
                $scope.addTags.push(inputTag);
                $scope.product.service_tags.push({name: inputTag});
                this.inputTag = null;
            };

            //remove tag
            $scope.deleteTag = function(index, id,ev){
                questionToastModel.show({
                    question : 'Do you want to delete the tag?',
                    buttons: {
                        ok: function(){
                            $scope.isChange = true;
                            if(id || id === 0) $scope.removeTags.push(id);
                            $scope.product.service_tags.splice(index,1);
                        },
                        cancel: function(){}
                    }
                },ev);
            };

            //remove athors
            $scope.deleteAthors = function(index, id,ev){
                questionToastModel.show({
                    question : 'Do you want to delete the author?',
                    buttons: {
                        ok: function(){
                            $scope.isChange = true;
                            $scope.removeAuthors.push(id);
                            $scope.product.service_authors.splice(index, 1);
                        },
                        cancel: function(){}
                    }
                },ev);
            };

            var uploadImage = function(image) {
                if (image.tags) {
                    image.tags.push({tagName: $scope.product.title + ' picture'});
                    angular.forEach(image.tags, function(tag, index) {
                        if (!angular.isObject(tag)) {
                            image.tags[index] = {tagName: tag}
                        }
                    });
                } else {
                    image.tags = [{tagName: $scope.product.title + ' picture'}];
                }
                return fileUpload.uploadFileToUrl(image.file, {},'service').then(function(data){
                    var doc = {
                        documentUrl: data.file.name,
                        documentName: image.title,
                        ownerId: userData.accountId,
                        parentType: 'SERVICE',
                        docClass: 'IMAGE',
                        parentId: $scope.product.id,
                        accessLevel: 'MEMBER',
                        tags: image.tags
                    }

                    return ajax.create(dataFactory.documentsUrl().save, doc);
                });
            };

            var removeImage = function(imageId) {
                ajax.delete(dataFactory.documentsUrl(imageId).delete, {});
            };

            var uploadDocument = function(doc) {
                if (doc.tags) {
                    doc.tags.push({tagName: $scope.product.title + ' document'});
                    angular.forEach(doc.tags, function(tag, index) {
                        if (!angular.isObject(tag)) {
                            doc.tags[index] = {tagName: tag}
                        }
                    });
                } else {
                    doc.tags = [{tagName: $scope.product.title + ' document'}];
                }
                return fileUpload.uploadFileToUrl(doc.file, {},'service').then(function(data){
                    var newDoc = {
                        documentUrl: data.file.name,
                        documentName: doc.title,
                        ownerId: userData.accountId,
                        parentType: 'SERVICE',
                        docClass: 'SUPPORT',
                        parentId: $scope.product.id,
                        accessLevel: 'MEMBER',
                        tags: doc.tags
                    }
                    return ajax.create(dataFactory.documentsUrl().save, newDoc);
                });
            };

            //save edit product
            $scope.saveEdit = function(){
                if ($scope.product.specifications && $scope.product.specifications.length > 0) {
                    for(var i in $scope.product.specifications[0].special){
                        delete $scope.product.specifications[0].special[i]['$$hasKey'];
                    }
                }

                var promises = [];
                angular.forEach($scope.newImages, function(image) {
                    promises.push(uploadImage(image));
                });

                angular.forEach($scope.removedImages, function(imageId) {
                    promises.push(removeImage(imageId));
                });

                angular.forEach($scope.documents, function(doc) {
                    promises.push(uploadDocument(doc));
                });

                serviceModel.remove_services_tags($scope.removeTags);
                serviceModel.add_services_tags($scope.addTags);
                serviceModel.remove_services_authors($scope.removeAuthors);

                var service = {
                    title: $scope.product.title,
                    description: $scope.product.description,
                    serviceType: $scope.product.serviceType
                }

                if ($scope.product.specifications && $scope.product.specifications.length) {
                    service.specification = $scope.product.specifications[0];
                }

                serviceModel.edit_service(service,
                    function(data){
                        $scope.save = true;
                        $scope.isChangingPicture = false;
                        $state.go('service-marketplace', {serviceId: $scope.product.id});
                    });
            };

            $scope.cancelEdit = function(){
                $scope.save = true;
                $scope.isChangingPicture = false;
                $state.go('service-marketplace',{serviceId: $scope.product.id})
            }
        }
    ]
);
