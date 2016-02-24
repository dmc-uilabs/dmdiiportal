'use strict';
/**
* dmc.component.treemenu Module
*
* DMC Tree Menu
*/
angular.module('dmc.component.products-filter', [
]).
  directive('dmcProductsFilter', function(RecursionHelper) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/components/tree-menu/products-filter-tpl.html',
        scope : {
            stateName : "="
        },
        controller: function($scope, $location, $stateParams, $state){
            var filterData = $stateParams;
            // var searchPage = ($location.$$path.indexOf("/edit") != -1 ? "edit" : "search");
            // Authors for filter
            $scope.authors = [
                {
                    id : 1,
                    authorId : 1,
                    name : "GE",
                    checked : false,
                    count : 4
                },
                {
                    id : 2,
                    authorId : 2,
                    name : "Joe Smith",
                    checked : false,
                    count : 8
                }
            ];

            // Ratings for filter
            $scope.ratings = [
                {
                    id : 1,
                    stars : new Array(4),
                    count : 2,
                    checked : false
                },
                {
                    id : 2,
                    stars : new Array(3),
                    count : 8,
                    checked : false
                },
                {
                    id : 3,
                    stars : new Array(2),
                    count : 12,
                    checked : false
                }
            ];

            // Favorites for filter
            $scope.favorites = [
                {
                    id : 1,
                    tag : "my",
                    name : "My Favorites",
                    count : 7,
                    checked : false
                }
            ];

            // Dates for filter
            $scope.dates = [
                {
                    id : 1,
                    name : "7 days old",
                    tag : "7d",
                    count : 8,
                    checked : false
                },
                {
                    id : 2,
                    name : "1 month old",
                    tag : "1m",
                    count : 10,
                    checked : false
                },
                {
                    id : 3,
                    name : "1 year old",
                    tag : "1y",
                    count : 17,
                    checked : false
                }
            ];

            var checkFilterItems = function(type,key,length){
                if(filterData[type]) {
                    var arr = filterData[type];
                    if($.type(arr) != "array") arr = [arr];
                    for (var item_from_link in arr) { // items from link
                        if ($.isNumeric(arr[item_from_link])) arr[item_from_link] = parseInt(arr[item_from_link]);
                        for (var item in $scope[type]) {
                            if ((!length && arr[item_from_link] == $scope[type][item][key]) || (length && parseInt(arr[item_from_link]) == $scope[type][item][key].length)){
                                $scope[type][item].checked = true;
                                break;
                            }
                        }
                    }
                }
            };

            checkFilterItems('authors','authorId');
            checkFilterItems('ratings','stars',true);
            checkFilterItems('favorites','tag');
            checkFilterItems('dates','tag');


            $scope.checkAuthor = function(author){
                $scope.updatePage();
            };

            $scope.checkRating = function(rating){
                $scope.updatePage();
            };

            $scope.checkFavorite = function(favorite){
                $scope.updatePage();
            };

            $scope.checkDate = function(date){
                $scope.updatePage();
            };

            $scope.updatePage = function(){
                var checkedAuthors = [];
                var checkedRatings = [];
                var checkedFavorites = [];
                var checkedDates = [];
                // Authors
                for(var index in $scope.authors){
                    if($scope.authors[index].checked){
                        checkedAuthors.push($scope.authors[index].authorId);
                    }
                }
                // Ratings
                for(var index in $scope.ratings){
                    if($scope.ratings[index].checked){
                        checkedRatings.push($scope.ratings[index].stars.length);
                    }
                }
                // Favorites
                for(var index in $scope.favorites){
                    if($scope.favorites[index].checked){
                        checkedFavorites.push($scope.favorites[index].tag);
                    }
                }
                // Dates
                for(var index in $scope.dates){
                    if($scope.dates[index].checked){
                        checkedDates.push($scope.dates[index].tag);
                    }
                }

                if(checkedAuthors.length > 0){
                    filterData.authors = checkedAuthors;
                }else{
                    delete filterData.authors;
                }
                if(checkedRatings.length > 0){
                    filterData.ratings = checkedRatings;
                }else{
                    delete filterData.ratings;
                }
                if(checkedFavorites.length > 0){
                    filterData.favorites = checkedFavorites;
                }else{
                    delete filterData.favorites;
                }
                if(checkedDates.length > 0){
                    filterData.dates = checkedDates;
                }else{
                    delete filterData.dates;
                }
                //$location.path('/'+filterData.companyId+'/'+searchPage).search(filterData);
                $state.go($scope.stateName, filterData, {reload: true});
            };
        }
      };
    }
);

