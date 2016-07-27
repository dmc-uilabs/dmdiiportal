'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectStatus', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-status.html',
            scope: {
                source: "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, fileUpload) {
                $element.addClass("tab-projectsStatus");
                $scope.document = {};
                $scope.doc = [];


                var callback = function(response) {
                    toastModel.showToast('success', 'Project Status Saved!');
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
                    fileUpload.uploadFileToUrl($scope.doc[0].file, function(response) {
                        $scope.document.path = response.file.name
                        $scope.document.fileType = 0;

                        ajax.create(dataFactory.saveDMDIIDocument(), $scope.document, callback);
                    });
                };
            }
        };
    }]);
