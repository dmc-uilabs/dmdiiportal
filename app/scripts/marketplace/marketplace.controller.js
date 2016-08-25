'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.marketplace')
    .controller('DMCMarketplaceController',[
        "$state",
        "$stateParams",
        "$scope",
        "$rootScope",
        "$cookies",
        "ajax",
        "dataFactory",
        "socketFactory",
        "$location",
        "is_search",
        "DMCUserModel",
        "$window",
        "CompareModel",
        "isFavorite",
        function($state,
                 $stateParams,
                 $scope,
                 $rootScope,
                 $cookies,
                 ajax,
                 dataFactory,
                 socketFactory,
                 $location,
                 is_search,
                 DMCUserModel,
                 $window,
                 CompareModel,
                 isFavorite){
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
            $scope.currentProduct = angular.isDefined($stateParams.product) && defaultPages[$stateParams.product] ? $stateParams.product : 'services';
            $scope.currentProductType = (angular.isDefined($stateParams.type) ? $stateParams.type : null);
            //if($scope.currentProduct == 'services' && $scope.currentProductType == null) $scope.currentProductType = 'analytical';
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
                getFavoriteCount();
                CompareModel.get("services",userData);
            });

            $scope.favoritesCount = 0;
            function getFavoriteCount(){
                ajax.get(dataFactory.getFavoriteProducts(),{
                    accountId : userData.accountId
                },function(response){
                    $scope.favoritesCount = response.data.length;
                    apply();
                });
            }


            $scope.$on("UpdateFavorite", function(){
                getFavoriteCount();
            });


            // This code use for products-card -------------------------------------------------
            $scope.downloadData = false;        // on/off progress line in products-card
            $scope.productCardPageSize = $cookies.get('productCardPageSize') ? $cookies.get('productCardPageSize') : 12;    // visible items in products-card
            $scope.productCardCurrentPage = 1;  // current page in products-card
            // catch updated changedPage variable form $cookies
            // variable changed in products-card when user change page number (pagination)
            $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
                if(newValue && $scope.productCardCurrentPage !== newValue) {
                    $scope.productCardCurrentPage = newValue; // save new page number
                    $scope.getData();
                }
            });
            // if productCardPageSize changed
            $scope.$watch('productCardPageSize', function(newValue, oldValue) {
                if (newValue !== oldValue){ // if get another value
                    $cookies.put('productCardPageSize',newValue);
                    $scope.getData();
                    apply();
                }
            }, true);
            // -----------------------------------------------------------------------------------

            $scope.updatePageSize = function(pageSize){
                $scope.productCardPageSize = pageSize;
            };

            // get services for Carousel -------------------------------
            $scope.carouselData = {
                popular : {arr : [], count : 0},
                new : {arr : [], count : 0}
            };
            var responseDataForCarousel = {
                published : true,
                _limit : 10,
                _sort : "id",
                _order : "DESC"
            };
            // function for get Popular marketplace services
            $scope.getPopularServices = function(){
                ajax.get(dataFactory.getMarketPopularServices(), responseDataForCarousel,
                    function(response){
                        $scope.carouselData.popular = {arr : response.data, count : response.data.length};
                        isFavorite.check($scope.carouselData.popular.arr);
                        apply();
                    }
                );
            };
            if(!$scope.isSearch) $scope.getPopularServices();

            // function for get New marketplace services
            $scope.getNewServices = function(){
                ajax.get(dataFactory.getMarketNewServices(), responseDataForCarousel,
                    function(response){
                        $scope.carouselData.new = {arr : response.data, count : response.data.length};
                        isFavorite.check($scope.carouselData.new.arr);
                        apply();
                    }
                );
            };
            if(!$scope.isSearch) $scope.getNewServices();
            // ---------------------------------------------------------

            $scope.submit = function(text){
                $stateParams.text = text;
                //$state.go('marketplace_search', dataSearch, {reload: true});
                if(!$window.apiUrl){
                    responseDataForCarousel.title_like = text;
                }else{
                    delete responseDataForCarousel.title_like;
                }
                loadingData(true);
                ajax.get(dataFactory.searchMarketplace(text), responseDataForCarousel, callbackServices);
            };

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };


            $scope.marketplaceItems = {arr : [], count : 0};
            var totalCountItems = {
                all : 0, services : { total : 0, analytical : 0, solid : 0, data : 0 }, components : 0
            };
            // insert response data to array of marketplace items
            var insertData = function(data){
				console.log('insertData: $scope.currentProduct: ' + $scope.currentProduct)
				console.log('insertData: $scope.currentProductType: ' + $scope.currentProductType)
				console.log('insertData: $location.$$path: ' + $location.$$path)
				
                totalCountItems = {
                    all : 0, services : { total : 0, analytical : 0, solid : 0, data : 0 }, components : 0
                };
                for(var i in data){
                    totalCountItems.services.total++;
                    totalCountItems.all++;
                    if (data[i].serviceType == "analytical") {
                        totalCountItems.services.analytical++;
                    }else if(data[i].serviceType == "solid"){
                        totalCountItems.services.solid++;
                    }else if(data[i].serviceType == "data"){
                        totalCountItems.services.data++;
                    }
                }
                //if($scope.productCardPageSize == 0) delete data._limit;
                if($scope.currentProduct == 'services'){
                    if($scope.currentProductType) {
                        for (var i=0;i<data.length;i++) {
                            if (data[i].serviceType != $scope.currentProductType) {
                                data.splice(i,1);
                                i--;
                            }
                        }
                    }
                }
                if($location.$$path.indexOf('search') != -1 ||  $location.$$path.indexOf('home') != -1) {
                    $scope.marketplaceItems = {arr: data, count: data.length};
                }
                $scope.treeMenuModel = getMenu();
                checkFavorites();
            };

            var checkFavorites = function(){
                isFavorite.check($scope.marketplaceItems.arr);
                loadingData(false);
                apply();
            };

            // callback for services
            var callbackServices = function(response){
				console.log('callbackServices: $scope.currentProduct: ' + $scope.currentProduct)
				console.log('callbackServices: $scope.currentProductType: ' + $scope.currentProductType)
				
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
                    published : true,
                    //_limit : $scope.productCardPageSize,
                    _start : ($scope.productCardCurrentPage-1)*$scope.productCardPageSize,
                    title_like : $scope.searchModel
                };
                if(angular.isDefined($stateParams.authors)) data._authors = $stateParams.authors;
                if(angular.isDefined($stateParams.ratings)) data._ratings = $stateParams.ratings;
                if(angular.isDefined($stateParams.favorites)) data._favorites = $stateParams.favorites;
                if(angular.isDefined($stateParams.dates)) data._dates = $stateParams.dates;
                return data;
            };


            // get all services and components
            $scope.getServicesAndComponents = function(){
                //isFirstCallback = true;
                //loadingData(true);
                //ajax.get(dataFactory.getMarketServices(), responseData(), callbackServices);
                //ajax.get(dataFactory.getMarketComponents(), responseData(), callbackComponents);
            };

            // get all services --------------------------------------------------
            $scope.getServices = function(){
                loadingData(true);
                ajax.get(dataFactory.getMarketServices(), responseData(), callbackServices);
            };

            // get all components --------------------------------------------------
            $scope.getComponents = function(){
                //isFirstCallback = true;
                //loadingData(true);
                //ajax.get(dataFactory.getMarketComponents(), responseData(),callbackComponents);
            };

            // get all follow companies
            $scope.getFollowCompanies = function(){
                var accountId = ($rootScope.userData)? $rootScope.userData.accountId:1;
                ajax.get(dataFactory.getFollowCompanies(accountId), {},
                    function(response){
                        if(response.data.length > 0){
                            var companies = $.map( response.data, function( x ) { return x.companyId; });
                            $scope.getFollowCompaniesServices(companies);
                        }
                    }
                );
            };

            // get all services from follow companies
            $scope.getFollowCompaniesServices = function(companies){
                ajax.get(dataFactory.getFollowCompanyServices(), {
                        published : true,
                        companyId : companies,
                        _limit: 8
                    },
                    function(response){
                        $scope.marketplaceItems = {
                            arr : response.data,
                            count : response.data.length
                        };
                        isFavorite.check($scope.marketplaceItems.arr);
                        apply();
                    }
                );
            };

            $scope.getData = function(){
                if($location.$$path.indexOf('search') > -1) {
                    switch($scope.currentProduct){
                        case 'all':
                            //$scope.getServicesAndComponents();
                            break;
                        case 'components':
                            //$scope.getComponents();
                            break;
                        case 'services':
                            $scope.getServices();
                            break;
                        default:
                    }
                }else{
                    $scope.getFollowCompanies();
                    $scope.getServices();
                }
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

                var getUrl = function(product,type){
                    var dataSearch = $.extend(true,{},$stateParams);
                    if(product) dataSearch.product = product;
                    dataSearch.type = type;
                    return 'marketplace.php'+$state.href('marketplace_search',dataSearch);
                };

                var isOpened = function(product,type){
                    if ($stateParams.product === product) {
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
                            'items': totalCountItems.services.total,
                            'opened' : isOpened('services'),
                            'href' : getUrl('services',null),
                            'categories': [
                                {
                                    'id': 31,
                                    'title': 'Analytical Services',
                                    'tag' : 'analytical',
                                    'items': totalCountItems.services.analytical,
                                    'opened' : isOpened('services','analytical'),
                                    'href' : getUrl('services','analytical'),
                                    'categories': []
                                },
                                {
                                    'id': 32,
                                    'title': 'Solid Services',
                                    'tag' : 'solid',
                                    'items': totalCountItems.services.solid,
                                    'opened' : isOpened('services','solid'),
                                    'href' : getUrl('services','solid'),
                                    'categories': []
                                },
                                {
                                    'id': 33,
                                    'title': 'Data Services',
                                    'tag' : 'data',
                                    'items': totalCountItems.services.data,
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
        }
    ]
);
