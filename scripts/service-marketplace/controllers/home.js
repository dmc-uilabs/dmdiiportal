'use strict';

angular.module('dmc.service-marketplace')
    .controller('ServiceMarketplaceController', [
        'serviceData',
        'serviceModel',
        '$stateParams',
        '$scope',
        'ajax',
        'dataFactory',
        '$mdDialog',
        '$cookies',
        'toastModel',
        'isFavorite',
        'DMCUserModel',
        'previousPage',
        'CompareModel',
        '$location',
        '$http',
        function (serviceData,
                  serviceModel,
                  $stateParams,
                  $scope,
                  ajax,
                  dataFactory,
                  $mdDialog,
                  $cookies,
                  toastModel,
                  isFavorite,
                  DMCUserModel,
                  previousPage,
                  CompareModel,
                  $location,
                  $http) {

            $scope.product = serviceData;  //array product
            $scope.LeaveFlag = false;  //flag for visibility form Leave A Review
            $scope.submit_rating = 0;  //
            $scope.not_found = false;  //product not fount
            $scope.products_card = [];  //products card
            $scope.limit_reviews = true;  //limit reviews
            $scope.allServices = [];
            $scope.UserLogin = 'DMC Member';
            $scope.adding_to_project = false;
            $scope.selectSortingStar = 0;
            $scope.invate = false;
            $scope.documents = [];
            $scope.product.average_rating = $scope.product.ratingAverage || 0;

            $scope.previousPage = previousPage.get();
            if($scope.previousPage.tag != 'marketplace'){
                $scope.previousPage = {
                    tag : 'marketplace',
                    subPage : 'home',
                    title: 'BACK TO MARKETPLACE HOME',
                    url: '/marketplace.php#/home'
                };
            }
            $scope.service_images = [];
            ajax.get(dataFactory.documentsUrl().getList, { recent: 10, parentType: 'SERVICE', parentId: $scope.product.id, docClass: 'IMAGE' }, function(response) {
                if (response.data && response.data.data && response.data.data.length) {
                    $scope.service_images = response.data.data;
                }
            });

            $scope.service_docs = [];
            ajax.get(dataFactory.documentsUrl().getList, { recent: 10, parentType: 'SERVICE', parentId: $scope.product.id, docClass: 'SUPPORT' }, function(response) {
                if (response.data && response.data.data && response.data.data.length) {
                    $scope.service_docs = response.data.data;
                }
            });

            ajax.get(dataFactory.getUserName($scope.product.owner), {}, function(response) {
                $scope.owner_name = response.data.displayName;
            });

            ajax.get(dataFactory.getDefaultService($scope.product.id), {}, function(response) {
                $scope.defaultService = response.data;
            });

            // check if service is favorite for current user
            //isFavorite.check([$scope.product]);

            $scope.currentImage = 1;
            $scope.indexImages = 0;
            $scope.selectedTab = 0;

            $scope.history = {
                rightColumn: {
                    title: 'Your Projects',
                    viewAllLink: '/all.php#/history/service/'+$stateParams.serviceId+'/project',
                    list: []
                },
                leftColumn: {
                    title: 'Marketplace',
                    viewAllLink: '/all.php#/history/service/'+$stateParams.serviceId+'/marketplace',
                    list:[]
                }
            };

            ///////// commenting out as part of pre-beta sprint
            // serviceModel.get_service_hystory(
            //     {
            //         'period': 'today',
            //         'section': 'marketplace'
            //     },
            //     function(data){
            //         for(var i in data){
            //             data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
            //             switch(data[i].type){
            //                 case 'completed':
            //                 case 'successful_runs':
            //                     data[i].icon = 'images/ic_done_all_black_24px.svg';
            //                     break;
            //                 case 'added':
            //                     data[i].icon = 'images/ic_group_add_black_24px.svg';
            //                     break;
            //                 case 'rated':
            //                     data[i].icon = 'images/ic_star_black_24px.svg';
            //                     break;
            //                 case 'worked':
            //                     data[i].icon = 'images/icon_project.svg';
            //                     break;
            //                 case 'favorited':
            //                     data[i].icon = 'images/ic_favorite_black_24px.svg';
            //                     break;
            //                 case 'shared':
            //                     data[i].icon = 'images/ic_done_all_black_24px.svg';
            //                     break;
            //                 case 'discussion':
            //                     data[i].icon = 'images/ic_forum_black_24px.svg';
            //                     break;
            //                 case 'edited':
            //                     data[i].icon = 'images/ic_create_black_24px.svg';
            //                     break;
            //                 case 'unavailable_runs':
            //                     data[i].icon = 'images/ic_block_black_24px.svg';
            //                     break;
            //                 case 'incomplete_runs':
            //                     data[i].icon = 'images/ic_file_download_black_24px.svg';
            //                     break;
            //             }
            //
            //         }
            //         $scope.history.leftColumn.list = data;
            //     }
            // );
            // serviceModel.get_service_hystory(
            //     {
            //         'period': 'today',
            //         'section': 'project'
            //     },
            //     function(data){
            //         for(var i in data){
            //             data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
            //             switch(data[i].type){
            //                 case 'completed':
            //                 case 'successful_runs':
            //                     data[i].icon = 'images/ic_done_all_black_24px.svg';
            //                     break;
            //                 case 'added':
            //                     data[i].icon = 'images/ic_group_add_black_24px.svg';
            //                     break;
            //                 case 'rated':
            //                     data[i].icon = 'images/ic_star_black_24px.svg';
            //                     break;
            //                 case 'worked':
            //                     data[i].icon = 'images/icon_project.svg';
            //                     break;
            //                 case 'favorited':
            //                     data[i].icon = 'images/ic_favorite_black_24px.svg';
            //                     break;
            //                 case 'shared':
            //                     data[i].icon = 'images/ic_done_all_black_24px.svg';
            //                     break;
            //                 case 'discussion':
            //                     data[i].icon = 'images/ic_forum_black_24px.svg';
            //                     break;
            //                 case 'edited':
            //                     data[i].icon = 'images/ic_create_black_24px.svg';
            //                     break;
            //                 case 'unavailable_runs':
            //                     data[i].icon = 'images/ic_block_black_24px.svg';
            //                     break;
            //                 case 'incomplete_runs':
            //                     data[i].icon = 'images/ic_file_download_black_24px.svg';
            //                     break;
            //             }
            //         }
            //         $scope.history.rightColumn.list = data;
            //     }
            // );
            //
            // $scope.getHistory = function(type, time){
            //     var period = '';
            //     var params = {'section': 'project'};
            //     if(time == 'today'){
            //         period = 'today';
            //     }else if (time == 'week'){
            //         period = ['today','week'];
            //     }else{
            //         period = ['today','week','all'];
            //     }
            //
            //     params['period'] = period;
            //
            //     if(type != 'runs_by_users'){
            //         params['type'] = type;
            //     }
            //
            //     serviceModel.get_service_hystory(
            //         params,
            //         function(data){
            //             for(var i in data){
            //                 data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
            //                 if(data[i].type == 'successful_runs'){
            //                     data[i].icon = 'done_all';
            //                 }else if(data[i].type == 'unavailable_runs'){
            //                     data[i].icon = 'block';
            //                 }else if(data[i].type == 'incomplete_runs'){
            //                     data[i].icon = 'file_upload';
            //                 };
            //             }
            //             $scope.history.leftColumn.list = data;
            //             $scope.selectedTab = 2;
            //             apply();
            //         }
            //     );
            // };

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
                CompareModel.get('services',userData);
                //getFavoriteCount();
            });

            ///////// commenting out as part of pre-beta sprint
            // get favorites count ------------------
            // $scope.favoritesCount = 0;
            // var getFavoriteCount = function(){
            //     ajax.get(dataFactory.getFavoriteProducts(),{
            //         accountId : $scope.$root.userData.accountId
            //     },function(response){
            //         $scope.favoritesCount = response.data.length;
            //         apply();
            //     });
            // };

            $scope.share = function(ev){
              $mdDialog.show({
                  controller: 'ShareProductCtrl',
                  templateUrl: 'templates/components/product-card/share-product.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  locals: {
                      serviceId : $stateParams.serviceId
                  }
              }).then(function() {
              }, function() {
              });
          };

            $scope.sortList = [
                {
                    id: 0,
                    val: 'date',
                    name: 'Most Recent'
                },
                {
                    id: 1,
                    val: 'helpful',
                    name: 'Most Helpful'
                },
                {
                    id: 2,
                    val: 'leasthelpful',
                    name: 'Least Helpful'
                },
                {
                    id: 3,
                    val: 'highest',
                    name: 'Highest to Lowest Rating'
                },
                {
                    id: 4,
                    val: 'lowest',
                    name: 'Lowest to Highest Rating'
                },
                {
                    id: 5,
                    val: 'verified',
                    name: 'Verified Users'
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
                    $scope.images.splice(index, 1);
                    if ($scope.indexImages == index) $scope.indexImages = 0;
                    if($scope.indexImages > index) $scope.indexImages--;
                    apply();
                },
                selected: function(index){
                    return index == $scope.indexImages;
                }
            };

