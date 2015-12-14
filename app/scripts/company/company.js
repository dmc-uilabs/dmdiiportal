'use strict';
angular.module('dmc.company', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.company',
    "dmc.ajax",
    'dmc.component.treemenu',
    'dmc.component.productscard',
    'dmc.component.productcard',
    'dmc.component.carousel',
    'dmc.compare'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('company', {
        url: '/:companyId',
        controller: 'CompanyIdLocatorCtrl',
        template: '<ui-view />',
        resolve: {
            projectData: ['CompanyModel', '$stateParams',
                function(CompanyModel, $stateParams) {
                    return CompanyModel.getModel($stateParams.companyId);
                }]
        }
    }).state('company.storefront', {
        url: '/storefront/:page?type',
        controller: 'StorefrontCompanyCtr',
        templateUrl: 'templates/company/storefront.html'
    }).state('company.edit', {
        url: '/edit',
        controller: 'EditStorefrontCompanyCtr',
        templateUrl: 'templates/company/edit.html'
    });
    $urlRouterProvider.otherwise('/1');
}).controller('CompanyIdLocatorCtrl', [ '$stateParams', '$state', function ($stateParams, $state) {
        var companyId = $stateParams.companyId;
        if (companyId === "" || !angular.isDefined($stateParams.companyId)) {
            location.href = "/";
        }
        var hash = window.location.hash;
        if (hash.lastIndexOf('/') == hash.indexOf('/')) {
            $state.go('company.storefront', {companyId: companyId, page : 'services'})
        }
}]);