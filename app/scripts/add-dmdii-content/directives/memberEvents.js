'use strict';
angular.module('dmc.addDmdiiContent').
    directive('tabMemberEvents', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-content/tabs/tab-member-events.html',
            scope: {
                source : "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, questionToastModel) {
                $element.addClass("tab-memberEvents");
                $scope.event = {};

                var eventCallback = function(response) {
                    toastModel.showToast('success', 'Member Event Saved!');

                };

                $scope.clear = function() {
                    $scope.event = {};
                    $scope.noTitle = false;
                    $scope.noDateSelected = false;
                    $scope.noDescription = false;
                };

                $scope.$watch('event', function() {
                    if ($scope.noTitle && angular.isDefined($scope.event.name) && $scope.event.name.length > 0) {
                        $scope.noTitle = false;
                    }

                    if ($scope.noDateSelected && angular.isDefined($scope.event.date)) {
                        $scope.noDateSelected = false;
                    }

                    if ($scope.noDescription && angular.isDefined($scope.event.description) && $scope.event.description.length > 0) {
                        $scope.noDescription = false;
                    }
                }, true);

                $scope.save = function() {

                    if (!$scope.event.name) {
                        $scope.noTitle = true;
                    }
                    if (!$scope.event.date) {
                        $scope.noDateSelected = true;
                    }
                    if (!$scope.event.description) {
                        $scope.noDescription = true;
                    }

                    if ( $scope.noTitle || $scope.noDateSelected || $scope.noDescription) {
                        return;
                    }

                    ajax.create(dataFactory.saveDMDIIMember().events, $scope.event, eventCallback);
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        };
    }]);
