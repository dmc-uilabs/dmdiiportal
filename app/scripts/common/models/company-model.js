'use strict';

angular.module('dmc.model.company', [
    'dmc.data',
    'dmc.ajax',
    'dmc.model.account'
])
    .service('CompanyModel', ['dataFactory', 'ajax', '$http', '$location', '$stateParams','AccountModel',
        function(dataFactory, ajax, $http, $location, $stateParams, AccountModel) {

        this.get = function(id) {
            return ajax.get(dataFactory.companyURL(id).get,{
                "_expand" : "account"
            },function(response){
                var data = response.data;
                if(data.accountId == currentAccountId) data.isOwner = true;
                ajax.get(dataFactory.followCompany(),{
                        accountId : currentAccountId,
                        companyId : data.id
                    }, function(res){
                        if(res.data.length > 0) data.follow = res.data[0];
                    }
                );
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

            var getUrl = function(product,type){
                if(product) dataSearch.product = product;
                if(type) dataSearch.type = type;
                return 'company.php#/'+dataSearch.companyId+'/'+searchPage+'?'+$.param(dataSearch);
            };

            var isOpened = function(product,type){
                if ($stateParams.product === product) {
                    return (!type || $stateParams.type === type ? true : false);
                }else{
                    return false;
                }
            };

            return {
                title: 'BROWSE BY',
                data: [
                    //{
                    //    'id': 1,
                    //    'title': 'All',
                    //    'tag' : 'all',
                    //    'items': 45,
                    //    'opened' : isOpened('all'),
                    //    'href' : getUrl('all'),
                    //    'categories': []
                    //},
                    //{
                    //    'id': 2,
                    //    'title': 'Components',
                    //    'tag' : 'components',
                    //    'items': 13,
                    //    'opened' : isOpened('components'),
                    //    'href' : getUrl('components'),
                    //    'categories': []
                    //},
                    {
                        'id': 3,
                        'title': 'Services',
                        'tag' : 'services',
                        'items': 32,
                        'opened' : isOpened('services'),
                        'href' : getUrl('services'),
                        'categories': [
                            {
                                'id': 31,
                                'title': 'Analytical Services',
                                'tag' : 'analytical',
                                'items': 15,
                                'opened' : isOpened('services','analytical'),
                                'href' : getUrl('services','analytical'),
                                'categories': []
                            },
                            {
                                'id': 32,
                                'title': 'Solid Services',
                                'tag' : 'solid',
                                'items': 15,
                                'opened' : isOpened('services','solid'),
                                'href' : getUrl('services','solid'),
                                'categories': []
                            },
                            {
                                'id': 33,
                                'title': 'Data Services',
                                'tag' : 'data',
                                'items': 2,
                                'opened' : isOpened('services','data'),
                                'href' : getUrl('services','data'),
                                'categories': []
                            }
                        ]
                    }
                ]
            };
        };
}]);