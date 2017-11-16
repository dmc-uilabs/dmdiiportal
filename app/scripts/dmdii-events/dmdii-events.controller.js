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
        '$http',
        'toastModel',
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
                 $window,
                 $http,
                 toastModel){

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.selectedEvent = $rootScope.selectedEvent;

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
            });

            $scope.options = {
              multiDayEvents: {
                endDate: 'endDate',
                startDate: 'date'
              }
            };

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

            var addDMDIIEvents = function(response) {
              var eventArray = response.data.data;
              $scope.events = $scope.events.concat(eventArray);
              sortEvents($scope.events);
            }

            $scope.getEvents = function(){
              ajax.get(dataFactory.getDMDIIEvents().all, {page: 0, pageSize: 100}, addDMDIIEvents);
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
              today.setHours(0,0,0,0);
              var selectedEvents = [];
              // if we want to remove previous events
              // $scope.events = [];

              for (var i=0; i<events.length; i++) {
                var eventDate = new Date(events[i].date.replace(/-/g, '\/'))
                eventDate.setHours(0,0,0,0)

                var endDate = new Date(events[i].endDate)
                endDate.setHours(0,0,0,0)
                if (today.getTime() <= endDate.getTime() && today.getTime() >= eventDate.getTime()) {
                  selectedEvents.push(events[i])
                } else if (eventDate.getTime() === today.getTime()) {
                  selectedEvents.push(events[i])
                }
                // if we want to remove previous events
                if (eventDate > today) {
                  // $scope.events.push(events[i])
                  events[i].future=true;
                }
              }

              $scope.showEvents(selectedEvents);

            }

            var sortEvents = function(events) {
                $scope.events.sort(function(a,b){
                  return new Date(a.date) - new Date(b.date);
                });

                setInitialSelectedDay($scope.events);
            }

            $scope.selectEvent = function(event) {
              if (event) {
                addDocuments(event);
              }
              $rootScope.selectedEvent = event;
            }

            var addDocuments = function(dmdiiEvent) {
              ajax.get(dataFactory.getDMDIIDocuments().project, {page: 0, pageSize: 15, dmdiiProjectId: dmdiiEvent.id}, function(response) {
                dmdiiEvent.documents = response.data;
              });
            }

            $scope.deleteEvent = function(index, eventId) {
                var eventToDelete = $scope.events[index];
                showDeleteConfirm().then(function() {
                  $http.delete(dataFactory.getDMDIIEvents(eventId).delete).then(function(response){
                      deleteEventsFromView(index, eventId);
                      toastModel.showToast('success', 'Event deleted successfully.');
                  }, function(error) {
                      toastModel.showToast('error', 'Delete Failed.');
                  });
                });
            };

            var showDeleteConfirm = function() {
                var confirm = $mdDialog.confirm()
                    .title('Please Confirm')
                    .content('Are you sure you want to delete this event?')
                    .ok('Delete')
                    .cancel('Cancel');

                return $mdDialog.show(confirm);
            };

            var deleteEventsFromView = function(index, eventId) {
                $scope.events.splice(index, 1);
                for (var i = 0; i < $scope.dayEvents.length; i++) {
                    if ($scope.dayEvents[i].id === eventId) {
                        $scope.dayEvents.splice(i, 1);
                    }
                }
            }

            $scope.eventFilters = [
              {
                name: "Upcoming", isSelected: true,
                filterFunct: function(ev) {
                  return Date.parse(ev.awardedDate) >= Date.now() || Date.parse(ev.endDate) >= Date.now();
                }
              },
              {
                name: "Historical",
                filterFunct: function(ev) {
                  return Date.parse(ev.awardedDate) < Date.now() || Date.parse(ev.endDate) < Date.now();
                }
              },
              {
                name: "All",
                filterFunct: function(date) {
                  return true;
                }
              }
            ]

            $scope.selectEventListFilter = function(filterIndex) {
              $scope.eventFilters.forEach(function(eventFilter, i){
                if (i==filterIndex) {
                  eventFilter.isSelected = true;
                } else {
                  eventFilter.isSelected = false;
                }
              })
            }

            $scope.eventListFilter = function(event) {
              var currentFilter = $scope.eventFilters.filter(function(eventFilter){return eventFilter.isSelected})[0];
              return currentFilter.filterFunct(event);
            }

        }
    ]
)
