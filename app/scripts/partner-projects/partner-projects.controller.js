'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.partnerprojects')
    .controller('DMCPartnerProjectsController',[
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

            $scope.partnerProjectsLoading = true;

            // This code use for partnerProject-directory -------------------------------------------------
            $scope.downloadData = false;        // on/off progress line in partnerProject-directory
            $scope.partnerProjectPageSize = $cookies.get('partnerProjectPageSize') ? $cookies.get('partnerProjectPageSize') : 12;    // visible items in partnerProject-directory
            $scope.partnerProjectCurrentPage = 1;  // current page in partnerProject-directory
            // catch updated changedPage variable form $cookies
            // variable changed in partnerProject-directory when user change page number (pagination)
            $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
                if(newValue && $scope.partnerProjectCurrentPage !== newValue) {
                    $scope.partnerProjectCurrentPage = newValue; // save new page number
                    $scope.getPartnerProjects();
                }
            });
            // if partnerProjectPageSize changed
            $scope.$watch('partnerProjectPageSize', function(newValue, oldValue) {
                if (newValue !== oldValue){ // if get another value
                    $cookies.put('partnerProjectPageSize', newValue);
                    $scope.getPartnerProjects();
                    apply();
                }
            }, true);
            // -----------------------------------------------------------------------------------

            $scope.updatePageSize = function(pageSize){
                $scope.partnerProjectPageSize = pageSize;
            };

            $scope.hasPrev = function() {
                return $scope.partnerProjectCurrentPage !== 1;
            };

            $scope.hasNext = function() {
                return $scope.partnerProjectCurrentPage !== Math.ceil($scope.totalRecords / $scope.partnerProjectPageSize);
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
                ajax.get(dataFactory.searchPartnerProjects(text), responseData, callbackFunction);
            };

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };
// $scope.fakeRes = [
//     {
//         name: 'Awarded project',
//         description: 'The goal of the project is to allow companies to share data',
//         status: 'awarded'
//     },
//     {
//         name: 'Completed project',
//         description: 'The goal of the project is to allow companies to share data',
//         status: 'completed'
//     },
//     {
//         name: 'PreAward project',
//         description: 'The goal of the project is to allow companies to share data',
//         status: 'pre award'
//     }
// ]
            $scope.projects = {arr : [], count : 0};

            $scope.column = 'name';
            $scope.reverse = false;
            $scope.sort = function(column) {
              $scope.reverse = ($scope.column === column) ? !$scope.reverse : false;
              $scope.column = column;
            };

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
                    if (data[i].status === 'preaward') {
                        totalCountItems.status.preaward++;
                    } else if(data[i].status === 'awarded'){
                        totalCountItems.status.awarded++;
                    } else if(data[i].status === 'completed'){
                        totalCountItems.status.completed++;
                    }
                }
            }

            // callback
            var callbackFunction = function(response){
                $scope.projects.arr = response.data;
                insertData(response.data);
                $scope.totalRecords = response.totalRecords;
            };

            var responseData = function(){
                var data = {
                    _limit : $scope.partnerProjectPageSize,
                    _start : ($scope.partnerProjectCurrentPage-1) * $scope.partnerProjectPageSize,
                    name_like : $scope.searchModel
                };
                if(angular.isDefined($stateParams.status)) data._status = $stateParams.status;

                return data;
            };

            $scope.getPartnerProjects = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIProject().all, responseData(), callbackFunction);
            };
            $scope.getPartnerProjects();
            var getMenu = function(){

                var getUrl = function(cat, subcat){
                    var dataSearch = $.extend(true, {}, $stateParams);
                    dataSearch[cat] = subcat;
                    return 'partnerProject-directory.php' + $state.href('partnerProject_directory', dataSearch);
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
                            'href' : getUrl('statuus', null),
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
