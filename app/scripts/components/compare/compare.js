'use strict';
//var modalWindowFromLink = null;
angular.module('dmc.compare',[
        'dmc.ajax',
        'dmc.data',
        'ngMaterial',
        'ngMdIcons',
        'ngCookies',
        'dmc.component.productcard',
        'ngtimeago',
        'ngRoute',
        'dmc.component.product-card-buttons'
    ]).service('CompareModel', ['ajax', 'dataFactory','toastModel','$q','$http','$rootScope',
    function(ajax, dataFactory,toastModel,$q,$http,$rootScope) {

        this.get = function(type,user) {
            if(!$rootScope.comparedServices) {
                ajax.get(dataFactory.compare(user.profileId, type).userCompares, {}, function (response) {
                    $rootScope.comparedServices = {services: response.data, components: []};
                    $rootScope.comparedServicesIds = {services: $.map(response.data,function(x){ return x.serviceId; }), components: []};
                });
            }
        };

        this.add = function(type,data){
            if($rootScope.comparedServicesIds.services.indexOf(data.serviceId) == -1) {
                ajax.create(dataFactory.compare(null, type).add, data, function (response) {
                    $rootScope.comparedServices.services.push(response.data);
                    $rootScope.comparedServicesIds.services.push(+response.data.serviceId);
                });
            }
        };

        this.delete = function(type,serviceId,callback){
            var compareId = null;
            for(var i in $rootScope.comparedServices.services){
                if($rootScope.comparedServices.services[i].serviceId == serviceId){
                    compareId = $rootScope.comparedServices.services[i].id;
                    break;
                }
            }
            if(compareId) {
                ajax.delete(dataFactory.compare(compareId, type).delete, {}, function () {
                    for (var i in $rootScope.comparedServices.services) {
                        if ($rootScope.comparedServices.services[i].id == compareId) {
                            $rootScope.comparedServices.services.splice(i, 1);
                            break;
                        }
                    }
                    if($rootScope.comparedServicesIds.services.indexOf(serviceId) != -1){
                        $rootScope.comparedServicesIds.services.splice($rootScope.comparedServicesIds.services.indexOf(serviceId), 1);
                    }
                    if(callback) callback();
                });
            }
        };

        this.deleteAll = function(type){
            if($rootScope.comparedServices && $rootScope.comparedServices.services && $rootScope.comparedServices.services.length > 0) {
                var promises = {};
                for (var i in $rootScope.comparedServices.services) {
                    promises["service" + $rootScope.comparedServices.services[i].id] = $http.delete(dataFactory.compare($rootScope.comparedServices.services[i].id, type).delete);
                }
                return $q.all(promises).then(function(responses){
                        $rootScope.comparedServices = {services : [], components : []};
                        $rootScope.comparedServicesIds = {services : [], components : []};
                    },
                    function(response){
                        toastModel.showToast("error", "Error." + response.statusText);
                    }
                );
            }
        };

    }])
    .controller('CompareController',function($scope,DMCUserModel,$mdDialog,$cookies,ajax,dataFactory,isFavorite,$rootScope,CompareModel){
        $scope.currentProductType = 'service';
        $scope.switchProductType = function(type){
            $scope.currentProductType = type;
        };

        var userData = null;
        DMCUserModel.getUserData().then(function(res){
            userData = res;
            CompareModel.get("services",userData);
        });

        $scope.products = {arr : [], count : 0};
        $scope.projects = [];
        $scope.itemClass = '';

        $scope.getItemClass = function(){
            var count = $scope.products.arr.length;
            if(count == 1){
                return 'width-100';
            }else if(count == 2){
                return 'width-50';
            }else{
                return 'width-33';
            }
        };

        $scope.clearAll = function(){
            CompareModel.deleteAll("services");
            $scope.cancel();
        };

        // get services
        $scope.getServices = function(){
            if($rootScope.comparedServices.services.length > 0) {
                ajax.get(dataFactory.getServices(), {
                        id : $rootScope.comparedServicesIds.services
                    }, function (response) {
                        $scope.products.arr = $.merge($scope.products.arr, response.data);
                        getTags($.map($scope.products.arr,function(x){ return x.id; }));
                        isFavorite.check($scope.products.arr);
                        angular.forEach($scope.products.arr, function(product, index) {
                            ajax.get(dataFactory.documentsUrl().getList, {parentType: 'SERVICE', parentId: product.id, docClass: 'IMAGE', recent: 5}, function(response) {
                                if(response.data && response.data.data && response.data.data.length) {
                                    $scope.products.arr[index].images = response.data.data;
                                }
                            });

                            ajax.get(dataFactory.userAccount(product.owner).get, {}, function(response) {
                                $scope.products.arr[index].ownerName = response.data.displayName;
                            });
                        });
                        $scope.products.count += response.data.length;
                        if (response.data.length > 0) $scope.switchProductType('service');
                        $scope.itemClass = $scope.getItemClass();
                        apply();
                    }
                );
            }
        };
        $scope.getServices();

        function getTags(ids){
            ajax.get(dataFactory.getServicesTags(),{
                serviceId : ids
            },function(response){
                for(var i in response.data){
                    for(var j in $scope.products.arr){
                        if(response.data[i].serviceId == $scope.products.arr[j].id){
                            if(!$scope.products.arr[j].tags) $scope.products.arr[j].tags = [];
                            $scope.products.arr[j].tags.push(response.data[i]);
                            break;
                        }
                    }
                };
                apply();
            })
        }

        $scope.searchByTag = function(e){
            $scope.cancel();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.inLeftCount = 0;
        $scope.scrollLeft = function(){
            $scope.inLeftCount++;
            $(".compare-list-products .row").each(function(){
                $(this).find(".column:nth-child("+($scope.inLeftCount+1)+")").animate({
                    opacity:0
                },300);
                var width = 268.5;
                $(this).find(".column:nth-child(2)").animate({
                    marginLeft: -1*(($scope.inLeftCount*width)+(2*$scope.inLeftCount)+(2*($scope.inLeftCount-1)))
                },300);
            });
        };
        $scope.scrollRight = function(){
            $scope.inLeftCount--;
            $(".compare-list-products .row").each(function(){
                $(this).find(".column:nth-child("+($scope.inLeftCount+2)+")").animate({
                    opacity:1
                },300);
                var width = 268.5;
                $(this).find(".column:nth-child(2)").animate({
                    marginLeft: -1*(($scope.inLeftCount*width)+(2*$scope.inLeftCount)+(2*($scope.inLeftCount-1)))
                },300);
            });
        };
        $scope.removeFromCompare = function(id,type){
            CompareModel.delete("services",id,function(){
                $scope.removeFromArray(id,type);
            });
        };
        $scope.removeFromArray = function(id,type){
            for(var i=0;i<$scope.products.arr.length;i++){
                if(parseInt($scope.products.arr[i].id) == parseInt(id) && $scope.products.arr[i].type == type){
                    $scope.products.arr.splice(i,1);
                    $scope.itemClass = $scope.getItemClass();
                    apply();
                    break;
                }
            }
            if($scope.products.arr.length == 0) $scope.cancel();
        };

        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };

        // get all projects
        $scope.getProjects = function(){
            ajax.get(dataFactory.getProjects(),{
                _sort : "id",
                _order: "DESC",
                _start: 0
            },function(response){
                $scope.projects = response.data;
                apply();
            });
        };

        // $scope.loadProjects = function() {
        //     $scope.projects = $scope.$root.projects;
        // };
        // 
        // $scope.cancelAddToProject = function(item){
        //     item.addingToProject = null;
        // };
        // 
        // $scope.addToProject = function(item){
        //     item.addingToProject = true;
        // };
        // 
        // $scope.addedTimout = null;
        // 
        // $scope.backToAdd = function(item){
        //     item.added = false;
        //     //clearTimeout($scope.addedTimeout);
        //     apply();
        // };
        // 
        // $scope.saveToProject = function(projectId, item, index){
        //     var project = null;
        //     for(var i in $scope.projects){
        //         if($scope.projects[i].id == projectId){
        //             project = $scope.projects[i];
        //             break;
        //         }
        //     }
        // 
        //     if(project) {
        //         var updatedItem = $.extend(true, {}, $scope.products.arr[index]);
        //         if (updatedItem.hasOwnProperty('$$hashKey')) {
        //             delete updatedItem['$$hashKey'];
        //         }
        //         updatedItem.currentStatus = {
        //             project: {
        //                 id: project.id,
        //                 title: project.title
        //             }
        //         };
        //         updatedItem.owner = userData.accountId;
        //         updatedItem.projectId = project.id;
        //         updatedItem.from = 'marketplace';
        //         updatedItem.published = false;
        //         delete updatedItem.tags;
        //         
        //         ajax.create(dataFactory.services().add, updatedItem, function (response) {
        //             var id = response.data.id;
        //             $scope.cancelAddToProject(item);
        //             angular.forEach($scope.products.arr[index].tags, function(tag) {
        //                 delete tag.id;
        //                 tag.serviceId = id;
        //                 ajax.create(dataFactory.services(id).add_tags, tag);
        //             });
        //             if ($scope.products.arr[index].images && $scope.products.arr[index].images.length) {
        //                 angular.forEach($scope.products.arr[index].images, function(image) {
        //                     delete image.id;
        //                     image.ownerId = userData.accountId;
        //                     image.parentId = id;
        //                     ajax.create(dataFactory.documentsUrl().save, image)
        //                 });
        //             };
        //             ajax.get(dataFactory.services(item.id).get_interface, {}, function(response) {
        //                 angular.forEach(response.data, function(newDomeInterface) {
        //                     delete newDomeInterface.id;
        //                     newDomeInterface.serviceId = id;
        //                     ajax.create(dataFactory.services().add_interface, newDomeInterface);
        //                 });
        //             });
        // 
        //             if(!$scope.products.arr[index].currentStatus) $scope.products.arr[index].currentStatus = {};
        //             if(!$scope.products.arr[index].currentStatus.project) $scope.products.arr[index].currentStatus.project = {};
        //             $scope.products.arr[index].currentStatus.project.id = projectId;
        //             $scope.products.arr[index].currentStatus.project.title = project.title;
        //             $scope.products.arr[index].projectId = projectId;
        //             $scope.products.arr[index].added = true;
        // 
        //             $scope.products.arr[index].lastProject = {
        //                 title: project.title,
        //                 href: '/project.php#/' + project.id + '/home'
        //             };
        //             $scope.addedTimeout = setTimeout(function () {
        //                 $scope.products.arr[index].added = false;
        //                 apply();
        //             }, 20000);
        //             apply();
        //         });
        //     }
        // };

        $scope.addToFavorite = function(item){
            if(!item.favorite){
                // add to favorites
                var requestData = { "accountId": 1 };
                if(item.type == "service"){
                    requestData.serviceId = item.id;
                }else if(item.type == "component"){
                    requestData.componentId = item.id;
                }
                ajax.create(dataFactory.addFavorite(), requestData, function(response){
                    item.favorite = response.data;
                    apply();
                });
            }else{
                // remove from favorites
                ajax.delete(dataFactory.deleteFavorite(item.favorite.id), {}, function(response){
                    item.favorite = null;
                    apply();
                });
            }
        };
    })
    .directive('compareButton', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            controller: function($element,$scope,$mdDialog,$location,$stateParams){

                $element.on("click",function(ev){
                    if($(this).attr("disabled") == null) {
                        $(window).scrollTop(0);
                        $('html').addClass('hide-scroll');
                        $mdDialog.show({
                            controller: "CompareController",
                            templateUrl: 'templates/components/compare/compare-tpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true
                        }).then(function (answer) {
                            $('html').removeClass('hide-scroll');
                        }, function () {
                            $('html').removeClass('hide-scroll');
                        });
                    }
                });
            }
        };
    }]).run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        var original = $location.path;
        $location.path = function (path, notReload) {
            if (notReload === true) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };
    }])
    .controller('CompareMembersController',function($scope,$mdDialog,$cookies,ajax,dataFactory,compare,invitees){
        $scope.compareMembers = compare;
        $scope.inviteesSource = invitees;
        $scope.inLeftCount = 0;

        $scope.itemClass = '';

        $scope.getItemClass = function(){
            var count = $scope.compareMembers.length;
            if(count == 1){
                return 'width-100';
            }else if(count == 2){
                return 'width-50';
            }else if(count == 3){
                return 'width-33';
            }else{
                return '';
            }
        };
        $scope.itemClass = $scope.getItemClass();

        $scope.clearAll = function(){
            //$scope.compareMembers = null;
            $scope.compareMembers.splice(0);
            $scope.cancel();
        };

        $scope.scrollLeft = function(){
            $scope.inLeftCount++;
            $(".compare-list-products .row").each(function(){
                $(this).find(".column:nth-child("+($scope.inLeftCount+1)+")").animate({
                    opacity:0.34
                },100);
                $(this).find(".column:nth-child(2)").animate({
                    marginLeft: -1*(($scope.inLeftCount*200)+(2*$scope.inLeftCount)+(2*($scope.inLeftCount-1)))
                },300);
            });
        };
        $scope.scrollRight = function(){
            $scope.inLeftCount--;
            $(".compare-list-products .row").each(function(){
                $(this).find(".column:nth-child("+($scope.inLeftCount+2)+")").animate({
                    opacity:1
                },100);
                $(this).find(".column:nth-child(2)").animate({
                    marginLeft: -1*(($scope.inLeftCount*200)+(2*$scope.inLeftCount)+(2*($scope.inLeftCount-1)))
                },300);
            });
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.removeFromCompare = function(id){
            for(var i in $scope.compareMembers){
                if($scope.compareMembers[i].id === id){
                    $scope.compareMembers.splice(i,1);
                    $scope.itemClass = $scope.getItemClass();
                    break;
                }
            }
            if($scope.compareMembers.length == 0){
                $scope.cancel();
            }
        };

        $scope.removeFromInvites = function(item){
            for(var i in $scope.inviteesSource){
                if($scope.inviteesSource[i].id === item.id){
                    $scope.inviteesSource.splice(i,1);
                    break;
                }
            }
        };

        $scope.addToInvites = function(item){
            var found = false;
            for(var i in $scope.inviteesSource){
                if($scope.inviteesSource[i].id === item.id){
                    found == true;
                    break;
                }
            }
            if(!found) $scope.inviteesSource.push(item);
        };
    })
    .directive('compareMembersButton', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            scope: {
                compareSource : '=',
                inviteesSource : '='
            },
            controller: function($element,$scope,$mdDialog){
                $element.on("click",function(ev){
                    if($(this).attr("disabled") == null) {
                        $(window).scrollTop(0);
                        $('html').addClass('hide-scroll');
                        $mdDialog.show({
                            controller: "CompareMembersController",
                            templateUrl: 'templates/components/compare/compare-members-tpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: false,
                            locals : {
                                compare : $scope.compareSource,
                                invitees : $scope.inviteesSource
                            }
                        }).then(function (answer) {
                            $('html').removeClass('hide-scroll');
                        }, function () {
                            $('html').removeClass('hide-scroll');
                        });
                    }
                });
            }
        };
    }]);
