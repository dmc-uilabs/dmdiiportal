'use strict';
angular.module('dmc.company', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'ngSanitize',
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
    'flow'
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
        url: '/storefront/:page?type?text',
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
        //console.log(companyData);
        var hash = window.location.hash;
        if (hash.lastIndexOf('/') == hash.indexOf('/')) {
            $state.go('company.storefront', {companyId: companyId, page : 'services'})
        }
}]).service('menuCompany', ['$location',function ($location) {
    this.getMenu = function(selectedProductType,pageType,companyId){
        return {
            title: 'BROWSE BY',
            data: [
                {
                    'id': 1,
                    'title': 'All',
                    'tag' : 'all',
                    'items': 45,
                    'opened' : (selectedProductType == 'all' ? true : false),
                    'onClick' : function(){
                        $location.url(companyId+'/storefront/all');
                    },
                    'categories': []
                },
                {
                    'id': 2,
                    'title': 'Components',
                    'tag' : 'components',
                    'items': 13,
                    'opened' : (selectedProductType == 'components' ? true : false),
                    'onClick' : function(){
                        $location.url(companyId+'/storefront/components');
                    },
                    'categories': []
                },
                {
                    'id': 3,
                    'title': 'Services',
                    'tag' : 'services',
                    'items': 32,
                    'opened' : (selectedProductType == 'services' ? true : false),
                    'onClick' : function(){
                        $location.url(companyId+'/storefront/services');
                    },
                    'categories': [
                        {
                            'id': 31,
                            'title': 'Analytical Services',
                            'tag' : 'analytical',
                            'items': 15,
                            'opened' : (selectedProductType == 'services' && pageType == 'analytical' ? true : false),
                            'onClick' : function(){
                                $location.url(companyId+'/storefront/services?type=analytical');
                            },
                            'categories': []
                        },
                        {
                            'id': 32,
                            'title': 'Solid Services',
                            'tag' : 'solid',
                            'items': 15,
                            'opened' : (selectedProductType == 'services' && pageType == 'solid' ? true : false),
                            'onClick' : function(){
                                $location.url(companyId+'/storefront/services?type=solid');
                            },
                            'categories': []
                        },
                        {
                            'id': 33,
                            'title': 'Data Services',
                            'tag' : 'data',
                            'items': 2,
                            'opened' : (selectedProductType == 'services' && pageType == 'data' ? true : false),
                            'onClick' : function(){
                                $location.url(companyId+'/storefront/services?type=data');
                            },
                            'categories': []
                        }
                    ]
                }
            ]
        };
    };
}]);