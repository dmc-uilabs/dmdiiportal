// 'use strict';
// angular.module('dmc.addDmdiiContent').
//     directive('tabProjectEvents', ['$parse', function ($parse) {
//         return {
//             restrict: 'A',
//             templateUrl: 'templates/add-dmdii-content/tabs/tab-project-events.html',
//             scope: {
//                 source : '=',
//                 projects: '=',
//             }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $window, $timeout) {
//                 $element.addClass('tab-projectEvents');
//
//                 $scope.event = {
//                     eventDescription: ''
//                 };
//
//                 $scope.descriptionLimit = 5000;
//                 $scope.isValid = false;
//                 $scope.isSaved = false;
//                 $scope.fieldName = 'Description'
//
//                 $scope.$watch('event', function() {
//                     if ($scope.noTitle && angular.isDefined($scope.event.eventName) && $scope.event.eventName.length > 0) {
//                         $scope.noTitle = false;
//                     }
//
//                     if ($scope.noDateSelected && angular.isDefined($scope.event.eventDate)) {
//                         $scope.noDateSelected = false;
//                     }
//                 }, true);
//
//                 var eventCallback = function(response) {
//                     toastModel.showToast('success', 'Project Event Saved!');
//                     $timeout(function() {
//                         $window.location.reload();
//                     }, 500);                };
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
//                 };
//
//                 $scope.save = function() {
//                     $scope.isSaved = true;
//
//                     if (!$scope.event.eventName) {
//                         $scope.noTitle = true;
//                     }
//                     if (!$scope.event.eventDate) {
//                         $scope.noDateSelected = true;
//                     }
//
//                     if ( $scope.noTitle || $scope.noDateSelected || !$scope.isValid) {
//                         return;
//                     }
//
//                     $scope.event.eventDescription = convertToMarkdown($scope.event.eventDescription);
//
//                     ajax.create(dataFactory.dmdiiProjectEventUrl().save, $scope.event, eventCallback);
//                 };
//
//                 function apply(){
//                     if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
//                 }
//
//             }
//         };
//     }]);
