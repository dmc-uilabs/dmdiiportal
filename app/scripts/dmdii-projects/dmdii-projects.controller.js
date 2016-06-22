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
            $scope.dmdiiProjectCurrentPage = 1;  // current page in dmdiiProject-directory
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
                return $scope.dmdiiProjectCurrentPage !== 1;
            };

            $scope.hasNext = function() {
                return $scope.dmdiiProjectCurrentPage !== Math.ceil($scope.totalRecords / $scope.dmdiiProjectPageSize);
            };

            $scope.events= [
                {
                    'date':'2016-06-13',
                    'content':'<p>lorem ipsum</p>'
                },
                {
                    'date':'2016-06-27',
                    'content':'<p>lorem ipsum</p>'
                }
            ]
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
                status:
                    {
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
                console.log(data)
                for (var i in data){
                    totalCountItems.all++;
                    if (data[i].dmdiiProjectStatus.statusName === 'Preaward') {
                        totalCountItems.status.preaward++;
                    } else if(data[i].dmdiiProjectStatus.statusName === 'Awarded'){
                        totalCountItems.status.awarded++;
                    } else if(data[i].dmdiiProjectStatus.statusName === 'Completed'){
                        totalCountItems.status.completed++;
                    }
                }
                $scope.treeMenuModel = getMenu();

            }

            // callback
            var callbackFunction = function(response){
                console.log(response.data)
                $scope.projects.arr = response.data;
                $scope.dmdiiProjectsLoading = false;
                $scope.totalRecords = response.totalRecords;
                insertData(response.data);
            };

            var responseData = function(){
                var data = {
                    pageSize : $scope.dmdiiProjectPageSize,
                    page : $scope.dmdiiProjectCurrentPage
                    // _order: $scope.sortBy,
                    // _sort: $scope.sortDir,
                    // name_like : $scope.searchModel
                };
                if(angular.isDefined($stateParams.status)) data.status = $stateParams.status;

                return data;
            };

            $scope.getDmdiiProjects = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIProject(responseData()), null, callbackFunction);
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
                    dataSearch[cat] = subcat;
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
                                    'items': totalCountItems.status[1],
                                    'opened' : isOpened('status', '1'),
                                    'href' : getUrl('status', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 12,
                                    'title': 'Awarded',
                                    'tag' : '2',
                                    'items': totalCountItems.status[2],
                                    'opened' : isOpened('status', '2'),
                                    'href' : getUrl('status', '2'),
                                    'categories': []
                                },
								{
                                    'id': 13,
                                    'title': 'Completed',
                                    'tag' : '3',
                                    'items': totalCountItems.status[3],
                                    'opened' : isOpened('status', '3'),
                                    'href' : getUrl('status', '3'),
                                    'categories': []
                                }
                            ]
                        },
                        {
                            'id': 20,
                            'title': 'Focus Area',
                            'tag' : 'focus',
                            'opened' : isOpened('focus'),
                            'href' : getUrl('focus', null),
                            'categories': [
                                {
                                    'id': 21,
                                    'title': 'Model-Based Design/Enterprise',
                                    'tag' : '1',
                                    'items': totalCountItems.focus[1],
                                    'opened' : isOpened('focus', '1'),
                                    'href' : getUrl('focus', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 22,
                                    'title': 'Manufacturing Process',
                                    'tag' : '2',
                                    'items': totalCountItems.focus[2],
                                    'opened' : isOpened('focus', '2'),
                                    'href' : getUrl('focus', '2'),
                                    'categories': []
                                },
                                {
                                    'id': 23,
                                    'title': 'Sensors & Metrology',
                                    'tag' : '3',
                                    'items': totalCountItems.focus[3],
                                    'opened' : isOpened('focus', '3'),
                                    'href' : getUrl('focus', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 24,
                                    'title': 'Product Lifecycle Management',
                                    'tag' : '4',
                                    'items': totalCountItems.focus[4],
                                    'opened' : isOpened('focus', '4'),
                                    'href' : getUrl('focus', '4'),
                                    'categories': []
                                },
                                {
                                    'id': 25,
                                    'title': 'Other',
                                    'tag' : '5',
                                    'items': totalCountItems.focus[5],
                                    'opened' : isOpened('focus', '5'),
                                    'href' : getUrl('focus', '5'),
                                    'categories': []
                                }
                            ]
                        },
                        {
                            'id': 30,
                            'title': 'Thrust Area',
                            'tag' : 'thrust',
                            'opened' : isOpened('thrust'),
                            'href' : getUrl('thrust', null),
                            'categories': [
                                {
                                    'id': 33,
                                    'title': 'Advanced Analysis',
                                    'tag' : '3',
                                    'items': totalCountItems.thrust[3],
                                    'opened' : isOpened('thrust', '3'),
                                    'href' : getUrl('thrust', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 31,
                                    'title': 'Advanced Manufacturing Enterprise',
                                    'tag' : '1',
                                    'items': totalCountItems.thrust[1],
                                    'opened' : isOpened('thrust', '1'),
                                    'href' : getUrl('thrust', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 34,
                                    'title': 'Cybersecurity',
                                    'tag' : '4',
                                    'items': totalCountItems.thrust[4],
                                    'opened' : isOpened('thrust', '4'),
                                    'href' : getUrl('thrust', '4'),
                                    'categories': []
                                },
                                {
                                    'id': 32,
                                    'title': 'Intelligent Machining',
                                    'tag' : '2',
                                    'items': totalCountItems.thrust[2],
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
