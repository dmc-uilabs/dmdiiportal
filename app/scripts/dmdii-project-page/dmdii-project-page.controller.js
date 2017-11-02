'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/

angular.module('dmc.dmdiiProj')
    .controller('DMCDmdiiProjectPageController',[
        '$state',
        '$stateParams',
        '$scope',
        '$rootScope',
        '$cookies',
        'ajax',
        'dataFactory',
        'socketFactory',
        '$location',
        'is_search',
        'DMCUserModel',
        '$window',
        'questionToastModel',
        'toastModel',
        function($state,
                 $stateParams,
                 $scope,
                 $rootScope,
                 $cookies,
                 ajax,
                 dataFactory,
                 socketFactory,
                 $location,
                 is_search,
                 DMCUserModel,
                 $window,
                 questionToastModel,
                 toastModel){

            $scope.searchModel = angular.isDefined($stateParams.text) ? $stateParams.text : null;

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            var userData = null;
            DMCUserModel.getUserData().then(function(res){
                userData = res;
            });

            $scope.projectLoading = true;

            var loadingData = function(start){ // progress line
                $scope.downloadData = start;
            };

            // callback for project
            var callbackFunction = function(response){
                $scope.project = response.data.dmdiiProject;

                ajax.get(dataFactory.getDMDIIProject($scope.project.id).contributors, responseData(), function(response) {
                    $scope.project.contributingCompanies = response.data.organizations;
                    $scope.projectLoading = false;
                });

                ajax.get(dataFactory.dmdiiProjectUpdateUrl().get, {limit: 5, projectId: $scope.project.id}, function(response) {
                    $scope.updates = response.data.dmdiiProjectUpdates;
                    angular.forEach($scope.updates, function(update, index) {
                        var date = new Date(update.created);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        month = (month < 10) ? '0' + month : month;
                        var day = date.getDate() + 1;

                        $scope.updates[index].created = month + '-' + day + '-' + year;
                    })
                    $scope.projectLoading = false;
                });

                ajax.get(dataFactory.getDMDIIDocuments($scope.project.id).project, responseData(), function(response) {
                    $scope.documents = response.data.dmdiiProjectDocuments;
                    // if ($scope.documents.length > 0) {
                    //   selectDocument(0);
                    // }
                });

                // ajax.get(dataFactory.getDMDIIDocuments().projectDocument, {fileTypeId: 3, dmdiiProjectId: $scope.project.id}, function(response) {
                //     $scope.projectFinancials = response.data;
                // });
                //
                // ajax.get(dataFactory.getDMDIIDocuments().projectDocument, {fileTypeId: 4, dmdiiProjectId: $scope.project.id}, function(response) {
                //     $scope.projectSchedule = response.data;
                // });

            };

            var responseData = function(){
                var data = {};
                return data;
            };

            $scope.getDMDIIProject = function(){
                loadingData(true);
                ajax.get(dataFactory.getDMDIIProject($stateParams.projectId).get, responseData(), callbackFunction);
            };
            $scope.getDMDIIProject();

            // delete server
            $scope.deleteProject = function(event){
                questionToastModel.show({
                    question: "Are you sure you want to delete this project?",
                    buttons: {
                        ok: function(){
                            ajax.delete(dataFactory.getDMDIIProject($scope.project.id).delete, {},
                                function (response) {
                                    toastModel.showToast("success", "Project successfully removed!");
                                    $window.location.href='/dmdii-projects.php#/dmdii_projects';
                                }, function (response) {
                                    toastModel.showToast("error", response.statusText);
                                }
                            );
                        },
                        cancel: function(){}
                    }
                }, event);
            };

		}
    ]
).filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });
