'use strict';
angular.module('dmc.company')
    .controller('EditStorefrontCompanyCtr', [
        '$stateParams', '$state', "$scope", "$cookies", "ajax",
        'companyData','menuCompany','$location', 'Products','dataFactory','$mdToast','fileUpload','toastModel',
        function ($stateParams, $state, $scope, $cookies, ajax,
                  companyData, menuCompany,$location, Products, dataFactory,$mdToast,fileUpload,toastModel) {
        $scope.companyData = companyData;
        $scope.companyPicture = {
            'background-image' : 'url('+companyData.featureImage.large+')'
        };
        $scope.companyId = $stateParams.companyId;
        $scope.page = $state.current.name.split('.')[1];

        $scope.selectedProductType = "all";
        $scope.pageType = null;

        $scope.isChangingPicture = false;

        var callbackUploadPicture = function(data){
            $scope.companyData.featureImage.large = data.file.name;
            $scope.companyPicture['background-image'] = 'url('+companyData.featureImage.large+')';
        };

        $scope.uploadFile = function(flow){
            $scope.file = flow.files[0].file;
            $scope.cancelChangePicture(flow);
            fileUpload.uploadFileToUrl($scope.file,{id : $scope.companyId},'company',callbackUploadPicture);
        };

        $scope.changePicture = function(){
            $scope.isChangingPicture = true;
        };
        $scope.cancelChangePicture = function(flow){
            flow.files = [];
            $scope.isChangingPicture = false;
        };

        $scope.prevPicture = null;
        $scope.pictureDragEnter = function(flow){
        $scope.prevPicture = flow.files[0];
            flow.files = [];
        };

        $scope.pictureDragLeave = function(flow){
            if(flow.files.length == 0 && $scope.prevPicture != null) {
                flow.files = [$scope.prevPicture];
                $scope.prevPicture = null;
            }
        };

        $scope.addedNewFile = function(file,event,flow){
            flow.files.shift();
        };

        $scope.features = {
            services : [],
            components : []
        };
        $scope.products = [];
        var responseData = function(){
            var data = {
                limit : 20,
                offset: 0,
                type : $scope.pageType
            };
            return data;
        };

            // function for get all products --------------------------------------------------
            $scope.getAllProducts = function(){
                Products.get($scope.callbackProducts,'all',responseData());
            };
            $scope.callbackProducts = function(data){
                $scope.products = data.result;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            };
            // ---------------------------------------------------------------------------------

            // function for get services --------------------------------------------------
            $scope.getServices = function(){
                Products.get($scope.callbackServices,'services',responseData());
            };
            $scope.callbackServices = function(data){
                $scope.products = data.result;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            };
            // -----------------------------------------------------------------------------

            // function for get components --------------------------------------------------
            $scope.getComponents = function(){
                Products.get($scope.callbackComponents,'components',responseData());
            };
            $scope.callbackComponents = function(data){
                $scope.products = data.result;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            };
            // -----------------------------------------------------------------------------

            $scope.productTypeChanged = function(){
                switch($scope.selectedProductType){
                    case 'all':
                        $scope.getAllProducts();
                        break;
                    case 'services':
                        $scope.getServices();
                        break;
                    case 'components':
                        $scope.getComponents();
                        break;
                    default:
                        break;
                }
            };

            $scope.productTypeChanged();


        $scope.productTypes = [
            {
                name : "all",
                title : "All"
            },{
                name : "services",
                title : "Services"
            },{
                name : "components",
                title : "Components"
            }
        ];
        $scope.treeMenuModel = menuCompany.getMenu($scope.selectedProductType,$scope.pageType,$scope.companyId);

        $scope.cancelChanges = function(){

        };
            $scope.featuredIds = [];
            $scope.getFeatures = function(){
                ajax.on(dataFactory.getFeaturesCompany(),
                    {
                        company_id : $scope.companyId
                    },
                    function(data){
                        if(!data.error){
                            $scope.features.services = data.result.services;
                            $scope.features.components = data.result.components;
                            $scope.featuredIds = [];
                            for(var s in $scope.features.services){
                                $scope.featuredIds.push('s'+$scope.features.services[s].id);
                            }
                            for(var s in $scope.features.components){
                                $scope.featuredIds.push('c'+$scope.features.components[s].id);
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        }else{
                            toastModel.showToast("error",data.error);
                        }
                    },function(data){
                        toastModel.showToast("error","Error. getFeaturesCompany() fail");
                    }
                );
            };
            $scope.getFeatures();

        $scope.saveChanges = function(){
            ajax.on(dataFactory.saveCompanyChanges(),
                {
                    company_id : $scope.companyId,
                    name : $scope.companyData.name,
                    description : $scope.companyData.description
                },
                function(data){
                    if(!data.error){
                        toastModel.showToast('success','Data successfully changed');
                    }else{
                        toastModel.showToast("error",data.error);
                    }
                },function(data){
                    toastModel.showToast("error","Error. saveChanges() fail");
                }
            );
        };


        $scope.addFeatured = function(product_id,type){
            ajax.on(dataFactory.addFeaturedCompany(),
                {
                    company_id : $scope.companyId,
                    product_id : product_id,
                    type : type
                },
                function(data){
                    if(!data.error){
                        for(var p in $scope.products){
                            if($scope.products[p].type == type && $scope.products[p].id == product_id){
                                if($scope.products[p].type == 'service') {
                                    $scope.features.services.push($.extend(true, {}, $scope.products[p]));
                                }else if($scope.products[p].type == 'component') {
                                    $scope.features.components.push($.extend(true, {}, $scope.products[p]));
                                }
                                $scope.featuredIds.push(type[0]+product_id);
                                break;
                            }
                        }
                    }else{
                        toastModel.showToast("error",data.error);
                    }
                },function(data){
                    toastModel.showToast("error","Error. Adding featured company fail");
                }
            );
        };

        $scope.removeFeatured = function(product_id,type){
            ajax.on(dataFactory.removeFeaturedCompany(),
                {
                    company_id : $scope.companyId,
                    product_id : product_id,
                    type : type
                },
                function(data){
                    if(!data.error){
                        if($scope.featuredIds.indexOf(type[0]+product_id) != -1){
                            $scope.featuredIds.splice($scope.featuredIds.indexOf(type[0]+product_id),1);
                            var block = (type == 'service' ? 'services' : 'components');
                            var index = null;
                            for(var s in $scope.features[block]){
                                if($scope.features[block][s].id == product_id){
                                    index = s;
                                    break;
                                }
                            }
                            if(index) $scope.features[block].splice(index,1);
                        }
                    }else{
                        toastModel.showToast("error",data.error);
                    }
                },function(data){
                    toastModel.showToast("error","Error. Removing featured company fail");
                }
            );
        };


}]);