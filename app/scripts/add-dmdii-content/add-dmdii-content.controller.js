'use strict';

angular.module('dmc.addDmdiiContent')
    .controller('addDmdiiContentController', [
        "$stateParams",
        "$scope",
        "ajax",
        "dataFactory",
        "$location",
        "toastModel",
        "DMCUserModel",
        "questionToastModel",
        "fileUpload",
        function ($stateParams,
            $scope,
            ajax,
            dataFactory,
            $location,
            toastModel,
            DMCUserModel,
            questionToastModel,
            fileUpload) {

            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.projects = [];

            var callbackFunction = function(response) {
                if(angular.isDefined(response.data.count)) {
                    $scope.projects = response.data.data;
                } else {
                    $scope.projects = response.data;
                }
            }

            $scope.getProjects = function() {
                ajax.get(dataFactory.getDMDIIProject().all, {pageSize: 200, page:0}, callbackFunction)
            };
            $scope.getProjects();

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

        }
    ]);
