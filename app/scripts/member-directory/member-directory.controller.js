'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.members')
    .controller('DMCMemberDirectoryController',[
        '$state',
        '$stateParams',
        '$scope',
        '$rootScope',
        '$cookies',
        'ajax',
        'dataFactory',
        'socketFactory',
        '$location',
        'is_search',
        'DMCUserModel',
        '$window',
        'CompareModel',
        'isFavorite',
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

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
                CompareModel.get('services',userData);
            });

            $scope.membersLoading = true;

            // This code use for member-directory -------------------------------------------------
            $scope.downloadData = false;        // on/off progress line in member-directory
            $scope.memberPageSize = $cookies.get('memberPageSize') ? $cookies.get('memberPageSize') : 12;    // visible items in member-directory
            $scope.memberCurrentPage = 1;  // current page in member-directory
            // catch updated changedPage variable form $cookies
            // variable changed in member-directory when user change page number (pagination)
            $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
                if(newValue && $scope.memberCurrentPage !== newValue) {
                    $scope.memberCurrentPage = newValue; // save new page number
                    $scope.getDMDIIMembers();
                }
            });
            // if memberPageSize changed
            $scope.$watch('memberPageSize', function(newValue, oldValue) {
                if (newValue !== oldValue){ // if get another value
                    $cookies.put('memberPageSize', newValue);
                    $scope.getDMDIIMembers();
                    apply();
                }
            }, true);
            // -----------------------------------------------------------------------------------

            $scope.updatePageSize = function(pageSize){
                $scope.memberPageSize = pageSize;
            };

            $scope.hasPrev = function() {
                return $scope.memberCurrentPage !== 1;
            };

            $scope.hasNext = function() {
                return $scope.memberCurrentPage !== Math.ceil($scope.totalRecords / $scope.memberPageSize);
            };

            var responseData = {
                _sort : 'id',
                _order : 'DESC'
            };

            $scope.submit = function(text){
                $stateParams.text = text;
                //$state.go('marketplace_search', dataSearch, {reload: true});
                if(!$window.apiUrl){
                    responseData.name_like = text;
                }else{
                    delete responseData.name_like;
                }
                loadingData(true);
                ajax.get(dataFactory.searchDMDIIMembers(text), responseData, callbackFunction);
            };

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };

            $scope.members = {arr : [], count : 0};

            $scope.column = 'organization.name';
            $scope.reverse = false;
            $scope.sort = function(column) {
              $scope.reverse = ($scope.column === column) ? !$scope.reverse : false;
              $scope.column = column;
            };

            var totalCountItems = {
                all: 0, tier: { one: 0, two: 0 }, type: { industry: 0, government: 0, academic: 0 }, activeProjects: { yes: 0, no: 0 }
            };

            // insert response data to array of marketplace items
            var insertData = function(data){
                totalCountItems = {
                    all: 0, tier: { one: 0, two: 0 }, type: { industry: 0, government: 0, academic: 0 }, activeProjects: { yes: 0, no: 0 }
                };

                for (var i in data){

                    totalCountItems.all++;
                    if (data[i].organization.categoryTier === 1) {
                        totalCountItems.tier.one++;
                    } else if(data[i].organizaiton.categoryTier === 2){
                        totalCountItems.tier.two++;
                    }

                    if(data[i].organization.category === 'Industry'){
                        totalCountItems.type.industry++;
                    } else if(data[i].organization.category === 'Government'){
                        totalCountItems.type.government++;
                    } else if(data[i].organization.category === 'Academic'){
                        totalCountItems.type.academic++;
                    }

                    if (data[i].projects.find(function(project) {
						return project.status === 'active';
					})) {
                        totalCountItems.activeProjects.yes++;
						data[i].hasActiveProjects = 'Yes';
                    } else {
                        totalCountItems.activeProjects.no++;
						data[i].hasActiveProjects = 'No';
                    }
                }
            }

            // callback for services
            var callbackFunction = function(response){
                $scope.members.arr = response.data;
				$scope.membersLoading = false;
                insertData(response.data);
            };

            var responseData = function(){
                var data = {
                    _limit : $scope.memberPageSize,
                    _start : ($scope.memberCurrentPage-1) * $scope.memberPageSize,
                    name_like : $scope.searchModel
                };
                if(angular.isDefined($stateParams.tier)) data._tier = $stateParams.tier
                if(angular.isDefined($stateParams.type)) data._type = $stateParams.type;
                if(angular.isDefined($stateParams.activeProjects)) data._activeProjects = $stateParams.activeProjects;

                return data;
            };

            $scope.getDMDIIMembers = function(){
                loadingData(true);
                console.log('here')
                ajax.get(dataFactory.getDMDIIMember().all, responseData(), callbackFunction);
            };
            $scope.getDMDIIMembers();

            var getMenu = function(){

                var getUrl = function(cat, subcat){
                    var dataSearch = $.extend(true, {}, $stateParams);
                    dataSearch[cat] = subcat;
                    return 'member-directory.php' + $state.href('member_directory', dataSearch);
                };

                var isOpened = function(cat, subcat){
                    if (cat) {
                        return (!subcat || $stateParams[cat] === subcat ? true : false);
                    } else {
                        return false;
                    }
                };

                return {
                    title: 'BROWSE BY',
                    data: [
                        {
                            'id': 1,
                            'title': 'Tier',
                            'tag' : 'tier',
                            'opened' : isOpened('tier'),
                            'href' : getUrl('tier', null),
                            'categories': [
                                {
                                    'id': 11,
                                    'title': 'One',
                                    'tag' : 'one',
                                    'items': totalCountItems.tier.one,
                                    'opened' : isOpened('tier', 'one'),
                                    'href' : getUrl('tier', 'one'),
                                    'categories': []
                                },
                                {
                                    'id': 12,
                                    'title': 'Two',
                                    'tag' : 'two',
                                    'items': totalCountItems.tier.two,
                                    'opened' : isOpened('tier', 'two'),
                                    'href' : getUrl('tier', 'two'),
                                    'categories': []
                                }
                            ]
                        },
                        {
                            'id': 2,
                            'title': 'Type',
                            'tag' : 'type',
                            'opened' : isOpened('type'),
                            'href' : getUrl('type', null),
                            'categories': [
                                {
                                    'id': 21,
                                    'title': 'Academic',
                                    'tag' : 'academic',
                                    'items': totalCountItems.type.academic,
                                    'opened' : isOpened('type', 'academic'),
                                    'href' : getUrl('type', 'academic'),
                                    'categories': []
                                },
                                {
                                    'id': 22,
                                    'title': 'Government',
                                    'tag' : 'government',
                                    'items': totalCountItems.type.government,
                                    'opened' : isOpened('type', 'government'),
                                    'href' : getUrl('type', 'government'),
                                    'categories': []
                                },
                                {
                                    'id': 23,
                                    'title': 'Industry',
                                    'tag' : 'industry',
                                    'items': totalCountItems.type.industry,
                                    'opened' : isOpened('type', 'industry'),
                                    'href' : getUrl('type', 'industry'),
                                    'categories': []
                                }
                            ]
                        },
                        {
                            'id': 3,
                            'title': 'Active Projects',
                            'tag' : 'activeProjects',
                            'opened' : isOpened('activeProjects'),
                            'href' : getUrl('activeProjects', null),
                            'categories': [
                                {
                                    'id': 31,
                                    'title': 'Yes',
                                    'tag' : 'yes',
                                    'items': totalCountItems.activeProjects.yes,
                                    'opened' : isOpened('activeProjects', 'yes'),
                                    'href' : getUrl('activeProjects', 'yes'),
                                    'categories': []
                                },
                                {
                                    'id': 32,
                                    'title': 'No',
                                    'tag' : 'no',
                                    'items': totalCountItems.activeProjects.no,
                                    'opened' : isOpened('activeProjects', 'no'),
                                    'href' : getUrl('activeProjects', 'no'),
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
