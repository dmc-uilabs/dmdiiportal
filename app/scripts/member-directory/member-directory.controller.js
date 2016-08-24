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
                 $window){

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
            });

            $scope.membersLoading = true;


            // This code use for member-directory -------------------------------------------------
            $scope.downloadData = false;        // on/off progress line in member-directory
            $scope.memberPageSize = $cookies.get('memberPageSize') ? +$cookies.get('memberPageSize') : 12;    // visible items in member-directory
            $scope.memberCurrentPage = 0;  // current page in member-directory
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
                return $scope.memberCurrentPage !== 0;
            };

            $scope.hasNext = function() {
                return $scope.memberCurrentPage !== Math.ceil($scope.members.count / $scope.memberPageSize) - 1;
            };


            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };

            $scope.members = {arr : [], count : 0};

            // insert response data to array of marketplace items
            var insertData = function(data){
                $scope.membersByState = {};
                angular.forEach(data, function(member) {
                    if (!$scope.membersByState[member.organization.address.state]) {
                        $scope.membersByState[member.organization.address.state] =  [{name: member.organization.name, id: member.organization.id}];
                    } else {
                        $scope.membersByState[member.organization.address.state].push({name: member.organization.name, id: member.organization.id});
                    }
                });
            }

            $scope.options = {
                forceSixRows: true,
                trackSelectedDate: true
            }
            $scope.showCalendar = false;

            var eventsCallbackFunction = function(response) {
                $scope.events = response.data;
            }
            $scope.getEvents = function(){
                ajax.get(dataFactory.getDMDIIMember().events, {limit: 3}, eventsCallbackFunction);
            };
            $scope.getEvents();

            var newsCallbackFunction = function(response) {
                $scope.news = response.data;
            }
            $scope.getNews = function(){
                ajax.get(dataFactory.getDMDIIMember().news, {limit: 3}, newsCallbackFunction);
            };
            $scope.getNews();

            $scope.toggleCalendar = function() {
                if ($scope.showCalendar) {
                    $scope.showCalendar = false;
                } else {
                    $scope.showCalendar = true;
                }
            }

            $scope.eventClicked = function(event) {
                if (!$scope.showCalendar) {
                    $scope.showCalendar = true;
                }
                $(".is-selected").removeClass("is-selected");

                $(".calendar-day-"+event.date).addClass("is-selected");
                $scope.showEvents([event]);
            }
            $scope.dayClicked = function($event, day) {
                $(".is-selected").removeClass("is-selected");
                $($event.target).addClass("is-selected");
                $scope.showEvents(day.events)
            }

            $scope.showEvents = function(events) {
                $scope.dayEvents = events;
            }

            // callback for services
            var callbackFunction = function(response){
				$scope.membersLoading = false;
                if (angular.isDefined(response.data.count)) {
                    $scope.members.arr = response.data.data;
                    $scope.members.count = response.data.count;
                    insertData(response.data.data);
                } else {
                    $scope.members.arr = response.data;
                    insertData(response.data);
                }
                $scope.activeProjects = {};

                angular.forEach($scope.members.arr, function(member) {
                    ajax.get(dataFactory.getDMDIIProject().active, {dmdiiMemberId: member.id, page: 0, pageSize: 15}, function(response) {
                        console.log(response.data)
                        $scope.activeProjects[member.id] = response.data.data;
                    });
                });
            };

            var responseData = function(){
                var data = {
                    pageSize: $scope.memberPageSize,
                    page: $scope.memberCurrentPage,
                    // _order: $scope.sortDir,
                    // _sort: $scope.sortBy,
                    name: $scope.searchModel
                };
                if(angular.isDefined($stateParams.tier)) data.tier = $stateParams.tier
                if(angular.isDefined($stateParams.type)) data.categoryId = $stateParams.type;
                if(angular.isDefined($stateParams.activeProjects)) data.activeProjects = $stateParams.activeProjects;

                return data;
            };

            $scope.getDMDIIMembers = function(){
                loadingData(true);

                if (!angular.isDefined($scope.searchModel)) {
                    ajax.get(dataFactory.getDMDIIMember().all, responseData(), callbackFunction);
                } else {
                    ajax.get(dataFactory.getDMDIIMember().search, responseData(), callbackFunction);
                }
            };
            $scope.getDMDIIMembers();

            $scope.submit = function(name){
                $scope.memberCurrentPage = 0;
                $stateParams.name = name;
                loadingData(true);
                ajax.get(dataFactory.getDMDIIMember().search, responseData(), callbackFunction);
            };

            var callbackMapFunction = function(response) {
                angular.forEach(response.data, function(member) {
                    if (angular.isDefined($scope.mapObject.data[member.state])) {
                        $scope.mapObject.data[member.state].members.push('<li>' + member.name + '</li>');
                    } else {
                        $scope.mapObject.data[member.state] = {
                            fillKey: "HAS_MEMBER",
                            members: ['<li>' + member.name + '</li>']
                        };
                    }
                })
            }
            $scope.getDMDIIMemberMap = function() {
                ajax.get(dataFactory.getDMDIIMember().map, null, callbackMapFunction);
            }
            $scope.getDMDIIMemberMap();

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
                                    'opened' : isOpened('tier', '1'),
                                    'href' : getUrl('tier', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 12,
                                    'title': 'Two',
                                    'tag' : '2',
                                    'opened' : isOpened('tier', '2'),
                                    'href' : getUrl('tier', '2'),
                                    'categories': []
                                },
                                {
                                    'id': 13,
                                    'title': 'Three',
                                    'tag' : '3',
                                    'opened' : isOpened('tier', '3'),
                                    'href' : getUrl('tier', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 14,
                                    'title': 'Four',
                                    'tag' : '4',
                                    'opened' : isOpened('tier', '4'),
                                    'href' : getUrl('tier', '4'),
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
                                    'opened' : isOpened('type', '2'),
                                    'href' : getUrl('type', '2'),
                                    'categories': []
                                },
                                {
                                    'id': 22,
                                    'title': 'Government',
                                    'tag' : '3',
                                    'opened' : isOpened('type', '3'),
                                    'href' : getUrl('type', '3'),
                                    'categories': []
                                },
                                {
                                    'id': 23,
                                    'title': 'Industry',
                                    'tag' : '1',
                                    'opened' : isOpened('type', '1'),
                                    'href' : getUrl('type', '1'),
                                    'categories': []
                                },
                                {
                                    'id': 24,
                                    'title': 'Non-Profit',
                                    'tag' : '4',
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
                                    'opened' : isOpened('activeProjects', 'yes'),
                                    'href' : getUrl('activeProjects', 'yes'),
                                    'categories': []
                                },
                                {
                                    'id': 32,
                                    'title': 'No',
                                    'tag' : 'no',
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
            $scope.mapObject = {
                scope: 'usa',

                options: {
                    width: 500
                },
                geographyConfig: {
                    popupTemplate: function(geo, data) {
                        return [
                            '<div class="hoverinfo"><strong>',
                            'Number Of Members in ' + geo.properties.name,
                            ': ' + data.members.length,
                            '</strong>',
                            '<ul>' + data.members.join('') + '</ul>',
                            '</div>'
                        ].join('');
                    },
                    highlighBorderColor: '#EAA9A8',
                    highlighBorderWidth: 2
                },
                fills: {
                    'HAS_MEMBER': '#65AF3F',
                    'defaultFill': '#DDDDDD'
                },
                data: {},
                zoomable: false
            }
        }
    ]
);