//load data

            //get similar product
            serviceModel.get_all_service({'_limit': 4}, function(data){
                $scope.products_card = data;
                //isFavorite.check($scope.products_card);
                apply();
            });

//review
            //Show Leave A Review form
            $scope.LeaveAReview = function(){
                $scope.LeaveFlag = !$scope.LeaveFlag;
                $scope.submit_rating = 0;
            };

            //cancel Review form
            $scope.Cancel = function(){
                $scope.submit_rating = 0;
                $scope.LeaveFlag = false;
            };

            //Submit Leave A Review form
            $scope.Submit= function(NewReview){
                serviceModel.add_service_reviews(
                    {
                        name: $scope.$root.userData.displayName,
                        accountId: $scope.$root.userData.accountId,
                        reviewId: 0,
                        rating: $scope.submit_rating,
                        comment: NewReview && NewReview.Comment ? NewReview.Comment : null
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
////
            $scope.addReply = function(NewReview){
                var review = this.review;
                serviceModel.add_service_reviews(
                    {
                        name: $scope.$root.userData.displayName,
                        accountId: $scope.$root.userData.accountId,
                        reviewId: NewReview.id,
                        rating: 0,
                        comment: NewReview.Comment
                    },
                    function(data){
                        data.date = moment(data.date).format('MM/DD/YYYY hh:mm A');
                        if(review.replyReviews){
                            review.replyReviews.unshift(data);
                        }else{
                            review['replyReviews'] = [data];
                        }
                        serviceModel.update_service_reviews(NewReview.id,
                            {
                                'reply': true
                            },
                            function(data){
                                apply();
                            }
                        )
                    }
                )
            }

            $scope.updateHelpful = function(item, create, helpful){
                serviceModel.update_service_reviews(item.id,
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
            }

            $scope.addFlagged = function(NewReview){
                serviceModel.add_flagged(NewReview.id);
            }

            //sorting Reviews
            $scope.SortingReviews = function(val){
                var params = {};
                $scope.selectSortingStar = 0;
                switch(val){
                    case 'date':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'date';
                        break;
                    case 'helpful':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'like';
                        break;
                    case 'leasthelpful':
                        params['_order'] = 'ASC';
                        params['_sort'] = 'like';
                        break;
                    case 'lowest':
                        params['_order'] = 'ASC';
                        params['_sort'] = 'rating';
                        break;
                    case 'highest':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'rating';
                        break;
                    case 'verified':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'date';
                        params['status'] = true;
                        break;
                    case '1star':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'date';
                        params['rating'] = 1;
                        $scope.selectSortingStar = 1;
                        break;
                    case '2star':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'date';
                        params['rating'] = 2;
                        $scope.selectSortingStar = 2;
                        break;
                    case '3star':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'date';
                        params['rating'] = 3;
                        $scope.selectSortingStar = 3;
                        break;
                    case '4star':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'date';
                        params['rating'] = 4;
                        $scope.selectSortingStar = 4;
                        break;
                    case '5star':
                        params['_order'] = 'DESC';
                        params['_sort'] = 'date';
                        params['rating'] = 5;
                        $scope.selectSortingStar = 5;
                        break;
                }

                if ($scope.limit_reviews && !$scope.selectSortingStar) params['_limit'] = 2;

                // serviceModel.get_service_reviews(params, function(data){
                //     $scope.product.service_reviews = data;
                //     if($scope.limit_reviews === false){
                //
                //         $scope.product.rating = $scope.product.service_reviews.map(function(value, index){
                //             return value.rating;
                //         });
                //         $scope.product.number_of_comments = $scope.product.service_reviews.length;
                //
                //         $scope.product.precentage_stars = [0, 0, 0, 0, 0];
                //         $scope.product.average_rating = 0;
                //         if($scope.product.number_of_comments != 0) {
                //             for (var i in $scope.product.rating) {
                //                 $scope.product.precentage_stars[$scope.product.rating[i] - 1] += 100 / $scope.product.number_of_comments;
                //                 $scope.product.average_rating += $scope.product.rating[i];
                //             }
                //             $scope.product.average_rating = ($scope.product.average_rating / $scope.product.number_of_comments).toFixed(1);
                //
                //             for (var i in $scope.product.precentage_stars) {
                //                 $scope.product.precentage_stars[i] = Math.round($scope.product.precentage_stars[i]);
                //             }
                //         }
                //     }
                //     apply();
                // });
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
///
            $scope.$watchCollection('names', function(newNames, oldNames) {
            });

            //Search products
            $scope.submitSearch = function(text){
                window.location.href = '/marketplace.php#/search?product=services&text=' + text;
            };


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

            $scope.SortingReviews($scope.sortList[0].val);

            ////////adding the below as part of pre-beta changes to limit calls
            $scope.adHocData = function(dataToGet) {

              if (!$scope.product[dataToGet]) {
                var id = $scope.product.id;
                var endpoints = {
                  'service_tags': dataFactory.services(id).get_tags,
                  'service_reviews': dataFactory.services(id).reviews
                  // 'interfaceModel': dataFactory.services(id).get_interface
                };

                var extractData = function(response){
                  return response.data ? response.data : response;
                };

                $http.get(endpoints[dataToGet]).then(function(response){
                  if (dataToGet == 'interfaceModel') {
                    // $scope.product[dataToGet] = (response.data && response.data.length > 0 ? response.data[0] : null);
                  } else {
                    $scope.product[dataToGet] = extractData(response);
                  };

                });
              };

            };

            $scope.redirectToServiceHistory = function(projectId, serviceId) {
              window.location.href = '/run-app.php#/'+projectId+'/services/'+serviceId+'/run/app-history';
            };

            // $scope.addToCompare = function(){
            //     CompareModel.add('services',{
            //         profileId : $scope.userData.profileId,
            //         serviceId : $scope.product.id
            //     });
            // };

        }
    ]
);
