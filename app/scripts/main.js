'use strict';

angular.module('dmc', [
    'ngMdIcons',
    'ngAnimate',
    'ngCookies',
    'dmc.ajax',
    'dmc.data',
    'dmc.mobile',
    'rfpInvite',
    'dmc.configs.ngmaterial',
    'dmc.widgets.projects',
    'dmc.widgets.services',
    'dmc.widgets.tasks',
    'dmc.widgets.discussions',
    'dmc.widgets.documents',
    'dmc.widgets.components',
    'dmc.widgets.questions',
    'dmc.widgets.submissions',
    'dmc.widgets.invited-users',
    'dmc.component.treemenu',
    'dmc.component.productscard',
    'dmc.component.carousel',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.project',
    'dmc.compare',
    'dmc.sub-nav-menu',
    'ui.router',
    'ui.autocomplete',
    'ngtimeago',
    'md.data.table'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('home', {          // home page
        url: '/home',
        controller: 'HomeCtr',
        templateUrl: 'templates/home/home.html'
    }).state('dashboard', {                 // dashboard page
        url: '/dashboard',
        controller: 'DashboardCtr',
        templateUrl: 'templates/dashboard/dashboard.html'
    }).state('my-projects', {               // my projects page
        url: '/my-projects',
        controller: 'MyProjectsCtr',
        templateUrl: 'templates/my_projects/my_projects.html'
    }).state('invite-challenge', {          // invite challenge page
        url: '/invite-challenge',
        controller: 'InviteChallengeCtr',
        templateUrl: 'templates/invite-challenge/invite-challenge.html'
    }).state('marketplace', {               // marketplace page
        url: '/marketplace/:page?type',
        controller: 'MarketplaceCtr',
        templateUrl: 'templates/marketplace/marketplace.html',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('marketplaceSearch', {         // marketplace search page
        url: '/marketplace/search/:page?type?text',
        templateUrl: 'templates/marketplace/marketplace.html',
        controller: 'MarketplaceCtr',
        resolve: {
            is_search: function() {
                return true;
            }
        }
    }).state('project', {
        url: '/project/:projectId',
        controller: 'IdLocatorCtrl',
        template: '<ui-view />',
        resolve: {
            projectData: ['DMCProjectModel', '$stateParams',
                function(DMCProjectModel, $stateParams) {
                    return DMCProjectModel.getModel($stateParams.projectId);
                }]
        }
    }).state('project.home', {
        url: '/home',
        controller: 'ProjectHomeCtrl as projectCtrl',
        templateUrl: 'templates/project/pages/home.html'
    }).state('project.workspace', {
        url: '/workspace',
        controller: 'WorkspaceCtrl as projectCtrl',
        templateUrl: 'templates/project/pages/workspace.html'
    }).state('project.documents', {
        url: '/documents',
        controller: 'DocumentsCtrl as projectCtrl',
        templateUrl: 'templates/project/pages/documents.html'
    }).state('project.tasks', {
        url: '/tasks',
        controller: 'TasksCtrl as projectCtrl',
        templateUrl: 'templates/project/pages/tasks.html'
    }).state('project.team', {
        url: '/team',
        controller: 'TeamCtrl as projectCtrl',
        templateUrl: 'templates/project/pages/team.html'
    }).state('project.discussions', {
        url: '/discussions',
        controller: 'DiscussionsCtrl as projectCtrl',
        templateUrl: 'templates/project/pages/discussions.html'
    }).state('project.rfp-home', {
        url: '/rfp-home',
        controller: 'RfpHomeCtrl as projectCtrl',
        templateUrl: 'templates/project/rfp/home.html'
    }).state('project.rfp-submissions', {
        url: '/rfp-submissions',
        controller: 'RfpSubmissionsCtrl as projectCtrl',
        templateUrl: 'templates/project/rfp/submissions.html'
    }).state('project.rfp-documents', {
        url: '/rfp-documents',
        controller: 'RfpDocumentsCtrl as projectCtrl',
        templateUrl: 'templates/project/rfp/documents.html'
    }).state('project.rfp-questions', {
        url: '/rfp-questions',
        controller: 'RfpQuestionsCtrl as projectCtrl',
        templateUrl: 'templates/project/rfp/questions.html'
    }).state('project.rfp-people-invited', {
        url: '/rfp-people-invited',
        controller: 'RfpPeopleInvitedCtrl as projectCtrl',
        templateUrl: 'templates/project/rfp/people-invited.html'
    }).state('project.preview', {
        url: '/preview',
        templateUrl: 'templates/project/pages/home.html',
        controller: 'DMCPreviewProjectController as projectCtrl'
    }).state('project.submissionBlank', {
        url: '/submission-blank',
        templateUrl: 'templates/project/blank-submission.html',
        controller: 'DMCBlankSubmissionProjectController as projectCtrl'
    }).state('project.submission', {
        url: '/submission',
        templateUrl: 'templates/project/pages/home.html',
        controller: 'DMCSubmissionProjectController as projectCtrl'
    }).state('project.rfp-blank', {
        url: '/rfp-blank',
        templateUrl: 'templates/project/rfp-home-blank.html',
        controller: 'DMCRfpBlankHomeProjectController as projectCtrl'
    }).state('project.submit', {
        url: '/submit',
        templateUrl: 'templates/project/submit.html',
        controller: 'DMCSubmitProjectController as projectCtrl'
    }).state('project.submitted', {
        url: '/submitted',
        templateUrl: 'templates/project/submitted.html',
        controller: 'DMCSubmittedProjectController as projectCtrl'
    });
    $urlRouterProvider.otherwise('/home');
}).controller("DMCController",["$scope","$state","$rootScope",function($scope,$state,$rootScope){
    $scope.page = "home";
    $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
        $scope.page = toState.name;
    });
}]);


