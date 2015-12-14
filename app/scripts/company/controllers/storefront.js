'use strict';
angular.module('dmc.company')
    .controller('StorefrontCompanyCtr', [ '$stateParams', '$state', "$scope", "$cookies", "ajax","Products","$location", function ($stateParams, $state, $scope, $cookies, ajax,Products,$location) {
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

        //$scope.selectedProductType = $scope.productTypes[0].name;

        $scope.carouselData = {
            featured : {arr : [], count : 0},
            new : {arr : [], count : 0}
        };
        $scope.itemsArray = [];
        // get featured and new for Carousel -------------------------------
        $scope.callbackCarouselData = function(data){
            $scope.carouselData.featured = {arr : data.result, count : data.count};
            $scope.carouselData.new = {arr : data.result, count : data.count};
        };

        Products.get($scope.callbackCarouselData,'services',{
            limit : 10, offset: 0
        });
        // ---------------------------------------------------------

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
        if($scope.selectedProductType == 'all') $scope.getAllProducts();
        // ---------------------------------------------------------------------------------

        // function for get services --------------------------------------------------
        $scope.getServices = function(){
            Products.get($scope.callbackServices,'services',responseData());
        };
        $scope.callbackServices = function(data){
            get4Items(data.result);
        };
        if($scope.selectedProductType == 'services') $scope.getServices();
        // -----------------------------------------------------------------------------

        // function for get components --------------------------------------------------
        $scope.getComponents = function(){
            Products.get($scope.callbackComponents,'components',responseData());
        };
        $scope.callbackComponents = function(data){
            get4Items(data.result);
        };
        if($scope.selectedProductType == 'components') $scope.getComponents();
        // -----------------------------------------------------------------------------

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

        $scope.treeMenuModel = {
            title: 'BROWSE BY',
            data: [
                {
                    'id': 1,
                    'title': 'All',
                    'tag' : 'all',
                    'items': 45,
                    'opened' : ($scope.selectedProductType == 'all' ? true : false),
                    'onClick' : function(){
                        $location.url($scope.companyId+'/storefront/all');
                    },
                    'categories': []
                },
                {
                    'id': 2,
                    'title': 'Components',
                    'tag' : 'components',
                    'items': 13,
                    'opened' : ($scope.selectedProductType == 'components' ? true : false),
                    'onClick' : function(){
                        $location.url($scope.companyId+'/storefront/components');
                    },
                    'categories': []
                },
                {
                    'id': 3,
                    'title': 'Services',
                    'tag' : 'services',
                    'items': 32,
                    'opened' : ($scope.selectedProductType == 'services' ? true : false),
                    'onClick' : function(){
                        $location.url($scope.companyId+'/storefront/services');
                    },
                    'categories': [
                        {
                            'id': 31,
                            'title': 'Analytical Services',
                            'tag' : 'analytical',
                            'items': 15,
                            'opened' : ($scope.selectedProductType == 'services' && $scope.pageType == 'analytical' ? true : false),
                            'onClick' : function(){
                                $location.url($scope.companyId+'/storefront/services?type=analytical');
                            },
                            'categories': []
                        },
                        {
                            'id': 32,
                            'title': 'Solid Services',
                            'tag' : 'solid',
                            'items': 15,
                            'opened' : ($scope.selectedProductType == 'services' && $scope.pageType == 'solid' ? true : false),
                            'onClick' : function(){
                                $location.url($scope.companyId+'/storefront/services?type=solid');
                            },
                            'categories': []
                        },
                        {
                            'id': 33,
                            'title': 'Data Services',
                            'tag' : 'data',
                            'items': 2,
                            'opened' : ($scope.selectedProductType == 'services' && $scope.pageType == 'data' ? true : false),
                            'onClick' : function(){
                                $location.url($scope.companyId+'/storefront/services?type=data');
                            },
                            'categories': []
                        }
                    ]
                }
            ]
        };
}]);