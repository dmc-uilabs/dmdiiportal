'use strict';
angular.module('dmc.company-profile').
    directive('tabProjects', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-projects.html',
            scope: {
                source : "=",
                tags: "="
            }, controller: function($scope, $element, $attrs, $q, $timeout) {
                $element.addClass("tab-projects");


                $scope.searchSkill = null;
                $scope.selectedSkill = null;

                $scope.querySkillSearch = function(query) {
                    var results = query ? $scope.tags.filter( createFilterFor(query) ) : $scope.tags;
                    var deferred = $q.defer();
                    $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                    return deferred.promise;
                }

                function createFilterFor(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(tag) {
                        return (tag.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                };

                $scope.addNewSkill = function(skill) {
                    if ($scope.searchSkill.trim().length > 0 && !angular.isDefined($scope.source.desiredAreasOfExpertise)) {
                        $scope.source.desiredAreasOfExpertise = [skill];
                    } else if ($scope.searchSkill.trim().length > 0 && $scope.source.desiredAreasOfExpertise.indexOf(skill) === -1) {
                        $scope.source.desiredAreasOfExpertise.push({
                            name: $scope.searchSkill,
                            isDmdii: false,
                            description: null,
                            link: null
                        });
                    }
                }
                $scope.addSkill = function(skill) {
                    if (skill && !angular.isDefined($scope.source.desiredAreasOfExpertise)) {
                        $scope.source.desiredAreasOfExpertise = [skill];
                    } else if (skill && $scope.source.desiredAreasOfExpertise.indexOf(skill) === -1) {
                        $scope.source.desiredAreasOfExpertise.push(skill);
                    }
                }
                // delete skill
                $scope.deleteSkill = function(index){
                    $scope.source.desiredAreasOfExpertise.splice(index, 1);
                };
            }
        };
    }]);
