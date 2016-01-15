'use strict';
var modalWindowFromLink = null;
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
    .controller('CompareController',function($scope,$mdDialog,$cookies,Products,ajax,dataFactory){
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

        $scope.callbackServices = function(data) {
            $scope.products.arr = $.merge($scope.products.arr, data.result);
            //console.log($scope.products.arr);
            $scope.products.count += data.count;
            if(data.count > 0) $scope.switchProductType('service');
            $scope.itemClass = $scope.getItemClass();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        $scope.callbackComponents = function(data) {
            $scope.products.arr = $.merge($scope.products.arr,data.result);
            //console.log($scope.products.arr);
            $scope.products.count += data.count;
            if(data.count > 0) $scope.switchProductType('component');
            $scope.itemClass = $scope.getItemClass();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };

        Products.get($scope.callbackServices,'services',{
            ids : ($scope.compareProducts.services.length > 0 ? $scope.compareProducts.services : null)
        }); // get services
        Products.get($scope.callbackComponents,'components',{
            ids : ($scope.compareProducts.components.length > 0 ? $scope.compareProducts.components : null)
        }); // get components

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

        $scope.getProjects = function(){
            ajax.on(dataFactory.getUrlAllProjects(),{
                offset: 0
            },function(data){
                $scope.projects = data.result;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            },function(){
                alert("Ajax faild: getProjects");
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
            clearTimeout($scope.addedTimeout);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };
        $scope.saveToProject = function(projectId,item){
            ajax.on(dataFactory.getUrlAddToProject(item.id),{
                id : item.id,
                projectId : projectId,
                type : $scope.typeProduct
            },function(data){
                $scope.cancelAddToProject(item);
                item.currentStatus.project.id = projectId;
                item.projectId = projectId;
                item.added = true;
                var project = null;
                for(var i in $scope.projects){
                    if($scope.projects[i].id == projectId){
                        project = $scope.projects[i];
                        break;
                    }
                }
                item.lastProject = {
                    title : project.title,
                    href : '/project.php#/'+project.id+'/home'
                };
                $scope.addedTimeout = setTimeout(function(){
                    item.added = false;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                },10000);
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            },function(){
                alert("Ajax faild: saveToProject");
            }, 'POST');
        };

        //$scope.saveToProject = function(item){
        //    var pid = item.projectModel;
        //    item.projectModel = null;
        //    ajax.on(dataFactory.getUrlAddToProject(item.id),{
        //        id : item.id,
        //        projectId : pid,
        //        type : item.type
        //    },function(data){
        //        item.addingToProject = null;
        //        item.currentStatus.project.id = pid;
        //        item.projectId = pid;
        //        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        //    },function(){
        //        alert("Ajax faild: saveToProject");
        //    });
        //};

        $scope.removeFromProject = function(item){
            ajax.on(dataFactory.getUrlRemoveFromProject(item.id),{
                id : item.id,
                projectId : item.currentStatus.project.id,
                type : item.type
            },function(data){
                if(data.error == null) {
                    item.currentStatus.project.id = 0;
                    item.currentStatus.project.title = null;
                    item.projectId = 0;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            },function(){
                alert("Ajax faild: saveToProject");
            });
        };

        $scope.addToFavorite = function(item){
            return ajax.on(dataFactory.addProductToFavorite(),{
                productId : item.id,
                productType : item.type
            },function(data){
                if(!data.error) {
                    item.favorite = data.favorite;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }else{
                    alert(data.error);
                }
            },function(){
                alert("Ajax faild: removeFromProject");
            });
        };
    })
    .directive('compareButton', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            controller: function($element,$scope,$mdDialog,$location,$stateParams){

                var path = $location.$$path;
                var url = ($location.$$absUrl.indexOf('?') == -1 ? $location.$$absUrl : $location.$$absUrl.split('?')[0]);
                //get params for link
                var params = $.map($stateParams,function(item,key){
                    if($.type(item) == "array"){
                        return $.map(item,function(value){
                           return key+'='+value;
                        }).join("&");
                    }else {
                        if (key == "mw") item = 'compare';
                        return (item ? key + '=' + item : null);
                    }
                });
                params = params.join('&');
                var href = (params.length > 0 ? url+"?"+params : url);
                $element.attr("href",href);

                var searchObject = $.extend(true,{},$location.search());

                var removeModalWindowAttr = function(){
                    searchObject.mw = null;
                    $location.path(path,true).search(searchObject);
                };

                var addModalWindowAttr = function(){
                    searchObject.mw = 'compare';
                    $location.path(path,true).search(searchObject);
                };

                $element.on("click",function(ev){
                    addModalWindowAttr();
                    modalWindowFromLink = href;
                    ev.preventDefault();
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
                            removeModalWindowAttr();
                            $('html').removeClass('hide-scroll');
                        }, function () {
                            removeModalWindowAttr();
                            $('html').removeClass('hide-scroll');
                        });
                    }
                });

                if(modalWindowFromLink == null && searchObject.mw == "compare"){
                    $element.click();
                }
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