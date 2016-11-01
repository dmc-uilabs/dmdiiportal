'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectsOverview', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-projects-overview.html',
            scope: {
                source: '=',
                user: '='
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, fileUpload, $window) {
                $element.addClass('tab-projectsOverview');
                $scope.document = {};
                $scope.doc = [];

                var callback = function(response) {
                    toastModel.showToast('success', 'Project Overview Saved!');
                    $window.location.reload();
                };

                $scope.$watchCollection('doc', function() {
                    if ($scope.noDocSelected && $scope.doc.length > 0) {
                        $scope.noDocSelected = false;
                    }
                });

                $scope.save = function() {
                    if ($scope.doc.length === 0) {
                        $scope.noDocSelected = true;
                        return;
                    }

                    //send to s3, save returned link to document table
                    fileUpload.uploadFileToUrl($scope.doc[0].file, {}, 'projectOverview', function(response) {
                        $scope.document = {
                            documentUrl: response.file.name,
                            documentName: 'projectOverview',
                            ownerId: $scope.user.accountId,
                            fileype: 1,
                            accessLevel: $scope.doc[0].accessLevel
                        };

                        ajax.create(dataFactory.saveDMDIIDocument(), $scope.document, callback);
                    });
                };

            }
        };
    }]);
