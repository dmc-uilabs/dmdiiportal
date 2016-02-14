angular.module('dmc.project')
.controller('projectRunServicesCtrl', [
        '$scope',
        '$stateParams',
        'projectData',
        'serviceData',
        'ajax',
        'dataFactory',
        '$mdToast',
        'toastModel',
        '$timeout',
        '$interval',
        '$rootScope',
        'domeModel',
        '$state',
        function ($scope,
                  $stateParams,
                  projectData,
                  serviceData,
                  ajax,
                  dataFactory,
                  $mdToast,
                  toastModel,
                  $timeout,
                  $interval,
                  $rootScope,
                  domeModel,
                  $state) {

            $scope.ServiceId = $stateParams.ServiceId;
            $scope.rerun = (angular.isDefined($stateParams.rerun) ? $stateParams.rerun : null);
            $scope.projectData = projectData;
            $scope.service = serviceData;

            console.log($scope.service);

            $scope.$watch(function(){
                return $scope.service.interfaceModel;
            },function(){
                if ($scope.service.interfaceModel && $scope.service.interfaceModel.inParams) {
                    for (var key in $scope.service.interfaceModel.inParams) {
                        $scope.service.interfaceModel.inParams[key].defaultValue = $scope.service.interfaceModel.inParams[key].value;
                    }
                    // get current status
                    if($scope.service.currentStatus && $scope.service.currentStatus.status == 1){
                        $scope.status = getStatus($scope.service.currentStatus.status);
                        ajax.update(dataFactory.updateServiceStatus($scope.service.currentStatus.id),{
                                startDate: moment(new Date()).format("YYYY-MM-DD"),
                                startTime: moment(new Date()).format("HH:mm:ss")
                            }, function(response){
                                $scope.service.currentStatus.percentCompleted = 50;
                                runModel();
                                $scope.service.currentStatus.startDate = response.data.startDate;
                                $scope.service.currentStatus.startTime = response.data.startTime;
                                $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                            }, function(){
                                toastModel.showToast("error", "Run Failed. Please check your inputs and try again");
                            }
                        );
                    }
                    if($scope.rerun) getServiceInterface();
                    apply();
                }
            });

            function getServiceInterface(){
                // get last status
                ajax.get(dataFactory.getServiceRun($scope.rerun),{},
                    function(response){
                        $scope.rerun = null;
                        if(response.data && response.data.id){
                            console.log(response.data);
                            $scope.service.interfaceModel = response.data.interface;
                            for (var key in $scope.service.interfaceModel.inParams) {
                                $scope.service.interfaceModel.inParams[key].defaultValue = $scope.service.interfaceModel.inParams[key].value;
                            }
                            apply();
                        }else{
                            toastModel.showToast("error", "Rerun history item not found");
                        }
                    }
                );
            }


            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            // get run Time
            $scope.runTime = 0;
            $scope.calcRunTime = function(status){
                var runTime = (status.stopTime ? new Date(status.stopDate+' '+status.stopTime) - new Date(status.startDate+' '+status.startTime) : new Date() - new Date(status.startDate+' '+status.startTime));
                return (runTime/1000).toFixed(2);
            };

            // get last run time
            $scope.lastRunTime = 0;
            // get current status
            $scope.status = "Not Running";
            // get last status
            $scope.lastStatus = "none";



            // get last status
            if($scope.service.lastStatus){
                $scope.lastRunTime = $scope.calcRunTime($scope.service.lastStatus);
                $scope.lastStatus = getStatus($scope.service.lastStatus.status);
                apply();
            }

            $scope.averageRun = ($scope.service.averageRun ? $scope.service.averageRun.toFixed(2) : 0);

            // run Service
            $scope.run = function(){
                ajax.create(dataFactory.runService(),{
                        serviceId : $scope.service.id,
                        accountId : $rootScope.userData.accountId,
                        runBy : $rootScope.userData.displayName,
                        status : 1,
                        percentCompleted: 0,
                        startDate: moment(new Date()).format("YYYY-MM-DD"),
                        startTime: moment(new Date()).format("HH:mm:ss"),
                        project: {
                            "id": $scope.projectData.id,
                            "title": $scope.projectData.title
                        }
                    }, function(response){
                        $scope.status = getStatus(response.data.status);
                        $scope.service.currentStatus = response.data;
                        $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                        apply();
                        runModel();
                    }, function(){
                        toastModel.showToast("error", "Run Failed. Please check your inputs and try again");
                    }
                );
            };

            function getStatus(status){
                switch(status){
                    case 1:
                        return "running";
                        break;
                    case 0:
                        return "success";
                        break;
                    case -1:
                        return "error";
                        break;
                    default:
                        return status;
                        break;
                }
            }

            function runModelCallback(response){
                console.log(response.data);
                updateStatus((response.data.status == "error" ? -1 : 0),response.data.pkg);
                $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
            }
            function runModelErrorCallback(response){
                updateStatus(-1,$scope.service.interfaceModel);
                $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
            }
            // run Model
            function runModel(){
                if($scope.service.interface && $scope.service.interface.domeServer) {
                    $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                    domeModel.runModel({
                        model: $scope.service.interfaceModel,
                        interface: $scope.service.interface,
                        domeServer: $scope.service.interface.domeServer
                    }, runModelCallback, runModelErrorCallback);
                }else{
                    toastModel.showToast("error", "Dome server douse not found!");
                    updateStatus(-1,$scope.service.interfaceModel);
                    $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                }
            }

            // get random integer from min to max
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // update service status
            function updateStatus(status,interface_){
                var countDelay = getRandomInt(50,300);
                var upPercent = (status == -1 ? 100 : (100/countDelay));
                var interval = $interval(function() {
                    if($scope.service.currentStatus) {
                        $scope.service.currentStatus.percentCompleted += upPercent;
                        $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                        if ($scope.service.currentStatus.percentCompleted >= 100) {
                            $interval.cancel(interval);
                            ajax.update(dataFactory.updateServiceStatus($scope.service.currentStatus.id), {
                                    status: status,
                                    percentCompleted: 100,
                                    stopDate: moment(new Date()).format("YYYY-MM-DD"),
                                    stopTime: moment(new Date()).format("HH:mm:ss"),
                                    interface: {
                                        inParams : ( interface_ && interface_.inParams ? interface_.inParams : null ),
                                        outParams : ( interface_ && interface_.outParams ? interface_.outParams : null )
                                    }
                                }, function (response) {
                                    $scope.service.lastStatus = $.extend(true,{},response.data);
                                    $scope.service.currentStatus = null;
                                    $scope.runTime = 0;
                                    $scope.status = "Not Running";
                                    $scope.lastStatus = getStatus(response.data.status);
                                    $scope.lastRunTime = $scope.calcRunTime($scope.service.lastStatus);
                                    if (response.data.status == "success") {
                                        toastModel.showToast("success", "Run Completed Successfully");
                                    } else if (response.data.status == "error") {
                                        toastModel.showToast("error", "Run Completed with Error");
                                    }
                                    updateAverageRun();
                                    apply();
                                }
                            );
                        }
                        apply();
                    }
                },100);
            }

            function updateAverageRun(){
                ajax.get(dataFactory.services($scope.service.id).get_run_history, {
                        _sort: 'id',
                        _order: "DESC",
                        status_ne : 'running'
                    }, function(response){
                        var history = response.data;
                        var time = 0;
                        for(var i in history){
                            time += parseFloat($scope.calcRunTime(history[i]));
                        }
                        var averageRun = time/history.length;
                        ajax.update(dataFactory.services($scope.service.id).update, {
                                averageRun: averageRun
                            }, function(response){
                                $scope.service.averageRun = response.data.averageRun;
                                $scope.averageRun = $scope.service.averageRun.toFixed(2);
                                apply();
                            }
                        )
                    }
                )
            }

            $scope.clear = function(){
                for(var key in $scope.service.interfaceModel.inParams){
                    $scope.service.interface.inParams[key].value = null;
                }
                apply();
            };

            $scope.default = function(){
                for(var key in $scope.service.interfaceModel.inParams){
                    $scope.service.interfaceModel.inParams[key].value = $scope.service.interfaceModel.inParams[key].defaultValue;
                }
                apply();
            };

            $scope.save = function(){
                var test = false;
                for(var i in $scope.inputs){
                    if($scope.inputs[i].models != ''){
                        test = true;
                        break;
                    }
                }
                if(test == true){
                    toastModel.showToast("success", "The inputs have been saved");
                }else{
                    toastModel.showToast("error", "Save Failed. Please check your inputs and try again");
                }
            }
        }
    ]
);