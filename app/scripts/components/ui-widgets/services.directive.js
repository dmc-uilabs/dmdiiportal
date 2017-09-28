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
                            getLastStatusesAndAddedByName($.map(response.data,function(x){ return x.id; }));
                        },function(response){
                            toastModel.showToast("error", "Ajax failed: getServices");
                        }
                    );
                };
    
                function getAddedByName(id, index) {
                    
                    ajax.get(dataFactory.getUserName(id), {}, function (response) {
                        $scope.services[index].addedBy = response.data.displayName;
                    }, function (response) {
                        toastModel.showToast("error", "Ajax failed: getUserName");
                        $scope.services[index].addedBy = id;
                    });

                }

                $scope.onOrderChange = function(order) {
                    $scope.sort = order;
                };

                // get all services (first request)
                $scope.getServices();

                function getLastStatusesAndAddedByName(ids){
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
                                        allServices[i].currentStatus = updateServiceStatus(allServices[i], response.data[j]);
                                        if(allServices[i].projectId && allServices[i].currentStatus.project.id > 0) {
                                            allServices[i].currentStatus.date = new Date(allServices[i].currentStatus.startDate + ' ' + allServices[i].currentStatus.startTime);
                                            allServices[i].currentStatus.startDate = moment(allServices[i].currentStatus.startDate).format("MM/DD/YYYY");
                                            allServices[i].currentStatus.startTime = moment(new Date(allServices[i].currentStatus.startDate + ' ' + allServices[i].currentStatus.startTime)).format("hh:mm A");
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

                            $.each($scope.services,function(index, value){
                                this.releaseDateFormat = this.releaseDate;
                                this.releaseDate = Date.parse(this.releaseDate);
                                getAddedByName(this.profileId, index);
                            });
                            apply();

                        }
                    );

                    // poll For Service Status
                    setTimeout(function(){
                        beginServicePolls(allServices)
                    }, 5000)

                }

                function updateServiceStatus(service, currentStatus) {
                  return service.currentStatus ? $.extend(true,service.currentStatus,currentStatus) : currentStatus;
                }

                function returnRunningServices(services) {
                  var serviceIds = []
                  var notInSuccess = []

                  for(var i=0; i<services.length; i++) {
                    if (services[i].currentStatus && services[i].currentStatus.status == 0) {
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

                function pollForServiceStatus() {
                  var svcsToCheck = returnRunningServices(allServices)

                  if(!svcsToCheck) {
                    return;
                  }

                  var ids = svcsToCheck.map(function(x) { return x.id })
                  if (ids.length < 1) { return }

                  var requestData = {
                      serviceId : ids,
                      _sort : "startDate",
                      _order : "DESC"
                  };

                  ajax.get(dataFactory.runService(),requestData,
                      function(response){
                        updateServicesStatuses(svcsToCheck, response.data)
                        setTimeout(pollForServiceStatus, 5000);
                      }
                    )
                }

                function updateServicesStatuses(services, statuses) {
                  for(var i=0;i<services.length;i++){
                    for(var j=0; j<statuses.length; j++) {
                      if (services[i].id == statuses[j].serviceId) {
                        services[i].currentStatus = updateServiceStatus(services[i], statuses[j]);
                        break;
                      }
                    }
                  }
                }

                function serviceRunStillActive(runId) {
                  var stillActive = false;
                  var svcsToCheck = returnRunningServices(allServices)

                  for (var i=0; i<svcsToCheck.length; i++) {
                    if (svcsToCheck[i].currentStatus.id == runId && svcsToCheck[i].currentStatus.status == 0) {
                      stillActive = true;
                    }

                  }

                  return stillActive;
                }

                function beginServicePolls() {
                  var svcsToCheck = returnRunningServices(allServices)

                  if(!svcsToCheck) { return  }

                  for (var i=0; i<svcsToCheck.length; i++) {
                    pollSingleServiceRun(svcsToCheck[i].currentStatus.id)
                  }
                }

                var runningPolls = {};

                function pollSingleServiceRun(runId) {
                  ajax.get(dataFactory.pollModel(runId), {}, function(response) {

                    if (response.data.status == 1) {
                      pollForServiceStatus();
                    // } else if (serviceHasErrored(response)) {
                    //   setServiceToFailed(runId);
                    } else if (serviceRunStillActive(runId)) {
                      if (runningPolls[runId]) {
                        clearTimeout(runningPolls[runId])
                      }
                      runningPolls[runId] = (setTimeout(pollSingleServiceRun.bind(null, runId), 10000));
                    }

                  }, pollSingleServiceRunErrorCallback);
                }

                function stopPolls() {
                  for (var key in runningPolls) {
                    if (runningPolls.hasOwnProperty(key)) {
                      clearTimeout(runningPolls[key])
                    }
                  }
                }

                function pollSingleServiceRunErrorCallback(response) {
                  toastModel.showToast('error', 'Error poling Dome service');
                }

                var serviceErrors = {};

                // Removing the logic below to set services to failed, as long-running services
                //  will incorrectly trigger this response

                // function serviceHasErrored(response) {
                //   serviceErrors[response.data.id] = serviceErrors[response.data.id] || 0
                //
                //   if (response.data.status == 0 && angular.equals({},response.data.outParams)) {
                //     serviceErrors[response.data.id]++
                //   } else {
                //     serviceErrors[response.data.id] = 0
                //   }
                //
                //   return serviceErrors[response.data.id] > 1
                // }

                // function setServiceToFailed(runId) {
                //   var serviceInFailure = returnServiceFromRunId(runId)
                //   serviceInFailure.currentStatus.status = 3
                // }

                function returnServiceFromRunId(runId) {
                  return allServices.find(function(x){
                    return x.currentStatus.id == runId
                  })
                }


                var getStatusesNames = function() {
                  ajax.get(dataFactory.getStaticJSON('serviceStatuses.json'), {}, function(response){
                    $scope.serviceStatusNames = response.data
                  });
                }

                getStatusesNames()

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

                $scope.cancelServiceRun = function(event,item){
                    questionToastModel.show({
                        question: "Are you sure you want to cancel this service run?",
                        buttons: {
                            ok: function(){
                              ajax.create(dataFactory.cancelServiceRun(item.currentStatus.id), {}, function(response){
                                  updateServiceStatus(item, response.data);
                                  toastModel.showToast("success", "Service run cancelled");
                              }, function(response){
                                console.log(response)
                                toastModel.showToast("error", response.data ? response.data : response.statusText)
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

                $scope.$on('$destroy', function() {
                  stopPolls();
                });
            }
        };
    }])
