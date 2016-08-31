'use strict';

angular.module('dmc.company-profile')
    .controller('EditCompanyProfileController', [
        "$stateParams",
        "$scope",
        "$timeout",
        "$window",
        "ajax",
        "dataFactory",
        "$location",
        "toastModel",
        "questionToastModel",
        "DMCUserModel",
        "fileUpload",
        function ($stateParams,
                  $scope,
                  $timeout,
                  $window,
                  ajax,
                  dataFactory,
                  $location,
                  toastModel,
                  questionToastModel,
                  DMCUserModel,
                  fileUpload) {

            var getCompany = function() {
                ajax.get(dataFactory.getOrganization($stateParams.companyId), {}, function(response) {
                    $scope.company = response.data;
                });
            }
            if (angular.isDefined($stateParams.companyId)) {
                getCompany();
                $scope.title = "Update an Organization";
                $scope.action = "updated";
            } else {
                $scope.title = "Create an Organization";
                $scope.action = "created";
                $scope.company = {
                    contacts: [],
                    awards: [],
                    areasOfExpertise: [],
                    desiredAreasOfExpertise: [],
                    address: {}
                };
            }

            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            // logo drop box --------------------------------------------

            ajax.get(dataFactory.getOrgTags(), {}, function(response) {
                $scope.tags = response.data;
            });

            $scope.changingLogo = false;
            $scope.changeLogo = function(){
                $scope.changingLogo = true;
            };

            $scope.cancelChangingLogo = function(){
                $scope.changingLogo = false;
            };

            $scope.newLogo = null;
            $scope.pictureDragEnter = function(flow){
                $scope.newLogo = flow.files[0];
                flow.files = [];
            };

            $scope.pictureDragLeave = function(flow){
                //$scope.newLogo = null;
            };

            $scope.addedNewFile = function(file,event,flow){
                $scope.newLogo = file;
                flow.files.shift();
            };

            $scope.removePicture = function(flow){
                flow.files = [];
                $scope.newLogo = null;
            };

            $scope.saveLogo = function() {
                $scope.cancelChangingLogo();
                uploadLogo();
            }

            var uploadLogo = function(companyId){
                if($scope.newLogo){
                    fileUpload.uploadFileToUrl($scope.newLogo.file,{id : $scope.company.id},'company-logo', function(response) {
                        ajax.create(dataFactory.saveDocument(),
                            {
                                organizationId: companyId,
                                ownerId: $scope.user.accountId,
                                documentUrl: response.file.name,
                                documentName: 'company-logo',
                                fileTypeId: 1
                            }, function(response) {
                                if (response.status === 200) {
                                    toastModel.showToast('success', 'Logo uploaded successfully');
                                }
                            });
                    });
                }
            };

            $scope.deleteLogo = function(ev){
                //TODO soft delete doc
            };

            var callbackUploadPicture = function(data){
                if(!data.error) {
                    toastModel.showToast('success', 'Image successfully added');
                }else{
                    toastModel.showToast('error', 'Unable add image');
                }
            };
            // --------------------------------------------------------------------

            var saveCallback = function(response) {
                if(response.status === 200) {
                    toastModel.showToast('success', 'Organization successfully ' + $scope.action);
                    $timeout(function() {
                        $window.location.href = '/company-profile.php#/' + response.data.id;
                    }, 500);
                }else{
                    toastModel.showToast('error', 'Organization could not be ' + $scope.action);
                }
                uploadLogo();
                // uploadVideos();
                // uploadImages();
            }

            $scope.saveChanges = function(){
                if ($scope.company.id) {
                    ajax.put(dataFactory.updateOrganization($scope.company.id), $scope.company, saveCallback);
                } else {
                    ajax.create(dataFactory.createOrganization(), $scope.company, saveCallback);
                }
                //save doc

            };

            // function for create contact
            var createContact = function(contact,updatedData){
                var contact_ = $.extend(true,{},contact);
                console.log(contact)
            };


            // function for update video
            var updateVideo = function(video,updatedData){
                //TODO upload doc, s3
                // ajax.update(dataFactory.updateCompanyVideo(video.id), updatedData,
                //     function (response) {
                //         var data = response.data ? response.data : response;
                //         for (var i in $scope.company.videos) {
                //             if ($scope.company.videos[i].id == video.id) {
                //                 $scope.company.videos[i].title = $scope.company.videos[i].changedTitle;
                //                 $scope.company.videos[i].link = $scope.company.videos[i].changedLink;
                //                 break;
                //             }
                //         }
                //         apply();
                //     }, function () {
                //         toastModel.showToast("error", "Error. The problem on the server (update video).");
                //     }
                // );
            };

            // function for delete video
            var deleteVideo = function(id){
                //TODO soft delete doc
                // ajax.delete(dataFactory.deleteCompanyVideo(id),{},
                //     function(response){
                //         apply();
                //     },function(){
                //         toastModel.showToast("error", "Error. The problem on the server (delete video).");
                //     }
                // );
            };

            // function for delete array of images
            var removeImages = function(){
                //TODO soft delete all images
                // if($scope.changes.removedImages.length > 0){
                //     ajax.on(dataFactory.removeCompanyImages(),{
                //             ids : $scope.changes.removedImages
                //         },
                //         function (data) {
                //             for ( var index = 0; index < $scope.company.images.length; index++) {
                //                 if($scope.changes.removedImages.indexOf($scope.company.images[index].id) != -1){
                //                     $scope.company.images.splice(index,1);
                //                 }
                //             }
                //             $scope.changes.removedImages = [];
                //             apply();
                //         }, function () {
                //             toastModel.showToast("error", "Error. The problem on the server (remove images).");
                //         }, "POST"
                //     );
                // }
            };


            $scope.currentSection = {
                index : 0,
                name : 'overview'
            };

            $scope.sections = {
                overview : {
                    title : "Overview"
                },
                skills : {
                    title : "Skills"
                },
                projects : {
                    title : "Projects"
                },
                contact : {
                    title : "Contact"
                },
                membership : {
                    title : "Membership"
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
                if($scope.company.id) {
                    $location.path('edit/' + $scope.company.id + '/' +key);
                    getCurrentSection();
                } else {
                    $location.path('create/' + key);
                    getCurrentSection();
                }
            };

            $scope.cancelChanges = function(){
                $location.path('/'+$scope.company.id).search();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
