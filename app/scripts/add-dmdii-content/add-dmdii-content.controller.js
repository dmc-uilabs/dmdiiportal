'use strict';

angular.module('dmc.addDmdiiContent')
    .controller('addDmdiiContentController', [
        "$stateParams",
        "$scope",
        "ajax",
        "dataFactory",
        "$location",
        "toastModel",
        "questionToastModel",
        "fileUpload",
        function ($stateParams,
                  $scope,
                  ajax,
                  dataFactory,
                  $location,
                  toastModel,
                  questionToastModel,
                  fileUpload) {

            // logo drop box --------------------------------------------
            $scope.newLogo = null;
            $scope.fileDragEnter = function(flow){
                $scope.newFile = flow.files[0];
                flow.files = [];
            };

            $scope.addedNewFile = function(file,event,flow){
                $scope.newFile = file;
                flow.files.shift();
            };

            $scope.removeFile = function(flow){
                flow.files = [];
                $scope.newFile = null;
            };

            $scope.uploadFile = function(){
                if($scope.newFile){
                    fileUpload.uploadFileToUrl($scope.newFile.file, callbackUploadFile);
                    $scope.cancelChangingLogo();
                }
            };

            var callbackUploadFile = function(data){
                if(!data.error) {
                    $scope.quicklink.file = data.file.name;
                    apply();
                    toastModel.showToast('success', 'File successfully added');
                }else{
                    toastModel.showToast('error', 'Unable add File');
                }
            };
            // --------------------------------------------------------------------

            $scope.currentSection = {
                index : 0,
                name : 'quickLinks'
            };

            $scope.sections = {
                quicklinks : {
                    title : 'Quick Links'
                },
                memberEvents : {
                    title : 'Member Events'
                },
                memberNews : {
                    title : 'Member News'
                },
                projectEvents : {
                    title : 'Project Events'
                },
                projectNews : {
                    title : 'Project News'
                },
                projectsOverview: {
                    title : 'Projects Overview'
                },
				projectStatus: {
                    title : 'Projects Status'
                }
            };

            var getCurrentSection = function(){
                var sectionName = $location.$$path.split('/');
                sectionName = sectionName[sectionName.length-1];
				console.log(sectionName)
                var index = 0;
                for(var s in $scope.sections){
                    if(s == sectionName) {
                        $scope.currentSection = {
                            index : index,
                            name : sectionName
                        };
                        break;
                    }
                    index++;
                }
            };
            getCurrentSection();

            $scope.onSectionSelected = function(key){
                $location.path('/addContent/' + key);
                getCurrentSection();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
