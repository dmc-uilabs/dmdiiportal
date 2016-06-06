angular.module('dmc.project')
.controller('DocumentsUploadCtrl',
    function ($scope, $rootScope, $state, $stateParams, $mdDialog, $q, $http, projectData, dataFactory, toastModel) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

        $scope.documents = [];

        function apply(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        $scope.comeBack = function(){
            $state.go("project.documents");
        };

        $scope.uploadDocuments = function(){
            var promises = {};
            console.log($scope.documents);
            for(var i in $scope.documents){
                var fd = new FormData();
                fd.append('file', $scope.documents[i].file);
                fd.append('projectId', projectCtrl.currentProjectId);
                fd.append('title', $scope.documents[i].title);
                fd.append('type', $scope.documents[i].type);

                promises["document"+i] = $http.post(dataFactory.documentUpload(), fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            }

            $q.all(promises).then(function(){
                    $state.go("project.documents");
                }, function(res){
                    toastModel.showToast("error", "Error." + res.statusText);
                }
            );
        };
    });
