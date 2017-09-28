'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllRunServicesController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'previousPage',
        'dataFactory',
        '$interval',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    dataFactory,
                    $interval) {


            $("title").text("All Services");

            // comeback to the previous page
            $scope.previousPage = previousPage.get();

            $scope.services = [];
            $scope.order = "DESC";
            $scope.sort = "-currentStatus.status";

            var allServices = [];
            $scope.getServices = function(){
                ajax.get(dataFactory.getServices(),{},
                    function(response){
                        $scope.total = response.data.length;
                        allServices = response.data;
                        getLastStatuses($.map(response.data,function(x){ return x.id; }));
                    },function(response){
                        toastModel.showToast("error", "Ajax faild: getServices");
                    }
                );
            };
            $scope.getServices();

            $scope.onOrderChange = function(order) {
                $scope.sort = order;
            };

            function getLastStatuses(ids){
                var requestData = {
                    serviceId : ids,
                    _sort : "startDate",
                    _order : "DESC"
                };
                ajax.get(dataFactory.runService(),requestData,
                    function(response){
                        for(var i in allServices){
                            for(var j=0;j<response.data.length;j++){
                                if(allServices[i].id == response.data[j].serviceId){
                                    allServices[i].currentStatus = response.data[j];
                                    allServices[i].currentStatus.date = new Date(allServices[i].currentStatus.startDate+' '+allServices[i].currentStatus.startTime);
                                    allServices[i].currentStatus.startDate = moment(allServices[i].currentStatus.startDate).format("MM/DD/YYYY");
                                    allServices[i].currentStatus.startTime = moment(new Date(allServices[i].currentStatus.startDate+' '+allServices[i].currentStatus.startTime)).format("hh:mm A");
                                    runService(allServices[i]);
                                    break;
                                }
                            }
                            if(!allServices[i].currentStatus) allServices[i].currentStatus = { status : -2 };
                        }
                        allServices.sort(function(a, b) { return b.currentStatus.status - a.currentStatus.status });
                        if($scope.limit) allServices.splice($scope.limit,allServices.length);
                        $scope.services = allServices;
                        $.each($scope.services,function(){
                            this.releaseDateFormat = this.releaseDate;
                            this.releaseDate = Date.parse(this.releaseDate);
                        });
                        apply();
                    }
                );
            }

            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            // get random integer from min to max
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function updateStatus(service){
                ajax.update(dataFactory.updateServiceStatus(service.currentStatus.id),{
                    status : 0,
                    percentCompleted : 100
                },function(response){
                    for(var i in $scope.services) {
                        if($scope.services[i].id == response.data.serviceId) {
                            $scope.services[i].currentStatus = response.data;
                            apply();
                            break;
                        }
                    }
                });
            }

            function runService(service) {
                if (service.currentStatus.status == 1) {
                    var countDelay = getRandomInt(200, 500);
                    var upPercent = 100 / countDelay;
                    service.currentStatus.percentCompleted = parseInt(getRandomInt(5, 21));
                    service.currentStatus.interval = $interval(function () {
                        service.currentStatus.percentCompleted += upPercent;
                        if (service.currentStatus.percentCompleted >= 100) {
                            updateStatus(service);
                            $interval.cancel(service.currentStatus.interval);
                        }
                    }, 100);
                }
            }
        }
    ]
);