'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabQuicklinks', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-quicklinks.html',
            scope: {
                source : '=',
                user: '='
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, fileUpload, questionToastModel, $window) {
                $element.addClass('tab-quicklinks');

                $scope.quicklink = {
                    text: ''
                };
                $scope.linkType = 'text';
                $scope.document = [];

                $scope.descriptionLimit = 5000;
                $scope.isValid = false;
                $scope.isSaved = false;
                $scope.fieldName = 'Description'

                var convertToMarkdown = function(input) {
                    var escaped = toMarkdown(input);
                    return escaped;
                };

                var quicklinkCallback = function(response) {
                    // $scope.quicklink = {};
                    $scope.noTitle = false;
                    $scope.noDescription = false;
                    $scope.noLink = false;
                    $scope.noDocSelected = false;
                    $scope.descriptionOverLimit = false;
                    toastModel.showToast('success', 'Quicklink Saved!');
                    $timeout(function() {
                        $window.location.reload();
                    }, 1000);
                };

                $scope.clear = function() {
                    $scope.quicklink = {
                        text: ''
                    };
                    $scope.document = [];
                    $scope.noTitle = false;
                    $scope.noLink = false;
                    $scope.noDocSelected = false;

                };

                $scope.$watch('quicklink', function() {
                    if ($scope.noTitle && angular.isDefined($scope.quicklink.displayName) && $scope.quicklink.displayName.trim().length > 0) {
                        $scope.noTitle = false;
                    }


                    if ($scope.linkType === 'link' && $scope.noLink && angular.isDefined($scope.quicklink.link) && $scope.quicklink.link.trim().length > 0) {
                        $scope.noLink = false;
                    }

                    if ($scope.linkType === 'document' && $scope.noDocSelected && angular.isDefined($scope.document) && $scope.document.length > 0) {
                        $scope.noDocSelected = false;
                    }

                }, true);

                $scope.save = function() {
                    $scope.isSaved = true;

                    if (!$scope.quicklink.displayName) {
                        $scope.noTitle = true;
                    }

                    if ($scope.linkType === 'text') {

                        $scope.quicklink.text = convertToMarkdown($scope.quicklink.text);

                        delete $scope.quicklink.link;
                        delete $scope.quicklink.doc;

                        if ($scope.noTitle || !$scope.isValid) {
                            return;
                        }

                    } else if ($scope.linkType === 'link') {
                        if (!$scope.quicklink.link) {
                            $scope.noLink = true;
                        }

                        $scope.quicklink.link = 'HTTP://' + $scope.quicklink.link;

                        delete $scope.quicklink.text;
                        delete $scope.quicklink.doc;

                        if ($scope.noTitle || $scope.noLink) {
                            return;
                        }
                    } else if ($scope.linkType === 'document') {
                        if ($scope.document.length === 0) {
                            $scope.noDocSelected = true;
                        }

                        if ($scope.noTitle || $scope.noDocSelected) {
                            return;
                        }
                    }

                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    month = (month < 10) ? '0' + month : month;
                    var day = date.getDate();

                    $scope.quicklink.created = year + '-' + month + '-' + day;

                    if ($scope.linkType === 'document') {
                        $scope.quicklink.text = null;
                        $scope.quicklink.link = null;
                        fileUpload.uploadFileToUrl($scope.document[0].file, {}, 'quickdoc', function(response) {
                            $scope.quicklink.doc = response.file.name;
                            ajax.create(dataFactory.saveDMDIIDocument(),
                                {
                                    ownerId: $scope.user.accountId,
                                    documentUrl: $scope.quicklink.doc,
                                    documentName: $scope.quicklink.displayName,
                                    accessLevel: 'ALL_MEMBERS'
                                }, function(response) {
                                $scope.quicklink.doc = response.data;
                                ajax.create(dataFactory.quicklinkUrl().save, $scope.quicklink, quicklinkCallback);
                            });
                        });
                    } else {
                        ajax.create(dataFactory.quicklinkUrl().save, $scope.quicklink, quicklinkCallback);
                    }
                };
                function apply() {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        };
    }]);
