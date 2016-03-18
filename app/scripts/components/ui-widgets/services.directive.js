'use strict';

angular.module('dmc.widgets.services',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket',
        'dmc.model.previous-page'
    ]).
    directive('uiWidgetServices', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/ui-widgets/services.html',
            scope: {
                columns: "=",
                widgetTitle: "=",
                widgetStyle: "=",
                projectId: "=",
                titleHref: "=",
                viewAllHref: "=",
                startAtOffset: "=",
                progressPosition: "=",
                limit: "=",
                sortBy: "="
            },
            link: function (scope, iElement, iAttrs) {

            },
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel, previousPage, $interval) {
                $scope.previousPage = previousPage;

                $scope.services = [];
                $scope.total = 0;
                $scope.sort = $scope.sortBy ? $scope.sortBy : '-currentStatus.status';
                $scope.order = 'DESC';
                //if(!$scope.limit) $scope.limit = 5;
                // function for get all services from DB

                var allServices = [];
                $scope.getServices = function(){
                    ajax.get(dataFactory.getServices($scope.projectId),{},
                        function(response){
                            allServices = response.data;
                            getLastStatuses($.map(response.data,function(x){ return x.id; }));
                        },function(response){
                            toastModel.showToast("error", "Ajax faild: getServices");
                        }
                    );
                };

                $scope.onOrderChange = function(order) {
                    $scope.sort = order;
                };

                // get all services (first request)
                $scope.getServices();

                function getLastStatuses(ids){
                    var requestData = {
                        serviceId : ids,
                        _sort : "startDate",
                        _order : "DESC"
                    };
                    ajax.get(dataFactory.runService(),requestData,
                        function(response){
                            for(var i=0;i<allServices.length;i++){
                                for(var j=0;j<response.data.length;j++){
                                    if(allServices[i].id == response.data[j].serviceId){
                                        allServices[i].currentStatus = (allServices[i].currentStatus ? $.extend(true,allServices[i].currentStatus,response.data[j]) : response.data[j]);
                                        if(allServices[i].projectId && allServices[i].currentStatus.project.id > 0) {
                                            allServices[i].currentStatus.date = new Date(allServices[i].currentStatus.startDate + ' ' + allServices[i].currentStatus.startTime);
                                            allServices[i].currentStatus.startDate = moment(allServices[i].currentStatus.startDate).format("MM/DD/YYYY");
                                            allServices[i].currentStatus.startTime = moment(new Date(allServices[i].currentStatus.startDate + ' ' + allServices[i].currentStatus.startTime)).format("hh:mm A");
                                            runService(allServices[i]);
                                        }else {
                                            allServices[i].currentStatus = null;
                                        }
                                        break;
                                    }
                                }
                                if(!allServices[i].currentStatus || !allServices[i].currentStatus.project){
                                    allServices.splice(i,1);
                                    i--;
                                }
                            }
                            $scope.total = allServices.length;
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

                // Socket listeners -------------------------------------------------

                // get updated service
                //socketFactory.on(socketFactory.updated().services, function(item){
                //    $scope.getServices();
                //});

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        };
    }])