'use strict';

angular.module('dmc.add-project-doc')
    .controller('DMCAddProjectDocController', [
        '$stateParams',
        '$scope',
        '$q',
        '$timeout',
        'ajax',
        'dataFactory',
        '$location',
        'toastModel',
        'questionToastModel',
        'DMCUserModel',
        'fileUpload',
        '$window',
        function ($stateParams,
                $scope,
                $q,
                $timeout,
                ajax,
                dataFactory,
                $location,
                toastModel,
                questionToastModel,
                DMCUserModel,
                fileUpload,
                $window) {


            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.documents = []
            var responseData = function(){
              var data = {};
              return data;
            };

            $scope.getProject = function() {
                ajax.get(dataFactory.getDMDIIProject($stateParams.projectId).get, {}, function(response) {
                    $scope.project = response.data;
                });
            }
            $scope.getProject();

            $scope.docAccessLevels = {
				'All Members': 'ALL_MEMBERS',
				'Project Participants': 'PROJECT_PARTICIPANTS',
				'Project Participants and Upper Tier Members': 'PROJECT_PARTICIPANTS_AND_UPPER_TIER_MEMBERS',
				'Project Participants VIPS': 'PROJECT_PARTICIPANT_VIPS'
			}

			$scope.updateAccessLevels = {
				'All Members': 'ALL_MEMBERS',
				'Project Participants': 'PROJECT_PARTICIPANTS',
				'Project Participants VIPS': 'PROJECT_PARTICIPANT_VIPS'
			}

			$scope.update = {};
			$scope.projectUpdates = [];


            var callback = function(response) {
                toastModel.showToast('success', 'Project Document Saved!');
                $window.location.reload();
            }

            $scope.uploadDocs = function() {
                console.log($scope.user)
                angular.forEach($scope.documents, function(doc) {
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
                            path: '',
                            dmdiiProjectId: $stateParams.projectId
                        }

                        ajax.create(dataFactory.saveDMDIIDocument(), doc, callback);
                    });
                });
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

                $scope.update.dmdiiProject = $stateParams.projectId;

				ajax.create(dataFactory.saveDMDIIProject().update, $scope.update, function(response) {
                    $scope.update = {};
                    toastModel.showToast('success', 'Project Update Saved!');
                });
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
