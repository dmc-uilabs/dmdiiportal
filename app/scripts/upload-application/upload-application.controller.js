'use strict';
angular.module('dmc.uploadapplicationData')
	.controller('uploadapplicationDataController', [
        '$stateParams',
        '$scope',
        'ajax',
        'dataFactory',
        '$location',
		'$timeout',
        'toastModel',
        'DMCUserModel',
        'questionToastModel',
        'fileUpload',
        function ($stateParams,
            $scope,
            ajax,
            dataFactory,
            $location,
			$timeout,
            toastModel,
            DMCUserModel,
            questionToastModel,
            fileUpload) {

            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.applicationData = {};

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

			$scope.screenshots = [];
			$scope.screenshotLimit = 3;

			$scope.appDocs = [];
			$scope.appDocLimit = 5;

			$scope.appIcon = [];
			$scope.appIconLimit = 1;
			//--------end doc upload options-------
            var convertToMarkdown = function(input) {
                var escaped = toMarkdown(input);
                return escaped;
            };

            var saveCallback = function(response) {
                $scope.applicationData = {};

                toastModel.showToast('success', 'Application has been Submitted!');
				$timeout($window.location.reload, 500);
            };

            $scope.clear = function() {
                $scope.applicationData = {};
                $scope.document = [];
                $scope.noTitle = false;
                $scope.noLink = false;
                $scope.noDocSelected = false;

            };
			//validation watch
            $scope.$watch('applicationData', function() {
                if ($scope.noTitle && angular.isDefined($scope.applicationData.displayName) && $scope.applicationData.displayName.trim().length > 0) {
                    $scope.noTitle = false;
                }

                if ($scope.linkType === 'link' && $scope.noLink && angular.isDefined($scope.applicationData.link) && $scope.applicationData.link.trim().length > 0) {
                    $scope.noLink = false;
                }

                if ($scope.linkType === 'document' && $scope.noDocSelected && angular.isDefined($scope.document) && $scope.document.length > 0) {
                    $scope.noDocSelected = false;
                }

            }, true);

            $scope.save = function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10) ? '0' + month : month;
                var day = date.getDate();

                $scope.applicationData.created = year + '-' + month + '-' + day;

                fileUpload.uploadFileToUrl($scope.application[0].file, {}, 'quickdoc', function(response) {
                    $scope.applicationData.application = response.file.name;
                    ajax.create(dataFactory.documentsURL().save,
                        {
                            ownerId: $scope.user.accountId,
                            documentUrl: $scope.applicationData.doc,
                            documentName: $scope.applicationData.displayName
                        }, function(response) {
                        $scope.applicationData.doc = response.data;
                        ajax.create(dataFactory.saveapplicationData(), $scope.applicationData, saveCallback);
                    });
                });
            };
            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }
		}]);
