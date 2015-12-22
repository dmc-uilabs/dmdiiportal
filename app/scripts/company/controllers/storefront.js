'use strict';
angular.module('dmc.company')
    .controller('StorefrontCompanyCtr', ['$stateParams', '$state', "$scope", "$cookies", "ajax","Products","$location",'companyData','menuCompany', 'toastModel','dataFactory', function ($stateParams, $state, $scope, $cookies, ajax,Products,$location,companyData, menuCompany, toastModel, dataFactory ) {
        $scope.companyData  = companyData ;
        // ------------------------------ get state params
        $scope.companyId = $stateParams.companyId;
        $scope.selectedProductType = $stateParams.page;
        $scope.isSearch = ($stateParams.text ? true : false);
        $scope.searchModel = $stateParams.text;
        $scope.pageType = (angular.isDefined($stateParams.type) ? $stateParams.type : 'analytical');
        // -----------------------------------------------
        $scope.currentStorefrontPage = 1;
        $scope.pageSize = 10;
        $scope.downloadData = false;
        $scope.page = $state.current.name.split('.')[1];

        $scope.productTypes = [
            {
                id : 1,
                name : "all",
                title : "All"
            },{
                id : 2,
                name : "services",
                title : "Services"
            },{
                id : 3,
                name : "components",
                title : "Components"
            }
        ];


            $scope.carouselData = {
                featured : {arr : [], count : 0},
                new : {arr : [], count : 0}
            };

            $scope.getFeatures = function(){
                ajax.on(dataFactory.getFeaturesCompany(),
                    {
                        company_id : $scope.companyId
                    },
                    function(data){
                        if(!data.error){
                            //$scope.features.services = data.result.services;
                            //$scope.features.components = data.result.components;
                            $scope.carouselData.featured.arr = $.merge(data.result.services,data.result.components);
                        }else{
                            toastModel.showToast("error",data.error);
                        }
                    },function(data){
                        toastModel.showToast("error","Error. getFeaturesCompany() fail");
                    }
                );
            };
            $scope.getFeatures();

        // get featured and new for Carousel -------------------------------
        $scope.callbackCarouselData = function(data){
            //$scope.carouselData.featured = {arr : data.result, count : data.count};
            $scope.carouselData.new = {arr : data.result, count : data.count};
        };

        Products.get($scope.callbackCarouselData,'services',{
            limit : 10, offset: 0
        });
        // ---------------------------------------------------------

        $scope.itemsArray = {arr : [],count : 0};
        var responseData = {
            limit : 4,
            offset: ($scope.currentStorefrontPage-1)*$scope.pageSize,
            type : $scope.pageType,
            name : $scope.searchModel
        };

        // function for get all products --------------------------------------------------
        $scope.getAllProducts = function(){
            Products.get($scope.callbackProducts,'all',responseData);
        };
        $scope.callbackProducts = function(data){
            $scope.itemsArray = {arr : data.result,count : data.count};
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        // ---------------------------------------------------------------------------------

        // function for get services --------------------------------------------------
        $scope.getServices = function(){
            Products.get($scope.callbackServices,'services',responseData);
        };
        $scope.callbackServices = function(data){
            $scope.itemsArray = {arr : data.result,count : data.count};
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        // -----------------------------------------------------------------------------

        // function for get components --------------------------------------------------
        $scope.getComponents = function(){
            Products.get($scope.callbackComponents,'components',responseData);
        };
        $scope.callbackComponents = function(data){
            $scope.itemsArray = {arr : data.result,count : data.count};
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        // -----------------------------------------------------------------------------
        $scope.update = function(search){
            $scope.isSearch = search;
            responseData.limit =(search ? $scope.pageSize : 4);
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
        //$scope.$watch('pageSize', function(newValue, oldValue) {
        //   // if (newValue !== oldValue){ // if get another value
        //       // console.log($scope.pageSize);
        //        //$scope.update(true);
        //   // }
        //});

        $scope.productTypeChanged = function(search){
            $scope.update(search);
            var item = null;
            var index = -1;
            for(var i in $scope.productTypes){
                if($scope.productTypes[i].name == $scope.selectedProductType){
                    item = $.extend(true,{},$scope.productTypes[i]);
                    index = i;
                    break;
                }
            }
            if(item) {
                $scope.productTypes.splice(index, 1);
                $scope.productTypes = $scope.productTypes.sort(function (a, b) {
                    return a.id - b.id
                });
                $scope.productTypes.unshift(item);
            }
            $scope.treeMenuModel = menuCompany.getMenu($scope.selectedProductType,$scope.pageType,$scope.companyId);
        };
        $scope.productTypeChanged($scope.isSearch);

        $scope.showAll = function(){
            $scope.update(true);
        };

        $scope.submit = function(){
            var params = { text: $scope.searchModel };
            if($scope.selectedProductType == 'services') params.type = $scope.pageType;
            $location.path('/'+$scope.companyId+'/storefront/'+$scope.selectedProductType).search(params);
        };

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

        if($scope.companyData.description.length > 200) {
            $scope.companyData.shortDescription = $scope.companyData.description.replace(/<br>/g, '').substring(0, 200)+'...';
        }
        $scope.isReadMore = false;
        $scope.readMore = function(){
            $scope.isReadMore = ($scope.isReadMore ? false : true);
        };

        $scope.isFollow = $scope.companyData.follow;
        $scope.followCompany = function(){
            ajax.on(dataFactory.followCompany(),{
                    companyId : $scope.companyId,
                    accountId : 1
                },
                function(data){
                    if(!data.error){
                        $scope.isFollow = data.follow;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }else{
                        toastModel.showToast("error",data.error);
                    }
                },function(data){
                    toastModel.showToast("error","Error. followCompany() fail");
                }
            );
        };

        $scope.treeMenuModel = menuCompany.getMenu($scope.selectedProductType,$scope.pageType,$scope.companyId);
}]);