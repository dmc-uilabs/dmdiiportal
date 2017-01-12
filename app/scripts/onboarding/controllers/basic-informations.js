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

		$scope.isDMDIIMember = false;
		$scope.autocompleteStyle = {'float':'left', 'display': 'none'};

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

		$scope.$watch('isDMDIIMember', function() {
		    changeIsDMDIIMember()
		});

		function changeIsDMDIIMember(){
		  // company 13 is 'other'
		  if($scope.info.company != 13){
		    $scope.info.company = 13;
				$scope.autocompleteStyle = {'float':'left', 'display': 'none'};
		  } else {
				$scope.ctrl.selectedCompany = "";
				$scope.ctrl.searchCompany = "";
		    $scope.info.company = null;
				// $scope.item.name = "";
		    $scope.autocompleteStyle = {'float':'left'};
		  }
		}

		function setCompany(company) {
			$scope.info.company = company.id;
		}

		function searchCompanyChange(text) {
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
