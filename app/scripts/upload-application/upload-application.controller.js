'use strict';
<<<<<<< HEAD
angular.module('dmc.uploadApplication')
	.controller('uploadApplicationController', [
        '$stateParams',
        '$scope',
		'$q',
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
				appTags: []
			};

			//-------text input options----------------------------
			$scope.titleLimit = 30;
			$scope.shortDescriptionLimit = 80;
			$scope.fullDescription = 4000;
			$scope.releaseNotesLimit = 1500;
			$scope.licenseLimit = 10000;
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
<<<<<<< HEAD
			//--------end doc upload options-------

			//----------autocomplete tags---------
			$scope.chipLimit = 7;

			function loadTags() {
				var tags = [];
			};
			//-----------end autocomplete---------

            var saveCallback = function(response) {
                $scope.applicationData = {};

                toastModel.showToast('success', 'Application has been Submitted!');
				$timeout($window.location.reload, 500);
            };

            $scope.clear = function() {
                $scope.applicationData = {};
                $scope.noTitle = false;
				$scope.noShortDescription = false;
                $scope.document = [];
                $scope.noDocSelected = false;

            };
			//validation watch
            $scope.$watch('applicationData', function() {
                if ($scope.noTitle && angular.isDefined($scope.applicationData.appTitle) && $scope.applicationData.appTitle.trim().length > 0) {
                    $scope.noTitle = false;
                }

                if ($scope.noDocSelected && $scope.application.length > 0) {
                    $scope.noDocSelected = false;
                }

				if ($scope.noShortDescription && angular.isDefined($scope.applicationData.shortDescriptionLimit) && $scope.applicationData.shortDescription.length > 0) {
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
							$scope.applicationData.doc = response.data;
						});
					});
				});
			};

			var uploadAppDocs = function() {
				angular.forEach($scope.appDocs, function(doc) {
					return fileUpload.uploadFileToUrl(doc.file, {}, 'applicationDoc').then(function(response) {
						return ajax.create(dataFactory.documentsURL().save,
						{
							ownerId: $scope.user.accountId,
							documentUrl: response.file.name,
							documentName: 'doc',
							parentType: 'APPSUBMISSION',
							docClass: 'SUPPORT'
						}, function(response) {
							$scope.applicationData.doc = response.data;
						});
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

            $scope.save = function() {

				if (!$scope.applicationData.appTitle || $scope.applicationData.appTitle.trim().length > 0) {
					$scope.noTitle = true;
				};

				if (!$scope.applicationData.shortDescription || $scope.applicationData.shortDescription.trim().length > 0) {
					$scope.noShortDescription = true;
				};

				if ($scope.application.length === 0) {
					$scope.noDocSelected = true;
				};

				$q.all([
					uploadApplication(),
					uploadAppIcon(),
					uploadAppDocs(),
					uploadScreenshots(),
				]).then(function(response) {
					ajax.create(dataFactory.uploadApplication(), $scope.applicationData, saveCallback);
				});

            };

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

	}]);
