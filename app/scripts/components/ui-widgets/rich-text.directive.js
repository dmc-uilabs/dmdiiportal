//TODO the thing
//rich text isRequired, limit, model then html

angular.module('dmc.widgets.rich-text', [
	'angular-medium-editor'
]).directive('uiWidgetRichText', function() {
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

			$scope.$watch('model', function() {
				$scope.chars = $('#richdiv').text().trim().length;

				if (!$scope.model && $scope.isRequired && $scope.chars === 0) {
					$scope.noDescription = true;
					return;
				} else {
					$scope.noDescription = false;
				}

				$scope.model = $scope.model.trim()

				if ($scope.chars > $scope.limit) {
					$scope.descriptionOverLimit = true;
				} else {
					$scope.descriptionOverLimit = false;
				}


				if ($scope.noDescription || $scope.descriptionOverLimit) {
					$scope.isValid = false;
				} else {
					$scope.isValid = true;
				}
			});
		}

	}
});
