'use strict';

angular.module('dmc.product')

    .controller('componentController', ['componentData','DMCUserModel', 'serviceModel', '$stateParams', '$scope', 'ajax', 'dataFactory', '$mdDialog', '$mdToast', 'toastModel','$timeout', '$cookies', 'isFavorite', '$state',
        function (componentData,DMCUserModel, serviceModel, $stateParams,   $scope,   ajax,   dataFactory,   $mdDialog,   $mdToast,   toastModel,  $timeout,   $cookies, isFavorite, $state) {

            $scope.product = componentData  //array product
            $scope.LeaveFlag = false;  //flag for visibility form Leave A Review
            $scope.submit_rating = 0;  //
            $scope.not_found = false;  //product not fount
            $scope.products_card = [];  //products card
            $scope.includedServices = [];
            $scope.limit_reviews = true;  //limit reviews
            $scope.allServices = [];
            $scope.adding_to_project = false;
            $scope.selectSortingStar = 0;
            $scope.invate = false;

            isFavorite.check([$scope.product]);

            $scope.currentImage = 1;
            $scope.indexImages = 0;

            var userData = DMCUserModel.getUserData();
            userData.then(function(){
                getFavoriteCount();
            });
            // get favorites count ------------------
            $scope.favoritesCount = 0;
            var getFavoriteCount = function(){
                ajax.get(dataFactory.getFavoriteProducts(),{
                    accountId : $scope.$root.userData.accountId
                },function(response){
                    $scope.favoritesCount = response.data.length;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                });
            };
            // ---------------------------------------

            $scope.share = function(ev){
                console.info("dksgnj")
                $mdDialog.show({
                    controller: "ShareProductCtrl",
                    templateUrl: "templates/components/product-card/share-product.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    locals: {
                        serviceId : $stateParams.productId
                    }
                }).then(function() {
                }, function() {
                });
            };


            $scope.history = {
                leftColumn: {
                    title: "Marketplace",
                    viewAllLink: "",
                    list:[]
                },
                rightColumn: {
                    title: "Your Projects",
                    viewAllLink: "",
                    list:[]
                }
            }

            serviceModel.get_service_hystory(
                {
                    "period": "today",
                    "section": "project"
                },
                function(data){
                    for(var i in data){
                        data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A");
                        switch(data[i].type){
                            case "completed":
                            case "successful_runs":
                                data[i].icon = "images/ic_done_all_black_24px.svg";
                                break;
                            case "added":
                                data[i].icon = "images/ic_group_add_black_24px.svg";
                                break;
                            case "rated":
                                data[i].icon = "images/ic_star_black_24px.svg";
                                break;
                            case "worked":
                                data[i].icon = "images/icon_project.svg";
                                break;
                            case "favorited":
                                data[i].icon = "images/ic_favorite_black_24px.svg";
                                break;
                            case "shared":
                                data[i].icon = "images/ic_done_all_black_24px.svg";
                                break;
                            case "discussion":
                                data[i].icon = "images/ic_forum_black_24px.svg";
                                break;
                            case "edited":
                                data[i].icon = "images/ic_create_black_24px.svg";
                                break;
                            case "unavailable_runs":
                                data[i].icon = "images/ic_block_black_24px.svg";
                                break;
                            case "incomplete_runs":
                                data[i].icon = "images/ic_file_download_black_24px.svg";
                                break;
                        }

                    }
                    $scope.history.leftColumn.list = data;
                }
            );
            serviceModel.get_service_hystory(
                {
                    "period": "today",
                    "section": "marketplace"
                },
                function(data){
                    for(var i in data){
                        data[i].date = moment(data[i].date).format("MM/DD/YYYY hh:mm A");
                        switch(data[i].type){
                            case "completed":
                            case "successful_runs":
                                data[i].icon = "images/ic_done_all_black_24px.svg";
                                break;
                            case "added":
                                data[i].icon = "images/ic_group_add_black_24px.svg";
                                break;
                            case "rated":
                                data[i].icon = "images/ic_star_black_24px.svg";
                                break;
                            case "worked":
                                data[i].icon = "images/icon_project.svg";
                                break;
                            case "favorited":
                                data[i].icon = "images/ic_favorite_black_24px.svg";
                                break;
                            case "shared":
                                data[i].icon = "images/ic_done_all_black_24px.svg";
                                break;
                            case "discussion":
                                data[i].icon = "images/ic_forum_black_24px.svg";
                                break;
                            case "edited":
                                data[i].icon = "images/ic_create_black_24px.svg";
                                break;
                            case "unavailable_runs":
                                data[i].icon = "images/ic_block_black_24px.svg";
                                break;
                            case "incomplete_runs":
                                data[i].icon = "images/ic_file_download_black_24px.svg";
                                break;
                        }
                    }
                    $scope.history.rightColumn.list = data;
                }
            );

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.sortList = [
                {
                    id: 0,
                    val: "date",
                    name: "Most Recent"
                },
                {
                    id: 1,
                    val: "helpful",
                    name: "Most Helpful"
                },
                {
                    id: 2,
                    val: "leasthelpful",
                    name: "Least Helpful"
                },
                {
                    id: 3,
                    val: "highest",
                    name: "Highest to Lowest Rating"
                },
                {
                    id: 4,
                    val: "lowest",
                    name: "Lowest to Highest Rating"
                },
                {
                    id: 5,
                    val: "verified",
                    name: "Verified Users"
                }
            ];


            $scope.sortListModel = 0;
            $scope.selectItemDropDown = function(value){
                if(value != 0) {
                    var item = $scope.sortList[value];
                    $scope.sortList.splice(value, 1);
                    $scope.sortList = $scope.sortList.sort(function(a,b){return a.id - b.id});
                    if ($scope.sortList.unshift(item)) this.sortListModel = 0;
                }
                $scope.SortingReviews($scope.sortList[0].val);
            };

            //functions for carousel
            $scope.carouselFunctions = {
                openImage : function(index){
                    $scope.indexImages = index;

                },
                deleteImage: function(index){
                    $scope.product.images.splice(index, 1);
                    if ($scope.indexImages == index){
                        $scope.indexImages = 0;
                    }
                    if($scope.indexImages > index){
                        $scope.indexImages--;
                    }
                    apply();
                },
                selected: function(index){
                    return index == $scope.indexImages;
                }
            };

//load data
            serviceModel.get_included_services(function(data){
                $scope.includedServices = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });

            serviceModel.get_all_component({"_limit": 4}, function(data){
                $scope.products_card = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });

            serviceModel.get_all_component({}, function(data){
                $scope.allServices = data;
                for(var i in $scope.allServices){
                    $scope.allServices[i].average_rating = 0;
                    ajax.get(dataFactory.components('service', $scope.allServices[i].id).reviews, {},
                        function(response){
                            $scope.allServices[i]["component_reviews"] = response.data;
                            $scope.allServices[i].rating = $scope.allServices[i].component_reviews.map(function(value, index){
                                return value.rating;
                            });
                            var number_of_comments = $scope.allServices[i].rating.length;
                            if(number_of_comments != 0) {
                                var average_rating = 0;
                                for (var k in $scope.allServices[i].rating) {
                                    average_rating += $scope.allServices[i].rating[k];
                                }
                                $scope.allServices[i].average_rating = (average_rating / number_of_comments).toFixed(1);
                            }
                        }
                    );
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });

//review
            //Show Leave A Review form
            $scope.LeaveAReview = function(){
                $scope.LeaveFlag = !$scope.LeaveFlag;
            };

            //cancel Review form
            $scope.Cancel = function(){
                $scope.LeaveFlag = false;
            };

            //Submit Leave A Review form
            $scope.Submit= function(NewReview){
                serviceModel.add_component_reviews(
                    {
                        name: $scope.$root.userData.displayName,
                        accountId: $scope.$root.userData.accountId,
                        reviewId: 0,
                        rating: $scope.submit_rating,
                        comment: NewReview.Comment
                    },
                    function(data){
                        $scope.product.number_of_comments++;
                        $scope.product.rating.push($scope.submit_rating);
                        $scope.submit_rating = 0;
                        $scope.LeaveFlag = !$scope.LeaveFlag;

                        $scope.product.precentage_stars = [0, 0, 0, 0, 0];
                        $scope.product.average_rating = 0;
                        for (var i in $scope.product.rating) {
                            $scope.product.precentage_stars[$scope.product.rating[i] - 1] += 100 / $scope.product.number_of_comments;
                            $scope.product.average_rating += $scope.product.rating[i];
                        }
                        $scope.product.average_rating = ($scope.product.average_rating / $scope.product.number_of_comments).toFixed(1);

                        for (var i in $scope.product.precentage_stars) {
                            $scope.product.precentage_stars[i] = Math.round($scope.product.precentage_stars[i]);
                        }

                        $scope.SortingReviews('date');
                        apply();
                    }
                );
            };

            $scope.addReply = function(NewReview){
                var review = this.review;
                serviceModel.add_component_reviews(
                    {
                        name: $scope.$root.userData.displayName,
                        accountId: $scope.$root.userData.accountId,
                        reviewId: NewReview.id,
                        rating: 0,
                        comment: NewReview.Comment
                    },
                    function(data){
                        data.date = moment(data.date).format("MM/DD/YYYY hh:mm A");
                        if(review.replyReviews){
                            review.replyReviews.unshift(data);
                        }else{
                            review['replyReviews'] = [data];
                        }
                        serviceModel.update_component_reviews(NewReview.id,
                            {
                                'reply': true
                            },
                            function(data){
                                apply();
                            }
                        )
                    }
                )
            };

            $scope.updateHelpful = function(item, create, helpful){
                serviceModel.update_component_reviews(item.id,
                    {
                        'like': item.like,
                        'dislike': item.dislike
                    },
                    function(data){
                    }
                );
                if(create){
                    serviceModel.add_helful(helpful, item.id,function(data){
                        item.helpful = data;
                    });
                }else{
                    serviceModel.update_helful(item.helpful.id, item.helpful)
                }
            };

            $scope.addFlagged = function(NewReview){
                serviceModel.add_flagged(NewReview.id);
            }

            //sorting Reviews
            $scope.SortingReviews = function(val){
                var params = {};
                $scope.selectSortingStar = 0;
                switch(val){
                    case "date":
                        params['_order'] = "DESC";
                        params['_sort'] = "date";
                        break
                    case "helpful":
                        params['_order'] = "DESC";
                        params['_sort'] = "like";
                        break
                    case "leasthelpful":
                        params['_order'] = "ASC";
                        params['_sort'] = "like";
                        break
                    case "lowest":
                        params['_order'] = "ASC";
                        params['_sort'] = "rating";
                        break
                    case "highest":
                        params['_order'] = "DESC";
                        params['_sort'] = "rating";
                        break
                    case "verified":
                        params['_order'] = "DESC";
                        params['_sort'] = "date";
                        params['status'] = true;
                        break
                    case "1star":
                        params['_order'] = "DESC";
                        params['_sort'] = "date";
                        params['rating'] = 1;
                        $scope.selectSortingStar = 1;
                        break
                    case "2star":
                        params['_order'] = "DESC";
                        params['_sort'] = "date";
                        params['rating'] = 2;
                        $scope.selectSortingStar = 2;
                        break
                    case "3star":
                        params['_order'] = "DESC";
                        params['_sort'] = "date";
                        params['rating'] = 3;
                        $scope.selectSortingStar = 3;
                        break
                    case "4star":
                        params['_order'] = "DESC";
                        params['_sort'] = "date";
                        params['rating'] = 4;
                        $scope.selectSortingStar = 4;
                        break
                    case "5star":
                        params['_order'] = "DESC";
                        params['_sort'] = "date";
                        params['rating'] = 5;
                        $scope.selectSortingStar = 5;
                        break
                }

                if ($scope.limit_reviews && !$scope.selectSortingStar) params['_limit'] = 2;

                serviceModel.get_component_reviews(params, function(data){
                    $scope.product.component_reviews = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                });
            };

            //Selected rating
            $scope.stars = function(val){
                $scope.submit_rating = val;
            };

            //View All Review
            $scope.ViewAllReview = function(){
                $scope.limit_reviews = false;
                if($scope.selectSortingStar){
                    $scope.selectSortingStar =0;
                }
                $scope.SortingReviews($scope.sortList[0].val);
            };

            //View All Included
            $scope.ViewIncluded = function(ev){
                $(window).scrollTop(0);
                $mdDialog.show({
                    controller: "ViewIncludedController",
                    templateUrl: "templates/product/view_included.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        products: $scope.allServices
                    },
                    clickOutsideToClose:true
                })
                    .then(function() {
                    }, function() {
                    });
            };

            //Search products
            $scope.submitSearch = function(text){
                window.location.href = '/marketplace.php#/search/' + $stateParams.typeProduct +'s?text=' + text;
            };

//

//functional
            $scope.addToFavorite = function(){
                if(!$scope.product.favorite){
                    // add to favorites
                    var requestData = {
                        accountId : $scope.$root.userData.accountId,
                        serviceId : $scope.product.id
                    };
                    ajax.create(dataFactory.addFavorite(), requestData, function(response){
                        $scope.product.favorite = response.data;
                        getFavoriteCount();
                    });
                }else{
                    // remove from favorites
                    ajax.delete(dataFactory.deleteFavorite($scope.product.favorite.id), {}, function(response){
                        $scope.product.favorite = false;
                        getFavoriteCount();
                    });
                }
            };

            $scope.toProject = function(){
                $scope.adding_to_project = true;
            };

            $scope.btnCanselToProject = function(){
                $scope.adding_to_project = false;
            };

            $scope.btnRemoveOfProject = function(){
                ajax.update(dataFactory.addServiceToProject($scope.product.id), {
                        currentStatus: {
                            project: {
                                id: 0,
                                title: ""
                            }
                        },
                        projectId: 0
                    }, function (response) {
                        $scope.product.projectId = 0;
                        $scope.product.currentStatus.project.id = 0;
                        $scope.product.currentStatus.project.title = "";
                        $scope.invate = false;
                        $scope.adding_to_project = false;
                    }, function (response) {
                        toastModel.showToast("error", "Failed Add To Project");
                    }
                );
            };

            $scope.btnAddToProject = function(id){
                var project = null;
                for(var i in $scope.projects){
                    if($scope.projects[i].id == id){
                        project = $scope.projects[i];
                        break;
                    }
                }

                if(project) {
                    ajax.update(dataFactory.addServiceToProject($scope.product.id), {
                            currentStatus: {
                                project: {
                                    id: id,
                                    title: project.title
                                }
                            },
                            projectId: id,
                            from: 'marketplace'
                        }, function (response) {
                            $scope.product.projectId = id;
                            $scope.product.currentStatus.project.id = id;
                            $scope.product.currentStatus.project.title = project.title;
                            $scope.invate = true;
                            $scope.adding_to_project = false;
                            setTimeout(function () {
                                $scope.invate = false;
                                apply();
                            }, 210000);
                            toastModel.showToast("success", "Service added to " + response.data.currentStatus.project.title);
                        }, function (response) {
                            toastModel.showToast("error", "Failed Add To Project");
                        }
                    );
                }
            };

            var updateCompareCount = function () {
                var arr = $cookies.getObject('compareProducts');
                return arr == null ? {services: [], components: []} : arr;
            };
            $scope.compareProducts = updateCompareCount();

            $scope.$watch(function() { return $cookies.changedCompare; }, function(newValue) {
                $scope.compareProducts = updateCompareCount();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });

            $scope.removeFromCompare = function(){
                var compareProducts = $cookies.getObject('compareProducts');
                if(compareProducts != null){
                    if($scope.product.type == 'service') {
                        if($.inArray( parseInt($scope.product.id), compareProducts.services ) != -1){
                            compareProducts.services.splice( $.inArray(parseInt($scope.product.id), compareProducts.services), 1);
                            $cookies.putObject('compareProducts', compareProducts);
                            $cookies.changedCompare = new Date();
                        }
                    }else if($scope.product.type == 'component'){
                        if($.inArray( parseInt($scope.product.id), compareProducts.components ) != -1){
                            compareProducts.components.splice($.inArray(parseInt($scope.product.id), compareProducts.components), 1);
                            $cookies.putObject('compareProducts', compareProducts);
                            $cookies.changedCompare = new Date();
                        }
                    }
                }
            };

            $scope.addToCompare = function(){
                if($scope.product.type == 'service' && $scope.compareProducts.components.length == 0) {
                    if($.inArray( parseInt($scope.product.id), $scope.compareProducts.services ) == -1){
                        $scope.compareProducts.services.push(parseInt($scope.product.id));
                        $cookies.putObject('compareProducts', $scope.compareProducts);
                        $cookies.changedCompare = new Date();
                    }
                }else if($scope.product.type == 'component' && $scope.compareProducts.services.length == 0){
                    if($.inArray( parseInt($scope.product.id), $scope.compareProducts.components ) == -1){
                        $scope.compareProducts.components.push(parseInt($scope.product.id));
                        $cookies.putObject('compareProducts', $scope.compareProducts);
                        $cookies.changedCompare = new Date();
                    }
                }
            };

            $scope.SortingReviews($scope.sortList[0].val);


            var getMenu = function(){
                var dataSearch = $.extend(true,{},$stateParams);

                var getUrl = function(product,type){

                    //#/home?product=services&type=analytical
                    console.info('ds','marketplace.php/#/home?product=' + $stateParams.typeProduct + ((type) ? '&type='+type : ''));
                    return 'marketplace.php#/home?product=' + $stateParams.typeProduct + ((type) ? '&type='+type : '');
                };

                var isOpened = function(product,type){
                    if ($stateParams.typeProduct === product) {
                        return (!type || $stateParams.typeProduct === type ? true : false);
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