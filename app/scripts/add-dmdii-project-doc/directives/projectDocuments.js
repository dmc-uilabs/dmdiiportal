'use strict';
angular.module('dmc.add-project-doc').
    directive('tabProjectDocuments', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/add-dmdii-project-doc/tabs/tab-project-documents.html',
            scope: {
                source: '=',
                project: '=',
				user: '='
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, $q, fileUpload, $window) {
                $element.addClass('tab-projectDocuments');

                $scope.documents = [];

				$scope.docAccessLevels = {
					'All Members': 'ALL_MEMBERS',
					'Project Participants': 'PROJECT_PARTICIPANTS',
					'Project Participants and Upper Tier Members': 'PROJECT_PARTICIPANTS_AND_UPPER_TIER_MEMBERS',
					'Project Participants VIPS': 'PROJECT_PARTICIPANT_VIPS'
				}

				var callback = function(response) {
					toastModel.showToast('success', 'Project Document Saved!');
                    $scope.docCount--;
                    if ($scope.docCount === 0) {
                        $window.location.reload();
                    }
				}

                $scope.uploadDocs = function() {
                    if ($scope.documents.length === 0) {
                        $scope.noDocSelected = true;
                        return;
                    }

                    angular.forEach($scope.documents, function(doc, i) {
                        $scope.docCount = $scope.documents.length;
                        if (doc.tags) {
                            angular.forEach(doc.tags, function(tag, index) {
                                if (!angular.isObject(tag)) {
                                    $scope.documents[i].tags[index] = {tagName: tag}
                                }
                            });
                            $scope.documents[i].tags.push({tagName: $scope.project.projectTitle + ' document'});
                        } else {
                            $scope.documents[i].tags = [{tagName: $scope.project.projectTitle + ' document'}];
                        }
                        $scope.documents[i].tags.push({tagName: doc.file.name});
                        console.log(doc)
                        //send to s3, save returned link to document table
                        fileUpload.uploadFileToUrl(doc.file, {}, 'projectDocument', function(response) {
                            console.log(response)
                            var doc = {
                                documentUrl: response.file.name,
                                documentName: $scope.documents[i].title + $scope.documents[i].type,
                                ownerId: $scope.user.accountId,
                                dmdiiProjectId: $scope.project.id,
                                accessLevel: $scope.documents[i].accessLevel,
                                tags: $scope.documents[i].tags
                            }
                            ajax.create(dataFactory.saveDMDIIDocument(), doc, callback);

                        });
                    });
                };
			}
		}
	}]);
