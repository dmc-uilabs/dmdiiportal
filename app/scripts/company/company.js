'use strict';
angular.module('dmc.company', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'ngSanitize',
    'ui.sortable',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.company',
    "dmc.ajax",
    "dmc.data",
    'dmc.component.treemenu',
    'dmc.component.productscard',
    'dmc.component.productcard',
    'dmc.component.carousel',
    'dmc.compare',
    'dmc.model.fileModel',
    'dmc.model.fileUpload',
    'dmc.model.toast-model',
    'dmc.component.products-filter',
    'flow',
    'ng-autofocus'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('company', {
        url: '/:companyId',
        controller: 'CompanyIdLocatorCtrl',
        template: '<ui-view />',
        resolve: {
            companyData: ['CompanyModel', '$stateParams',
                function(CompanyModel, $stateParams) {
                    return CompanyModel.getModel($stateParams.companyId);
                }]
        }
    }).state('company.storefront', {
        url: '/storefront?product?type?mw',
        controller: 'StorefrontCompanyCtr',
        templateUrl: 'templates/company/storefront.html',
        resolve: {
            companyData: ['CompanyModel', '$stateParams',
                function(CompanyModel, $stateParams) {
                    return CompanyModel.getModel($stateParams.companyId);
                }]
        }
    }).state('company.edit', {
        url: '/edit?product?type?authors?ratings?favorites?dates?text?mw',
        controller: 'EditStorefrontCompanyCtr',
        templateUrl: 'templates/company/edit.html',
        resolve: {
            companyData: ['CompanyModel', '$stateParams',
                function(CompanyModel, $stateParams) {
                    return CompanyModel.getModel($stateParams.companyId);
                }]
        }
    }).state('company.search', {
        url: '/search?product?type?authors?ratings?favorites?dates?text?mw',
        controller: 'StorefrontCompanyCtr',
        templateUrl: 'templates/company/storefront.html',
        resolve: {
            companyData: ['CompanyModel', '$stateParams',
                function(CompanyModel, $stateParams) {
                    return CompanyModel.getModel($stateParams.companyId);
                }]
        }
    });
    $urlRouterProvider.otherwise('/1');
}).controller('CompanyIdLocatorCtrl', [ '$stateParams', '$state', function ($stateParams, $state) {
        var companyId = $stateParams.companyId;
        if (companyId === "" || !angular.isDefined($stateParams.companyId)) {
            location.href = "/";
        }
        var hash = window.location.hash;
        if (hash.lastIndexOf('/') == hash.indexOf('/')) {
            $state.go('company.storefront', {companyId: companyId, product : 'all'})
        }
}]).service('menuCompany', ['$location','$stateParams',function ($location,$stateParams) {
    this.getMenu = function(){
        var dataSearch = $.extend(true,{},$stateParams);
        var searchPage = ($location.$$path.indexOf("/edit") != -1 ? "edit" : "search");
        return {
            title: 'BROWSE BY',
            data: [
                {
                    'id': 1,
                    'title': 'All',
                    'tag' : 'all',
                    'items': 45,
                    'opened' : (dataSearch.product == 'all' ? true : false),
                    'onClick' : function(){
                        dataSearch.product = 'all';
                        $location.path('/'+dataSearch.companyId+'/'+searchPage).search(dataSearch);
                    },
                    'categories': []
                },
                {
                    'id': 2,
                    'title': 'Components',
                    'tag' : 'components',
                    'items': 13,
                    'opened' : (dataSearch.product == 'components' ? true : false),
                    'onClick' : function(){
                        dataSearch.product = 'components';
                        $location.path('/'+dataSearch.companyId+'/'+searchPage).search(dataSearch);
                    },
                    'categories': []
                },
                {
                    'id': 3,
                    'title': 'Services',
                    'tag' : 'services',
                    'items': 32,
                    'opened' : (dataSearch.product == 'services' ? true : false),
                    'onClick' : function(){
                        dataSearch.product = 'services';
                        $location.path('/'+dataSearch.companyId+'/'+searchPage).search(dataSearch);
                    },
                    'categories': [
                        {
                            'id': 31,
                            'title': 'Analytical Services',
                            'tag' : 'analytical',
                            'items': 15,
                            'opened' : (dataSearch.product == 'services' && dataSearch.type == 'analytical' ? true : false),
                            'onClick' : function(){
                                dataSearch.product = 'services';
                                dataSearch.type = 'analytical';
                                $location.path('/'+dataSearch.companyId+'/'+searchPage).search(dataSearch);
                            },
                            'categories': []
                        },
                        {
                            'id': 32,
                            'title': 'Solid Services',
                            'tag' : 'solid',
                            'items': 15,
                            'opened' : (dataSearch.product == 'services' && dataSearch.type == 'solid' ? true : false),
                            'onClick' : function(){
                                dataSearch.product = 'services';
                                dataSearch.type = 'solid';
                                $location.path('/'+dataSearch.companyId+'/'+searchPage).search(dataSearch);
                            },
                            'categories': []
                        },
                        {
                            'id': 33,
                            'title': 'Data Services',
                            'tag' : 'data',
                            'items': 2,
                            'opened' : (dataSearch.product == 'services' && dataSearch.type == 'data' ? true : false),
                            'onClick' : function(){
                                dataSearch.product = 'services';
                                dataSearch.type = 'data';
                                $location.path('/'+dataSearch.companyId+'/'+searchPage).search(dataSearch);
                            },
                            'categories': []
                        }
                    ]
                }
            ]
        };
    };
}]);