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
        '$compile',
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
                  $state,
                  $compile,
                  questionToastModel) {

            $scope.ServiceId = $stateParams.ServiceId;
            $scope.rerun = (angular.isDefined($stateParams.rerun) ? $stateParams.rerun : null);
            $scope.projectData = projectData;
            $scope.service = serviceData;
            $scope.orderInputs = 'position';
            $scope.isChangedOrder = false;
            $scope.isChangedValues = false;
            $scope.hasCustomUI = false;

            var getStatusesNames = function() {
              ajax.get(dataFactory.getStaticJSON('serviceStatuses.json'), {}, function(response){
                $scope.serviceStatusNames = response.data
              });
            }

            getStatusesNames()

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
                    if('inputTemplate' in $scope.service.interfaceModel.inParams){
                      updateCustomUIForInputs();
                    }
                    if('companyVPC' in $scope.service.interfaceModel.inParams){
                      setVPCData('companyVPC');
                    }
                }
                    updatePositionInputs();
                    // get current status
                    if($scope.service.currentStatus && $scope.service.currentStatus.status == 0){
                        $scope.status = getStatus($scope.service.currentStatus.status);
                    }
                    if($scope.rerun) getServiceInterface();
                    apply();

            });

            function updateCustomUIForInputs() {
              // Define our data object
              var context = {};
              var options;
              var templateText;
              var compiledTemplate;
              var handleBarHtml;
              var compiledHtml;
              for(var key in $scope.service.interfaceModel.inParams){
                    try{
                      context[key] = JSON.parse($scope.service.interfaceModel.inParams[key].value);
                    }catch(e){
                      context[key] = $scope.service.interfaceModel.inParams[key].value;
                    }
              }
              if($scope.service.interfaceModel.inParams['inputTemplate'].value){
                templateText = $scope.service.interfaceModel.inParams['inputTemplate'].value;
                compiledTemplate = Handlebars.compile(templateText);
                handleBarHtml = compiledTemplate(context);
                compiledHtml = $compile(handleBarHtml)($scope);

                // Add the compiled html to the page
                $('.content-placeholder').html(compiledHtml);
                $scope.hasCustomUI = true;
              }else{
                $scope.hasCustomUI = false;
              }
            }

            function updateCustomUIForOutputs() {
              var context = {};
              var options;
              var templateText;
              var compiledTemplate;
              var handleBarHtml;
              var compiledHtml;

              for(var key in $scope.service.interfaceModel.inParams){
                try{
                  context[key] = JSON.parse($scope.service.interfaceModel.inParams[key].value);
                }catch(e){
                  context[key] = $scope.service.interfaceModel.inParams[key].value;
                }
              }
              for (var outKey in $scope.service.interfaceModel.outParams){
		try{
	             context[outKey] = JSON.parse($scope.service.interfaceModel.outParams[outKey].value);
		}catch(e){
		  context[outKey] = $scope.service.interfaceModel.outParams[outKey].value;
		}
              }

              if($scope.service.interfaceModel.outParams['outputTemplate'].value){
                templateText = $scope.service.interfaceModel.outParams['outputTemplate'].value;
                compiledTemplate = Handlebars.compile(templateText);
                handleBarHtml = compiledTemplate(context);
                compiledHtml = $compile(handleBarHtml)($scope);

                // Add the compiled html to the page
                $('.content-placeholder').html(compiledHtml);
                $scope.hasCustomUI = true;
              }else{
                $scope.hasCustomUI = false;
              }
            }

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
                            toastModel.showToast('error', 'Rerun history item not found');
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
            $scope.status = 'Not Running';
            // get last status
            $scope.lastStatus = 'none';

            // TODO add logic to get the most recent (prior) status
            // // get last status
            // if($scope.service.lastStatus){
            //     // $scope.lastRunTime = $scope.calcRunTime($scope.service.lastStatus);
            //     $scope.lastStatus = getStatus($scope.service.lastStatus.status);
            //     apply();
            // }

            $scope.averageRun = ($scope.service.averageRun ? $scope.service.averageRun.toFixed(2) : 0);

            // run Service
            $scope.run = function(){
                runModel();
            };

            // TODO add logic to get the most recent (prior) status
            function getStatus(status){
                switch(status){
                    case 0:
                        return 'running';
                        break;
                    case 1:
                        return 'success';
                        break;
                    case -1:
                        return 'error';
                        break;
                    default:
                        return status;
                        break;
                }
            }

            $scope.isRunning = function() {
                return angular.isDefined(pollingInterval) ? true : false;
            }

            var pollingInterval;

            function startPolling(data) {
                // if internal is already running don't start another
                if (angular.isDefined(pollingInterval)) return;
                getUpdatedStatus(data.runId);
                pollingInterval = $interval( function(){
                    domeModel.pollModel(data, pollModellCallback, pollModelErrorCallback);
                }, 500);
            }

            function stopPolling() {
                if (angular.isDefined(pollingInterval)) {
                    $interval.cancel(pollingInterval);
                    pollingInterval = undefined;
                  }
                getUpdatedStatus($scope.service.currentStatus.id);
            }

            // stop polling when route changes
            $scope.$on('$destroy', function() {
              stopPolling();
            });

            function pollModellCallback(response) {
                if (response.data.status == 1) {
                    // model done running
                    stopPolling();
                    $scope.service.interfaceModel.outParams = response.data.outParams;
                    if('outputTemplate' in $scope.service.interfaceModel.outParams){
                      updateCustomUIForOutputs();
                    }
                } else {
                    // model still running
                }
            }

            function pollModelErrorCallback(response) {
                toastModel.showToast('error', 'Error poling Dome service');
            }

            function runModelCallback(response){
                startPolling(response.data);
            }

            function runModelErrorCallback(response){
                toastModel.showToast('error', 'Error running Dome service');
            }
            // run Model
            function runModel(){
                if($scope.service.interfaceModel && $scope.service.interfaceModel.outParams) {
                    for (var key in $scope.service.interfaceModel.outParams) {
                        $scope.service.interfaceModel.outParams[key].value = null;
                    }
                }
                if($scope.service.interface && $scope.service.interface.domeServer) {
                  if($scope.hasCustomUI){
                    for (var key in $scope.service.interfaceModel.inParams){
                      var domeName = $scope.service.interfaceModel.inParams[key].name;
                      if(document.getElementById(domeName)){
                        var domeValue = document.getElementById(domeName).value;
                        if(domeValue){
                          $scope.service.interfaceModel.inParams[key].value = domeValue;
                        }
                      }else{
                        $scope.service.interfaceModel.inParams[key].value = $scope.service.interfaceModel.inParams[key].defaultValue;
                      }
                    }
                  }
                  if($scope.service.interfaceModel && $scope.service.interfaceModel.inParams) {
                      for (var key in $scope.service.interfaceModel.inParams) {
                          // Escape double quotes since values will be passed as JSON strings
                          $scope.service.interfaceModel.inParams[key].value = $scope.service.interfaceModel.inParams[key].value.replace(/"/g, '\\"');
                      }
                  }
                    domeModel.runModel({
                        serviceId : $scope.service.id.toString(),
                        inParams: $scope.service.interfaceModel.inParams,
                        outParams: $scope.service.interfaceModel.outParams
                    }, runModelCallback, runModelErrorCallback);
                }else{
                    toastModel.showToast('error', 'Dome server is not found!');
                }
            }

            // get random integer from min to max
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // update service status
            function getUpdatedStatus(id){
                ajax.get(dataFactory.getServiceRun(id),{},
                    function(response){
                        $scope.service.currentStatus = response.data;
                        $scope.status = getStatus(response.data.status);
                    }
                );
            }

            function updateStatusAndPoll() {
                $scope.service.interfaceModel.inputs = [];
                for (var key in $scope.service.interfaceModel.inParams) {
                    $scope.service.interfaceModel.inParams[key].defaultValue = $scope.service.interfaceModel.inParams[key].value;
                    // $scope.service.interfaceModel.inParams[key].value = $scope.service.currentStatus.interface.inParams[key].value;
                    $scope.service.interfaceModel.inputs.push($scope.service.interfaceModel.inParams[key]);
                }
                for (var key in $scope.service.interfaceModel.outParams) {
                    $scope.service.interfaceModel.outParams[key].value = null;
                }
                $scope.changedValue();
                updatePositionInputs();
                startPolling({runId: $scope.service.currentStatus.id });
                apply();
            }

            function updateAverageRun(){
                ajax.get(dataFactory.services($scope.service.id).get_run_history, {
                        _sort: 'id',
                        _order: 'DESC',
                        status_ne : 'running'
                    }, function(response){
                        var history = response.data;
                        var time = 0;
                        for(var i in history){
                            time += parseFloat($scope.calcRunTime(history[i]));
                        }
                        var averageRun = time/history.length;
                        var updatedItem = $.extend(true, {}, $scope.service.__serviceData);
                        updatedItem.averageRun = averageRun;
                        ajax.update(dataFactory.services($scope.service.id).update, updatedItem,
                            function(response){
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
                    'serviceId': $scope.service.id,
                    'positions': []
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
                            toastModel.showToast('success', 'Order successfully saved');
                        }
                    );
                }else{
                    ajax.update(dataFactory.services($scope.service.position_inputs.id).update_position_inputs, {
                            positions : dataRequest.positions
                        }, function (response) {
                            $scope.isChangedOrder = false;
                            $scope.service.position_inputs = response.data;
                            toastModel.showToast('success', 'Order successfully changed');
                        }
                    );
                }
            }

            // service is still running
            if ($scope.service.currentStatus && $scope.service.currentStatus.status == 0) {
                updateStatusAndPoll($scope.service.currentStatus.id);
            }


            $scope.loadProjects = function() {
              if (!$scope.projects) {
                // get all projects for file inputs
                ajax.get(dataFactory.getMyProjects(),{
                  _limit: 300
                },function(response){
                  $scope.projects = response.data.content;
                });
              }
            };

            $scope.updateFileList = function(inputFile) {
              if (document.getElementById('inputFile')) {
                document.getElementById('inputFile').value = "";
              } else {
                $scope.service.interfaceModel.inParams["inputFile"].value = "";
              }
              getFiles(inputFile.projectModel.directoryId);
            }

            function getFiles(dirId){
              ajax.get(dataFactory.directoriesUrl(dirId).files, {}, function(docResp){
                $scope.projectFiles = docResp.data||[];
              });
            }

            $scope.setinputFileValue = function(file) {
              if (document.getElementById('inputFile')) {
                document.getElementById('inputFile').value = file.documentUrl;
              } else {
                $scope.service.interfaceModel.inParams["inputFile"].value = file.documentUrl;
              }
            }

            function setVPCData(fieldId){
              ajax.get(dataFactory.getMyVPC(), {}, function(response){
                document.getElementById(fieldId).value = response.data.myVPC;
              });
            }

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

        }
    ]
);
