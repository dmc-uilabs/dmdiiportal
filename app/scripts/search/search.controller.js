'use strict';
angular.module('dmc.search')
    .controller('SearchController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'previousPage',
        'DMCUserModel',
        '$mdDialog',
        '$rootScope',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    DMCUserModel,
                    $mdDialog,
                    $rootScope,
                    dataFactory) {

            $scope.userData = DMCUserModel.getUserData();

            $scope.type = $stateParams.type;
            $scope.subTypeModel = angular.isDefined($stateParams.subtype) ? $stateParams.subtype : null;
            $scope.searchTextModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.totalItemsPerPage = angular.isDefined($stateParams.limit) ? $stateParams.limit : 10;
            $scope.currentPage = angular.isDefined($stateParams.page) ? $stateParams.page : 1;
            $scope.sortItems = angular.isDefined($stateParams.sort) ? $stateParams.sort : null;
            $scope.pages = [];
            $scope.totalResults = 0;
            $(window).scrollTop(0);
            $scope.getPageHref = function(number){
                var dataSearch = $stateParams;
                dataSearch.page = number;
                return '/search.php'+$state.href('search',dataSearch);
            };

            var totalCountItems = {
                members: 0 , companies : 0, discussions : 0
            };

            $scope.sortArray = [{
                val : 'popular', name: 'Most Popular'
            }];

            $scope.showArray = [
                {
                    val:10, name: '10 items'
                },
                {
                    val:25, name: '25 items'
                },
                {
                    val:50, name: '50 items'
                },
                {
                    val:100, name: '100 items'
                },
                {
                    val:'all', name: 'All items'
                }
            ];

            $scope.discussionsSubTypes = [
                {
                    tag: 'members',
                    name: 'Members'
                }, {
                    tag: 'companies',
                    name: 'Companies'
                },{
                    tag: 'discussions',
                    name: 'Discussions'
                }
            ];
            function setFirstInList(array,key,val) {
                var item = null;
                for (var i in array) {
                    if (array[i][key] == val) {
                        item = array[i];
                        array.splice(i,1);
                        break;
                    }
                }
                if(item) array.unshift(item);
            }
            setFirstInList($scope.showArray,'val',$scope.totalItemsPerPage);
            setFirstInList($scope.sortArray,'val',$scope.sortItems);
            setFirstInList($scope.discussionsSubTypes,'tag',$scope.subTypeModel);

            $scope.searchPlaceholder = getPlaceholder();
            $scope.subTypes = getSubTypes();

            $scope.changeSort = function(val){
                //update();
            };

            $scope.changePerPage = function(val){
            };

            $scope.$watch('totalItemsPerPage',function(newVal,oldVal){
                if(newVal && newVal != oldVal){
                    var dataSearch = $stateParams;
                    dataSearch.limit = newVal;
                    $state.go('search', dataSearch, {reload: true});
                }
            });

            $scope.$watch('sortItems',function(newVal, oldVal){
                if(newVal != oldVal){
                    var dataSearch = $stateParams;
                    dataSearch.sort = newVal;
                    $state.go('search', dataSearch, {reload: true});
                }
            });

            $scope.$watch('currentPage',function(newVal, oldVal){
                console.log(newVal);
                if(newVal && newVal != oldVal){
                    var dataSearch = $stateParams;
                    dataSearch.page = newVal;
                    $state.go('search', dataSearch, {reload: true});
                }
            });

            $scope.$watch('totalResults',function(newVal,oldVal){
                if(newVal != oldVal){
                    $scope.pages = [];
                    if(newVal > $scope.totalItemsPerPage) {
                        var count = newVal % $scope.totalItemsPerPage != 0 ? (Math.floor(newVal / $scope.totalItemsPerPage) + 1) : newVal / $scope.totalItemsPerPage;
                        for(var i=0;i<count;i++){
                            $scope.pages.push((i+1));
                        }
                        $scope.updateVisiblePages();
                    }
                }
            });

            $scope.openPage = function(event,number){
                event.preventDefault();
                var dataSearch = $stateParams;
                dataSearch.page = number;
                $state.go('search', dataSearch, {reload: true});
            };

            $scope.visiblePages = [];
            $scope.updateVisiblePages = function(){
                var count = $scope.pages.length;
                $scope.visiblePages = [];
                var start = ($scope.currentPage-2 <= 0 ? 1 : $scope.currentPage-2);
                var end = ($scope.currentPage+2 > count ? count : $scope.currentPage+2);
                if($scope.currentPage-2 <= 0) end-=$scope.currentPage-2-1;
                if($scope.currentPage+2 > count) start-=($scope.currentPage+2-count);
                for(var i=start;i<=end;i++){
                    $scope.visiblePages.push(i);
                }
                apply();
            };
            //$scope.updateVisiblePages();

            $scope.showMembers = function(id, ev){
                console.info('index', id);
                $(window).scrollTop();
                $mdDialog.show({
                    controller: 'showMembers',
                    templateUrl: 'templates/components/members-card/show-members.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    locals: {
                        'id' : id
                    }
                }).then(function() {
                    $(window).scrollTop();
                }, function() {
                    $(window).scrollTop();
                });
            }

            // Discussions Start ----------------------------------------------------
            $scope.discussions = [];
            $scope.order = 'DESC';
            $scope.sort = 'text';

            $scope.getDiscussions = function () {

                ajax.get(dataFactory.getIndividualDiscussions(), {
                    '_order' : $scope.order,
                    'projectId' : $scope.projectId,
                    title_like: $scope.searchTextModel,
                    '_sort' : $scope.sort
                }, function (response) {
                    totalCountItems.discussions = response.data.length;
                    $scope.treeMenuModel = getMenu();
                    if($scope.type == 'discussions') {
                        $scope.totalResults = response.data.length;
                        $scope.discussions = response.data;
                        var ids = $.map($scope.discussions, function (x) {
                            return x.id;
                        });
                        ajax.get(dataFactory.addCommentIndividualDiscussion(), {
                            'individual-discussionId': ids,
                            '_order': 'DESC',
                            '_sort': 'id',
                            'commentId': 0
                        }, function (res) {
                            for (var i in $scope.discussions) {
                                $scope.discussions[i].created_at_format = moment(new Date($scope.discussions[i].created_at)).format('MM/DD/YYYY');
                                $scope.discussions[i].replies = 0;
                                for (var j in res.data) {
                                    if ($scope.discussions[i].id == res.data[j]['individual-discussionId']) {
                                        $scope.discussions[i].replies++;
                                        $scope.discussions[i].last = res.data[j];
                                        $scope.discussions[i].last.created_at_format = moment(new Date($scope.discussions[i].last.created_at)).format('MM/DD/YYYY');
                                        if ($scope.discussions[i].isPosted == null) {
                                            $scope.discussions[i].isPosted = true;
                                        } else if ($scope.discussions[i].isPosted == true) {
                                            $scope.discussions[i].isPosted = false;
                                        }
                                    }
                                }
                                if ($scope.discussions[i].replies > 0) $scope.discussions[i].replies--;
                                if ($scope.discussions[i].isPosted == null) $scope.discussions[i].isPosted = true;
                            }
                            //var limit = $scope.totalItemsPerPage;
                            //if ($scope.totalResults > limit) {
                            //    $scope.discussions = $scope.discussions.splice(($scope.currentPage - 1) * limit, $scope.currentPage * limit);
                            //}
                            apply();
                        });
                    }
                });
            };

            $scope.onOrderChange = function (order) {
                //$scope.sort = order;
                //$scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                //$scope.getDiscussions();
            };

            // Discussions End ------------------------------------------------------

            // Companies Start ------------------------------------------------------
            $scope.totalFollowing = 0;
            $scope.arrayItems = [];
            $scope.getCompanies = function () {
                ajax.get(dataFactory.companyURL().all, {
                        _sort: 'id',
                        _order: $scope.order,
                        name_like: $scope.searchTextModel,
                        _type: $scope.subTypeModel,
                        accountId_ne: $scope.userData.accountId
                    }, function (response) {
                        totalCountItems.companies = response.data.length;
                        $scope.treeMenuModel = getMenu();
                        if($scope.type == 'companies' || $scope.type == 'all') {
                            $scope.totalFollowing = 0;
                            $scope.arrayItems = response.data;
                            $scope.totalResults = response.data.length;

                            angular.forEach($scope.arrayItems, function(company) {
                                company.isCompany = true;
                                ajax.get(dataFactory.documentsUrl().getList, {
                                    parentType: 'ORGANIZATION',
                                    parentId: company.id,
                                    docClass: 'LOGO',
                                    page: 0, pageSize: 1
                                }, function(response) {
                                    if (response.data && response.data.data && response.data.data !== null && response.data.data.length > 0) {
                                        company.logoImage = response.data.data[0];
                                    };
                                });
                            });

                            isFollowCompany($.map($scope.arrayItems, function (x) {
                                return x.id;
                            }));
                        }
                        if($scope.type == 'all'){
                            ajax.get(dataFactory.profiles().all, {
                                    _sort: 'id',
                                    _order: $scope.order,
                                    displayName_like: $scope.searchTextModel,
                                    _type: $scope.subTypeModel
                                }, function (res) {
                                    $scope.totalResults += res.data.length;
                                    var limit = ($scope.totalItemsPerPage == 'all' ? $scope.totalResults : $scope.totalItemsPerPage);
                                    for(var i in res.data) {
                                        res.data[i].isMember = true;
                                        $scope.arrayItems.push(res.data[i]);
                                    }
                                    if($scope.totalResults > $scope.totalItemsPerPage){
                                        $scope.arrayItems = $scope.arrayItems.splice(($scope.currentPage-1)*limit, $scope.currentPage*limit);
                                    }
                                    var idsMembers = [];
                                    for(var i in $scope.arrayItems){
                                        if($scope.arrayItems[i].isMember){
                                            idsMembers.push($scope.arrayItems[i].id);
                                        }
                                    }
                                    isFollowMember(idsMembers);
                                    apply();
                                }
                            );
                        }else{
                            var limit = ($scope.totalItemsPerPage == 'all' ? $scope.totalResults : $scope.totalItemsPerPage);
                            $scope.arrayItems = $scope.totalResults > $scope.totalItemsPerPage ? response.data.splice(($scope.currentPage-1)*limit, $scope.currentPage*limit) : response.data;
                            isFollowCompany($.map($scope.arrayItems,function(x){ return x.id;}));
                        }
                        apply();
                    }
                );
            };
            // Companies End --------------------------------------------------------

            // Members Start ------------------------------------------------------
            $scope.getMembers = function () {
                ajax.get(dataFactory.profiles().all, {
                        _sort: 'id',
                        _order: $scope.order,
                        displayName_like: $scope.searchTextModel,
                        _type: $scope.subTypeModel
                    }, function (response) {
                        totalCountItems.members = response.data.length;
                        $scope.treeMenuModel = getMenu();
                        if($scope.type == 'members') {
                            $scope.totalFollowing = 0;
                            $scope.totalResults = response.data.length;
                            var limit = ($scope.totalItemsPerPage == 'all' ? $scope.totalResults : $scope.totalItemsPerPage);
                            $scope.arrayItems = $scope.totalResults > $scope.totalItemsPerPage ? response.data.splice(($scope.currentPage - 1) * limit, $scope.currentPage * limit) : response.data;
                            for (var i in $scope.arrayItems) {
                                $scope.arrayItems[i].isMember = true;
                            }
                            isFollowMember($.map($scope.arrayItems, function (x) {
                                return x.id;
                            }));
                        }
                        apply();
                    }
                );
            };
            // Members End --------------------------------------------------------

            $scope.userData.then(function(data){
                $scope.userData = data;
                $scope.getDiscussions();
                $scope.getCompanies();
                $scope.getMembers();
            });

            $scope.addCompanyToProject = function(){

            };

            $scope.addMemberToProject = function(){

            };

            $rootScope.searchPageTotalFollow = {
                add : function(){
                    $scope.totalFollowing++;
                },
                delete : function(){
                    $scope.totalFollowing--;
                }
            };

            $scope.createDiscussion = function(ev){
                $(window).scrollTop(0);
                $mdDialog.show({
                    controller: 'ComposeDiscussionController',
                    templateUrl: 'templates/individual-discussion/compose-discussion.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    locals: {
                        project_id: null
                    }
                })
                    .then(function() {
                    }, function() {
                    });
            };

            function isFollowMember(ids){
                if(ids.length > 0) {

                        ajax.get(dataFactory.getAccountFollowedMembers($scope.userData.accountId), {
                            profileId: ids
                        }, function (response) {
                            for(var i in $scope.arrayItems){
                                if($scope.arrayItems[i].isMember) {
                                    for (var j in response.data) {
                                        if ($scope.arrayItems[i].id == response.data[j].profileId) {
                                            $scope.totalFollowing++;
                                            $scope.arrayItems[i].follow = response.data[j];
                                            break;
                                        }
                                    }
                                }
                            }
                            apply();
                        });

                }
            }

            function isFollowCompany(ids){
                if(ids.length > 0) {

                        ajax.get(dataFactory.getFollowCompanies($scope.userData.accountId), {
                            companyId: ids
                        }, function (response) {
                            for(var i in $scope.arrayItems){
                                if($scope.arrayItems[i].isCompany) {
                                    for (var j in response.data) {
                                        if ($scope.arrayItems[i].id == response.data[j].companyId) {
                                            $scope.totalFollowing++;
                                            $scope.arrayItems[i].follow = response.data[j];
                                            break;
                                        }
                                    }
                                }
                            }
                            apply();
                        });
                }
            }

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            $scope.subTypeChange = function(subtype){
                var dataSearch = $stateParams;
                dataSearch.subtype = subtype;
                $state.go('search', dataSearch, {reload: true});
            };

            $scope.submit = function(text){
                var dataSearch = $stateParams;
                dataSearch.text = text;
                $state.go('search', dataSearch, {reload: true});
            };

            function getPlaceholder(){
                var placeholder = 'Search';
                switch($stateParams.type){
                    case 'members':
                        placeholder += ' Members';
                        break;
                    case 'companies':
                        placeholder += ' Companies';
                        break;
                    case 'discussions':
                        placeholder += ' Discussions';
                        break;
                    default:
                        break;
                }
                return placeholder;
            }

            function getSubTypes(){
                return {
                    placeholder : 'Filter',
                    items : $scope.discussionsSubTypes
                };
            }

            var getMenu = function(){
                var dataSearch = $.extend(true,{},$stateParams);

                var getUrl = function(type){
                    dataSearch.type = type ? type : 'all';
                    return 'search.php'+$state.href('search',dataSearch);
                };

                var isOpened = function(type){
                    if ($stateParams.type === type) {
                        return true;
                    }else{
                        return false;
                    }
                };

                return {
                    title: 'BROWSE BY',
                    data: [
                        {
                            'id': 1,
                            'title': 'Members & Companies',
                            'tag' : 'all',
                            'items' : totalCountItems.members+totalCountItems.companies,
                            'opened' : isOpened('all'),
                            'href' : getUrl('all'),
                            'categories': []
                        },
                        {
                            'id': 2,
                            'title': 'Members',
                            'tag' : 'members',
                            'items' : totalCountItems.members,
                            'opened' : isOpened('members'),
                            'href' : getUrl('members'),
                            'categories': []
                        },
                        {
                            'id': 3,
                            'title': 'Companies',
                            'tag' : 'companies',
                            'items' : totalCountItems.companies,
                            'opened' : isOpened('companies'),
                            'href' : getUrl('companies')
                        },
                        {
                            'id': 4,
                            'title': 'Discussions',
                            'tag' : 'discussions',
                            'items' : totalCountItems.discussions,
                            'opened' : isOpened('discussions'),
                            'href' : getUrl('discussions')
                        }
                    ]
                };
            };

            $scope.treeMenuModel = getMenu();
        }
    ]
);
