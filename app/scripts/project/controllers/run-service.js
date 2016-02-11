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
        'DMCUserModel',
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
                  DMCUserModel,
                  $state) {

            $scope.ServiceId = $stateParams.ServiceId;
            $scope.rerun = (angular.isDefined($stateParams.rerun) ? $stateParams.rerun : null);
            $scope.projectData = projectData;
            $scope.service = serviceData;
            $scope.currentUser = DMCUserModel.getUserData().$$state.value;

            if($scope.service.interface && $scope.service.interface.inParams) {
                for (var key in $scope.service.interface.inParams) {
                    $scope.service.interface.inParams[key].defaultValue = $scope.service.interface.inParams[key].value;
                }
            }

            function getServiceInterface(){
                // get last status
                ajax.get(dataFactory.getServiceRun($scope.rerun),{},
                    function(response){
                        if(response.data && response.data.id){
                            $scope.service.interface = response.data.interface;
                            for (var key in $scope.service.interface.inParams) {
                                $scope.service.interface.inParams[key].defaultValue = $scope.service.interface.inParams[key].value;
                            }
                            apply();
                        }else{
                            toastModel.showToast("error", "Rerun history item not found");
                        }
                    }
                );
            }
            if($scope.rerun) getServiceInterface();

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

            // watch current status
            $scope.$watch(function(){
                return $scope.service.currentStatus;
            },function(newVal){
                // get current status
                if($scope.service.currentStatus && $scope.service.currentStatus.status){
                    $scope.status = "running";
                    //runModel();
                    $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                }
            });

            // watch last status
            $scope.$watch(function(){
                return $scope.service.lastStatus;
            },function(newVal){
                // get last run time and get lastStatus
                if(newVal){
                    $scope.lastRunTime = $scope.calcRunTime(newVal);
                    $scope.lastStatus = $scope.service.lastStatus.status;
                    apply();
                }
            });

            $scope.averageRun = ($scope.service.averageRun ? $scope.service.averageRun.toFixed(2) : 0);

            // run Service
            $scope.run = function(){
                ajax.create(dataFactory.runService(),{
                        serviceId : $scope.service.id,
                        accountId : $scope.currentUser.accountId,
                        runBy : $scope.currentUser.displayName,
                        status : "running",
                        percentCompleted: 0,
                        startDate: moment(new Date()).format("YYYY-MM-DD"),
                        startTime: moment(new Date()).format("HH:mm:ss"),
                        project: {
                            "id": $scope.projectData.id,
                            "title": $scope.projectData.title
                        }
                    }, function(response){
                        $scope.status = response.data.status;
                        $scope.service.currentStatus = response.data;
                        $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                        apply();
                        runModel();
                    }, function(){
                        toastModel.showToast("error", "Run Failed. Please check your inputs and try again");
                    }
                );
            };

            // run Model
            function runModel(){
                $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                ajax.get(dataFactory.runModel(),{
                        interface : $scope.service.interface,
                        url : $scope.service.serverIp
                    }, function(response){
                        updateStatus("success",response.data.pkg);
                        $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                    },function(){
                        updateStatus("error",$scope.service.interface);
                        $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
                    }
                );
            }

            // get random integer from min to max
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // update service status
            function updateStatus(status,interface_){
                var countDelay = getRandomInt(50,300);
                var upPercent = (100/countDelay);
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
                                    interface: interface_
                                }, function (response) {
                                    $scope.service.lastStatus = $.extend(true,{},response.data);
                                    $scope.service.currentStatus = null;
                                    $scope.runTime = 0;
                                    $scope.status = "Not Running";
                                    $scope.lastStatus = response.data.status;
                                    toastModel.showToast("success", "Run Completed Successfully");
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
                for(var key in $scope.service.interface.inParams){
                    $scope.service.interface.inParams[key].value = null;
                }
                apply();
            };

            $scope.default = function(){
                for(var key in $scope.service.interface.inParams){
                    $scope.service.interface.inParams[key].value = $scope.service.interface.inParams[key].defaultValue;
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