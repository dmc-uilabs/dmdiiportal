'use strict';
angular.module('dmc.company')
    .controller('StorefrontCompanyCtr', [
        '$stateParams', '$state', "$scope", "$cookies", "ajax","Products","$location",'companyData','menuCompany', 'toastModel','dataFactory',
        function ($stateParams, $state, $scope, $cookies, ajax,Products,$location,companyData, menuCompany, toastModel, dataFactory ) {
        $scope.companyData  = companyData ;
        // ------------------------------ get state params
        $scope.companyId = $stateParams.companyId;
        $scope.selectedProductType = $stateParams.page;
        $scope.pageType = (angular.isDefined($stateParams.type) ? $stateParams.type : 'analytical');
        // -----------------------------------------------

        $scope.page = $state.current.name.split('.')[1];

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
        $scope.itemsArray = [];
        var get4Items = function(data){
            $scope.itemsArray = [];
            for(var i=0;i<data.length;i++) {
                if(i <= 3) {
                    $scope.itemsArray.push(data[i]);
                }else{
                    break;
                }
            }
        };


        var responseData = function(){
            var data = {
                limit : 4,
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
            get4Items(data.result);
        };
        // ---------------------------------------------------------------------------------

        // function for get services --------------------------------------------------
        $scope.getServices = function(){
            Products.get($scope.callbackServices,'services',responseData());
        };
        $scope.callbackServices = function(data){
            get4Items(data.result);
        };
        // -----------------------------------------------------------------------------

        // function for get components --------------------------------------------------
        $scope.getComponents = function(){
            Products.get($scope.callbackComponents,'components',responseData());
        };
        $scope.callbackComponents = function(data){
            get4Items(data.result);
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

        $scope.treeMenuModel = menuCompany.getMenu($scope.selectedProductType,$scope.pageType,$scope.companyId);
}]);