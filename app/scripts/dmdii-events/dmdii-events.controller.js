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

            var truncateText = function(text,length) {
              if (text.length > length) {
                return text.substring(0, length)+"...";
              } else {
                return text;
              }
            }

        }
    ]
)
