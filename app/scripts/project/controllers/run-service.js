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
            $scope.orderInputs = 'position';
            $scope.isChangedOrder = false;
            $scope.isChangedValues = false;


            console.log($scope.service);

            $scope.sortableOptions = {
                update: function(e, ui) {
                    $scope.isChangedOrder = true;
                },
                axis: 'y'
            };

            $scope.sortableOutputOptions = {
                update: function(e, ui) {
                    $scope.isChangedOrder = true;
                },
                axis: 'y'
            };

            $scope.changedValue = function () {
                $scope.isChangedValues = false;
                for(var i in $scope.service.interfaceModel.inputs){
                    if(new String($scope.service.interfaceModel.inputs[i].defaultValue).valueOf() != new String($scope.service.interfaceModel.inputs[i].value).valueOf()){
                        $scope.isChangedValues = true;
                        break;
                    }
                }
            };

            $scope.$watch(function(){
                return $scope.service.interfaceModel;
            },function(){
                if ($scope.service.interfaceModel && $scope.service.interfaceModel.inParams) {
                    $scope.service.interfaceModel.inputs = [];
                    for (var key in $scope.service.interfaceModel.inParams) {
                        $scope.service.interfaceModel.inParams[key].defaultValue = $scope.service.interfaceModel.inParams[key].value;
                        $scope.service.interfaceModel.inputs.push($scope.service.interfaceModel.inParams[key]);
                    }
                    for (var key in $scope.service.interfaceModel.outParams) {
                        $scope.service.interfaceModel.outParams[key].value = null;
                    }
                }
                    updatePositionInputs();
                    // get current status
                    if($scope.service.currentStatus && $scope.service.currentStatus.status == 1){
                        $scope.status = getStatus($scope.service.currentStatus.status);
                        ajax.update(dataFactory.updateServiceStatus($scope.service.currentStatus.id),{
                                startDate: moment(new Date()).format("MM/DD/YYYY"),
                                startTime: moment(new Date()).format("hh:mm:ss A")
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

            });

            function updatePositionInputs(){
                if( $scope.service.position_inputs ) {
                    var autoSetPosition = $scope.service.interfaceModel.inputs.length;
                    for (var i = 0; i < $scope.service.interfaceModel.inputs.length; i++) {
                        for (var j = 0; j < $scope.service.position_inputs.positions.length; j++) {
                            if($scope.service.interfaceModel.inputs[i].name == $scope.service.position_inputs.positions[j].name){
                                $scope.service.interfaceModel.inputs[i].position = $scope.service.position_inputs.positions[j].position;
                                break;
                            }
                        }
                        if(!$scope.service.interfaceModel.inputs[i].position){
                            autoSetPosition++;
                            $scope.service.interfaceModel.inputs[i].position = autoSetPosition;
                        }
                    }
                    $scope.service.interfaceModel.inputs.sort(function(a, b){return a.position - b.position});
                    apply();
                }
            }

            function getServiceInterface(){
                // get last status
                ajax.get(dataFactory.getServiceRun($scope.rerun),{},
                    function(response){
                        $scope.rerun = null;
                        if(response.data && response.data.id){
                            $scope.service.interfaceModel.inputs = [];
                            for (var key in $scope.service.interfaceModel.inParams) {
                                $scope.service.interfaceModel.inParams[key].defaultValue = $scope.service.interfaceModel.inParams[key].value;
                                $scope.service.interfaceModel.inParams[key].value = response.data.interface.inParams[key].value;
                                $scope.service.interfaceModel.inputs.push($scope.service.interfaceModel.inParams[key]);
                            }
                            for (var key in $scope.service.interfaceModel.outParams) {
                                $scope.service.interfaceModel.outParams[key].value = null;
                            }
                            $scope.changedValue();
                            updatePositionInputs();
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
                console.log(new Date(status.stopDate+' '+status.stopTime));
                console.log(new Date(status.startDate+' '+status.startTime));
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
                        startDate: moment(new Date()).format("MM/DD/YYYY"),
                        startTime: moment(new Date()).format("hh:mm:ss A"),
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
                updateStatus((response.data.status == "error" ? -1 : 0),response.data.pkg);
                $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
            }
            function runModelErrorCallback(response){
                updateStatus(-1,$scope.service.interfaceModel);
                $scope.runTime = $scope.calcRunTime($scope.service.currentStatus);
            }
            // run Model
            function runModel(){
                if($scope.service.interfaceModel && $scope.service.interfaceModel.outParams) {
                    for (var key in $scope.service.interfaceModel.outParams) {
                        $scope.service.interfaceModel.outParams[key].value = null;
                    }
                }
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
                                    stopDate: moment(new Date()).format("MM/DD/YYYY"),
                                    stopTime: moment(new Date()).format("hh:mm:ss A"),
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
                                    if (getStatus(response.data.status) == "success") {
                                        toastModel.showToast("success", "Run Completed Successfully");
                                        for (var key in $scope.service.interfaceModel.outParams) {
                                            $scope.service.interfaceModel.outParams[key].value = interface_.outParams[key].value;
                                        }
                                    } else if (getStatus(response.data.status) == "error") {
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

            $scope.reset = function(){
                $scope.isChangedOrder = false;
                updatePositionInputs();
            };

            $scope.default = function(){
                for(var key in $scope.service.interfaceModel.inParams){
                    $scope.service.interfaceModel.inParams[key].value = $scope.service.interfaceModel.inParams[key].defaultValue;
                }
                $scope.isChangedValues = false;
                apply();
            };

            $scope.save = function(){
                var dataRequest = {
                    "serviceId": $scope.service.id,
                    "positions": []
                };
                for(var i=0; i < $scope.service.interfaceModel.inputs.length;i++){
                    dataRequest.positions.push({
                        name : $scope.service.interfaceModel.inputs[i].name,
                        position : (i+1)
                    });
                }
                if(!$scope.service.position_inputs) {
                    ajax.create(dataFactory.services().add_position_inputs, dataRequest,
                        function (response) {
                            $scope.service.position_inputs = response.data;
                            toastModel.showToast("success", "Order successfully saved");
                        }
                    );
                }else{
                    ajax.update(dataFactory.services($scope.service.position_inputs.id).update_position_inputs, {
                            positions : dataRequest.positions
                        }, function (response) {
                            $scope.isChangedOrder = false;
                            $scope.service.position_inputs = response.data;
                            toastModel.showToast("success", "Order successfully changed");
                        }
                    );
                }
            }
        }
    ]
);