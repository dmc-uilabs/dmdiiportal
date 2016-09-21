//TODO the thing
//rich text isRequired, limit, model then html

angular.module('dmc.widgets.richText', [
	'angular-medium-editor'
]).directive('richText', function() {
	return {
		restrict: 'A',
		templateUrl: 'templates/components/ui-widgets/rich-text.html',
		scope: {
			ngModel: '=',
			isRequired: '=',
			limit: '=',
			isSaved: '=',
			isValid: '='
		},
		controller: function ($scope) {

			$scope.noDescription = false;
			$scope.descriptionOverLimit = false;
			$scope.isValid = !$scope.isRequired;

			$scope.$watch('ngModel', function() {
				$scope.ngModel = $scope.ngModel.trim()
				$scope.chars = $scope.ngModel.length;

				if ($scope.chars > $scope.limit) {
					$scope.descriptionOverLimit = true;
				} else {
					$scope.descriptionOverLimit = false;
				}

				if ($scope.isRequired && $scope.chars === 0) {
					$scope.noDescription = true;
				} else {
					$scope.noDescription = false;
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
