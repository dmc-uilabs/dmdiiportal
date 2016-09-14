'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabQuicklinks', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-quicklinks.html',
            scope: {
                source : "=",
                user: "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, fileUpload, questionToastModel, $window) {
                $element.addClass("tab-quicklinks");

                $scope.quicklink = {};
                $scope.linkType = 'text';
                $scope.document = [];

                $scope.docAccessLevels = {
                    'All Members': 'ALL_MEMBERS',
                    'Project Participants': 'PROJECT_PARTICIPANTS',
                    'Project Participants and Upper Tier Members': 'PROJECT_PARTICIPANTS_AND_UPPER_TIER_MEMBERS',
                    'Project Participants VIPS': 'PROJECT_PARTICIPANT_VIPS'
                }

                var convertToMarkdown = function(input) {
                    var escaped = toMarkdown(input);
                    return escaped;
                };

                var quicklinkCallback = function(response) {
                    toastModel.showToast('success', 'Quicklink Saved!');
                    $scope.quicklink = {};
                    $scope.noTitle = false;
                    $scope.noDescription = false;
                    $scope.noLink = false;
                    $scope.noDocSelected = false;
                    $window.location.reload();
                };

                $scope.clear = function() {
                    $scope.quicklink = {};
                    $scope.document = [];
                    $scope.noTitle = false;
                    $scope.noDescription = false;
                    $scope.noLink = false;
                    $scope.noDocSelected = false;
                };

                $scope.$watch('quicklink', function() {
                    if ($scope.noTitle && angular.isDefined($scope.quicklink.displayName) && $scope.quicklink.displayName.trim().length > 0) {
                        $scope.noTitle = false;
                    }

                    if ($scope.linkType === 'text' && $scope.noText && angular.isDefined($scope.quicklink.text) && $scope.quicklink.text.trim().length > 0) {
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
                    if (!$scope.quicklink.displayName) {
                        $scope.noTitle = true;
                    }

                    if ($scope.linkType === 'text') {
                        if (!$scope.quicklink.text) {
                            $scope.noText = true;
                        }

                        $scope.quicklink.text = convertToMarkdown($scope.quicklink.text);

                        delete $scope.quicklink.link;
                        delete $scope.quicklink.path;

                        if ($scope.noTitle || $scope.noDescription) {
                            return;
                        }

                    } else if ($scope.linkType === 'link') {
                        if (!$scope.quicklink.link) {
                            $scope.noLink = true;
                        }

                        $scope.quicklink.link = 'HTTP://' + $scope.quicklink.link;

                        delete $scope.quicklink.text;
                        delete $scope.quicklink.path;

                        if ($scope.noTitle || $scope.noLink) {
                            return;
                        }
                    } else if ($scope.linkType === 'document') {
                        if ($scope.document.length === 0) {
                            $scope.noDocSelected = true;
                        }

                        delete $scope.quicklink.text;
                        delete $scope.quicklink.link;

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
                        fileUpload.uploadFileToUrl($scope.document[0].file, {}, 'quickdoc', function(response) {
                            $scope.quicklink.doc = response.file.name;
                            ajax.create(dataFactory.saveDMDIIDocument(),
                                {
                                    ownerId: $scope.user.accountId,
                                    documentUrl: $scope.quicklink.doc,
                                    documentName: $scope.quicklink.displayName
                                }, function(response) {
                                $scope.quicklink.doc = response.data;
                                ajax.create(dataFactory.saveQuicklink(), $scope.quicklink, quicklinkCallback);
                            });
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
