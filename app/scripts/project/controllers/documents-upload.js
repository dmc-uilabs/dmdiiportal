angular.module('dmc.project')
.controller('DocumentsUploadCtrl',
    function ($scope, $rootScope, $state, $stateParams, $mdDialog, $q, $http, projectData, dataFactory, toastModel, fileUpload, ajax) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

        $scope.documents = [];

        function apply(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        $scope.comeBack = function(){
            $state.go('project.documents');
        };

        $scope.accessLevels = {
            'Public': 'PUBLIC',
            'Members': 'MEMBER',
            'Admin': 'ADMIN'
        }
        $scope.uploadDocuments = function(){
            var promises = {};

            for(var i in $scope.documents){
              (function(doc){
                if (doc.tags) {
                    doc.tags.push({tagName: projectCtrl.projectData.title + ' document'});
                    angular.forEach(doc.tags, function(tag, index) {
                        if (!angular.isObject(tag)) {
                            doc.tags[index] = {tagName: tag}
                        }
                    });
                } else {
                    doc.tags = [{tagName: projectCtrl.projectData.title + ' document'}];
                }
                promises[doc.title] = fileUpload.uploadFileToUrl(doc.file, {}, doc.title + doc.type).then(function(response) {
                    var docData = {
                        parentId: projectCtrl.currentProjectId,
                        parentType: 'PROJECT',
                        documentUrl: response.file.name,
                        documentName: doc.title + doc.type,
                        ownerId: $rootScope.userData.accountId,
                        docClass: 'SUPPORT',
                        accessLevel: doc.accessLevel,
                        tags: doc.tags
                    };

                    return ajax.create(dataFactory.documentsUrl().save, docData, function(resp){});
                });
              })($scope.documents[i]);
            }

/*
              fileUpload.uploadFileToUrl(
                  $scope.documents[i].file,
                  {id:projectCtrl.currentProjectId },
                  'ProjectDoc',
                  function(data){
                      if(data.file && data.file.name){
                          var docSize = $scope.documents[i].file.size;
                          $scope.documents[i].file = data.file.name;
                          console.log($scope.userData);
                          //Get current date
                          var d = new Date();
                          var modDate = d.getDate();
                          var fd = {
                             id: "-1",
                             size: docSize,
                             file: $scope.documents[i].file,
                             projectId:projectCtrl.currentProjectId,
                             projectDocumentId: "0",
                             owner: $scope.userData.displayName,
                             ownerId:$scope.userData.profileId,
                             title:$scope.documents[i].title,
                             modifed: modDate
                          };

                          //hard code projectDocumentId until we put in a folder system.
                          promises["document"+i] = $http.post(dataFactory.addProjectDocument(), fd);

                      }
                  }
              );
*/
              /*
                console.log($scope.userData);
                var fd = {
                   file: $scope.documents[i].file,
                   projectId:projectCtrl.currentProjectId,
                   projectDocumentId: "0",
                   owner: $scope.userData.displayName,
                   ownerId:$scope.userData.profileId,
                   title:$scope.documents[i].title,
                   modified: "1"
                };
                //fd["size"] = "1";


              /*  var fd = new FormData();
                fd.append('filename', $scope.documents[i].file);
                fd.append('projectId', projectCtrl.currentProjectId);
                fd.append('title', $scope.documents[i].title);
                fd.append('type', $scope.documents[i].type);*/

                //promises["document"+i] = $http.post(dataFactory.addProjectDocument(), fd);
                /*, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });*/


            $q.all(promises).then(function(){
                    $state.go("project.documents");
                }, function(res){
                    toastModel.showToast("error", "Error." + res.statusText);
                }
            );
        };
    });
