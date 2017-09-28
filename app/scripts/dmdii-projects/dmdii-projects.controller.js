'use strict';

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
            $scope.startDate.setDate(1);
            $scope.startDate.setMonth($scope.startDate.getMonth()-4);

            var year = $scope.startDate.getFullYear();
            var month = $scope.startDate.getMonth() + 1;
            month = (month < 10) ? '0' + month : month;
            var day = $scope.startDate.getDate();
            day = (day < 10) ? '0' + day : day;

            $scope.startDate = year + '-' + month + '-' + day;

            $scope.endDate = new Date();
            $scope.endDate.setMonth($scope.endDate.getMonth()+9);
            $scope.endDate.setDate(0);

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
                ajax.get(dataFactory.getDMDIIDocuments().overview, {}, function(response)  {
                    $scope.projectOverview = response.data;
                });

                ajax.get(dataFactory.getDMDIIDocuments().status, {}, function(response)  {
                    $scope.projectStatus = response.data;
                });
            }
            $scope.getProjectStaticImages();

            $scope.selectItemDropDown = function(showIndex){
                if($scope.sizeModule != showIndex) {
                    $scope.sizeModule = showIndex
                    var item = $scope.showArray[$scope.sizeModule];
                    $scope.updatePageSize(item.val);
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
                return $scope.projects.count && $scope.dmdiiProjectCurrentPage !== Math.ceil($scope.projects.count / $scope.dmdiiProjectPageSize) - 1;
            };

            var eventsCallbackFunction = function(response) {
                $scope.events = [];
                angular.forEach(response.data, function(event) {
                    if(moment(event.eventDate).isBefore(moment($scope.startDate)) || moment(event.eventDate).isAfter(moment($scope.endDate))){
                        return;
                    }
                    var e = {
                        id: event.id,
                        date: event.eventDate,
                        content: {
                          name: event.eventName,
                          date: moment(event.eventDate).format("MMMM DD, YYYY"),
                          description: event.eventDescription
                        }
                    }
                    $scope.events.push(e);
                });
            }
            $scope.getEvents = function(){
                ajax.get(dataFactory.dmdiiProjectEventUrl().get, {limit: 10000}, eventsCallbackFunction);
            };
            $scope.getEvents();

            var newsCallbackFunction = function(response) {
                $scope.news = response.data;
            }

            $scope.getNews = function(){
                ajax.get(dataFactory.dmdiiProjectNewsUrl().get, {limit: 3}, newsCallbackFunction);
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
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
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

                for (var i=0; i<$scope.projects.arr.length; i++) {
                  if(($scope.projects.arr[i].dmdiiFunding == 5983) && ($scope.projects.arr[i].costShare == 8395)){
                    $scope.projects.arr[i].kind='dmdiiEvent'
                  }else{
                    $scope.projects.arr[i].kind='dmdiiProject'
                  }
                }

                $scope.dmdiiProjectsLoading = false;
                // var numberProjects=$scope.projects.arr.length;
                // $scope.randProjectId = Math.floor(Math.random()*numberProjects);
                // $scope.randProject = $scope.projects.arr[$scope.randProjectId];
                // $scope.randProject.projectSummary = truncateText($scope.randProject.projectSummary, 350);

                // insertData(response.data);
            };

            var truncateText = function(text,length) {
              if (text.length > length) {
                return text.substring(0, length)+"...";
              } else {
                return text;
              }
            }

            var responseData = function(){
                var data = {
                    pageSize : $scope.dmdiiProjectPageSize,
                    page : $scope.dmdiiProjectCurrentPage,
                    // _order: $scope.sortBy,
                    // _sort: $scope.sortDir,
                    title: $scope.searchModel
                };

                for (var filter in $scope.treeMenuModel){
                  var params = [];
                  for (var category in $scope.treeMenuModel[filter].categories){
                    if($scope.treeMenuModel[filter].categories[category].selected){
                      params.push($scope.treeMenuModel[filter].categories[category].id);
                    }
                  }
                  data[$scope.treeMenuModel[filter].queryString] = params;
                }

                return data;
            };

            var $myGroup = $('#portalDropdowns');
            $myGroup.on('show.bs.collapse','.collapse', function() {
                $myGroup.find('.collapse.in').collapse('hide');
            });


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
                ajax.get(dataFactory.quicklinkUrl().get, {limit: 7}, callbackLinksFunction)
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

            $scope.deleteNews = function(index, id) {
                ajax.delete(dataFactory.dmdiiProjectNewsUrl(id).delete, {}, function() {
                    $scope.news.splice(index, 1);
                });
            };

            $scope.deleteQuicklink = function(index, id) {
                ajax.delete(dataFactory.quicklinkUrl(id).delete, {}, function() {
                    $scope.docs.splice(index, 1);
                });
            };

            $scope.deleteDocument = function(id, type) {
                ajax.delete(dataFactory.deleteDMDIIDocument(id), {}, function() {
                    delete $scope[type];
                });
            };

            $scope.$watch('treeMenuModel', function() {
                $scope.getDmdiiProjects();
            }, true);

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

                return [
                          {
                            'id': 1,
                            'title': 'Status',
                            'queryString': 'status',
                            'categories': [
                                {
                                    'id': 1,
                                    'title': 'Pre-Awarded',
                                },
                                {
                                    'id': 2,
                                    'title': 'Awarded',
                                },
                                {
                                    'id': 3,
                                    'title': 'Completed',
                                }
                            ]
                          },
                          {
                            'id': 2,
                            'title': 'Focus',
                            'queryString': 'focusId',
                            'categories': [
                                {
                                    'id': 1,
                                    'title': 'Model-Based Design/Enterprise',
                                },
                                {
                                    'id': 2,
                                    'title': 'Manufacturing Process',
                                },
                                {
                                    'id': 3,
                                    'title': 'Sesnors & Metrology',
                                },
                                {
                                    'id': 4,
                                    'title': 'Supply Chain Management',
                                },
                                {
                                    'id': 5,
                                    'title': 'Product Lifecycle Management',
                                },
                                {
                                    'id': 6,
                                    'title': 'Other',
                                },
                                {
                                    'id': 7,
                                    'title': 'Cyber Security',
                                }
                              ]
                          },
                          {
                            'id': 3,
                            'title': 'Thrust Area',
                            'queryString': 'thrustId',
                            'categories': [
                              {
                                  'id': 3,
                                  'title': 'Advanced Analysis',
                              },
                              {
                                  'id': 1,
                                  'title': 'Advanced Manufacturing Enterprise',
                              },
                              {
                                  'id': 2,
                                  'title': 'Intelligent Machining',
                              },
                              {
                                  'id': 4,
                                  'title': 'Adaptive Vehicle Make',
                              },
                              {
                                  'id': 5,
                                  'title': 'Digital Manufacturing Commons',
                              },
                              {
                                  'id': 6,
                                  'title': 'Cost Systems',
                              },
                              {
                                  'id': 7,
                                  'title': 'Design - Process/Product Development - Systems Engineering',
                              },
                              {
                                  'id': 8,
                                  'title': 'Future Factory',
                              },
                              {
                                  'id': 9,
                                  'title': 'Agile Resilient Supply Chain',
                              },
                              {
                                  'id': 10,
                                  'title': 'Cyber Security in Manufacturing',
                              }
                            ]
                          }
                      ];
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
