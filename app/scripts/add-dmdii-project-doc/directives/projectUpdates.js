'use strict';
angular.module('dmc.add-project-doc').
    directive('tabProjectUpdates', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-project-doc/tabs/tab-project-updates.html',
            scope: {
                source: "=",
                project: "=",
				user: "=",
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $q, fileUpload, $window) {
                $element.addClass("tab-projectUpdates");

				$scope.updateAccessLevels = {
					'All Members': 'ALL_MEMBERS',
					'Project Participants': 'PROJECT_PARTICIPANTS',
					'Project Participants VIPS': 'PROJECT_PARTICIPANT_VIPS'
				};

				$scope.update = {};
				$scope.projectUpdates = [];

                var convertToMarkdown = function(input) {
                    var escaped = toMarkdown(input);
                    return escaped;
                };

				$scope.saveUpdates = function() {
					var startDate = new Date($scope.update.created);
					var year = startDate.getFullYear();
					var month = startDate.getMonth() + 1;
					month = (month < 10) ? '0' + month : month;
					var day = startDate.getDate();
					day = (day < 10) ? '0' + day : day;

					$scope.update.created = year + '-' + month + '-' + day;

					$scope.update.creator = $scope.user.accountId;

					$scope.update.dmdiiProject = $scope.project.id;

                    $scope.update.description = convertToMarkdown($scope.update.description);

					ajax.create(dataFactory.saveDMDIIProject().update, $scope.update, function(response) {
						$scope.update = {};
						toastModel.showToast('success', 'Project Update Saved!');
                        $timeout($window.location.reload, 500);
					});
				};
			}
		};
	}]);
