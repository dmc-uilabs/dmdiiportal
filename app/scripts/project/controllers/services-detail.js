angular.module('dmc.project')
.controller('projectServicesDetailCtrl', ['$scope', '$stateParams', 'projectData', 'ajax', 'dataFactory', function ($scope, $stateParams, projectData, ajax, dataFactory) {
	
	$scope.projectData = projectData;
	$scope.average_rating = 0;
	$scope.precentage_stars = [0,0,0,0,0];
	$scope.number_of_comments = 0;
	$scope.service = null;

	$scope.statistics = {
		"Project": {
			"SuccessfulRuns": {
				"Today": 8,
				"Week": 10,
				"AllTime": 12
			},
			"IncompleteRuns": {
				"Today": 1,
				"Week": 3,
				"Month": 3
			},
			"UnavailableRuns": {
				"Today": 1,
				"Week": 2,
				"Month": 2
			},
			"RunsByUsers": {
				"Today": 10,
				"Week": 15,
				"AllTime": 17
			},
			"UniqueUsers": {
				"Today": 10,
				"Week": 2,
				"Month": 5
			},
			"AverageTime": {
				"Today": 10.1,
				"Week": 11,
				"Month": 22.2
			}
		},
		"Marketplace": {
			"SuccessfulRuns": {
				"Today": 8,
				"Week": 10,
				"AllTime": 12
			},
			"IncompleteRuns": {
				"Today": 1,
				"Week": 3,
				"Month": 3
			},
			"UnavailableRuns": {
				"Today": 1,
				"Week": 2,
				"Month": 2
			},
			"RunsByUsers": {
				"Today": 10,
				"Week": 15,
				"AllTime": 17
			},
			"UniqueUsers": {
				"Today": 10,
				"Week": 2,
				"Month": 5
			},
			"AverageTime": {
				"Today": 10.1,
				"Week": 11,
				"Month": 22.2
			}
		}
	}

	ajax.on(
		dataFactory.getUrlAllServices(),
		{
			projectId: projectData.id,
			ids: [$stateParams.ServiceId]
		},
		function(data){
			if(data.count > 0){
				$scope.service = data.result[0];
				$scope.number_of_comments = $scope.service.rating.length;
				if($scope.number_of_comments != 0) {
					calculate_rating();
				}
				ajax.on(
	        dataFactory.getProductReview(),
	        {
		        typeProduct: $scope.service.type + 's',
		        productId: $scope.service.id,
		        limit: 2,
		        sort: 'date',
        		order: 'DESC'
	        },
	        function(data){
	          $scope.service.reviews = data.result;
	          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
	        },
	        function(){
	          alert("Ajax fail: getProductReview");
	        }
	      );
			}
		},
		function(){
			alert("Ajax fail: getAllServices");
		}
	);

	//Calculate Rating
	var calculate_rating = function() {
		$scope.precentage_stars = [0,0,0,0,0];
		$scope.average_rating = 0;
		for (var i in $scope.service.rating) {
			$scope.precentage_stars[$scope.service.rating[i] - 1] += 100 / $scope.number_of_comments;
			$scope.average_rating += $scope.service.rating[i];
		}
		$scope.average_rating = ($scope.average_rating / $scope.number_of_comments).toFixed(1);

		for (var i in $scope.precentage_stars) {
			$scope.precentage_stars[i] = Math.round($scope.precentage_stars[i]);
		}
	};

}])