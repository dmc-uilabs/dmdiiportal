angular.module('dmc.onboarding')
.controller('BasicInformationsController',
	['$scope', '$rootScope', '$mdDialog','ajax','dataFactory',
	function ($scope, $rootScope, $mdDialog,ajax,dataFactory) {
		$scope.info = {};

		$scope.ctrl = {};
		$scope.ctrl.simulateQuery = false;
		// $scope.ctrl.companies = getAllCompanies();
		$scope.ctrl.setCompany = setCompany;
		$scope.ctrl.queryCompanySearch = queryCompanySearch;
		$scope.ctrl.searchCompanyChange = searchCompanyChange;

        var getAllCompanies = function() {
            ajax.get(dataFactory.companyURL().all, {}, function(response){
                $scope.ctrl.companies = response.data;
            });
        }
		getAllCompanies();

		var createCompanyFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				return (item.name.toLowerCase().indexOf(lowercaseQuery) === 0);
			};
		}

		function queryCompanySearch(query) {
			console.log($scope.ctrl.companies, query, $scope.ctrl.searchCompany)
			var results = query ? $scope.ctrl.companies.filter( createCompanyFilterFor(query) ) : $scope.ctrl.companies,
				deferred;
			if ($scope.ctrl.simulateQuery) {
				deferred = $q.defer();
				$timeout(function () {
					deferred.resolve(results);
				}, Math.random() * 1000, false);
				return deferred.promise;
			} else {
				return results;
			}
		}

		function setCompany(company) {
			$scope.info.company = company.id;
		}

		function searchCompanyChange(text) {
			console.log($scope.ctrl, $scope.ctrl.companies, text, $scope.ctrl.searchCompany)
			if (text.trim().length == 0) {
				$scope.info.company = null;
			}
		}

        $scope.enter = function(){
			$mdDialog.hide($scope.info);
		};

        function apply() {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
}]);
