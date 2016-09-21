'use strict';

var currentAccountId = 1;

angular.module('dmc.company', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'ngSanitize',
    'ng-showdown',
    'ui.sortable',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.company',
    'dmc.ajax',
    'dmc.data',
    'dmc.component.treemenu',
    'dmc.component.productscard',
    'dmc.component.productcard',
    'dmc.component.carousel',
    'dmc.model.question-toast-model',
    'dmc.compare',
    'dmc.model.fileModel',
    'dmc.model.fileUpload',
    'dmc.model.toast-model',
    'dmc.component.products-filter',
    'flow',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
    'ng-autofocus'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    var resolve = {
        companyData: ['CompanyModel', '$stateParams',
            function(CompanyModel, $stateParams) {
                return CompanyModel.get($stateParams.companyId);
            }]
    };
    $stateProvider.state('company', {
        url: '/:companyId',
        controller: 'CompanyIdLocatorCtrl',
        template: '<ui-view />'
    }).state('company.storefront', {
        url: '/storefront?product?type',
        controller: 'StorefrontCompanyCtr',
        templateUrl: 'templates/company/storefront.html',
        resolve: resolve
    }).state('company.edit', {
        url: '/edit?product?type?authors?ratings?favorites?dates?text',
        controller: 'EditStorefrontCompanyCtr',
        templateUrl: 'templates/company/edit.html',
        resolve: resolve
    }).state('company.search', {
        url: '/search?product?type?authors?ratings?favorites?dates?text',
        controller: 'StorefrontCompanyCtr',
        templateUrl: 'templates/company/storefront.html',
        resolve: resolve
    });
    $urlRouterProvider.otherwise('/1');
}).controller('CompanyIdLocatorCtrl', ['$stateParams', '$state', function ( $stateParams, $state) {

    var companyId = $stateParams.companyId;
    if (companyId === '' || !angular.isDefined($stateParams.companyId)) {
        location.href = '/';
    }
    var hash = window.location.hash;
    if (hash.lastIndexOf('/') == hash.indexOf('/')) {
        $state.go('company.storefront', {companyId: companyId, product : 'services'})
    }
}])
