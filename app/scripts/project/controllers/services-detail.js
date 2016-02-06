angular.module('dmc.project')
.controller('projectServicesDetailCtrl', ['serviceData', 'serviceModel', '$scope', '$stateParams', 'projectData', 'ajax', 'dataFactory', '$state', 
	function (serviceData, serviceModel ,$scope, $stateParams, projectData, ajax, dataFactory, $state) {
	
	$scope.projectData = projectData;
	$scope.service = serviceData;
	$scope.average_rating = 0;
	$scope.followFlag = false;
	$scope.precentage_stars = [0,0,0,0,0];
	$scope.number_of_comments = 0;
	// $scope.service = null;
	$scope.flagHistory = false;
	$scope.sort = "runDate";
	$scope.order = true;
    $scope.selectedTab = 0;

	$scope.history = {
		leftColumn: {
			title: "Project",
			viewAllLink: "",
			list:[]
		},
		rightColumn: {
			title: "Marketplace",
			viewAllLink: "",
			list:[]
		}
	}

            serviceModel.get_service_hystory(
                {
                    "period": "today",
                    "section": "project"
                },
                function(data){
                    for(var i in data){
                        data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                        if(data[i].type == "successful_runs"){
                            data[i].icon = "done_all";
                        }else if(data[i].type == "unavailable_runs"){
                            data[i].icon = "block";
                        }else if(data[i].type == "incomplete_runs"){
                            data[i].icon = "file_upload";
                        };
                    }
                    $scope.history.leftColumn.list = data;
                }
            );
            serviceModel.get_service_hystory(
                {
                    "period": "today",
                    "section": "marketplace"
                },
                function(data){
                    for(var i in data){
                        data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                        if(data[i].type == "edited"){
                            data[i].icon = "edit";
                        }
                    }
                    $scope.history.rightColumn.list = data;
                }
            );

            $scope.getHistory = function(type, time){
                var period = "";
                var params = {"section": "project"};
                if(time == "today"){
                    period = "today";
                }else if (time == "week"){
                    period = ["today","week"];
                }else{
                    period = ["today","week","all"];
                };

                params['period'] = period;

                if(type != "runs_by_users"){
                    params['type'] = type;
                };

                serviceModel.get_service_hystory(
                    params,
                    function(data){
                        for(var i in data){
                            data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                            if(data[i].type == "successful_runs"){
                                data[i].icon = "done_all";
                            }else if(data[i].type == "unavailable_runs"){
                                data[i].icon = "block";
                            }else if(data[i].type == "incomplete_runs"){
                                data[i].icon = "file_upload";
                            };
                        }
                        $scope.history.leftColumn.list = data;
                        $scope.selectedTab = 1;
                        apply();
                    }
                );
            }

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

	$scope.runHistory = [
		{
			runDate: "10/15/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Success",
		},
		{
			runDate: "12/15/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "12:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "12:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "09:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "09:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/09/2015",
			runTimeService: "09:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:22 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
		{
			runDate: "10/19/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 3.0,
			results: "Fail",
		},
		{
			runDate: "12/10/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Success",
		},
		{
			runDate: "12/11/2015",
			runTimeService: "11:35 AM",
			runBy: "Forge Admin",
			runTime: 2.9,
			results: "Fail",
		},
	]
/*
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
*/
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

	//Search products
	$scope.search = function(text){
		window.location.href = '/marketplace.php#/search/services?text=' + text;
	}

	$scope.showHistory = function(){
		$scope.flagHistory = !$scope.flagHistory;
	}

	$scope.sorting = function(sort){
		$scope.sort = sort;
		$scope.order = !$scope.order;
	}

}])