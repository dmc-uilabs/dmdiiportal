'use strict';

var showAllCategories = false;

angular.module('dmc.faq')
    .controller('GeneralFAQCtr', ['$stateParams', '$state', "$scope", "ajax", "$location","dataFactory","toastModel", function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel) {
        $scope.categoryId = (angular.isDefined($stateParams.categoryId) ? $stateParams.categoryId : 1);
        $scope.articleId = parseInt($stateParams.articleId);
        $scope.categories = {};
        $scope.selectedCategory = null;
        $scope.showAllCategories = showAllCategories;
        $scope.limitCategories = 2;
        $scope.totalCategories = 0;
        $scope.article = null;
        $scope.relatedArticles = [];
        $scope.searchModel = $stateParams.text;

        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };

        // get total count categories
        $scope.getTotalCategories = function(){
            ajax.get(dataFactory.getFAQCategories(), {
                    title_like : $scope.searchModel
                }, function(response){
                    $scope.totalCategories = response.data.length;
                    apply();
                }
            );
        };

        // get categories
        $scope.getFAQCategories = function(){
            var requestData = {};
            if($scope.searchModel) requestData.title_like = $scope.searchModel;
            if(!$scope.showAllCategories)  requestData._limit = $scope.limitCategories;
            ajax.get(dataFactory.getFAQCategories(), requestData,
                function(response){
                    $scope.categories = response.data;
                    $scope.getFAQSubcategories();
                    apply();
                }
            );
        };

        // get all subcategories with articles for opened category
        $scope.getFAQSubcategories = function(){
            ajax.get(dataFactory.getFAQSubcategories(), {
                    faq_categoryId : $scope.categoryId,
                    _embed : "faq_articles"
                }, function (response) {
                    for(var c in $scope.categories) {
                        if($scope.categories[c].id == $scope.categoryId) {
                            $scope.selectedCategory = $scope.categories[c];
                            break;
                        }
                    }
                    $scope.selectedCategory.faq_subcategories = response.data;
                    apply();
                }
            );
        };

        // get article
        $scope.getArticle = function(){
            ajax.get(dataFactory.getFAQArticle($scope.articleId), {},
                function(response){
                    $scope.article = response.data;
                    $scope.getRelatedArticles();
                    apply();
                }
            );
        };

        // get related articles
        $scope.getRelatedArticles = function(){
            ajax.get(dataFactory.getRelatedArticles($scope.article.faq_subcategoryId), {
                    faq_subcategoryId : $scope.article.faq_subcategoryId,
                    id_ne : $scope.article.id
                },
                function(response){
                    $scope.relatedArticles = response.data;
                    apply();
                }
            );
        };

        $scope.getFAQCategories();
        $scope.getTotalCategories();

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