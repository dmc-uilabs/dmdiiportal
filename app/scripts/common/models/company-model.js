'use strict';

angular.module('dmc.model.company', [
    'dmc.data',
    'dmc.ajax',
    'dmc.model.account'
])
    .service('CompanyModel', ['dataFactory', 'ajax', '$http', '$location', '$stateParams','AccountModel',
        function(dataFactory, ajax, $http, $location, $stateParams, AccountModel) {

        this.get = function(id) {
            return ajax.get(dataFactory.companyURL(id).get,{},function(response){
                var data = response.data;
                // get owner
                data.owner = AccountModel.get(data.accountId);

                if(data.accountId == currentAccountId) data.isOwner = true;
                return data;
            },function(response){
                return response.data;
            });
        };

            this.getModel = function(id) {
                return $http.get(dataFactory.getCompanyUrl(id)).then(
                    function(response){
                        var data = dataFactory.get_result(response.data).result
                        return data;
                    },
                    function(response){
                        return response;
                    }
                );
            };

        this.getReviewModel = function(id) {
            return $http.get(dataFactory.getCompanyReviewUrl(id)).then(
                function(response){
                    var data = dataFactory.get_result(response.data).result
                    return data;
                },
                function(response){
                    return response;
                }
            );
        };

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