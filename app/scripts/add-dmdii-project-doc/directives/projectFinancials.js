// 'use strict';
// angular.module('dmc.add-project-doc').
//     directive('tabProjectFinancials', ['$parse', function ($parse) {
//         return {
//             restrict: 'A',
//             templateUrl: 'templates/add-dmdii-project-doc/tabs/tab-project-financials.html',
//             scope: {
//                 source: '=',
//                 project: '=',
//                 user: '='
//             }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $q, fileUpload, $window) {
//                 $element.addClass('tab-projectFinancials');
//                 $scope.doc = [];
//                 $scope.document = {};
//
//                 $scope.$watchCollection('doc', function() {
//                     if ($scope.noDocSelected && $scope.doc.length > 0) {
//                         $scope.noDocSelected = false;
//                     }
//                 });
//
//                 var callback = function(response) {
//                     toastModel.showToast('success', 'Project Financial Saved!');
//                     $window.location.reload();
//
//                 }
//                 $scope.save = function() {
//                     if ($scope.doc.length === 0) {
//                         $scope.noDocSelected = true;
//                         return;
//                     }
//
//                     //send to s3, save returned link to document table
//                     fileUpload.uploadFileToUrl($scope.doc[0].file, {}, 'projectFinancials', function(response) {
//                         $scope.document = {
//                             documentUrl: response.file.name,
//                             documentName: 'projectFinancials',
//                             ownerId: $scope.user.accountId,
//                             dmdiiProjectId: $scope.project.id,
//                             fileType: 3,
//                             accessLevel: 'ALL_MEMBERS',
//                             tags: [{tagName: $scope.project.projectTitle + ' project financials'}]
//                         };
//
//                         ajax.create(dataFactory.saveDMDIIDocument(), $scope.document, callback);
//                     });
//                 };
//             }
//         };
//     }]);
