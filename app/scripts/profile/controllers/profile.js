angular.module('dmc.profile')
    .controller('profileController',
    	['profileData', 'profileModel', '$stateParams', '$scope', '$location', '$anchorScroll', 'ajax', 'dataFactory', '$state',
    	function (profileData, profileModel, $stateParams, $scope, $location, $anchorScroll, ajax, dataFactory, $state) {

        $scope.profile = profileData;  //profile

        ajax.get(dataFactory.documentsUrl().getList, {page: 0, pageSize: 1, parentType: 'USER', parentId: $scope.profile.id, docClass: 'IMAGE'}, function(response) {
            if (response.data && response.data.data) {
                $scope.profile.image = response.data.data[0].documentUrl;
            }
        });

        $scope.LeaveFlag = false;  //flag for visibility form Leave A Review
        $scope.submit_rating = 0;  //
        $scope.limit_reviews = true;  //limit reviews
        $scope.sortListModel = 0;  //model for drop down menu 'sorting'

        $scope.showflag = false;
        $scope.followFlag = false;
        $scope.inviteToProject = false;
        $scope.invate = false;
        $scope.toProject = '';
        $scope.selectSortingStar = 0;
        $scope.projects = [];
        $scope.toProjectId = null;

            $scope.privacyInfo = {
                email : {
                    title : 'Email',
                    icon : 'email'
                },
                phone : {
                    title : 'Phone',
                    icon : 'phone'
                },
                location : {
                    title : 'Location',
                    icon : 'gps_fixed'
                }
            };

        $scope.sortList = [
            {
                id: 0,
                val: 'date',
                name: 'Most recent'
            },
            {
                id: 1,
                val: 'helpful',
                name: 'Most Helpful'
            },
            {
                id: 2,
                val: 'highest',
                name: 'Highest to Lowest Rating'
            },
            {
                id: 3,
                val: 'lowest',
                name: 'Lowest to Highest Rating'
            },
            {
                id: 4,
                val: 'verified',
                name: 'Verified Users'
            }
        ];

        $scope.history = {
            leftColumn: {
                title: 'Public',
                viewAllLink: '/all.php#/history/profile/'+$stateParams.profileId+'/public',
                list: []
            },
            rightColumn: {
                title: 'Mutual',
                viewAllLink: '/all.php#/history/profile/'+$stateParams.profileId+'/mutual',
                list:[]
            }
        }

        /* uncomment when fixed/implemented
        // get profile history
        profileModel.getProfileHistory(
            {
                '_limit': 3,
                'section': 'public'
            },
            function(data){
                for(var i in data){
                    data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
                    switch(data[i].type){
                        case 'completed':
                            data[i].icon = 'images/ic_done_all_black_24px.svg';
                            break;
                        case 'added':
                            data[i].icon = 'images/ic_group_add_black_24px.svg';
                            break;
                        case 'rated':
                            data[i].icon = 'images/ic_star_black_24px.svg';
                            break;
                        case 'worked':
                            data[i].icon = 'images/icon_project.svg';
                            break;
                        case 'favorited':
                            data[i].icon = 'images/ic_favorite_black_24px.svg';
                            break;
                        case 'shared':
                            data[i].icon = 'images/ic_done_all_black_24px.svg';
                            break;
                        case 'discussion':
                            data[i].icon = 'images/ic_forum_black_24px.svg';
                            break;
                    }
                }
                $scope.history.leftColumn.list = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
        );

        // get Profile history
        profileModel.getProfileHistory(
            {
                '_limit': 3,
                'section': 'mutual'
            },
            function(data){
                for(var i in data){
                    data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
                    switch(data[i].type){
                        case 'completed':
                            data[i].icon = 'images/ic_done_all_black_24px.svg';
                            break;
                        case 'added':
                            data[i].icon = 'images/ic_group_add_black_24px.svg';
                            break;
                        case 'rated':
                            data[i].icon = 'images/ic_star_black_24px.svg';
                            break;
                        case 'worked':
                            data[i].icon = 'images/icon_project.svg';
                            break;
                        case 'favorited':
                            data[i].icon = 'images/ic_favorite_black_24px.svg';
                            break;
                        case 'shared':
                            data[i].icon = 'images/ic_done_all_black_24px.svg';
                            break;
                        case 'discussion':
                            data[i].icon = 'images/ic_forum_black_24px.svg';
                            break;
                    }
                }
                $scope.history.rightColumn.list = data;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
        );
        */

        ajax.get(
            dataFactory.getProjects(),
            {},
            function(response){
                $scope.projects = response.data;
            }
        )

//review
        //Show Leave A Review form
        $scope.LeaveAReview = function () {
            $scope.LeaveFlag = !$scope.LeaveFlag;
            $scope.submit_rating = 0;
        };

        //cancel Review form
        $scope.Cancel = function () {
            $scope.LeaveFlag = false;
            $scope.submit_rating = 0;
        };

        //Submit Leave A Review form
        $scope.Submit = function (NewReview) {
			profileModel.add_profile_reviews($stateParams.profileId,
				{
                    name: $scope.$root.userData.displayName,
                    accountId: $scope.$root.userData.accountId,
                    reviewId: 0,
                    rating: $scope.submit_rating,
                    comment: NewReview && NewReview.Comment ? NewReview.Comment : null
				},
				function(data){
	            	$scope.profile.number_of_comments++;
		            $scope.profile.rating.push($scope.submit_rating);
		            $scope.submit_rating = 0;
		            $scope.LeaveFlag = !$scope.LeaveFlag;

                    $scope.profile.precentage_stars = [0, 0, 0, 0, 0];
                    $scope.profile.average_rating = 0;
                    for (var i in $scope.profile.rating) {
                        $scope.profile.precentage_stars[$scope.profile.rating[i] - 1] += 100 / $scope.profile.number_of_comments;
                        $scope.profile.average_rating += $scope.profile.rating[i];
                    }
                    $scope.profile.average_rating = ($scope.profile.average_rating / $scope.profile.number_of_comments).toFixed(1);

                    for (var i in $scope.profile.precentage_stars) {
                        $scope.profile.precentage_stars[i] = Math.round($scope.profile.precentage_stars[i]);
                    }

                    $scope.SortingReviews('date');
	            	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
	            }
	        );
        };

        $scope.addReply = function(NewReview){
            var review = this.review;
            profileModel.add_profile_reviews($stateParams.profileId,
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
                    profileModel.update_profile_reviews(NewReview.id,
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
            profileModel.update_profile_reviews(item.id,
                {
                    'like': item.like,
                    'dislike': item.dislike
                },
                function(data){
                }
            );
            if(create){
                profileModel.add_helful(helpful, item.id,function(data){
                    item.helpful = data;
                });
            }else{
                profileModel.update_helful(item.helpful.id, item.helpful)
            }
        }

        $scope.addFlagged = function(NewReview){
            profileModel.add_flagged(NewReview.id);
        }

        //selected dorp down menu 'sorting'
        $scope.selectItemDropDown = function (value) {
            if (value != 0) {
                var item = $scope.sortList[value];
                $scope.sortList.splice(value, 1);
                $scope.sortList = $scope.sortList.sort(function (a, b) {
                    return a.id - b.id
                });
                if ($scope.sortList.unshift(item)) this.sortListModel = 0;
            }
            $scope.SortingReviews($scope.sortList[0].val);
        };

        //sorting Reviews
        $scope.SortingReviews = function (val) {
            var params = {};


            $scope.selectSortingStar = 0;
            switch (val) {
                case 'date':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'date';
                    break
                case 'helpful':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'like';
                    break
                case 'lowest':
                	params['_order'] = 'ASC';
                	params['_sort'] = 'rating';
                    break
                case 'highest':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'rating';
                    break
                case 'verified':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'date';
                	params['status'] = true;
                    break
                case '1star':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'date';
                	params['rating'] = 1;
                    $scope.selectSortingStar = 1;
                    break
                case '2star':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'date';
                	params['rating'] = 2;
                    $scope.selectSortingStar = 2;
                    break
                case '3star':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'date';
                	params['rating'] = 3;
                    $scope.selectSortingStar = 3;
                    break
                case '4star':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'date';
                	params['rating'] = 4;
                    $scope.selectSortingStar = 4;
                    break
                case '5star':
                	params['_order'] = 'DESC';
                	params['_sort'] = 'date';
                	params['rating'] = 5;
                    $scope.selectSortingStar = 5;
                    break
            }
            if ($scope.limit_reviews && !$scope.selectSortingStar) params['_limit'] = 2;

            // TODO remove at a later date
            // profileModel.get_profile_reviews($stateParams.profileId, params, function(data){
            // 	$scope.profile.reviews = data;
            // 	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            // });
        };

        //Selected rating
        $scope.stars = function (val) {
            $scope.submit_rating = val;
        };

        //View All Review
        $scope.ViewAllReview = function () {
            $scope.limit_reviews = false;
            if($scope.selectSortingStar){
                $scope.selectSortingStar =0;
            }
            $scope.SortingReviews($scope.sortList[0].val);
        };

///
        $scope.goToReview = function () {
            $location.hash('review');
            $anchorScroll();
        }

        $scope.showMore = function () {
            $scope.showflag = false;
        }

        $scope.follow = function () {
            $scope.followFlag = !$scope.followFlag;
        }


        $scope.searchText = '';
        $scope.btnInviteToProject = function () {
            $scope.inviteToProject = true;
        }

        $scope.btnAddToProject = function (index) {
            console.info('add', $scope.projects[index])
            $scope.toProject = $scope.projects[index].title;
            $scope.toProjectId = $scope.projects[index].id;
            $scope.invate = true;
            $scope.inviteToProject = false;
            ajax.create(dataFactory.createMembersToProject(),
                {
                    'profileId': $stateParams.profileId,
                    'projectId': $scope.toProjectId,
                    'fromProfileId': $scope.$root.userData.profileId,
                    'from': $scope.$root.userData.displayName,
                    'date': moment(new Date).format('x'),
                    'accept': false
                },
                function(response){
                }
            );
        }

        $scope.btnCanselToProject = function () {
            $scope.inviteToProject = false;
        }

        $scope.btnRemoveOfProject = function () {
            $scope.toProject = '';
            $scope.invate = false;
            $scope.inviteToProject = false;
        }

        $scope.SortingReviews($scope.sortList[0].val);
    }]);
