// 'use strict';
// angular.module('dmc.addDmdiiContent').
//     directive('tabMemberEvents', ['$parse', function ($parse) {
//         return {
//             restrict: 'A',
//             templateUrl: 'templates/add-dmdii-content/tabs/tab-member-events.html',
//             scope: {
//                 source : '=',
//             }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, questionToastModel, $window, $timeout) {
//                 $element.addClass('tab-memberEvents');
//                 $scope.event = {
//                     description: ''
//                 };
//
//                 $scope.descriptionLimit = 5000;
//                 $scope.isValid = false;
//                 $scope.isSaved = false;
//                 $scope.fieldName = 'Description';
//
//                 var eventCallback = function(response) {
//                     toastModel.showToast('success', 'Member Event Saved!');
//                     $timeout(function() {
//                         $window.location.reload();
//                     }, 500);
//                 };
//
//                 var convertToMarkdown = function(input) {
//                     var escaped = toMarkdown(input);
//                     return escaped;
//                 };
//
//                 $scope.clear = function() {
//                     $scope.event = {
//                         description: ''
//                     };
//                     $scope.noTitle = false;
//                     $scope.noDateSelected = false;
//                     $scope.noDescription = false;
//                 };
//
//                 $scope.$watch('event', function() {
//                     if ($scope.noTitle && angular.isDefined($scope.event.name) && $scope.event.name.length > 0) {
//                         $scope.noTitle = false;
//                     }
//
//                     if ($scope.noDateSelected && angular.isDefined($scope.event.date)) {
//                         $scope.noDateSelected = false;
//                     }
//                 }, true);
//
//                 $scope.save = function() {
//                     $scope.isSaved = true;
//
//                     if (!$scope.event.name) {
//                         $scope.noTitle = true;
//                     }
//                     if (!$scope.event.date) {
//                         $scope.noDateSelected = true;
//                     }
//
//                     if ($scope.noTitle || $scope.noDateSelected || !$scope.isValid) {
//                         return;
//                     }
//
//                     $scope.event.description = convertToMarkdown($scope.event.description);
//                     ajax.create(dataFactory.dmdiiMemberEventUrl().save, $scope.event, eventCallback);
//                 };
//
//                 function apply(){
//                     if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
//                 };
//             }
//         };
//     }]);
