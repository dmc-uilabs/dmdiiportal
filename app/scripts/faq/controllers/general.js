'use strict';

var showAllCategories = false;

angular.module('dmc.faq')
    .controller('GeneralFAQCtr', ['$stateParams', '$state', "$scope", "ajax", "$location","dataFactory","toastModel", function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel) {
        $scope.categoryId = $stateParams.categoryId;
        $scope.articleId = parseInt($stateParams.articleId);
        $scope.categories = {};
        $scope.selectedCategory = null;
        $scope.showAllCategories = showAllCategories;
        $scope.limitCategories = ($scope.showAllCategories ? 0 : 2);
        $scope.totalCategories = 0;
        $scope.article = null;
        $scope.relatedArticles = [];
        $scope.searchModel = $stateParams.text;

        $scope.getFAQCategories = function(){
            ajax.on(dataFactory.getFAQCategories(), {
                    categoryId : $scope.categoryId,
                    limit : $scope.limitCategories,
                    text : $scope.searchModel
                }, function(data){
                    if(!data.error){
                        if(data.categoryId != $scope.categoryId){
                            $scope.categoryId = data.categoryId;
                            if(data.categoryId != null) {
                                $scope.submit();
                            }
                        }else {
                            $scope.categories = data.result;
                            $scope.totalCategories = data.totalCategories;
                            $scope.getFAQCategory();
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }else{
                        toastModel.showToast("error", data.error);
                    }
                },function(data){
                    toastModel.showToast("error", "Error. getFAQCategories() fail");
                }
            );
        };

        $scope.getFAQCategory = function(){
            if($scope.categoryId) {
                ajax.on(dataFactory.getFAQCategory($scope.categoryId), {
                        categoryId: $scope.categoryId,
                        text: $scope.searchModel
                    }, function (data) {
                        if (!data.error) {
                            if ($scope.categoryId != data.categoryId) {
                                $scope.categoryId = data.categoryId;
                                $scope.getFAQCategory();
                            } else {
                                $scope.selectedCategory = data.result;
                            }
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        } else {
                            if(data.categoryId != null) {
                                toastModel.showToast("error", data.error);
                            }
                        }
                    }, function (data) {
                        toastModel.showToast("error", "Error. getFAQCategory() fail");
                    }
                );
            }
        };

        $scope.getArticle = function(){
            ajax.on(dataFactory.getFAQArticle($scope.articleId), {
                    articleId : $scope.articleId,
                    text : $scope.searchModel
                }, function(data){
                    if(!data.error){
                        $scope.article = data.result;
                        $scope.relatedArticles = data.relatedArticles;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }else{
                        toastModel.showToast("error", data.error);
                    }
                },function(data){
                    toastModel.showToast("error", "Error. getFAQCategory() fail");
                }
            );
        };

        $scope.getFAQCategories();
        if ($.isNumeric($scope.categoryId)) $scope.getFAQCategory();
        if($scope.articleId > 0) $scope.getArticle();

        $scope.viewAll = function(){
            $scope.limitCategories = $scope.totalCategories;
            $scope.showAllCategories = true;
            showAllCategories = $scope.showAllCategories;
            $scope.getFAQCategories();
        };

        $scope.showLess = function(){
            $scope.limitCategories = 2;
            $scope.showAllCategories = false;
            showAllCategories = $scope.showAllCategories;
            $scope.getFAQCategories();
        };

        $scope.submit = function(){
            if($scope.articleId > 0) {
                $location.path("/article/"+$scope.categoryId+"/"+$scope.articleId).search(($scope.searchModel ? {text : $scope.searchModel} : {}));
            }else{
                $location.path("/general/"+$scope.categoryId).search(($scope.searchModel ? {text : $scope.searchModel} : {}));
            }
        };
    }]
);