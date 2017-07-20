'use strict';

angular.module('dmc.dmdiiEvents')
    .controller('DMCDmdiiEventsController',[
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
        // 'is_search',
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
                //  is_search,
                 DMCUserModel,
                 $mdDialog,
                 $window){

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.selectedEvent = $rootScope.selectedEvent;

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
            });

            $scope.events = $scope.events || [];
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

            var eventSourcesLoaded = 0

            // var eventsCallbackFunction = function(response) {
            //     $scope.events = $scope.events.concat(response.data);
            //     sortEvents($scope.events);
            //     setInitialSelectedDay($scope.events);
            //     eventSourcesLoaded++;
            // }

            var addMemEvents = function(response) {
              $scope.events = $scope.events.concat(response.data);
              eventSourcesLoaded++;
              sortEvents($scope.events);
            }

            var addProjEvents = function(events) {
              events = events.data;
              for (var i=0; i<events.length; i++) {
                events[i].date = events[i].eventDate;
                events[i].name = events[i].eventName;
                events[i].description = events[i].eventDescription;
              }
              $scope.events = $scope.events.concat(events);
              eventSourcesLoaded++;
              sortEvents($scope.events);
            }

            var addDMDIIEvents = function(events) {
              events = events.data.data;
              events = events.filter(function(event){
                return (event.dmdiiFunding == 5983) && (event.costShare == 8395)
              })
              for (var i=0; i<events.length; i++) {
                events[i].date = events[i].awardedDate;
                events[i].name = events[i].projectTitle;
                events[i].description = events[i].projectSummary;
              }
              $scope.events = $scope.events.concat(events);
              eventSourcesLoaded++;
              sortEvents($scope.events);
            }

            $scope.getEvents = function(){
                ajax.get(dataFactory.dmdiiMemberEventUrl().get, {limit: 1000}, addMemEvents);
                ajax.get(dataFactory.dmdiiProjectEventUrl().get, {limit: 1000}, addProjEvents);
                ajax.get(dataFactory.getDMDIIProject().all, {page: 0, pageSize: 100}, addDMDIIEvents);
            };

            $scope.getEvents();

            var truncateText = function(text,length) {
              if (text.length > length) {
                return text.substring(0, length)+"...";
              } else {
                return text;
              }
            }

            $scope.eventClicked = function(event) {
                if (!$scope.showCalendar) {
                    $scope.showCalendar = true;
                }
                $('.is-selected').removeClass('is-selected');

                $('.calendar-day-'+event.date).addClass('is-selected');
                $scope.showEvents([event]);
            }

            $scope.dayClicked = function($event, day) {
                $('.is-selected').removeClass('is-selected');
                $($event.target).addClass('is-selected');
                $scope.showEvents(day.events)
            }

            var setSelectedDay = function(dateString) {
              $('.is-selected').removeClass('is-selected');
              $('.calendar-day-'+dateString).addClass('is-selected');
            }

            $scope.showEvents = function(events) {
                $scope.dayEvents = events;
            }

            var setInitialSelectedDay = function(events) {
              var today = new Date();
              var selectedDay;
              var selectedEvents = [];
              // if we want to remove previous events
              // $scope.events = [];

              for (var i=0; i<events.length; i++) {
                var eventDate = new Date(events[i].date)
                if (!selectedDay && eventDate >= today) {
                  selectedDay = eventDate
                  selectedEvents.push(events[i])
                } else if (eventDate == selectedDay) {
                  selectedEvents.push(events[i])
                }
                // if we want to remove previous events
                if (eventDate >= today) {
                  // $scope.events.push(events[i])
                  events[i].future=true;
                }
              }

              $scope.showEvents(selectedEvents);

            }

            var sortEvents = function(events) {
              if (eventSourcesLoaded == 3) {
                $scope.events.sort(function(a,b){
                  return new Date(a.date) - new Date(b.date);
                });

                setInitialSelectedDay($scope.events);
              }
            }

            $scope.selectEvent = function(event) {
              if (event && event.dmdiiFunding) {
                addDocuments(event);
              }
              $rootScope.selectedEvent = event;
            }

            var addDocuments = function(dmdiiEvent) {
              ajax.get(dataFactory.getDMDIIDocuments().project, {page: 0, pageSize: 15, dmdiiProjectId: dmdiiEvent.id}, function(response) {
                dmdiiEvent.documents = response.data;
              });
            }

        }
    ]
)
