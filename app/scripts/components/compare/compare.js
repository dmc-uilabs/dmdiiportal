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
        'ngRoute'
    ])
    .controller('CompareController',function($scope,$mdDialog,$cookies,ajax,dataFactory,isFavorite){
        $scope.currentProductType = 'service';
        $scope.switchProductType = function(type){
            $scope.currentProductType = type;
        };
        var updateCompareCount = function(){
            var arr = $cookies.getObject('compareProducts');
            return arr == null ? {services : [], components : []} : arr;
        };

        $scope.compareProducts = updateCompareCount();
        $scope.products = {arr : [], count : 0};
        $scope.projects = [];
        $scope.itemClass = '';

        $scope.getItemClass = function(){
            var count = $scope.products.arr.length;
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

        $scope.clearAll = function(){
            $cookies.remove('compareProducts');
            $cookies.changedCompare = new Date();
            $scope.cancel();
        };

        // get services
        $scope.getServices = function(){
            if($scope.compareProducts.services.length > 0) {
                ajax.get(dataFactory.getServices(), {
                        id : $scope.compareProducts.services
                    }, function (response) {
                        $scope.products.arr = $.merge($scope.products.arr, response.data);
                        getTags($.map($scope.products.arr,function(x){ return x.id; }));
                        isFavorite.check($scope.products.arr);
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

        // get components
        $scope.getComponents = function(){
            if($scope.compareProducts.components.length > 0) {
                ajax.get(dataFactory.getComponents(), {
                        id : $scope.compareProducts.components
                    }, function (response) {
                        $scope.products.arr = $.merge($scope.products.arr, response.data);
                        $scope.products.count += response.data.length;
                        if (response.data.length > 0) $scope.switchProductType('component');
                        $scope.itemClass = $scope.getItemClass();
                        apply();
                    }
                );
            }
        };
        $scope.getComponents();

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.inLeftCount = 0;
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
        $scope.removeFromCompare = function(id,type){
            var compareProducts = $cookies.getObject('compareProducts');
            if(compareProducts != null){
                if(type == 'service') {
                    if($.inArray( parseInt(id), compareProducts.services ) != -1){
                        compareProducts.services.splice( $.inArray(parseInt(id), compareProducts.services), 1);
                        $cookies.putObject('compareProducts', compareProducts);
                        $cookies.changedCompare = new Date();
                        $scope.removeFromArray(id,type);
                    }
                }else if(type == 'component'){
                    if($.inArray( parseInt(id), compareProducts.components ) != -1){
                        compareProducts.components.splice($.inArray(parseInt(id), compareProducts.components), 1);
                        $cookies.putObject('compareProducts', compareProducts);
                        $cookies.changedCompare = new Date();
                        $scope.removeFromArray(id,type);
                    }
                }
            }
        };
        $scope.removeFromArray = function(id,type){
            for(var i=0;i<$scope.products.arr.length;i++){
                if(parseInt($scope.products.arr[i].id) == parseInt(id) && $scope.products.arr[i].type == type){
                    $scope.products.arr.splice(i,1);
                    $scope.itemClass = $scope.getItemClass();
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
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

        $scope.loadProjects = function() {
            $scope.projects = $scope.$root.projects;
        };

        $scope.cancelAddToProject = function(item){
            item.addingToProject = null;
        };

        $scope.addToProject = function(item){
            item.addingToProject = true;
        };

        $scope.addedTimout = null;

        $scope.backToAdd = function(item){
            item.added = false;
            //clearTimeout($scope.addedTimeout);
            apply();
        };

        $scope.saveToProject = function(projectId,item){
            var project = null;
            for(var i in $scope.projects){
                if($scope.projects[i].id == projectId){
                    project = $scope.projects[i];
                    break;
                }
            }
            if(project) {
                ajax.update(dataFactory.addServiceToProject(item.id), {
                        currentStatus: {
                            project: {
                                id: project.id,
                                title: project.title
                            }
                        },
                        projectId: projectId,
                        from: 'marketplace'
                    }, function (response) {
                        $scope.cancelAddToProject(item);
                        item.currentStatus.project.id = projectId;
                        item.currentStatus.project.title = project.title;
                        item.projectId = projectId;
                        item.added = true;

                        item.lastProject = {
                            title: project.title,
                            href: '/project.php#/' + project.id + '/home'
                        };
                        $scope.addedTimeout = setTimeout(function () {
                            item.added = false;
                            apply();
                        }, 10000);
                        apply();
                    }
                );
            }
        };

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