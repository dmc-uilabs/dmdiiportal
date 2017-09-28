'use strict';

angular.module('dmc.sub-nav-menu',[
    ]).
    directive('subNavMenuButton', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/sub-nav-menu/sub-nav-menu-button-tpl.html',
            scope: {
                currentPage : "=",
                menuType: "="
            },
            link: function (scope, iElement, iAttrs) {
                iElement.addClass('nav-menu-button');
            },
            controller: function($scope, $element, $attrs,$mdDialog) {
                if($scope.menuType === 'rfp') {
                    $scope.pages = RfpSubNavPages;
                }else{
                    $scope.pages = SubNavPages;
                }

                $scope.getCurrentPageName = function(){
                    var title = null;
                    for(var i in $scope.pages){
                        if(parseInt($scope.pages[i].id) == parseInt($scope.currentPage)){
                            title = $scope.pages[i].title;
                            break;
                        }
                    }
                    return title;
                };

                $scope.currentPageName = $scope.getCurrentPageName();


                $element.on("click",".button-sub-nav",function(event){
                    $mdDialog.show({
                        controller: "SubNavDialogController",
                        templateUrl: 'templates/components/sub-nav-menu/sub-nav-dialog.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        clickOutsideToClose: true,
                        locals : {
                            currentPage : $scope.currentPage,
                            pages : $scope.pages
                        }
                    })
                });
            }
        };
    }]).controller('SubNavDialogController',function($scope,$mdDialog,currentPage,$compile,pages){
        $scope.pages = pages;
        $scope.currentPage = currentPage;
        $scope.cancel = function() {
            $mdDialog.cancel(false);
        };
        $scope.openPage = function(){
            $mdDialog.cancel(false);
        };
    });

var SubNavPages = [
    {
        id : 1,
        title : 'Home',
        icon : 'home',
        state : 'project.home'
    },
    //{
    //    id : 2,
    //    title : 'Workspace',
    //    icon : 'view_quilt',
    //    state : 'project.workspace'
    //},
    {
        id : 3,
        title : 'Documents',
        icon : 'my_library_books',
        state : 'project.documents'
    },
    {
        id : 7,
        title : 'Services',
        icon : 'icon_service-white',
        location : 'folder',
        state : 'project.services'
    },
    {
        id : 5,
        title : 'Team',
        icon : 'people',
        state : 'project.team'
    },
    {
        id : 6,
        title : 'Discussions',
        icon : 'forum',
        state : 'project.discussions'
    },
    {
        id : 4,
        title : 'Tasks',
        icon : 'list',
        state : 'project.tasks'
    }
    //{
    //    id : 8,
    //    title : 'Components',
    //    icon : 'receipt',
    //    state : 'project.components'
    //}
];

var RfpSubNavPages = [
    {
        id : 1,
        title : 'Home',
        icon : 'home',
        state : 'project.rfp-home'
    },
    {
        id : 2,
        title : 'Submissions',
        icon : 'shop_two',
        state : 'project.rfp-submissions'
    },
    {
        id : 3,
        title : 'Documents',
        icon : 'my_library_books',
        state : 'project.rfp-documents'
    },
    {
        id : 4,
        title : 'Questions',
        icon : 'live_help',
        state : 'project.rfp-questions'
    },
    {
        id : 5,
        title : 'People Invited',
        icon : 'group_add',
        state : 'project.rfp-people-invited'
    }
];