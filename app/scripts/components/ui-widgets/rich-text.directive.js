//TODO the thing
//rich text isRequired, limit, model then html

angular.module('dmc.widgets.rich-text', [
	'angular-medium-editor',
	'ng-showdown'
]).directive('uiWidgetRichText', [ '$showdown', function($showdown) {
	return {
		restrict: 'A',
		templateUrl: 'templates/components/ui-widgets/rich-text.html',
		scope: {
			fieldName: '=',
			model: '=',
			isRequired: '=',
			limit: '=',
			isSaved: '=',
			isValid: '='
		},
		controller: function ($scope) {

			$scope.noDescription = false;
			$scope.descriptionOverLimit = false;
			$scope.isValid = !$scope.isRequired;
			$scope.chars = 0;

			if ($scope.isRequired) {
				$scope.placeholderText = 'Enter text here (required)';
			} else {
				$scope.placeholderText = 'Enter text here';
			}

$scope.$watch('isValid', function() {
	console.log('rich',$scope.isValid)
})
			$scope.$watch('model', function() {
				if ($scope.model === undefined) {
					$scope.model = '';
				}

				$scope.model = $scope.model.trim()
				$scope.chars = $showdown.stripHtml($scope.model).length;

				if ($scope.isRequired && $scope.chars === 0) {
					$scope.noDescription = true;
				} else {
					$scope.noDescription = false;
				}

				if ($scope.chars > $scope.limit) {
					$scope.descriptionOverLimit = true;
				} else {
					$scope.descriptionOverLimit = false;
				}
console.log($scope.noDescription, $scope.descriptionOverLimit)

				if ($scope.noDescription || $scope.descriptionOverLimit) {
					$scope.isValid = false;
				} else {
					$scope.isValid = true;
				}
			});
		}

	}
}]);
