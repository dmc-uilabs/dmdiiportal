// 'use strict';
// angular.module('dmc.addDmdiiContent').
//     directive('tabMemberNews', ['$parse', function ($parse) {
//         return {
//             restrict: 'A',
//             templateUrl: 'templates/add-dmdii-content/tabs/tab-member-news.html',
//             scope: {
//                 source : '='
//             }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $window) {
//                 $element.addClass('tab-memberNews');
//
//                 var newsCallbackFunction = function(response) {
//                     toastModel.showToast('success', 'Member News Saved!');
//                     $window.location.reload();
//                 };
//
//                 $scope.clear = function() {
//                     $scope.news = {};
//                 };
//
//                 $scope.$watch('news', function() {
//                     if ($scope.noTitle && angular.isDefined($scope.news.title) && $scope.news.title.trim().length > 0) {
//                         $scope.noTitle = false;
//                     }
//
//                     if ($scope.noContent && angular.isDefined($scope.news.content) && $scope.news.content.trim().length > 0) {
//                         $scope.noContent = false;
//                     }
//                 }, true);
//
//                 $scope.save = function() {
//                     if (!$scope.news.title) {
//                         $scope.noTitle = true;
//                     }
//
//                     if (!$scope.news.content) {
//                         $scope.noContent = true;
//                     }
//
//                     if ($scope.noTitle || $scope.noContent) {
//                         return;
//                     }
//
//                     ajax.create(dataFactory.dmdiiMemberNewsUrl().save, $scope.news, newsCallbackFunction);
//                 };
//
//                 function apply(){
//                     if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
//                 }
//
//             }
//         };
//     }]);
