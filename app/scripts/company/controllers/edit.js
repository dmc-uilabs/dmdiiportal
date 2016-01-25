'use strict';
var selectedTabIndex = 0;
var isFocused = false;
angular.module('dmc.company')
    .controller('EditStorefrontCompanyCtr', ['$stateParams', '$state', "$scope", "$cookies", "ajax", 'companyData','menuCompany','$location', 'Products','dataFactory','$mdToast','fileUpload','toastModel','$timeout', function ($stateParams, $state, $scope, $cookies, ajax, companyData, menuCompany,$location, Products, dataFactory,$mdToast,fileUpload,toastModel,$timeout) {
        $scope.selectedTabIndex = selectedTabIndex;
        $scope.$watch("selectedTabIndex",function(newVal){
            selectedTabIndex = newVal;
        });

        // auto focus for First Name input
        $timeout(function() {
            if(!isFocused) {
                isFocused = true;
                $("#descriptionCompany").focus();
            }
        });

        $scope.companyData = companyData;
        var inputToHtml = function(textInput){
            return (textInput == null ? null : textInput.trim().replace(/\n/g, '<br>'));
        };
        var htmlToInput = function(textInput){
            return (textInput == null ? null : textInput.trim().replace(/<br>/g, '\n'));
        };

        $scope.companyData.description = htmlToInput($scope.companyData.description);
        $scope.companyPicture = {
            'background-image' : (companyData.featureImage && companyData.featureImage.large ? 'url('+companyData.featureImage.large+')' : null)
        };

        $scope.companyId = $stateParams.companyId;
        $scope.page = $state.current.name.split('.')[1];

        $scope.searchModel = $stateParams.text;
        $scope.selectedProductType = $stateParams.product;
        $scope.pageType = null;
        $scope.isSearch = true;
        $scope.currentStorefrontPage = 1;
        $scope.pageSize = 10;
        $scope.downloadData = false;
        $scope.isChangingLogo = false;

        $scope.changeLogo = function(){
            $scope.isChangingLogo = true;
        };

        $scope.cancelChangeLogo = function(){
            $scope.isChangingLogo = false;
            $scope.flowLogo = null;
        };

        $scope.changedPositions = null;
        $scope.sortableOptions = {
            update: function(e, ui) {
                $scope.getChangedPosition();
            }
        };

        $scope.getChangedPosition = function(){
            var data = [];
            $(".feature-item").each(function(index){
                var position = $(this).find(".product-card-position").val((index+1));
                var id = $(this).find(".product-card-featureId").val();
                data.push([id,index+1]);
            });
            $scope.changedPositions = data;
        };

        $scope.isChangingPicture = false;
        $scope.currentPicture = null;
        var callbackUploadPicture = function(data){
            if(!data.error) {
                $scope.companyData.featureImage.large = data.file.name;
                if ($scope.companyPicture['background-image']) {
                    toastModel.showToast('success', 'Picture successfully changed');
                } else {
                    toastModel.showToast('success', 'Picture successfully uploaded');
                }
                $scope.companyPicture['background-image'] = 'url(' + companyData.featureImage.large + ')';
            }else{
                toastModel.showToast('error', 'Unable upload picture');
            }
        };

        var callbackUploadLogo = function(data){
            if(!data.error) {
                $scope.companyData.logoImage = data.file.name;
                toastModel.showToast('success', 'Logo successfully uploaded');
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }else{
                toastModel.showToast('error', 'Unable upload logo');
            }
        };

        $scope.uploadFile = function(flow){
            $scope.file = flow.files[0].file;
            fileUpload.uploadFileToUrl($scope.file,{id : $scope.companyId},'company',callbackUploadPicture);
            $scope.cancelChangePicture(flow);
        };

        $scope.flowLogo = null;
        $scope.uploadLogo = function(){
            $scope.file = $scope.flowLogo.files[0].file;
            fileUpload.uploadFileToUrl($scope.file,{id : $scope.companyId},'company-logo',callbackUploadLogo);
            $scope.cancelChangeLogo();
        };

        $scope.deleteLogo = function(){
            ajax.on(dataFactory.deleteCompanyLogo($scope.companyId), {
                    logoImage : null
                }, function(data){
                    $scope.companyData.logoImage = null;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                },function(data){
                    toastModel.showToast("error","Error. getFeaturesCompany() fail");
                },"PUT"
            );
        };

        $scope.changePicture = function(){
            $scope.isChangingPicture = true;
        };

        $scope.cancelChangePicture = function(flow){
            flow.files = [];
            if($scope.currentPicture) $scope.companyPicture['background-image'] = $scope.currentPicture;
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
            $scope.flowBoxStyle = {'max-width' : 560};
            flow.files.shift();
        };

        $scope.addedNewLogo = function(file,event,flow){
            $scope.flowLogo = flow;
            flow.files.shift();
        };

        $scope.$watch(function(){
            return $("#flowImage").attr("src");
        },function(newVal,oldVal){
            if(newVal && newVal != oldVal){
                $scope.currentPicture = $scope.companyPicture['background-image'];
                $scope.companyPicture['background-image'] = 'url(' + newVal + ')';
            }
        });

        $scope.removePicture = function(flow){
            flow.files = [];
            $scope.flowBoxStyle = null;
            if($scope.currentPicture) $scope.companyPicture['background-image'] = $scope.currentPicture;
        };

        $scope.removeLogo = function(flow){
            flow.files = [];
            $scope.flowLogo = null;
        };

        $scope.features = {
            services : [],
            components : [],
            all : []
        };
        $scope.products = {arr : [],count : 0};


        var responseData = {
            limit : 4,
            offset: ($scope.currentStorefrontPage-1)*$scope.pageSize,
            checkFeatures : true,
            filterData : $stateParams
        };

        // function for get all products --------------------------------------------------
        $scope.getAllProducts = function(){
            Products.get($scope.callbackProducts,'all',responseData);
        };
        $scope.callbackProducts = function(data){
            $scope.products = {arr : data.result,count : data.count};
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        // ---------------------------------------------------------------------------------

        // function for get services --------------------------------------------------
        $scope.getServices = function(){
            Products.get($scope.callbackServices,'services',responseData);
        };
        $scope.callbackServices = function(data){
            $scope.products = {arr : data.result,count : ($stateParams.type ? data.countTypes[$stateParams.type] : data.count)};
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        // -----------------------------------------------------------------------------

        // function for get components --------------------------------------------------
        $scope.getComponents = function(){
            Products.get($scope.callbackComponents,'components',responseData);
        };
        $scope.callbackComponents = function(data){
            $scope.products = {arr : data.result,count : data.count};
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        // -----------------------------------------------------------------------------

        $scope.update = function(search){
            $scope.isSearch = search;
            responseData.limit = $scope.pageSize;
            responseData.offset = ($scope.currentStorefrontPage-1)*$scope.pageSize;
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
            };
        };
        $scope.update($scope.isSearch);

        $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
            if(parseInt(newValue) > 0 && $scope.currentStorefrontPage !== parseInt(newValue)) {
                $scope.currentStorefrontPage = newValue; // save new page number
                $scope.update(true);
            }
        });

        $scope.updatePageSize = function(val){
            $scope.pageSize = val;
            $scope.update(true);
        };

        $scope.productTypeChanged = function () {
            var dataSearch = $.extend(true,{},$stateParams);
            dataSearch.product = $scope.selectedProductType;
            $location.path('/' + dataSearch.companyId + '/edit').search(dataSearch);
        };

        $scope.submit = function(){
            var dataSearch = $.extend(true,{},$stateParams);
            dataSearch.text = $scope.searchModel;
            $location.path('/' + dataSearch.companyId + '/edit').search(dataSearch);
        };


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
                            $scope.features.all = [];
                            for(var s in $scope.features.services){
                                $scope.features.all.push($scope.features.services[s]);
                            }
                            for(var s in $scope.features.components){
                                $scope.features.all.push($scope.features.components[s]);
                            }
                            $scope.features.all.sort(function(a,b){
                                return a.position > b.position;
                            });
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

        $scope.changedData = {};

        $scope.changedInput = function(type){
            $scope.changedData[type] = $scope.companyData[type];
        };

        $scope.cancelChanges = function(){
            $location.path('/'+$scope.companyId+'/storefront').search({
                product : 'services'
            });
        };

        $scope.saveChanges = function(){
            var description = inputToHtml($scope.companyData.description);
            ajax.on(dataFactory.saveCompanyChanges(),
                {
                    company_id : $scope.companyId,
                    description : description,
                    positions : $scope.changedPositions
                },
                function(data){
                    if(!data.error){
                        toastModel.showToast('success','Data successfully changed');
                        $scope.changedData = {};
                        $location.path('/'+$scope.companyId+'/storefront').search({
                            product : 'services'
                        });
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
                        for(var i=0;i < $scope.products.arr.length;i++) {
                            if($scope.products.arr[i].type == type && $scope.products.arr[i].id == product_id){
                                $scope.products.arr[i].featureId = data.result.id;
                                $scope.products.arr[i].position = data.result.position;
                                $scope.products.arr[i].inFeatured = true;
                                $scope.features[$scope.products.arr[i].type+'s'].push($.extend(true,{},$scope.products.arr[i]));
                                $scope.features.all.push($.extend(true,{},$scope.products.arr[i]));
                                $scope.features.all.sort(function(a,b){
                                    return a.position > b.position;
                                });
                                break;
                            }
                        }
                        $scope.getChangedPosition();
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
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
                        for(var i=0;i<$scope.features[$scope.products.arr[i].type+'s'].length;i++){
                            if($scope.features[$scope.products.arr[i].type+'s'][i].id == product_id){
                                $scope.features[$scope.products.arr[i].type+'s'].splice(i,1);
                                break;
                            }
                        }
                        for(var i=0;i<$scope.features.all.length;i++){
                            if($scope.features.all[i].id == product_id && $scope.features.all[i].type == type){
                                $scope.features.all.splice(i,1);
                                break;
                            }
                        }
                        for(var i=0;i < $scope.products.arr.length;i++) {
                            if($scope.products.arr[i].type == type && $scope.products.arr[i].id == product_id){
                                delete $scope.products.arr[i].featureId;
                                delete $scope.products.arr[i].position;
                                delete $scope.products.arr[i].inFeatured;
                                break;
                            }
                        }
                        $scope.getChangedPosition();
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }else{
                        toastModel.showToast("error",data.error);
                    }
                },function(data){
                    toastModel.showToast("error","Error. Removing featured company fail");
                }
            );
        };

        // disable all links in products card
        $("md-tabs").on("click",".product-card a",function(event){
            event.preventDefault();
        }).on("mouseenter",".product-card a",function(){
            $(this).attr("href","");
            $(this).css("cursor","default");
        });
}]);