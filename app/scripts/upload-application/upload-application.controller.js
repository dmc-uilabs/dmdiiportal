'use strict';
angular.module('dmc.uploadApplication')
	.controller('uploadApplicationController', [
        '$stateParams',
        '$scope',
		'$q',
		'$window',
        'ajax',
        'dataFactory',
        '$location',
		'$timeout',
        'toastModel',
        'DMCUserModel',
        'fileUpload',
        function ($stateParams,
            $scope,
			$q,
			$window,
            ajax,
            dataFactory,
            $location,
			$timeout,
            toastModel,
            DMCUserModel,
            fileUpload) {

            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.applicationData = {
				appTags: [],
				screenShots: [],
				appDocuments: []
			};

			ajax.get(dataFactory.getApplicationNames(), {}, function(response) {
				$scope.usedNames = response.data
			});

			//-------text input options----------------------------
			$scope.notUnique = false;
			$scope.titleLimit = 30;
			$scope.shortDescriptionLimit = 80;
			$scope.fullDescription = 4000;
			$scope.releaseNotesLimit = 1500;
			$scope.licenseLimit = 10000;

			$scope.checkUnique = function() {
				$scope.notUnique = $scope.usedNames.includes($scope.applicationData.appName);
			}
			//-------end text input options------------------------

			//-------select box options ---------------------------
			$scope.categories = {
				'ANALYTIC': 'Analytic',
				'BUSINESS': 'Business',
				'DATA': 'Data'
			};

			$scope.subcategories = {
				'COST_ESTIMATION_TOOLS': 'Cost Estimation Tools',
				'DATA_TRANSLATION': 'Data Translation',
				'DESIGN_VERIFICATION_AND_TESTING': 'Design Verification and Testing',
				'FACTORY_DATA_COLLECTION_AND_ANALYSIS': 'Factory Data Collection and Analasys',
				'MODELING_AND_SIMULATION_ENVIRONMENT': 'Modeling and Simulation Environment',
				'SUPPLIER_INTEROPERABILITY': 'Supplier Interoperability'
			};

			$scope.pricingStructures = {
				'COST_PER_EXECUTION': 'Cost Per Execution',
				'FREE': 'Free',
				'PROPORTIONAL_TO_RESOURCES_USED': 'Proportional to Resources Used',
				'UNLIMITED_EXECUTIONS_PER_MONTH': 'Unlimited Executions Per Month'
			};

			$scope.hostingMethods = {
				'PUBLIC': 'Public',
				'PRIVATE': 'Private',
				'THIRD_PARTY': 'Third Party'
			};
			//-------end select box options ---------------------------

            $scope.isValid = false;
            $scope.isSaved = false;

			//---------doc upload options----------
			$scope.application = [];
			$scope.applicationLimit = 1;

			$scope.appIcon = [];
			$scope.appIconLimit = 1;

			$scope.screenshots = [];
			$scope.screenshotLimit = 3;

			$scope.appDocs = [];
			$scope.appDocLimit = 5;
			//--------end doc upload options-------

			//----------autocomplete tags---------
			$scope.chipLimit = 7;

			function loadTags() {
				ajax.get(dataFactory.getApplicationTags(), {}, function(response) {
					$scope.tags = response.data;
				})
			};
			//-----------end autocomplete---------
            var saveCallback = function(response) {
				if (response.status === 200) {
					toastModel.showToast('success', 'Application has been Submitted!');
					$scope.applicationData = {};
					$timeout($window.location.reload, 500);
				} else {
					toastModel.showToast('error', 'Error: ' + response.data.message)
				}
            };

			//validation watch
            $scope.$watch('applicationData', function() {
                if ($scope.noTitle && angular.isDefined($scope.applicationData.appTitle) && $scope.applicationData.appTitle.trim().length > 0) {
                    $scope.noTitle = false;
                }

				if ($scope.noShortDescription && angular.isDefined($scope.applicationData.shortDescription) && $scope.applicationData.shortDescription.length > 0) {
                    $scope.noShortDescription = false;
                }

            }, true);

			var uploadScreenshots = function() {
				angular.forEach($scope.screenshots, function(doc) {
					return fileUpload.uploadFileToUrl(doc.file, {}, 'applicationScreenshot').then(function(response) {
						return ajax.create(dataFactory.documentsURL().save,
							{
								ownerId: $scope.user.accountId,
								documentUrl: response.file.name,
								documentName: 'screenshot',
								parentType: 'APPSUBMISSION',
								docClass: 'IMAGE'
							}, function(response) {
							$scope.applicationData.screenShots.push(response.data);
						});
					});
				});
			};

			var uploadAppDocs = function(doc) {
				return fileUpload.uploadFileToUrl(doc.file, {}, 'applicationDoc').then(function(response) {
					return ajax.create(dataFactory.documentsURL().save,
					{
						ownerId: $scope.user.accountId,
						documentUrl: response.file.name,
						documentName: 'doc',
						parentType: 'APPSUBMISSION',
						docClass: 'SUPPORT'
					}, function(response) {
						$scope.applicationData.appDocuments.push(response.data);
					});
				});
			};

			var uploadAppIcon = function() {
				return fileUpload.uploadFileToUrl($scope.appIcon[0].file, {}, 'applicationIcon').then(function(response) {
					return ajax.create(dataFactory.documentsURL().save,
						{
							ownerId: $scope.user.accountId,
							documentUrl: response.file.name,
							documentName: 'icon',
							parentType: 'APPSUBMISSION'
						}, function(response) {
						$scope.applicationData.appIcon = response.data;
					});
				});
			};

			var uploadApplication = function() {
				return fileUpload.uploadFileToUrl($scope.application[0].file, {}, 'application').then(function(response) {
					return ajax.create(dataFactory.documentsURL().save,
					{
						ownerId: $scope.user.accountId,
						documentUrl: response.file.name,
						documentName: 'application',
						parentType: 'APPSUBMISSION'
					}, function(response) {
						$scope.applicationData.application = response.data;
					});
                })
			};

			$scope.transformTag = function(tag) {
				console.log(tag)
				if (tag && !angular.isObject(tag)) {
					tag = { name: tag }
				};
				return tag;
			}
            $scope.save = function() {
				if (!$scope.applicationData.appTitle || $scope.applicationData.appTitle.trim().length <= 0) {
					$scope.noTitle = true;
				};

				if (!$scope.applicationData.shortDescription || $scope.applicationData.shortDescription.trim().length <= 0) {
					$scope.noShortDescription = true;
				};

				if ($scope.application.length === 0) {
					$scope.noDocSelected = true;
				};

				if ($scope.appIcon.length === 0) {
					$scope.noIconSelected = true;
				};

				if ($scope.notUnique || $scope.noDocSelected || $scope.noShortDescription || $scope.noTitle || $scope.noIconSelected) {

					return;
				}

				// angular.forEach(applicationData.appTags, function(tag) {
				// 	if (!angular.isObject(tag)) {
				// 		tag = { name: tag };
				// 	};
				// });

				var promises = [
					uploadApplication(),
					uploadAppIcon()
				];
				angular.forEach($scope.appDocs, function(doc) {
					promises.push(uploadAppDocs(doc));
				});
				angular.forEach($scope.screenshots, function(doc) {
					promises.push(uploadScreenshots(doc));
				});

				$q.all(promises).then(function(response) {
					ajax.create(dataFactory.uploadApplication(), $scope.applicationData, saveCallback);
				});

            };

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

	}]);
