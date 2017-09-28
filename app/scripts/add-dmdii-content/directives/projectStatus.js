// 'use strict';
// angular.module('dmc.addDmdiiContent').
//     directive('tabProjectStatus', ['$parse', function ($parse) {
//         return {
//             restrict: 'A',
//             templateUrl: 'templates/add-dmdii-content/tabs/tab-project-status.html',
//             scope: {
//                 source: '=',
//                 user: '='
//             }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, fileUpload, $window) {
//                 $element.addClass('tab-projectsStatus');
//                 $scope.document = {};
//                 $scope.doc = [];
//
//
//                 var callback = function(response) {
//                     toastModel.showToast('success', 'Project Status Saved!');
//                     $window.location.reload();
//
//                 };
//
//                 $scope.$watchCollection('doc', function() {
//                     if ($scope.noDocSelected && $scope.doc.length > 0) {
//                         $scope.noDocSelected = false;
//                     }
//                 });
//
//                 $scope.save = function() {
//                     if ($scope.doc.length === 0) {
//                         $scope.noDocSelected = true;
//                         return;
//                     }
//
//                     //send to s3, save returned link to document table
//                     fileUpload.uploadFileToUrl($scope.doc[0].file, {}, 'projectStatus', function(response) {
//                         $scope.document = {
//                             documentUrl: response.file.name,
//                             documentName: 'projectStatus',
//                             ownerId: $scope.user.accountId,
//                             fileType: 2,
//                             accessLevel: 'ALL_MEMBERS',
//                             tags: [{tagName: 'projects-stats'}]
//                         };
//
//                         ajax.create(dataFactory.saveDMDIIDocument(), $scope.document, callback);
//                     });
//                 };
//             }
//         };
//     }]);
