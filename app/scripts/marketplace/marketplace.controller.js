'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.marketplace')
.controller('DMCMarketplaceController',["$stateParams","$scope","$cookies","ajax","dataFactory","socketFactory","$location","is_search","isFavorite", function($stateParams,$scope,$cookies,ajax,dataFactory,socketFactory,$location,is_search,isFavorite){
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
        $scope.currentPageType = (angular.isDefined($stateParams.type) ? $stateParams.type : null);
        if($scope.currentPage == 'services' && $scope.currentPageType == null) $scope.currentPageType = 'analytical';
        $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };

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

        // get data from cookies
        var updateCompareCount = function(){
            var arr = $cookies.getObject('compareProducts');
            return arr == null ? {services : [], components : []} : arr;
        };
        $scope.compareProducts = updateCompareCount();

        // catch updated changedCompare variable form $cookies
        $scope.$watch(function() { return $cookies.changedCompare; }, function(newValue) {
            $scope.compareProducts = updateCompareCount();
            apply();
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
                apply();
            }
        }, true);
        // -----------------------------------------------------------------------------------

        // get services for Carousel -------------------------------
        $scope.carouselData = {
            popular : {arr : [], count : 0},
            new : {arr : [], count : 0}
        };
        var responseDataForCarousel = {
            _limit : 10,
            _sort : "id",
            _order : "DESC"
        };
        // function for get Popular marketplace services
        $scope.getPopularServices = function(){
            ajax.get(dataFactory.getPopularServices(), responseDataForCarousel,
                function(response){
                    $scope.carouselData.popular.arr = response.data;
                    $scope.carouselData.popular.cout = response.data.length;
                    isFavorite.check($scope.carouselData.popular.arr);
                    apply();
                }
            );
        };
        if(!$scope.isSearch) $scope.getPopularServices();

        // function for get New marketplace services
        $scope.getNewServices = function(){
            ajax.get(dataFactory.getNewServices(), responseDataForCarousel,
                function(response){
                    $scope.carouselData.new.arr = response.data;
                    $scope.carouselData.new.cout = response.data.length;
                    isFavorite.check($scope.carouselData.new.arr);
                    apply();
                }
            );
        };
        if(!$scope.isSearch) $scope.getNewServices();
        // ---------------------------------------------------------

        $scope.submit = function(text){
            $scope.searchModel = text;
            var dataSearch = $.extend(true,{},$stateParams);
            dataSearch.text = $scope.searchModel;
            $location.path('/search').search(dataSearch);
        };

        var loadingData = function(start){ // progress line
            $scope.downloadData = start;
        };


        $scope.marketplaceItems = {arr : [], count : 0};

        // insert response data to array of marketplace items
        var isFirstCallback = true;
        var insertData = function(data){
            if($scope.currentPage == 'all' && !isFirstCallback){
                $scope.marketplaceItems = {
                    arr : $.merge($scope.marketplaceItems.arr, data),
                    count : $scope.marketplaceItems.arr.length
                };
                isFavorite.check($scope.marketplaceItems.arr);
                loadingData(false);
                apply();
            }else{
                isFirstCallback = false;
                $scope.marketplaceItems = {
                    arr : data,
                    count : data.length
                };
                if($scope.currentPage != 'all'){
                    isFavorite.check($scope.marketplaceItems.arr);
                    loadingData(false);
                    apply();
                }
            }
        };

        // callback for services
        var callbackServices = function(response){
            for(var index in response.data){
                response.data[index].type = "service";
            }
            insertData(response.data);
        };

        // callback for components
        var callbackComponents = function(response){
            for(var index in response.data){
                response.data[index].type = "component";
            }
            insertData(response.data);
        };

        // response data
        var responseData = function(){
            var data = {
                _limit : $scope.productCardPageSize,
                _start : ($scope.productCardCurrentPage-1)*$scope.productCardPageSize,
                title_like : $scope.searchModel
            };
            if($scope.currentPage == 'services'){
                data.serviceType = $scope.currentPageType;
            }
            return data;
        };


        // get all services and components
        $scope.getServicesAndComponents = function(){
            isFirstCallback = true;
            loadingData(true);
            ajax.get(dataFactory.getServices(), responseData(), callbackServices);
            ajax.get(dataFactory.getComponents(), responseData(), callbackComponents);
        };

        // get all services --------------------------------------------------
        $scope.getServices = function(){
            isFirstCallback = true;
            loadingData(true);
            ajax.get(dataFactory.getServices(), responseData(), callbackServices);
        };

        // get all components --------------------------------------------------
        $scope.getComponents = function(){
            isFirstCallback = true;
            loadingData(true);
            ajax.get(dataFactory.getComponents(), responseData(),callbackComponents);
        };

        $scope.getData = function(){
            if($scope.currentPage === 'all') $scope.getServicesAndComponents();
            if($scope.currentPage === 'components') $scope.getComponents();
            if($scope.currentPage === 'services') $scope.getServices();
        };
        $scope.getData();



        // socket updates
        //socketFactory.on(socketFactory.updated().services, function(item){
        //    $scope.services = updateItem($scope.products,item);
        //    $cookies.updateProductCard = new Date();
        //    $scope.carouselData = updateItem($scope.carouselData,item);
        //    apply();
        //});
        //
        //socketFactory.on(socketFactory.updated().components, function(item){
        //    $scope.components = updateItem($scope.products,item);
        //    $cookies.updateProductCard = new Date();
        //    apply();
        //});


        var getMenu = function(){
            var dataSearch = $.extend(true,{},$stateParams);

            var getUrl = function(page,type){
                if(page) dataSearch.page = page;
                if(type){
                    dataSearch.type = type;
                }else{
                    delete dataSearch.type;
                }
                return 'marketplace.php#/search?'+$.param(dataSearch);
            };

            var isOpened = function(page,type){
                if ($stateParams.page === page) {
                    return (!type || $stateParams.type === type ? true : false);
                }else{
                    return false;
                }
            };

            return {
                title: 'BROWSE BY',
                data: [
                    //{
                    //    'id': 1,
                    //    'title': 'All',
                    //    'tag' : 'all',
                    //    'items': 45,
                    //    'opened' : isOpened('all'),
                    //    'href' : getUrl('all'),
                    //    'categories': []
                    //},
                    //{
                    //    'id': 2,
                    //    'title': 'Components',
                    //    'tag' : 'components',
                    //    'items': 13,
                    //    'opened' : isOpened('components'),
                    //    'href' : getUrl('components'),
                    //    'categories': []
                    //},
                    {
                        'id': 3,
                        'title': 'Services',
                        'tag' : 'services',
                        'items': 32,
                        'opened' : isOpened('services'),
                        'href' : getUrl('services'),
                        'categories': [
                            {
                                'id': 31,
                                'title': 'Analytical Services',
                                'tag' : 'analytical',
                                'items': 15,
                                'opened' : isOpened('services','analytical'),
                                'href' : getUrl('services','analytical'),
                                'categories': []
                            },
                            {
                                'id': 32,
                                'title': 'Solid Services',
                                'tag' : 'solid',
                                'items': 15,
                                'opened' : isOpened('services','solid'),
                                'href' : getUrl('services','solid'),
                                'categories': []
                            },
                            {
                                'id': 33,
                                'title': 'Data Services',
                                'tag' : 'data',
                                'items': 2,
                                'opened' : isOpened('services','data'),
                                'href' : getUrl('services','data'),
                                'categories': []
                            }
                        ]
                    }
                ]
            };
        };

        $scope.treeMenuModel = getMenu();

}]);
