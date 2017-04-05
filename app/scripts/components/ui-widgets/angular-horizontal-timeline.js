/**
 * Angular JS horizontal timeline
 *
 * (c) eowo
 * http://github.com/eowo/angularjs-horizontal-timeline
 *
 * Version: v0.0.1
 *
 * Licensed under the MIT license
 */

var template =
'<div class="timeline">'+
'<div class="timeline-left">'+
'	<label>{{startLabel}}</label>'+
'</div>'+
'<div class="timeline-center">'+
'<div class="progress">'+
'	<span ng-style="{width:progress_percent+\'%\'}"></span>'+
'	<ul class="timeline-events">'+
'		<li class="timeline-event" ng-repeat="event in events"'+
'			ng-click="selectedEvent[$index]=true"'+
'			ng-blur="deselectEvent($index)"'+
'			event-date="event.date"'+
'			title="{{event.date}}"'+
'			timeline-event-marker><span></span>'+
'			<div class="timeline-event-box"'+
'				ng-show="selectedEvent[$index]"'+
'				ng-hide="!selectedEvent[$index]">'+
'               {{event.date}}<div ng-bind-html="event.content | unsafe"></div>'+
'               <a class="delete-btn" href ng-click="deleteEvent($index, event.id)" ng-if="user.isDmdiiAdmin">delete</a>'+
'			</div>'+
'		</li>'+
'	</ul>'+
'	<ul class="timeline-bg">'+
'		<li class="timeline-month" ng-repeat="month in months"'+
'			timeline-month><span style="color: #5e5e5e" title="{{month.date}}">{{month.name}}</span>'+
'			<ul>'+
'				<li class="timeline-day" ng-repeat="day in month.days"'+
'					ng-if="$index==0" ng-style="{ \'left\' : ($index * (100/month.days.length) )+\'%\'}">'+
'					<span title="{{month.date + \'-\' + day}}"><i></i></span>'+
'				</li>'+
'			</ul></li>'+
'	</ul>'+
'</div>'+
'</div>'+
'<div class="timeline-right">'+
'	<label>{{endLabel}}</label>'+
'</div>'+
'</div>';

angular.module('angular-horizontal-timeline', ['ngSanitize'] )

.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
})

.directive('horizontalTimeline', [ 'ajax', 'dataFactory', '$timeout', function(ajax, dataFactory, $timeout) {
	function controller($scope){
		$scope.selectedEvent = [];
		$scope.months= [];
        $scope.userData = $scope.$root.userData;
		$scope.getPosition = function(date){
			date = moment(date);
			var diff = date.diff(moment($scope.startDate), 'months', true);
      var diff = Math.round(diff);
			var curWeekWidth = 100/$scope.months[diff].days.length;
			var monthsWidth = 100/$scope.months.length;
			var ixOfWeek = Math.ceil(date.format('D')/7) - 1;
			var curDOfMPercent = (date.format('D') - $scope.months[diff].days[ixOfWeek] ) * 14.28;

			return ( (monthsWidth * diff) + (((ixOfWeek * curWeekWidth) + (curDOfMPercent / 100 * curWeekWidth)) / 100 * monthsWidth) );
		};

        $scope.deselectEvent = function(index) {
            $timeout(function() {
                $scope.selectedEvent[index] = false;
            }, 500)
        }
        $scope.deleteEvent = function(index, id) {
            console.log('test', index, id)
            ajax.delete(dataFactory.dmdiiProjectEventUrl(id).delete, {}, function() {
                $scope.events.splice(index, 1);
            });
        };

		var range  = moment().range(moment($scope.startDate), moment($scope.endDate));
		range.by('months', function(month) {
			$scope.months.push({
				'date':month.format('YYYY-MM'),
				'name':month.format('MMMM'),
				'days':[]});

			var dayrange = moment().range(month.startOf('month').format('YYYY-MM-DD'), month.endOf('month').format('YYYY-MM-DD'));
			dayrange.by('weeks', function(week) {
				  $scope.months[$scope.months.length - 1].days.push(week.format('DD'));
			});
		});

		$scope.progress_percent = $scope.getPosition(moment().format('YYYY-MM-DD'));
    $scope.startLabel = moment($scope.startDate).format('MMMM YYYY');
    $scope.endLabel = moment($scope.endDate).format('MMMM YYYY');
	}

	return {
		restrict: 'AEC',
		controller: controller,
		scope: {
			startDate: '@',
			endDate: '@',
			events: '=',
        user: '='
		},
		template:template
	};
}])

.directive('timelineMonth', function() {
	function link(scope, element, attr) {
		var monthWidth = 100/scope.months.length;
		element.css({'width': monthWidth+'%'});
	}
	return {
		restrict: 'A',
		link : link
	};
})

.directive('timelineEventMarker', function() {
	function link(scope, element, attr) {
		var eventDate = scope.$eval(attr.eventDate);
		var pos = scope.getPosition(eventDate);
		element.css({'left': pos+'%'});
	}
	return {
		restrict: 'A',
		link : link,
		scope: false
	};
});
