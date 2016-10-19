'use strict';

angular.module('dmc.model.company', [
    'dmc.data',
    'dmc.ajax',
    'dmc.model.account'
])
    .service('CompanyModel', ['dataFactory', 'DMCUserModel', 'ajax','$state', '$http', '$location', '$stateParams','AccountModel',
        function(dataFactory,DMCUserModel, ajax,$state, $http, $location, $stateParams, AccountModel) {
            var userData = DMCUserModel.getUserData();
            userData.then(function(res){
                userData = res;
            });
            this.get = function(id) {
                return ajax.get(dataFactory.companyURL(id).get,{},function(response){
                    var data = response.data ? response.data : response;
                    if(data.accountId == userData.accountId) data.isOwner = true;
                    /*
                    ajax.get(dataFactory.followCompany(),{
                            accountId : userData.accountId,
                            companyId : data.id
                        }, function(res){
                            if(res.data.length > 0) data.follow = res.data[0];
                        }
                    );
                    */
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

            this.getMenu = function(totalCountItems){
                var searchPage = ($location.$$path.indexOf("/edit") != -1 ? "edit" : "search");

                var getUrl = function(product,type){
                    var dataSearch = $.extend(true,{},$stateParams);
                    if(product) dataSearch.product = product;
                    dataSearch.type = type;
                    return 'company.php'+$state.href('company.search',dataSearch);
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
                            'items': totalCountItems.services.total,
                            'opened' : isOpened('services'),
                            'href' : getUrl('services'),
                            'categories': [
                                {
                                    'id': 31,
                                    'title': 'Analytical Services',
                                    'tag' : 'analytical',
                                    'items': totalCountItems.services.analytical,
                                    'opened' : isOpened('services','analytical'),
                                    'href' : getUrl('services','analytical'),
                                    'categories': []
                                },
                                {
                                    'id': 32,
                                    'title': 'Solid Services',
                                    'tag' : 'solid',
                                    'items': totalCountItems.services.solid,
                                    'opened' : isOpened('services','solid'),
                                    'href' : getUrl('services','solid'),
                                    'categories': []
                                },
                                {
                                    'id': 33,
                                    'title': 'Data Services',
                                    'tag' : 'data',
                                    'items': totalCountItems.services.data,
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
