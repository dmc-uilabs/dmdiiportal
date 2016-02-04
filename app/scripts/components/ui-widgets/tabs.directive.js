'use strict';

angular.module('dmc.widgets.tabs',[
])
	.directive('uiWidgetTabsHistory', [function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-history.html',
			//transclude: true,
			scope: {
				data: "=",
				filters: "="
			},
			controller: function($scope) {


			$scope.history = [
	//Successful Runs
				{
					icon: "done_all",
					
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01-19-2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/17/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/18/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/11/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas successfully ran the service.",
					type: "Successful Runs",
					date: moment("01/11/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
	//Incomplete Runs
				{
					icon: "done_all",
					title: "Timmy Thomas Incomplete ran the service.",
					type: "Incomplete Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas Incomplete ran the service.",
					type: "Incomplete Runs",
					date: moment("01/17/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "done_all",
					title: "Timmy Thomas Incomplete ran the service.",
					type: "Incomplete Runs",
					date: moment("01/16/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
	//Unavailable Runs
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					type: "Unavailable Runs",
					date: moment("01/19/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
				{
					icon: "block",
					title: "Anna Barton ran the service unsuccessfully.",
					type: "Unavailable Runs",
					date: moment("01/18/2016 12:00:00").format("MM/DD/YYYY, h:mm A")
				},
			]

				$scope.ok = function(){
					console.info("Dfsd");
				}

				$scope.filterBy = function(val){
					console.info(val)
					var day, month, nowDay=19, nowMonth=1;
					day = val.date.split(' ');
					day = val.date.split('/');
					month = day[0];
					day = day[1];

					if($scope.filters.type != val.type){
						return false;
					}
					switch($scope.filters.time){
						case "today": if(day == nowDay && month == nowMonth) return true; else return false; 
						case "week": if(nowDay-day<7 && month == nowMonth) return true; else return false; 
						case "all": return true; 
					}
				}
			}
		};
	}])
	.directive('uiWidgetTabsStatistic', [ function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-statistic.html',
			transclude: true,
			scope: {
				data: "=",
				filter: "="
			},
			controller: function($scope) {
				$scope.filtered = function(block, time, type){
					$scope.filter.block = block;
					$scope.filter.time = time;
					$scope.filter.type = type;					
				}
			}
		};
	}])
	.directive('uiWidgetTabsAuthor', [ function () {
		return {
			restrict: 'E',
			templateUrl: 'templates/components/ui-widgets/tabs-author.html',
			transclude: true,
			scope: {
				data: "=",
			},
			controller: function($scope) {
				console.info("direcrive", $scope.data);
				$scope.follow = function(item){
					item.follow = !item.follow;
				}
			}
		};
	}]);