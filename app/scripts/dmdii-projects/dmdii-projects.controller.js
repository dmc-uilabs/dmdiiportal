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
                all: 0, status: { preaward: 0, awarded: 0, completed: 0 }
            };

            // insert response data to array of marketplace items
            var insertData = function(data){
                totalCountItems = {
					all: 0, status: { preaward: 0, awarded: 0, completed: 0 }
                };
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
                $scope.projects.arr = response.data;
                $scope.dmdiiProjectsLoading = false;
                $scope.totalRecords = response.totalRecords;
                insertData(response.data);
            };

            var responseData = function(){
                var data = {
                    _limit : $scope.dmdiiProjectPageSize,
                    _start : ($scope.dmdiiProjectCurrentPage-1) * $scope.dmdiiProjectPageSize,
                    _order_by: $scope.sortBy,
                    _sort_dir:$scope.sortDir,
                    name_like : $scope.searchModel
                };
                if(angular.isDefined($stateParams.status)) data._status = $stateParams.status;

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
                                    'tag' : 'preaward',
                                    'items': totalCountItems.status.preaward,
                                    'opened' : isOpened('status', 'preaward'),
                                    'href' : getUrl('status', 'preaward'),
                                    'categories': []
                                },
                                {
                                    'id': 12,
                                    'title': 'Awarded',
                                    'tag' : 'awarded',
                                    'items': totalCountItems.status.awarded,
                                    'opened' : isOpened('status', 'awarded'),
                                    'href' : getUrl('status', 'awarded'),
                                    'categories': []
                                },
								{
                                    'id': 13,
                                    'title': 'Completed',
                                    'tag' : 'completed',
                                    'items': totalCountItems.status.completed,
                                    'opened' : isOpened('status', 'completed'),
                                    'href' : getUrl('status', 'completed'),
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
