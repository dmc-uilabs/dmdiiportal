'use strict';

angular.module('dmc.widgets.services',[
        'dmc.ajax',
        'dmc.data',
        'dmc.socket',
        'dmc.model.question-toast-model',
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
            controller: function($scope, $element, $attrs, socketFactory, dataFactory, ajax, toastModel, previousPage, $interval,questionToastModel) {
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
                                            // runService(allServices[i]);
                                        }else {
                                            allServices[i].currentStatus = null;
                                        }
                                        break;
                                    }
                                }
                                // commented out to test service run
                                // if(!allServices[i].currentStatus || !allServices[i].currentStatus.project){
                                //     allServices.splice(i,1);
                                //     i--;
                                // }
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

                    // poll For Service Status
                    setTimeout(function(){
                      var svcsToCheck = returnServicesNotInSuccess(allServices)
                      if (svcsToCheck) {
                        pollForServiceStatus(svcsToCheck)
                      }
                    }, 5000)


                }

                function returnServicesNotInSuccess(services) {
                  var serviceIds = []
                  var notInSuccess = []

                  for(var i=0; i<services.length; i++) {
                    if (!services[i].currentStatus.status || services[i].currentStatus.status == 0) {
                      serviceIds.push(services[i].id)
                      notInSuccess.push(services[i])
                    }
                  }

                  if (serviceIds.length > 0) {
                    return notInSuccess
                  } else {
                    return undefined
                  }

                }

                function pollForServiceStatus(svcsToCheck) {
                  var ids = svcsToCheck.map(function(x) { return x.id })
                  if (ids.length < 1) { return }

                  var requestData = {
                      serviceId : ids,
                      _sort : "startDate",
                      _order : "DESC"
                  };

                  ajax.get(dataFactory.runService(),requestData,
                      function(response){
                        // for(var i=0;i<response.data.length;i++){
                        //   var svcToUpdate = svcsToCheck.filter(function(svc) {return svc.id == response.data[i].serviceId})[0]
                        //   svcToUpdate.currentStatus = (svcToUpdate.currentStatus ? $.extend(true,svcToUpdate.currentStatus,response.data[i]) : response.data[i]);
                        // }

                        console.log('new polling code')

                        for(var i=0;i<svcsToCheck.length;i++){
                          for(var j=0; j<response.data.length; j++) {
                            if (svcsToCheck[i].id == response.data[j].serviceId) {
                              svcsToCheck[i].currentStatus = (svcsToCheck[i].currentStatus ? $.extend(true,svcsToCheck[i].currentStatus,response.data[j]) : response.data[j])
                              break;
                            }
                          }
                        }

                        svcsToCheck = returnServicesNotInSuccess(allServices)

                        if (svcsToCheck) {
                          setTimeout(pollForServiceStatus.bind(null, svcsToCheck), 5000);
                        }

                      }
                    )
                  }

                var getStatusesNames = function() {
                  ajax.get(dataFactory.getStaticJSON('serviceStatuses.json'), {}, function(response){
                    $scope.serviceStatusNames = response.data
                  });
                }

                getStatusesNames()

                $scope.returnStatusText = function(statusInt) {
                  return $scope.serviceStatusNames[statusInt] ? $scope.serviceStatusNames[statusInt] : 'Never Run'
                }

                $scope.deleteService = function(event,item){
                    questionToastModel.show({
                        question: "Are you sure you want to remove this service?",
                        buttons: {
                            ok: function(){
                                var itemData = angular.isDefined(item.__serviceData) ? item.__serviceData : item;
                                if (itemData.hasOwnProperty('$$hashKey')) {
                                    delete itemData['$$hashKey'];
                                }
                                var deleteItem = $.extend(true, {}, itemData);
                                deleteItem.currentStatus = {};
                                deleteItem.projectId = 0;
                                ajax.update(dataFactory.services(item.id).update, deleteItem, function(response){
                                    for(var i in $scope.services){
                                        if($scope.services[i].id == item.id){
                                            $scope.services.splice(i,1);
                                            break;
                                        }
                                    }
                                    toastModel.showToast("success", "Service successfully removed!");
                                });
                            },
                            cancel: function(){}
                        }
                    }, event);

                };

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
