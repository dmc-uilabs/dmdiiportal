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
            $scope.memberPageSize = $cookies.get('memberPageSize') ? +$cookies.get('memberPageSize') : 12;    // visible items in member-directory
            $scope.memberCurrentPage = 1;  // current page in member-directory
            // catch updated changedPage variable form $cookies
            // variable changed in member-directory when user change page number (pagination)
            $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
                if(newValue && $scope.memberCurrentPage !== newValue) {
                    $scope.memberCurrentPage = newValue; // save new page number
                    $scope.getDMDIIMembers();
                }
            });


            $scope.showArray = [
                {
                    id : 1, val:12, name: '12 items'
                },
                {
                    id : 2, val:24, name: '24 items'
                },
                {
                    id : 3, val:48, name: '48 items'
                },
                {
                    id : 4, val:96, name: '96 items'
                }
            ];

            $scope.sizeModule = 0;
            for(var i in $scope.showArray){
                if($scope.showArray[i].val === $scope.memberPageSize){
                    $scope.sizeModule = i;
                    break;
                }
            }

            $scope.selectItemDropDown = function(){
                if($scope.sizeModule != 0) {
                    var item = $scope.showArray[$scope.sizeModule];
                    $scope.updatePageSize(item.val);
                    $scope.showArray.splice($scope.sizeModule, 1);
                    $scope.showArray = $scope.showArray.sort(function(a,b){return a.id - b.id});
                    if ($scope.showArray.unshift(item)) $scope.sizeModule = 0;
                }
            };

            $scope.$watch('sort', function() {
                if (!$scope.sort) {
                    return;
                }
                if ($scope.sort.charAt(0) === '-') {
                    $scope.sortDir = 'desc';
                    $scope.sortBy =  $scope.sort.substr(1);
                } else {
                    $scope.sortDir = 'asc';
                    $scope.sortBy = $scope.sort;
                }
                $scope.getDMDIIMembers();
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

            var totalCountItems = {
                all: 0, tier: { one: 0, two: 0 }, type: { industry: 0, government: 0, academic: 0, nonprofit: 0 }, activeProjects: { yes: 0, no: 0 }
            };

            // insert response data to array of marketplace items
            var insertData = function(data){
                totalCountItems = {
                    all: 0, tier: { one: 0, two: 0 }, type: { industry: 0, government: 0, academic: 0, nonprofit: 0 }, activeProjects: { yes: 0, no: 0 }
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
                $scope.treeMenuModel = getMenu();
            }

            // callback for services
            var callbackFunction = function(response){
                $scope.members.arr = response.data;
				$scope.membersLoading = false;
                insertData(response.data);
            };

            var responseData = function(){
                var data = {
                    pageSize : $scope.memberPageSize,
                    page : $scope.memberCurrentPage
                    // _order: $scope.sortDir,
                    // _sort: $scope.sortBy,
                    // name_like : $scope.searchModel
                };
                if(angular.isDefined($stateParams.tier)) data.tier = $stateParams.tier
                if(angular.isDefined($stateParams.type)) data.categoryId = $stateParams.type;
                if(angular.isDefined($stateParams.activeProjects)) data.activeProjects = $stateParams.activeProjects;

                return data;
            };

            $scope.getDMDIIMembers = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIMember(responseData()), null, callbackFunction);
            };
            $scope.getDMDIIMembers();


            $scope.getNext = function() {
                $scope.memberCurrentPage++;
                $scope.getDMDIIMembers();
            }

            $scope.getPrev = function() {
                $scope.memberCurrentPage--;
                $scope.getDMDIIMembers();
            }

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
                                    'tag' : '1',
                                    'items': totalCountItems.tier.one,
                                    'opened' : isOpened('tier', '1'),
                                    'href' : getUrl('tier', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 12,
                                    'title': 'Two',
                                    'tag' : '2',
                                    'items': totalCountItems.tier.two,
                                    'opened' : isOpened('tier', '2'),
                                    'href' : getUrl('tier', '2'),
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
                                    'tag' : '2',
                                    'items': totalCountItems.type.academic,
                                    'opened' : isOpened('type', '2'),
                                    'href' : getUrl('type', '2'),
                                    'categories': []
                                },
                                {
                                    'id': 22,
                                    'title': 'Government',
                                    'tag' : '3',
                                    'items': totalCountItems.type.government,
                                    'opened' : isOpened('type', '3'),
                                    'href' : getUrl('type', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 23,
                                    'title': 'Industry',
                                    'tag' : '1',
                                    'items': totalCountItems.type.industry,
                                    'opened' : isOpened('type', '1'),
                                    'href' : getUrl('type', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 24,
                                    'title': 'Non-Profit',
                                    'tag' : '4',
                                    'items': totalCountItems.type.nonprofit,
                                    'opened' : isOpened('type', '4'),
                                    'href' : getUrl('type', '4'),
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
