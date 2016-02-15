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
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    dataFactory) {


            $("title").text("All Services");

            // comeback to the previous page
            $scope.previousPage = previousPage.get();

            $scope.services = [];
            $scope.order = "DESC";
            $scope.sort = "title";

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
                                    allServices[i].currentStatus.startTime = moment(new Date(allServices[i].currentStatus.startDate+' '+allServices[i].currentStatus.startTime)).format("hh:mm:ss A");
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
        }
    ]
);