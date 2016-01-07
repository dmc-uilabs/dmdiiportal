angular.module('dmc.project')
.controller('projectServicesDetailCtrl', ['$scope', '$stateParams', 'projectData', 'ajax', 'dataFactory', '$state', function ($scope, $stateParams, projectData, ajax, dataFactory, $state) {
	
	$scope.projectData = projectData;
	$scope.average_rating = 0;
	$scope.followFlag = false;
	$scope.precentage_stars = [0,0,0,0,0];
	$scope.number_of_comments = 0;
	$scope.service = null;

	$scope.statistics = [
		{
			title: "Project",
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
		{
			title: "Marketplace",
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
	]

	$scope.history = {
		leftColumn: {
			title: "Public",
			viewAllLink: "",
			list:[
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					date: "July 31",
				},
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					date: "July 30",
				},
				{
					icon: "file_upload",
					title: "Jhon Smith uploaded the service.",
					date: "June 30",
				},
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					date: "June 30",
				},
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					date: "June 30",
				},
				{
					icon: "file_upload",
					title: "Jhon Smith uploaded the service.",
					date: "June 30",
				},
			]
		},
		rightColumn: {
			title: "Marketplace",
			viewAllLink: "",
			list:[
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				},
				{
					icon: "edit",
					title: "Adam Marks edited the service description",
					date: "June 30",
				}
			]
		}
	}

	ajax.on(
		dataFactory.getUrlAllServices(),
		{
			productId: projectData.id,
			ids: [$stateParams.ServiceId]
		},
		function(data){
			if(data.count > 0){
				$scope.service = data.result[0];
				$scope.number_of_comments = $scope.service.rating.length;
				if($scope.number_of_comments != 0) {
					calculate_rating();
				}
				if($scope.service.tags.length == 0){
					$scope.service.tags = ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10",]
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

	$scope.delete = function(){
		ajax.on(
			dataFactory.getUrlRemoveFromProject($stateParams.projectId),
			{
				'projectId': $stateParams.projectId,
				'type': 'service',
				'id': $stateParams.ServiceId,
			},
			function(data){
				console.info("ok", data);
				for(var index in $scope.projectData.services.data){
					console.info("index",index)
					if($scope.projectData.services.data[index].id == $stateParams.ServiceId){
						$scope.projectData.services.data.splice(index, 1);
						break;
					}
				}
				$state.go("project.services");
			},
			function(){
				alert("Ajax fail: getAllServices");
			},
			"POST"
		);

	}

	$scope.follow = function(){
		$scope.followFlag = !$scope.followFlag;
	}

}])