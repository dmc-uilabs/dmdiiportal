'use strict';
angular.module('dmc.component.members-card', [
		'dmc.widgets.stars',
])
.directive('dmcMembersCard', function(){
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {
			cardSource: '=',
		},
		templateUrl: 'templates/components/members-card/members-card.html',
		controller: function($scope){
			$scope.profile = {
				display_name: "John Thomas",
				jobTitle: "Engineering Manager",
				avatar: "/uploads/profile/1/20151222084711000000.jpg",
      	company: "General Electric (GE) Global Research",
      	rating: 3.4,
      	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio."
			}
		}
	}
})