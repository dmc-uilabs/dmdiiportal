'use strict';
angular.module('dmc.company')
    .controller('StorefrontCompanyCtr', [
        '$stateParams',
        '$state',
        "$scope",
        "$cookies",
        "ajax",
        "$location",
        'companyData',
        'CompanyModel',
        'toastModel',
        'dataFactory',
        'isFavorite',
        '$mdDialog', function ($stateParams,
                               $state,
                               $scope,
                               $cookies,
                               ajax,
                               $location,
                               companyData,
                               CompanyModel,
                               toastModel,
                               dataFactory,
                               isFavorite,
                               $mdDialog ) {

        $scope.companyData  = companyData ;
        if($scope.companyData && $scope.companyData.id) {
            $scope.owner = $scope.companyData.account;
            // ------------------------------ get state params
            $scope.companyId = $stateParams.companyId;
            $scope.selectedProductType = $stateParams.product;
            $scope.isSearch = ($location.$$path.indexOf('search') != -1 ? true : false);
            $scope.searchModel = $stateParams.text;
            $scope.productSubType = (angular.isDefined($stateParams.type) ? $stateParams.type : 'analytical');
            // -----------------------------------------------
            $scope.currentStorefrontPage = 1;
            $scope.pageSize = 10;
            $scope.downloadData = false;
            $scope.page = $state.current.name.split('.')[1];

            $scope.productTypes = [
                //{
                //    id: 1,
                //    name: "all",
                //    title: "All"
                //},
                {
                    id: 2,
                    name: "services",
                    title: "Services"
                }
                //, {
                //    id: 3,
                //    name: "components",
                //    title: "Components"
                //}
            ];


            $scope.carouselData = {
                featured: {arr: [], count: 0},
                new: {arr: [], count: 0}
            };

            // get company Featured
            $scope.getFeatured = function () {
                ajax.get(dataFactory.getCompanyFeatured($scope.companyId), {
                        "_order" : "DESC",
                        "_sort" : "position",
                        "_expand" : ["service","component"]
                    },
                    function (response) {
                        $scope.carouselData.featured.arr = [];
                        for(var index in response.data){
                            var item_ = null;
                            if(response.data[index].service){
                                item_ = response.data[index].service;
                                item_.type = "service";
                            }else if(response.data[index].component){
                                item_ = response.data[index].component;
                                item_.type = "component";
                            }
                            if(item_) {
                                item_.featureId = response.data[index].id;
                                item_.inFeatured = true;
                                item_.position = response.data[index].position;
                                $scope.carouselData.featured.arr.push(item_);
                            }
                        }
                        $scope.carouselData.featured.count = $scope.carouselData.featured.arr.length;
                        isFavorite.check($scope.carouselData.featured.arr);
                        $scope.carouselData.featured.arr.sort(function(a,b){
                            return a.position > b.position;
                        });
                        apply();
                    }
                );
            };
            if(!$scope.isSearch) $scope.getFeatured();

            // get new services and components for Carousel
            $scope.getNewCompanyServices = function(){
                ajax.get(dataFactory.getNewCompanyServices($scope.companyId), {
                        "_limit" : 10,
                        "_order" : "DESC",
                        "_sort" : "id"
                    }, function (response) {
                        $scope.carouselData.new = {arr: response.data, count: response.data.length};
                        isFavorite.check($scope.carouselData.new.arr);
                        apply();
                    }
                );
            };
            if(!$scope.isSearch) $scope.getNewCompanyServices();

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };


            $scope.storefrontItems = {arr: [], count: 0};

            var responseData = {
                _limit : 4,
                _embed : "company_featured",
                _start : ($scope.currentStorefrontPage-1)*$scope.pageSize
            };

            // insert response data to array of storefront items
            var isFirstCallback = true;
            var insertData = function(data){
                if($scope.selectedProductType == 'all' && !isFirstCallback){
                    $scope.storefrontItems = {
                        arr : $.merge($scope.storefrontItems.arr, data),
                        count : $scope.storefrontItems.arr.length
                    };
                    isFavorite.check($scope.storefrontItems.arr);
                    apply();
                }else{
                    isFirstCallback = false;
                    $scope.storefrontItems = {
                        arr : data,
                        count : data.length
                    };
                    if($scope.selectedProductType != 'all'){
                        isFavorite.check($scope.storefrontItems.arr);
                        apply();
                    }
                }
            };

            // callback for services
            var callbackCompanyServices = function(response){
                for(var index in response.data){
                    response.data[index].type = "service";
                }
                insertData(response.data);
            };

            // callback for components
            var callbackCompanyComponents = function(response){
                for(var index in response.data){
                    response.data[index].type = "component";
                }
                insertData(response.data);
            };

            // get all services and components
            $scope.getServicesAndComponents = function(){
                isFirstCallback = true;
                ajax.get(dataFactory.getCompanyServices($scope.companyId), responseData, callbackCompanyServices);
                ajax.get(dataFactory.getCompanyComponents($scope.companyId), responseData, callbackCompanyComponents);
            };

            // get all services --------------------------------------------------
            $scope.getServices = function(){
                isFirstCallback = true;
                ajax.get(dataFactory.getCompanyServices($scope.companyId), responseData, callbackCompanyServices);
            };

            // get all components --------------------------------------------------
            $scope.getComponents = function(){
                isFirstCallback = true;
                ajax.get(dataFactory.getCompanyComponents($scope.companyId), responseData,callbackCompanyComponents);
            };

            // update products
            $scope.update = function (search) {
                $scope.isSearch = search;
                if($scope.searchModel){
                    responseData.title_like = $scope.searchModel;
                }else{
                    delete responseData.title_like;
                }
                if($scope.productSubType){
                    responseData.serviceType = $scope.productSubType;
                }else{
                    delete responseData.serviceType;
                }
                responseData._limit = (search ? $scope.pageSize : 4);
                responseData._start = ($scope.currentStorefrontPage - 1) * $scope.pageSize;
                switch ($scope.selectedProductType) {
                    case 'all':
                        $scope.getServicesAndComponents();
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
            $scope.update($scope.isSearch);

            // if changed number of page
            $scope.$watch(function () {
                return $cookies.changedPage;
            }, function (newValue) {
                if (parseInt(newValue) > 0 && $scope.currentStorefrontPage !== parseInt(newValue)) {
                    $scope.currentStorefrontPage = newValue; // save new page number
                    $scope.update(true);
                }
            });

            // Change count products per page
            $scope.updatePageSize = function (val) {
                $scope.pageSize = val;
                $scope.update(true);
            };

            // Function for product types drop down (all, services, components)
            $scope.productTypeChanged = function (type) {
                $scope.selectedProductType = type;
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.product = $scope.selectedProductType;
                $location.path('/' + dataSearch.companyId + '/search').search(dataSearch);
            };

            // Function for Search by name
            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.text = $scope.searchModel;
                $location.path('/' + dataSearch.companyId + '/search').search(dataSearch);
            };

            // Function for "Show All" Button
            $scope.showAll = function () {
                $scope.submit();
            };

            // get data from cookies
            var updateCompareCount = function () {
                var arr = $cookies.getObject('compareProducts');
                return arr == null ? {services: [], components: []} : arr;
            };
            $scope.compareProducts = updateCompareCount();

            // catch updated changedCompare variable form $cookies
            $scope.$watch(function () {
                return $cookies.changedCompare;
            }, function (newValue) {
                $scope.compareProducts = updateCompareCount();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });

            if ($scope.companyData.description.length > 200) {
                $scope.companyData.shortDescription = $scope.companyData.description.replace(/<br>/g, '').substring(0, 200) + '...';
            }

            $scope.isReadMore = false;
            $scope.readMore = function () {
                $scope.isReadMore = ($scope.isReadMore ? false : true);
            };

            $scope.followCompany = function () {
                if(!$scope.companyData.follow){
                    ajax.create(dataFactory.followCompany(),{
                        accountId : currentAccountId,
                        companyId : $scope.companyId
                    },function(response){
                        $scope.companyData.follow = response.data;
                        apply();
                    });
                }else{
                    ajax.delete(dataFactory.unfollowCompany($scope.companyData.follow.id),{},
                        function(response){
                            $scope.companyData.follow = null;
                        }
                    );
                }
            };

            // message dialog ---------------------------
            $scope.openMessageDialog = function(ev) {
                $mdDialog.show({
                    controller: messageDialogController,
                    templateUrl: 'templates/company/message-dialog-tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    locals : {
                        owner : $scope.companyData.account,
                        currentUser : {id : currentAccountId}
                    }
                }).then(function(answer) {
                    // $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    // $scope.status = 'You cancelled the dialog.';
                });
            };
            // ------------------------------------------

            $scope.treeMenuModel = CompanyModel.getMenu();
        }
}]);