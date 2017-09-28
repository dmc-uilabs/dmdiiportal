'use strict';
angular.module('dmc.company-profile').
    directive('tabMembership', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-membership.html',
            scope: {
                source: "=",
                userData: "=",
                companyTier: "=",
                date: "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-membership");

                // $scope.date = {};
                //
                // // callback for member
                // var callbackFunction = function(response){
                //     $scope.member = $.extend(true, {}, $scope.member);
                //     //memberLocal = response.data;
                //     $scope.member = response.data;
                //
                //     var startDate = $scope.member.startDate.split('-');
                //     $scope.date.start = new Date(startDate[0], startDate[1]-1, startDate[2], 0);
                //     var expireDate = $scope.member.expireDate.split('-');
                //     $scope.date.expire = new Date(expireDate[0], expireDate[1]-1, expireDate[2], 0);
                //
                //     $scope.companyTier = {
                //         data: {
                //             id: $scope.member.dmdiiType.id,
                //             tier: $scope.member.dmdiiType.tier || undefined,
                //             category: $scope.member.dmdiiType.dmdiiTypeCategory.id,
                //             categoryString: $scope.member.dmdiiType.dmdiiTypeCategory.category
                //         }
                //     }
                // };
                //
                // var responseData = function(){
                //   var data = {};
                //   return data;
                // };
                //
                // var getDMDIIMember = function(){
                //     ajax.get(dataFactory.getDMDIIMember($scope.source.dmdiiMemberId).get, responseData(), callbackFunction);
                // };
                //getDMDIIMember();

                //$scope.companyTier = {};

                $scope.types = [
                    {
                        id: 4,
                        tier: 1,
                        category: 2,
                        categoryString: 'Academic'
                    },
                    {
                        id: 5,
                        tier: 2,
                        category: 2,
                        categoryString: 'Academic'
                    },
                    {
                        id: 6,
                        tier: 3,
                        category: 2,
                        categoryString: 'Academic'
                    },
                    {
                        id: 7,
                        tier: 4,
                        category: 2,
                        categoryString: 'Academic'
                    },
                    {
                        id: 1,
                        tier: 1,
                        category: 1,
                        categoryString: 'Industry'
                    },
                    {
                        id: 2,
                        tier: 2,
                        category: 1,
                        categoryString: 'Industry'
                    },
                    {
                        id: 3,
                        tier: 3,
                        category: 1,
                        categoryString: 'Industry'
                    },
                    {
                        id: 9,
                        category: 4,
                        categoryString: 'State And Local Government'
                    },
                    {
                        id: 8,
                        category: 3,
                        categoryString: 'U.S. Government'
                    }
                ]

                $scope.categories = {
                    1: 'Industry Tier ',
                    2: 'Academic Tier ',
                    3: 'U.S. Government',
                    4: 'State And Local Government'
                }

            }
        };
    }]);
