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
                        angular.forEach(doc.tag, function(tag, index) {
                            if (!angular.isObject(tag)) {
                                ajax.create(dataFactory.createDocumentTag(), tag, function(response) {
                                    doc.tag[index] = response.data;
                                });
                            }
                        });

                        //send to s3, save returned link to document table
                        fileUpload.uploadFileToUrl(doc.file, {}, 'projectDocument', function(response) {
                            var doc = {
                                documentUrl: response.file.name,
                                documentName: response.key,
                                ownerId: $scope.user.accountId,
                                parentType: 'DMDII',
                                parentId: $scope.project.id,
                                accessLevel: $scope.documents[i].accessLevel
                            }

                            ajax.create(dataFactory.documentsURL().save, doc, callback);

                        });
                    });
                };
			}
		}
	}]);
