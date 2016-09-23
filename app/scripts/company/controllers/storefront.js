'use strict';
angular.module('dmc.company')
    .controller('StorefrontCompanyCtr', [
        '$stateParams',
        '$state',
        '$scope',
        '$cookies',
        '$showdown',
        'ajax',
        '$location',
        'companyData',
        'CompanyModel',
        'toastModel',
        'dataFactory',
        'isFavorite',
        'DMCUserModel',
        'CompareModel',
        '$mdDialog', function ($stateParams,
                               $state,
                               $scope,
                               $cookies,
                               $showdown,
                               ajax,
                               $location,
                               companyData,
                               CompanyModel,
                               toastModel,
                               dataFactory,
                               isFavorite,
                               DMCUserModel,
                               CompareModel,
                               $mdDialog ) {

        $scope.companyData = companyData ;

        ajax.get(dataFactory.getDocument().byType, {organizationId: $scope.companyData.id, fileTypeId: 1, limit: 1}, function(response) {
            if (response.data.length > 0) {
                $scope.companyData.logoImage = response.data[0];
            };
        });

        function getCompanyJoinRequest(){
            ajax.get(dataFactory.getProfileCompanyJoinRequest($scope.currentUser.profileId), {},function(response){
                $scope.companyData.joinRequest = response.data && response.data.length > 0 ? response.data[0] : null;
                apply();
            });
        }

        if($scope.companyData && $scope.companyData.id) {
            $scope.currentUser = DMCUserModel.getUserData().then(function(res){
                $scope.currentUser = res;
                getCompanyJoinRequest();
                CompareModel.get('services',$scope.currentUser);
            });
            $scope.currentUser = ($scope.currentUser.$$state && $scope.currentUser.$$state.value ? $scope.currentUser.$$state.value : null);
            $scope.owner = $scope.companyData.account;
            // ------------------------------ get state params
            $scope.companyId = $stateParams.companyId;
            $scope.selectedProductType = $stateParams.product;
            $scope.isSearch = ($location.$$path.indexOf('search') != -1 ? true : false);
            $scope.searchModel = $stateParams.text;
            $scope.productSubType = (angular.isDefined($stateParams.type) ? $stateParams.type : null);
            // -----------------------------------------------
            $scope.currentStorefrontPage = 1;
            $scope.pageSize = $cookies.get('productCardPageSize') ? $cookies.get('productCardPageSize') : 12;
            $scope.downloadData = false;
            $scope.page = $state.current.name.split('.')[1];

            var totalCountItems = {
                all : 0, services : { total : 0, analytical : 0, solid : 0, data : 0 }, components : 0
            };



            $scope.join = function(){
                ajax.create(dataFactory.addCompanyJoinRequest(), {
                    'profileId': $scope.currentUser.profileId,
                    'companyId': $scope.companyId
                },function(response){
                    $scope.companyData.joinRequest = response.data;
                    toastModel.showToast('success', 'Request to join successfully sent');
                    apply();
                });
            };

            $scope.productTypes = [
                //{
                //    id: 1,
                //    name: 'all',
                //    title: 'All'
                //},
                {
                    id: 2,
                    name: 'services',
                    title: 'Services'
                }
                //, {
                //    id: 3,
                //    name: 'components',
                //    title: 'Components'
                //}
            ];


            $scope.carouselData = {
                featured: {arr: [], count: 0},
                new: {arr: [], count: 0}
            };

            // get company Featured
            $scope.getFeatured = function () {
                ajax.get(dataFactory.getCompanyFeatured($scope.companyId), {
                        '_order' : 'DESC',
                        '_sort' : 'position'
                    },
                    function (response) {
                        var servicesIds = [];
                        var componentsIds = [];
                        var featuredData = response.data;
                        $.each(response.data,function(){
                            if(this.serviceId){
                                servicesIds.push(this.serviceId);
                            }else{
                                componentsIds.push(this.componentId);
                            }
                        });
                        ajax.get(dataFactory.getServices(), {
                                id : servicesIds,
                                companyId : $scope.companyId
                            },function(res) {
                            for (var i in featuredData) {
                                for (var j in res.data) {
                                    if (featuredData[i].serviceId == res.data[j].id) {
                                        featuredData[i].service = res.data[j];
                                        break;
                                    }
                                }
                            }
                            $scope.carouselData.featured.arr = [];
                            for(var index in featuredData){
                                var item_ = null;
                                if(featuredData[index].service){
                                    item_ = featuredData[index].service;
                                    item_.type = 'service';
                                }else if(featuredData[index].component){
                                    item_ = featuredData[index].component;
                                    item_.type = 'component';
                                }
                                if(item_) {
                                    item_.featureId = featuredData[index].id;
                                    item_.inFeatured = true;
                                    item_.position = featuredData[index].position;
                                    $scope.carouselData.featured.arr.push(item_);
                                }
                            }
                            $scope.carouselData.featured.count = $scope.carouselData.featured.arr.length;
                            if($scope.carouselData.featured.count == 0) {
                                ajax.get(dataFactory.getCompanyServices($scope.companyId), {
                                        published : true,
                                        '_order' : 'DESC',
                                        '_sort' : 'id',
                                        '_limit' : 2
                                    }, function (response) {
                                        $scope.carouselData.featured.arr = response.data;
                                        $scope.carouselData.featured.count = response.data.length;
                                        isFavorite.check($scope.carouselData.featured.arr);
                                        apply();
                                    }
                                );
                            }else{
                                $scope.carouselData.featured.arr.sort(function (a, b) {
                                    return a.position > b.position;
                                });
                                isFavorite.check($scope.carouselData.featured.arr);
                                apply();
                            }
                        });
                    }
                );
            };
            if(!$scope.isSearch) $scope.getFeatured();

            // get new services and components for Carousel
            $scope.getNewCompanyServices = function(){
                ajax.get(dataFactory.getNewCompanyServices($scope.companyId), {
                        '_limit' : 10,
                        '_order' : 'DESC',
                        '_sort' : 'id',
                        published : true
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
                published : true,
                //_limit : $scope.pageSize,
                _start : ($scope.currentStorefrontPage-1)*$scope.pageSize
            };

            // insert response data to array of storefront items
            var insertData = function(data){
                totalCountItems = {
                    all : 0, services : { total : 0, analytical : 0, solid : 0, data : 0 }, components : 0
                };
                for(var i in data){
                    totalCountItems.services.total++;
                    totalCountItems.all++;
                    if (data[i].serviceType == 'analytical') {
                        totalCountItems.services.analytical++;
                    }else if(data[i].serviceType == 'solid'){
                        totalCountItems.services.solid++;
                    }else if(data[i].serviceType == 'data'){
                        totalCountItems.services.data++;
                    }
                }
                if(!$scope.isSearch && data.length > 0) data = data.splice(0,4);
                if($scope.isSearch && $scope.selectedProductType == 'services' && $scope.productSubType){
                    for (var i=0;i<data.length;i++) {
                        if (data[i].serviceType != $scope.productSubType) {
                            data.splice(i,1);
                            i--;
                        }
                    }
                }

                $scope.storefrontItems = {
                    arr : data,
                    count : data.length
                };

                isFavorite.check($scope.storefrontItems.arr);
                $scope.treeMenuModel = CompanyModel.getMenu(totalCountItems);
                apply();
            };

            // callback for services
            var callbackCompanyServices = function(response){
                for(var index in response.data){
                    response.data[index].type = 'service';
                }
                insertData(response.data);
            };

            // callback for components
            var callbackCompanyComponents = function(response){
                for(var index in response.data){
                    response.data[index].type = 'component';
                }
                insertData(response.data);
            };

            // get all services and components
            $scope.getServicesAndComponents = function(){

            };

            // get all services --------------------------------------------------
            $scope.getServices = function(){
                ajax.get(dataFactory.getCompanyServices($scope.companyId), responseData, callbackCompanyServices);
            };

            // get all components --------------------------------------------------
            $scope.getComponents = function(){

            };

            // update products
            $scope.update = function (search) {
                $scope.isSearch = search;
                if($scope.searchModel){
                    responseData.title_like = $scope.searchModel;
                }else{
                    delete responseData.title_like;
                }
                responseData._start = ($scope.currentStorefrontPage - 1) * $scope.pageSize;
                if(angular.isDefined($stateParams.authors)) responseData._authors = $stateParams.authors;
                if(angular.isDefined($stateParams.ratings)) responseData._ratings = $stateParams.ratings;
                if(angular.isDefined($stateParams.favorites)) responseData._favorites = $stateParams.favorites;
                if(angular.isDefined($stateParams.dates)) responseData._dates = $stateParams.dates;
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
                $cookies.put('productCardPageSize',val);
                $scope.pageSize = val;
                $scope.update(true);
            };

            // Function for product types drop down (all, services, components)
            $scope.productTypeChanged = function (type) {
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.product = type;
                $state.go('company.search', dataSearch, {reload: true});
            };

            // Function for Search by name
            $scope.submit = function (text) {
                var dataSearch = $.extend(true,{},$stateParams);
                dataSearch.text = text;
                $state.go('company.search', dataSearch, {reload: true});
            };

            // Function for 'Show All' Button
            $scope.showAll = function () {
                $scope.submit();
            };

            if ($scope.companyData.description.length > 200) {
                $scope.companyData.shortDescription = $scope.companyData.description.replace(/<br>/g, '').substring(0, 200) + '...';
            }

            $scope.isReadMore = false;
            $scope.readMore = function () {
                $scope.isReadMore = ($scope.isReadMore ? false : true);
            };

            $scope.followCompany = function () {
                if($scope.currentUser) {
                    if (!$scope.companyData.follow) {
                        ajax.create(dataFactory.followCompany(), {
                            accountId: $scope.currentUser.accountId,
                            companyId: $scope.companyId
                        }, function (response) {
                            $scope.companyData.follow = response.data;
                            apply();
                        });
                    } else {
                        ajax.delete(dataFactory.unfollowCompany($scope.companyData.follow.id), {},
                            function (response) {
                                $scope.companyData.follow = null;
                            }
                        );
                    }
                }
            };

            // message dialog ---------------------------
            $scope.openMessageDialog = function(ev) {
                if($scope.currentUser) {
                    $mdDialog.show({
                        controller: messageDialogController,
                        templateUrl: 'templates/company/message-dialog-tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            owner: $scope.companyData.account,
                            currentUser: {id: $scope.currentUser.accountId}
                        }
                    }).then(function (answer) {
                        // $scope.status = 'You said the information was '' + answer + ''.';
                    }, function () {
                        // $scope.status = 'You cancelled the dialog.';
                    });
                }else{
                    toastModel.showToast('error','You can\'t send message');
                }
            };
            // ------------------------------------------

            $scope.treeMenuModel = CompanyModel.getMenu(totalCountItems);
        }
}]);
