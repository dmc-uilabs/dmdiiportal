'use strict';

angular.module('dmc.company-profile')
    .controller('EditCompanyProfileController', [
        '$stateParams',
        '$scope',
        '$q',
        '$timeout',
        '$window',
        '$showdown',
        'ajax',
        'dataFactory',
        '$location',
        'toastModel',
        'questionToastModel',
        'DMCUserModel',
        'fileUpload',
        function ($stateParams,
                  $scope,
                  $q,
                  $timeout,
                  $window,
                  $showdown,
                  ajax,
                  dataFactory,
                  $location,
                  toastModel,
                  questionToastModel,
                  DMCUserModel,
                  fileUpload) {

            //limit of images and videos a company can have
            $scope.limit = 3;
            var getCompany = function() {
                ajax.get(dataFactory.getOrganization($stateParams.companyId), {}, function(response) {
                    $scope.company = response.data;

                    $scope.company.description = $showdown.makeHtml($scope.company.description);
                    ajax.get(dataFactory.documentsURL().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'LOGO',
                        page: 0, pageSize: 1
                    }, function(response) {
                        if (response.data.data.length > 0) {
                            $scope.company.logoImage = response.data.data[0];
                        };
                    });

                    ajax.get(dataFactory.documentsURL().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'IMAGE',
                        page: 0, pageSize: $scope.limit
                    }, function(response) {
                        $scope.company.images = response.data.data;
                    });

                    ajax.get(dataFactory.documentsURL().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'VIDEO',
                        page: 0, pageSize: $scope.limit
                    }, function(response) {
                        $scope.company.videos = response.data.data;
                    });
                });
            };

            $scope.company = {
                description: '',
                contacts: [],
                awards: [],
                areasOfExpertise: [],
                desiredAreasOfExpertise: [],
                address: {}
            };

            if (angular.isDefined($stateParams.companyId)) {
                getCompany();
                $scope.title = 'Update an Organization';
                $scope.action = 'updated';
            } else {
                $scope.title = 'Create an Organization';
                $scope.action = 'created';
            }

            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.descriptionLimit = 5000;
            $scope.isValid = false;
            $scope.isSaved = false;
            $scope.fieldName = 'Description'

            $scope.$on('isValid', function (event, data) {
                $scope.isValid = data;
            });

            $scope.images = [];
            $scope.videos = [];
            $scope.removedVideos = [];
            $scope.removedImages = [];

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

            $scope.newLogo = undefined;
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
            };

            $scope.saveLogo = function() {
                $scope.cancelChangingLogo();
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    $scope.newLogoUri = event.target.result;
                };
                fileReader.readAsDataURL($scope.newLogo.file);
            };

            $scope.removeLogo = function() {
                $scope.logoIsDeleted = true;
                $scope.companyLogoId = $scope.company.logoImage.id;
                delete $scope.company.logoImage;
            };

            $scope.removeAddedLogo = function() {
                $scope.newLogo = undefined;
                $scope.newLogoUri = undefined;
            };

            var uploadLogo = function(companyId){
                if($scope.newLogo){
                    fileUpload.uploadFileToUrl($scope.newLogo.file, {id : companyId}, 'company-logo', function(response) {
                        ajax.create(dataFactory.documentsURL().save,
                            {
                                organizationId: companyId,
                                ownerId: $scope.user.accountId,
                                documentUrl: response.file.name,
                                documentName: 'company-logo',
                                parentType: 'ORGANIZATION',
                                parentId: companyId,
                                docClass: 'LOGO'
                            }, function(response) {
                                console.log(response)
                                if (response.status === 200) {
                                    toastModel.showToast('success', 'Logo uploaded successfully');
                                }
                            });
                    });
                }
            };

            var deleteLogo = function(){
                ajax.delete(dataFactory.documentsURL($scope.companyLogoId).delete, {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Logo successfully deleted');
                    }else{
                        toastModel.showToast('error', 'Unable to delete logo');
                    }
                });
            };

            var deleteImages = function(){
                angular.forEach($scope.removedImages, function(imageId) {
                    ajax.delete(dataFactory.documentsURL(imageId), {}, function(response) {
                        if(response.status === 200) {
                            toastModel.showToast('success', 'Image successfully deleted');
                        } else {
                            toastModel.showToast('error', 'Unable to delete image');
                        }
                    });
                });
            };

            var deleteVideos = function(){
                angular.forEach($scope.removedVideos, function(videoId) {
                    ajax.delete(dataFactory.documentUrl(videoId), {}, function(response) {
                        if(response.status === 200) {
                            toastModel.showToast('success', 'Video successfully deleted');
                        }else{
                            toastModel.showToast('error', 'Unable to delete video');
                        }
                    });
                });
            };

            var uploadImages = function(companyId){
                angular.forEach($scope.images, function(image) {
                    fileUpload.uploadFileToUrl(image.file, {id : $scope.company.id}, 'company-image', function(response) {
                        ajax.create(dataFactory.documentsURL().save,
                            {
                                organizationId: companyId,
                                ownerId: $scope.user.accountId,
                                documentUrl: response.file.name,
                                documentName: image.title,
                                parentType: 'ORGANIZATION',
                                parentId: $scope.company.id,
                                docClass: 'IMAGE'
                            }, function(response) {
                                console.log(response)
                                if (response.status === 200) {
                                    toastModel.showToast('success', 'Image uploaded successfully');
                                }
                            });
                    });
                });
            };

            var uploadVideos = function(companyId){
                angular.forEach($scope.videos, function(video) {
                    fileUpload.uploadFileToUrl(video.file, {id : $scope.company.id}, 'company-video', function(response) {
                        ajax.create(dataFactory.documentsURL().save,
                            {
                                organizationId: companyId,
                                ownerId: $scope.user.accountId,
                                documentUrl: response.file.name,
                                documentName: video.title,
                                parentType: 'ORGANIZATION',
                                parentId: $scope.company.id,
                                docClass: 'VIDEO'
                            }, function(response) {
                                if (response.status === 200) {
                                    toastModel.showToast('success', 'Video uploaded successfully');
                                }
                            });
                        });
                });

            };
            var callbackUploadPicture = function(data){
                if(!data.error) {
                    toastModel.showToast('success', 'Image successfully added');
                }else{
                    toastModel.showToast('error', 'Unable to add image');
                }
            };
            // --------------------------------------------------------------------

            var saveCallback = function(response) {
                if(response.status === 200) {
                    toastModel.showToast('success', 'Organization successfully ' + $scope.action);
                    var companyId = response.data.id;

                    if ($scope.newLogo) {
                        uploadLogo(companyId);
                    }
                    if ($scope.logoIsDeleted) {
                        deleteLogo();
                    }
                    if ($scope.images.length > 0) {
                        uploadImages(companyId);
                    }
                    if ($scope.removedImages.length > 0) {
                        deleteImages();
                    }
                    if ($scope.videos.length > 0) {
                        uploadVideos(companyId);
                    }
                    if ($scope.removedVideos.length > 0) {
                        deleteVideos();
                    }

                    $timeout(function() {
                        $window.location.href = '/company-profile.php#/profile/' + response.data.id;
                    }, 500);
                }else{
                    toastModel.showToast('error', 'Organization could not be ' + $scope.action);
                }
            };

            var convertToMarkdown = function(input) {
                var escaped = toMarkdown(input);
                return escaped;
            };

            $scope.saveChanges = function(){
                $scope.isSaved = true;

                if (!$scope.isValid) {
                    return;
                }
                delete $scope.company.images;
                delete $scope.company.videos;
                delete $scope.company.logoImage;

                $scope.company.description = convertToMarkdown($scope.company.description);

                if ($scope.company.id) {
                    ajax.put(dataFactory.updateOrganization($scope.company.id), $scope.company, saveCallback);
                } else {
                    ajax.create(dataFactory.createOrganization(), $scope.company, saveCallback);
                }
            };

            // function for create contact
            var createContact = function(contact,updatedData){
                var contact_ = $.extend(true,{},contact);
            };

            $scope.currentSection = {
                index : 0,
                name : 'overview'
            };

            $scope.sections = {
                overview : {
                    title : 'Overview'
                },
                skills : {
                    title : 'Skills'
                },
                projects : {
                    title : 'Projects'
                },
                contact : {
                    title : 'Contact'
                },
                membership : {
                    title : 'Membership'
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
