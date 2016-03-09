'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.marketplace', [
    'dmc.configs.ngmaterial',
    'ngMdIcons',
    'ui.router',
    'md.data.table',
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ngtimeago',
    'ngCookies',
    'dmc.widgets.documents',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.component.treemenu',
    'dmc.component.productscard',
    'dmc.component.carousel',
    'dmc.compare',
    'dmc.widgets.tasks',
    'dmc.widgets.tabs',
    'dmc.component.products-filter'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('marketplace', {
        url: '/home?product?type?text',
        templateUrl: 'templates/marketplace/marketplace.html',
        controller: 'DMCMarketplaceController',
        resolve: {
            is_search: function() {
                return false;
            }
        }
    }).state('marketplace_search', {
        url: '/search?product?type?authors?ratings?favorites?dates?text?tag',
        templateUrl: 'templates/marketplace/marketplace.html',
        controller: 'DMCMarketplaceController',
        resolve: {
            is_search: function() {
                return true;
            }
        }
    });
    $urlRouterProvider.otherwise('/home?product=services');
});