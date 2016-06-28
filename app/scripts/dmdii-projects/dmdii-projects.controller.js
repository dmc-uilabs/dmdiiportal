'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiProjects')
    .controller('DMCDmdiiProjectsController',[
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

            $scope.dmdiiProjectsLoading = true;
            // This code use for dmdiiProject-directory -------------------------------------------------
            $scope.downloadData = false;        // on/off progress line in dmdiiProject-directory
            $scope.dmdiiProjectPageSize = $cookies.get('dmdiiProjectPageSize') ? +$cookies.get('dmdiiProjectPageSize') : 12;    // visible items in dmdiiProject-directory
            $scope.dmdiiProjectCurrentPage = 0;  // current page in dmdiiProject-directory
            // catch updated changedPage variable form $cookies
            // variable changed in dmdiiProject-directory when user change page number (pagination)
            $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
                if(newValue && $scope.dmdiiProjectCurrentPage !== newValue) {
                    $scope.dmdiiProjectCurrentPage = newValue; // save new page number
                    $scope.getDmdiiProjects();
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
                if($scope.showArray[i].val === $scope.pageSize){
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
                $scope.getDmdiiProjects();
            });

            // if dmdiiProjectPageSize changed
            $scope.$watch('dmdiiProjectPageSize', function(newValue, oldValue) {
                if (newValue !== oldValue){ // if get another value
                    $cookies.put('dmdiiProjectPageSize', newValue);
                    $scope.getDmdiiProjects();
                    apply();
                }
            }, true);
            // -----------------------------------------------------------------------------------

            $scope.updatePageSize = function(pageSize){
                $scope.dmdiiProjectPageSize = pageSize;
            };

            $scope.hasPrev = function() {
                return $scope.dmdiiProjectCurrentPage !== 0;
            };

            $scope.hasNext = function() {
                return $scope.dmdiiProjectCurrentPage !== Math.ceil($scope.projects.count / $scope.dmdiiProjectPageSize);
            };

            var eventsCallbackFunction = function(response) {
                $scope.events = response.data;
            }
            $scope.getEvents = function(){
                ajax.get(dataFactory.getDMDIIProject().events, {limit: 3}, eventsCallbackFunction);
            };
            $scope.getEvents();

            var newsCallbackFunction = function(response) {
                $scope.news = response.data;
            }

            $scope.getNews = function(){
                ajax.get(dataFactory.getDMDIIProject().news, {limit: 3}, newsCallbackFunction);
            };
            $scope.getNews();

            var responseData = {
                _sort : 'id',
                _order : 'DESC'
            };

            $scope.submit = function(text){
                $stateParams.text = text;
                $state.go('project_search', dataSearch, {reload: true});
                if(!$window.apiUrl){
                    responseData.name_like = text;
                }else{
                    delete responseData.name_like;
                }
                loadingData(true);
                ajax.get(dataFactory.searchDmdiiProjects(text), responseData, callbackFunction);
            };

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };

            $scope.projects = {arr : [], count : 0};

            var totalCountItems = {
                all: 0,
                status: {
                    1: 0,
                    2: 0,
                    3: 0
                },
                focus: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                },
                thrust: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0
                }
            };

            // insert response data to array of marketplace items
            var insertData = function(data){
                totalCountItems = {
					all: 0,
                    status: {
                        1: 0,
                        2: 0,
                        3: 0
                    },
                    focus: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0
                    },
                    thrust: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0
                    }
                };


                $scope.treeMenuModel = getMenu();

            }

            // callback
            var callbackFunction = function(response){
                if (response.data.count) {
                    $scope.projects.arr = response.data.data;
                    $scope.projects.count = response.totalRecords;
                } else {
                    $scope.projects.arr = response.data;
                }
                $scope.dmdiiProjectsLoading = false;
                insertData(response.data);
            };

            var responseData = function(){
                var data = {
                    pageSize : $scope.dmdiiProjectPageSize,
                    page : $scope.dmdiiProjectCurrentPage,
                    _order: $scope.sortBy,
                    _sort: $scope.sortDir,
                    name_like : $scope.searchModel
                };
                if(angular.isDefined($stateParams.status)) data.statusId = $stateParams.status;
                if(angular.isDefined($stateParams.callNumber)) data.callNumber = $stateParams.callNumber;
                if(angular.isDefined($stateParams.rootNumber)) data.rootNumber = $stateParams.rootNumber;
                if(angular.isDefined($stateParams.focusId)) data.focusId = $stateParams.focusId;
                if(angular.isDefined($stateParams.thrustId)) data.thrustId = $stateParams.thrustId;

                return data;
            };

            $scope.getDmdiiProjects = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIProject().all, responseData(), callbackFunction);
            };
            $scope.getDmdiiProjects();

            $scope.getNext = function() {
                $scope.dmdiiProjectCurrentPage++;
                $scope.getDmdiiProjects();
            }

            $scope.getPrev = function() {
                $scope.dmdiiProjectCurrentPage--;
                $scope.getDmdiiProjects();
            }
            var getMenu = function(){

                var getUrl = function(cat, subcat){
                    var dataSearch = $.extend(true, {}, $stateParams);
                    return 'dmdii-projects.php' + $state.href('dmdii_projects', dataSearch);
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
                            'title': 'Status',
                            'tag' : 'status',
                            'opened' : isOpened('status'),
                            'href' : getUrl('status', null),
                            'categories': [
                                {
                                    'id': 11,
                                    'title': 'Pre Award',
                                    'tag' : '1',
                                    'opened' : isOpened('status', '1'),
                                    'href' : getUrl('status', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 12,
                                    'title': 'Awarded',
                                    'tag' : '2',
                                    'opened' : isOpened('status', '2'),
                                    'href' : getUrl('status', '2'),
                                    'categories': []
                                },
								{
                                    'id': 13,
                                    'title': 'Completed',
                                    'tag' : '3',
                                    'opened' : isOpened('status', '3'),
                                    'href' : getUrl('status', '3'),
                                    'categories': []
                                }
                            ]
                        },
                        {
                            'id': 2,
                            'title': 'Focus',
                            'tag' : 'focusId',
                            'opened' : isOpened('focusId'),
                            'href' : getUrl('focusId', null),
                            'categories': [
                                {
                                    'id': 21,
                                    'title': 'Model-Based Design/Enterprise',
                                    'tag' : '1',
                                    'opened' : isOpened('focusId', '1'),
                                    'href' : getUrl('focusId', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 22,
                                    'title': 'Manufacturing Process',
                                    'tag' : '2',
                                    'opened' : isOpened('focusId', '2'),
                                    'href' : getUrl('focusId', '2'),
                                    'categories': []
                                },
                                {
                                    'id': 23,
                                    'title': 'Sensors & Metrology',
                                    'tag' : '3',
                                    'opened' : isOpened('focusId', '3'),
                                    'href' : getUrl('focusId', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 24,
                                    'title': 'Product Lifecycle Management',
                                    'tag' : '4',
                                    'opened' : isOpened('focusId', '4'),
                                    'href' : getUrl('focusId', '4'),
                                    'categories': []
                                },
                                {
                                    'id': 25,
                                    'title': 'Other',
                                    'tag' : '5',
                                    'opened' : isOpened('focusId', '5'),
                                    'href' : getUrl('focusId', '5'),
                                    'categories': []
                                }
                            ]
                        },
                        {
                            'id': 3,
                            'title': 'Thrust Area',
                            'tag' : 'thrust',
                            'opened' : isOpened('thrust'),
                            'href' : getUrl('thrust', null),
                            'categories': [
                                {
                                    'id': 33,
                                    'title': 'Advanced Analysis',
                                    'tag' : '3',
                                    'opened' : isOpened('thrust', '3'),
                                    'href' : getUrl('thrust', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 31,
                                    'title': 'Advanced Manufacturing Enterprise',
                                    'tag' : '1',
                                    'opened' : isOpened('thrust', '1'),
                                    'href' : getUrl('thrust', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 32,
                                    'title': 'Intelligent Machining',
                                    'tag' : '2',
                                    'opened' : isOpened('thrust', '2'),
                                    'href' : getUrl('thrust', '2'),
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
