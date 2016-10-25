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
        '$showdown',
        'ajax',
        'dataFactory',
        'socketFactory',
        '$location',
        'is_search',
        'DMCUserModel',
        '$mdDialog',
        '$window',
        function($state,
                 $stateParams,
                 $scope,
                 $rootScope,
                 $cookies,
                 $showdown,
                 ajax,
                 dataFactory,
                 socketFactory,
                 $location,
                 is_search,
                 DMCUserModel,
                 $mdDialog,
                 $window){

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
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

            $scope.startDate = new Date();
            $scope.startDate.setMonth($scope.startDate.getMonth()-4);

            var year = $scope.startDate.getFullYear();
            var month = $scope.startDate.getMonth() + 1;
            month = (month < 10) ? '0' + month : month;
            var day = $scope.startDate.getDate();
            day = (day < 10) ? '0' + day : day;

            $scope.startDate = year + '-' + month + '-' + day;

            $scope.endDate = new Date();
            $scope.endDate.setMonth($scope.endDate.getMonth()+4);

            var year = $scope.endDate.getFullYear();
            var month = $scope.endDate.getMonth() + 1;
            month = (month < 10) ? '0' + month : month;
            var day = $scope.endDate.getDate();
            day = (day < 10) ? '0' + day : day;

            $scope.endDate = year + '-' + month + '-' + day;

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

            $scope.getProjectStaticImages = function() {
                ajax.get(dataFactory.documentsURL().getList, {
                    docClass: 'OVERVIEW',
                    recent: 1
                }, function(response)  {
                    $scope.projectOverview = response.data.count>0 ? response.data.data[0]:{};
                });

                ajax.get(dataFactory.documentsURL().getList, {
                    docClass: 'STATUS',
                    recent: 1
                }, function(response)  {
                    $scope.projectStatus = response.data.count>0 ? response.data.data[0]:{};
                });
            }
            $scope.getProjectStaticImages();

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
                return $scope.dmdiiProjectCurrentPage !== Math.ceil($scope.projects.count / $scope.dmdiiProjectPageSize) - 1;
            };

            var eventsCallbackFunction = function(response) {
                $scope.events = [];
                angular.forEach(response.data, function(event) {
                    var e = {
                        date: event.eventDate,
                        content: '<h3>' + event.eventName + '</h3>' +
                            $showdown.makeHtml(event.eventDescription)
                    }
                    $scope.events.push(e);
                });
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
                if (angular.isDefined(response.data.count)) {
                    $scope.projects.arr = response.data.data;
                    $scope.projects.count = response.data.count;
                } else {
                    $scope.projects.arr = response.data;
                }
                $scope.dmdiiProjectsLoading = false;
                // insertData(response.data);
            };

            var responseData = function(){
                var data = {
                    pageSize : $scope.dmdiiProjectPageSize,
                    page : $scope.dmdiiProjectCurrentPage,
                    // _order: $scope.sortBy,
                    // _sort: $scope.sortDir,
                    title: $scope.searchModel
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

                if (!angular.isDefined($scope.searchModel)) {
                    ajax.get(dataFactory.getDMDIIProject().all, responseData(), callbackFunction);
                } else {
                    ajax.get(dataFactory.getDMDIIProject().search, responseData(), callbackFunction);
                }
            };
            $scope.getDmdiiProjects();

            $scope.submit = function(text){
                $scope.dmdiiProjectCurrentPage = 0;
                // $stateParams.title = text;
                loadingData(true);
                ajax.get(dataFactory.getDMDIIProject().search, responseData(), callbackFunction);
            };

            $scope.getNext = function() {
                $scope.dmdiiProjectCurrentPage++;
                $scope.getDmdiiProjects();
            }

            $scope.getPrev = function() {
                $scope.dmdiiProjectCurrentPage--;
                $scope.getDmdiiProjects();
            }

            $scope.docs = [];

            var callbackLinksFunction = function(response) {
                $scope.docs = response.data;
            }

            $scope.getQuickLinks = function() {
                ajax.get(dataFactory.getQuickLinks().all, {limit: 7}, callbackLinksFunction)
            }
            $scope.getQuickLinks();

            $scope.showModalQuickLink = function(doc){
                $mdDialog.show({
                    controller: 'QuickDocController',
                    templateUrl: 'templates/dmdii-projects/quick-doc.html',
                    parent: angular.element(document.body),
                    locals: {
                       doc: doc
                },
                    clickOutsideToClose: true
                });
            }

            $scope.quickLinkAction = function(doc) {
                if (angular.isDefined(doc.text) && doc.text !== null) {
                    $scope.showModalQuickLink(doc);
                }
                if (angular.isDefined(doc.link) && doc.link !== null) {
                    $window.open(doc.link);
                }
                if (angular.isDefined(doc.doc) && doc.doc !== null) {
                    ajax.get(dataFactory.getDMDIIDocuments(doc.doc.id).single, {}, function(response) {
                        $window.open(response.data.documentUrl);
                    })
                }
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
                            'tag' : 'thrustId',
                            'opened' : isOpened('thrustId'),
                            'href' : getUrl('thrustId', null),
                            'categories': [
                                {
                                    'id': 33,
                                    'title': 'Advanced Analysis',
                                    'tag' : '3',
                                    'opened' : isOpened('thrustId', '3'),
                                    'href' : getUrl('thrustId', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 31,
                                    'title': 'Advanced Manufacturing Enterprise',
                                    'tag' : '1',
                                    'opened' : isOpened('thrustId', '1'),
                                    'href' : getUrl('thrustId', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 32,
                                    'title': 'Intelligent Machining',
                                    'tag' : '2',
                                    'opened' : isOpened('thrustId', '2'),
                                    'href' : getUrl('thrustId', '2'),
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
).filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });
