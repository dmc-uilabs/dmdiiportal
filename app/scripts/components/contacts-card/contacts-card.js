'use strict';
angular.module('dmc.component.contacts-card', [])
.directive('dmcContactsCard', function(){
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {
			cardSource: '=',
		},
		templateUrl: 'templates/components/contacts-card/contacts-card.html',
		controller: function($scope){}
	}
})