'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabProjectFinancials', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-project-financials.html',
            scope: {
                source: "=",
                projects: "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $q, fileUpload) {
                $element.addClass("tab-projectFinancials");
                $scope.doc = [];
                $scope.document = {};
                $scope.noProjectSelected = false;

                $scope.querySearch = function(query) {
                    var results = query ? $scope.projects.filter( createFilterFor(query) ) : $scope.projects,
                        deferred;
                    return results;
                }

                function createFilterFor(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(project) {
                        return (project.projectTitle.toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                }

                $scope.$watch('selectedItem', function() {
                    if ($scope.noProjectSelected && angular.isDefined($scope.selectedItem)) {
                        $scope.noProjectSelected = false;
                    }
                });

                $scope.$watchCollection('doc', function() {
                    if ($scope.noDocSelected && $scope.doc.length > 0) {
                        $scope.noDocSelected = false;
                    }
                });

                var callback = function(response) {
                    toastModel.showToast('success', 'Project Financial Saved!');

                }
                $scope.save = function() {
                    if (!$scope.selectedItem) {
                        $scope.noProjectSelected = true;
                    }

                    if ($scope.doc.length === 0) {
                        $scope.noDocSelected = true;
                    }

                    if ($scope.noProjectSelected || $scope.noDocSelected) {
                        return;
                    }

                    //send to s3, save returned link to document table
                    fileUpload.uploadFileToUrl($scope.doc[0].file, {}, 'projectFinancials', function(response) {
                        $scope.document.documentUrl = response.file.name;
                        $scope.document.documentName = 'projectFinancials';
                        $scope.document.fileType = 3;
                        $scope.document.ownerId = $scope.$root.userData.accountId;
                        $scope.document.path = '';
                        $scope.document.dmdiiProjectId = $scope.selectedItem.id;

                        ajax.create(dataFactory.saveDMDIIDocument(), $scope.document, callback);
                    });
                };

            }
        };
    }]);
