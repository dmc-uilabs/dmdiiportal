'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabQuicklinks', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-quicklinks.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, fileUpload, questionToastModel) {
                $element.addClass("tab-quicklinks");

                $scope.quicklink = {};
                $scope.linkType = 'text';
                $scope.document = [];

                var quicklinkCallback = function(response) {
                    toastModel.showToast('success', 'Quicklink Saved!');
                };

                $scope.clear = function() {
                    $scope.quicklink = {};
                    $scope.document = [];
                };

                $scope.$watch('quicklink', function() {
                    if ($scope.noTitle && angular.isDefined($scope.quicklink.title) && $scope.quicklink.title.trim().length > 0) {
                        $scope.noTitle = false;
                    }

                    if ($scope.linkType === 'text' && $scope.noDescription && angular.isDefined($scope.quicklink.description) && $scope.quicklink.description.trim().length > 0) {
                        $scope.noDescription = false;
                    }

                    if ($scope.linkType === 'link' && $scope.noLink && angular.isDefined($scope.quicklink.link) && $scope.quicklink.link.trim().length > 0) {
                        $scope.noLink = false;
                    }

                    if ($scope.linkType === 'document' && $scope.noDocSelected && angular.isDefined($scope.document) && $scope.document.length > 0) {
                        $scope.noDocSelected = false;
                    }
                }, true);

                $scope.save = function() {
                    if (!$scope.quicklink.title) {
                        $scope.noTitle = true;
                    }

                    if ($scope.linkType === 'text') {
                        if (!$scope.quicklink.description) {
                            $scope.noDescription = true;
                        }

                        delete $scope.quicklink.link;
                        delete $scope.quicklink.path;

                        if ($scope.noTitle || $scope.noDescription) {
                            return;
                        }

                    } else if ($scope.linkType === 'link') {
                        if (!$scope.quicklink.link) {
                            $scope.noLink = true;
                        }

                        delete $scope.quicklink.description;
                        delete $scope.quicklink.path;

                        if ($scope.noTitle || $scope.noLink) {
                            return;
                        }
                    } else if ($scope.linkType === 'document') {
                        if ($scope.document.length === 0) {
                            $scope.noDocSelected = true;
                        }

                        delete $scope.quicklink.description;
                        delete $scope.quicklink.link;

                        if ($scope.noTitle || $scope.noDocSelected) {
                            return;
                        }
                    }

                    if ($scope.linkType === 'document') {
                        fileUpload.uploadFileToUrl($scope.document[0].file, function(response) {
                            $scope.quicklink.path = response.file.name;

                            ajax.create(dataFactory.saveQuicklink(), $scope.quicklink, quicklinkCallback);
                        });
                    } else {
                        ajax.create(dataFactory.saveQuicklink(), $scope.quicklink, quicklinkCallback);
                    }
                };
                function apply() {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        };
    }]);
