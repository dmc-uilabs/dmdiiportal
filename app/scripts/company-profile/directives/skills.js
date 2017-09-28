'use strict';
angular.module('dmc.company-profile').
    directive('tabSkills', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-skills.html',
            scope: {
                source : "=",
                tags: "="
            }, controller: function($scope, $element, $attrs, $q, $timeout) {
                $element.addClass("tab-skills");

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

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
                    console.log(skill)
                    if (skill.trim().length > 0 && !angular.isDefined($scope.source.areasOfExpertise)) {
                        $scope.source.areasOfExpertise = [{
                            name: skill,
                            isDmdii: false,
                            description: null,
                            link: null
                        }];
                    } else if (skill.trim().length > 0) {
                        $scope.source.areasOfExpertise.push({
                            name: skill,
                            isDmdii: false,
                            description: null,
                            link: null
                        });
                    }
                }

                $scope.addSkill = function(skill) {
                    if (skill && !angular.isDefined($scope.source.areasOfExpertise)) {
                        $scope.source.areasOfExpertise = [skill];
                    } else if (skill && $scope.source.areasOfExpertise.indexOf(skill) === -1) {
                        $scope.source.areasOfExpertise.push(skill);
                    }
                }

                // delete skill
                $scope.deleteSkill = function(index){
                    $scope.source.areasOfExpertise.splice(index, 1);
                };

            }
        };
    }]);
