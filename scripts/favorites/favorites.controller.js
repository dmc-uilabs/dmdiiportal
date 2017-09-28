'use strict';
angular.module('dmc.all-favorites')
    .controller('AllFavoritesCtrl', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'menuFavorite',
        'ajax',
        'dataFactory',
        'isFavorite',
        'DMCUserModel',
        'CompareModel',
        '$cookies',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    menuFavorite,
                    ajax,
                    dataFactory,
                    isFavorite,
                    DMCUserModel,
                    CompareModel,
                    $cookies) {


            $scope.selectedProduct = angular.isDefined($stateParams.product) ? $stateParams.product : 'services';
            $scope.selectedProductType = angular.isDefined($stateParams.type) ? $stateParams.type : null;
            //if($scope.selectedProduct == 'services' && !$scope.selectedProductType){
            //    $scope.selectedProductType = "analytical";
            //}
            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.isSearch = ($location.$$path.indexOf('search') != -1 ? true : false);
            $scope.allFavorites = { arr: [], count: 0};
            $scope.currentStorefrontPage = 1;
            $scope.pageSize = 10;
            $scope.downloadData = false;
            $scope.userData = DMCUserModel.getUserData();

            var totalCountItems = {
                all : 0, services : { total : 0, analytical : 0, solid : 0, data : 0 }, components : 0
            };
            $scope.treeMenuModel = menuFavorite.getMenu(totalCountItems);

            $scope.$watch(function() { return $cookies.currentStorefrontPage; }, function(newValue) {
                if(parseInt(newValue) > 0 && $scope.currentStorefrontPage !== parseInt(newValue)) {
                    $scope.currentStorefrontPage = newValue; // save new page number
                    $scope.getFavorites();
                }
            });

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var requestData = function(){
                var types = [];
                switch($scope.selectedProduct){
                    case 'services':
                        types = ['service'];
                        break;
                    case 'components':
                        types = ['component'];
                        break;
                    default:
                        types = ["service", "component"];
                        break;
                }
                var data = {
                    _start: ($scope.currentStorefrontPage-1)*$scope.pageSize
                };
                //if($scope.pageSize == 0) delete data._limit;
                //if($scope.selectedProduct == "services" && $scope.selectedProductType) data._type = $scope.selectedProductType;
                if($scope.searchModel) data._title = $scope.searchModel;
                if(angular.isDefined($stateParams.authors)) data._authors = $stateParams.authors;
                if(angular.isDefined($stateParams.ratings)) data._ratings = $stateParams.ratings;
                if(angular.isDefined($stateParams.favorites)) data._favorites = $stateParams.favorites;
                if(angular.isDefined($stateParams.dates)) data._dates = $stateParams.dates;
                return data;
            };

            $scope.getFavorites = function(){
                ajax.get(dataFactory.getFavoriteService($scope.userData.accountId), requestData(),
                    function(response){
                        var servicesIds = [];
                        var favoritesData = response.data;
                        $.each(response.data,function(){
                            if(this.serviceId) servicesIds.push(this.serviceId);
                        });
                        ajax.get(dataFactory.getServices(), {
                                id : servicesIds,
                                published : true
                            },
                            function(res){
                                for(var i in favoritesData){
                                    for(var j in res.data){
                                        if(favoritesData[i].serviceId == res.data[j].id){
                                            favoritesData[i].service = res.data[j];
                                            break;
                                        }
                                    }
                                }
                                var data = [];
                                for (var i in favoritesData){
                                    if(favoritesData[i].service){
                                        data.push(favoritesData[i].service);
                                    }else if(favoritesData[i].component){
                                        data.push(favoritesData[i].component);
                                    }
                                }

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
                                $scope.treeMenuModel = menuFavorite.getMenu(totalCountItems);
                                if($scope.selectedProduct == "services" && $scope.selectedProductType) {
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].serviceType != $scope.selectedProductType) {
                                            data.splice(i, 1);
                                            i--;
                                        }
                                    }
                                }
                                $scope.allFavorites = {
                                    arr : data,
                                    count : data.length
                                };
                                isFavorite.check($scope.allFavorites.arr);
                                apply();
                            }
                        );
                    }
                );
            };

            $scope.userData.then(function(data){
                $scope.userData = data;
                $scope.getFavorites();
                CompareModel.get("services",$scope.userData);
            });


            $scope.$on("UpdateFavorite", function(){
                $scope.getFavorites();
            });

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

            // Function for product types drop down (all, services, components)
            $scope.productTypeChanged = function (product) {
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.product = product;
                $state.go('allFavoritesSearch', dataSearch, {reload: true});
            };

            $scope.submit = function(text){
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.text = text;
                $state.go('allFavoritesSearch', dataSearch, {reload: true});
            };

            $scope.updatePageSize = function (val) {
                $scope.pageSize = val;
                $scope.getFavorites();
            };
        }
    ]
)
    .service('menuFavorite', ['$location','$stateParams','$state',function ($location,$stateParams,$state) {
        this.getMenu = function(totalCountItems){
            var dataSearch = $.extend(true,{},$stateParams);
            var searchPage = ($location.$$path.indexOf("/home") != -1 ? "home" : "search");

            var getUrl = function(product,type){
                if(product) dataSearch.product = product;
                if(type){
                    dataSearch.type = type;
                }else{
                    delete dataSearch.type;
                }
                return 'favorites.php'+$state.href('allFavoritesSearch',dataSearch);
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
                        'href' : getUrl('services'),
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
    }]);
