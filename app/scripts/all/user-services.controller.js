'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllUserServicesController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'toastModel',
        'previousPage',
        '$interval',
        'questionToastModel',
        'dataFactory',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    toastModel,
                    previousPage,
                    $interval,
                    questionToastModel,
                    dataFactory) {


            // comeback to the previous page
            $scope.previousPage = previousPage.get();
            if($scope.previousPage.tag != "community"){
                $scope.previousPage = {
                    tag : "dashboard",
                    title: "Back to Dashboard",
                    url: location.origin+'/dashboard.php'
                }
            }
            $(".bottom-header .active-page").removeClass("active-page");
            if($scope.previousPage.tag == "dashboard"){
                $(".dashboard-header-button").addClass("active-page");
            }else if($scope.previousPage.tag == "my-projects"){
                $(".projects-header-button").addClass("active-page");
            }
            $("title").text("View All Services");

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;
            $scope.typeModel = angular.isDefined($stateParams.type) ? $stateParams.type : "name";


            $scope.services = [];
            $scope.order = "DESC";
            $scope.sort = "-currentStatus.status";

            $scope.types = [
                {
                    tag: "name",
                    name: "Name"
                }, {
                    tag: "releaseDate",
                    name: "Date Added"
                }, {
                    tag: "owner",
                    name: "Added By"
                }
            ];


            var apply = function () {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.submit = function (text) {
                $scope.searchModel = text;
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.text = $scope.searchModel;
                $state.go('user-services', dataSearch, {reload: true});
            };

            $scope.changedType = function (type) {
                var dataSearch = $.extend(true, {}, $stateParams);
                dataSearch.type = type;
                $state.go('user-services', dataSearch, {reload: true});
            };

            var allServices = [];
            $scope.getServices = function(){
                ajax.get(dataFactory.getServices(),{
                        title_like: $scope.searchModel,
                        _type: $scope.typeModel
                    },
                    function(response){
                        allServices = [];
                        for(var i in response.data){
                            if(response.data[i].projectId > 0) allServices.push(response.data[i]);
                        }
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
    
            function getAddedByName(id, index) {
        
                ajax.get(dataFactory.getUserName(id), {}, function (response) {
                    $scope.services[index].addedBy = response.data.displayName;
                }, function (response) {
                    toastModel.showToast("error", "Ajax failed: getUserName");
                    $scope.services[index].addedBy = id;
                });
        
            }

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
                                    if(allServices[i].currentStatus.project.id > 0) {
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
                            if(!allServices[i].currentStatus){
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
                            getAddedByName(this.profileId, index);
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

            $scope.deleteService = function(event,item){
                questionToastModel.show({
                    question: "Are you sure you want to remove this service?",
                    buttons: {
                        ok: function(){
                            var deleteItem = $.extend(true, {}, item.__serviceData);
                            deleteItem.currentStatus = {};
                            deleteItem.projectId = 0;
                            ajax.update(dataFactory.services(item.id).update, deleteItem,
                            function(response){
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



        }
    ]
);