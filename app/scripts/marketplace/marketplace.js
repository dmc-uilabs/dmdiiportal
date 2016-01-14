'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.marketplace', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.component.productscard',
    'dmc.component.carousel',
    'dmc.compare',
    'dmc.component.products-filter'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('marketplace', {
        url: '/:page?type?mw',
        templateUrl: 'templates/marketplace/marketplace.html',
        controller: 'DMCMarketplaceController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('marketplace_search', {
        url: '/search/:page?type?text?mw',
        templateUrl: 'templates/marketplace/marketplace.html',
        controller: 'DMCMarketplaceController',
        resolve: {
            is_search: function() {
                return true;
            }
        }
    });
    $urlRouterProvider.otherwise('/all');
})
.controller('DMCMarketplaceController', function($stateParams,$scope,$cookies,ajax,dataFactory,Products,socketFactory,$location,is_search){
        $scope.isSearch = is_search;
        var defaultPages = {
            'all' : [],
            'services' : {
                'analytical' : [],
                'solid' : [],
                'data' : []
            },
            'components' : []
        };

        $scope.currentPage = angular.isDefined($stateParams.page) && defaultPages[$stateParams.page] ? $stateParams.page : 'services';
        $scope.currentPageType = angular.isDefined($stateParams.type) && defaultPages[$stateParams.page][$stateParams.type] ? $stateParams.type : null;
        $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : '';

        $scope.favoritesCount = 3;
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

        // This code use for products-card -------------------------------------------------
        $scope.downloadData = false;        // on/off progress line in products-card
        $scope.productCardPageSize = 10;    // visible items in products-card
        $scope.productCardCurrentPage = 1;  // current page in products-card
        // catch updated changedPage variable form $cookies
        // variable changed in products-card when user change page number (pagination)
        $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
            if(parseInt(newValue) > 0 && $scope.productCardCurrentPage !== parseInt(newValue)) {
                $scope.productCardCurrentPage = newValue; // save new page number
                $scope.getData();
            }
        });
        // if productCardPageSize changed
        $scope.$watch('productCardPageSize', function(newValue, oldValue) {
            if (newValue !== oldValue){ // if get another value
                $scope.getData();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
        }, true);
        // -----------------------------------------------------------------------------------

        // get services for Carousel -------------------------------
        $scope.carouselData = {arr : [], count : 0};

        $scope.callbackCarouselData = function(data){
            $scope.carouselData = {arr : data.result, count : data.count};;
        };

        Products.get($scope.callbackCarouselData,'services',{
            limit : 10, offset: 0
        });
        // ---------------------------------------------------------

        $scope.submit = function(){
            var url = '/marketplace.php#/search/' + $scope.currentPage;
            if($scope.currentPageType){
                url += '?type=' + $scope.currentPageType;
                url += '&text='+encodeURIComponent($scope.searchModel);
            }else{
                url += '?text='+encodeURIComponent($scope.searchModel);
            }
            $("md-tabs").remove();
            window.location.href = url;
        };

        var loadingData = function(start,d){ // progress line
            if($scope.currentPage === d) $scope.downloadData = start;
        };

        var responseData = function(page){
            var data = {
                limit : $scope.currentPage === page ? $scope.productCardPageSize : 0,
                offset: ($scope.productCardCurrentPage-1)*$scope.productCardPageSize,
                //name : $scope.searchModel,
                type : $scope.currentPageType
            };
            return data;
        };

        $scope.products = {arr : [], count : 0};

        // function for get all products --------------------------------------------------
        $scope.getAllProducts = function(){
            loadingData(true,'all');
            Products.get($scope.callbackProducts,'all',responseData('all'));
        };
        $scope.callbackProducts = function(data){
            updateMenuItems('all', data.count, null);
            if($scope.currentPage === 'all'){
                $scope.products = {arr : data.result, count : data.count};
                onlyTwo();
            }
            loadingData(false,'all');
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        $scope.getAllProducts();
        // -------------------------------------------------------------------------------

        // function for get components ----------------------------------------------------
        $scope.getComponents = function(){
            loadingData(true,'components');
            Products.get($scope.callbackComponents,'components',responseData('components'));
        };
        $scope.callbackComponents = function(data){
            updateMenuItems('components',data.count, null);
            if($scope.currentPage === 'components'){
                $scope.products = {arr : data.result, count : data.count};
                onlyTwo();
            }
            loadingData(false,'components');
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        $scope.getComponents();
        // -------------------------------------------------------------------------------

        // function for get services -----------------------------------------------------
        $scope.getServices = function(){
            loadingData(true,'services');
            if($scope.isSearch ) {
                var allData = {
                    limit : 2,
                    offset: 25,
                    type : $scope.currentPageType
                };
                Products.get($scope.callbackServices,'services',allData);
            } else {
                Products.get($scope.callbackServices,'services',responseData('services'));
            }
            // Products.get($scope.callbackServices,'services',responseData('services'));
        };
        $scope.callbackServices = function(data){
            updateMenuItems('services',data.count, data.countTypes);
            if($scope.currentPage === 'services'){
                $scope.products = {arr : data.result, count : data.count};
                onlyTwo();
            }
            if($scope.currentPageType) $scope.products.count = data.countTypes[$scope.currentPageType];
            loadingData(false,'services');
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        $scope.getServices();
        // -------------------------------------------------------------------------------

        var onlyTwo = function(){
            if($scope.isSearch ) {
                $scope.products.arr.splice(2, $scope.products.arr.length - 2);
                $scope.products.count = 2;
            }
        };

        $scope.getData = function(){
            if($scope.currentPage === 'all') $scope.getAllProducts();
            if($scope.currentPage === 'components') $scope.getComponents();
            if($scope.currentPage === 'services') $scope.getServices();
        };



        // socket updates
        //socketFactory.on(socketFactory.updated().services, function(item){
        //    $scope.services = updateItem($scope.products,item);
        //    $cookies.updateProductCard = new Date();
        //    $scope.carouselData = updateItem($scope.carouselData,item);
        //    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        //});
        //
        //socketFactory.on(socketFactory.updated().components, function(item){
        //    $scope.components = updateItem($scope.products,item);
        //    $cookies.updateProductCard = new Date();
        //    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        //});

        var updateItem = function(data,item){
            for(var i=0;i<data.arr.length;i++){
                if(data.arr[i].id === item.id && data.arr[i].type === item.type){
                    data.arr[i] = item;
                    break;
                }
            }
            return data;
        };

        // tree menu
        var updateMenuItems = function(tag, count, countTypes){
            if(tag == 'all') {
                $scope.treeMenuModel.data[0].items = count;
            }else{
                var search = (tag === 'components' ? 'services' : 'components');
                var count_found = 0;
                for (var i = 0; i < $scope.treeMenuModel.data.length; i++) {
                    if(countTypes != null && $scope.treeMenuModel.data[i].tag === tag && $scope.treeMenuModel.data[i].categories.length > 0){
                        for(var j = 0; j < $scope.treeMenuModel.data[i].categories.length;j++){
                            $scope.treeMenuModel.data[i].categories[j].items = countTypes[$scope.treeMenuModel.data[i].categories[j].tag];
                        }
                    }
                    if ($scope.treeMenuModel.data[i].tag === tag) $scope.treeMenuModel.data[i].items = count;
                    if ($scope.treeMenuModel.data[i].tag === search) $scope.treeMenuModel.data[0].items = count + $scope.treeMenuModel.data[i].items;
                }
            }
        };

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


});
