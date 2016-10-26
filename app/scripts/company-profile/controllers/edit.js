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

            $scope.newLogo = [];
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
                        recent: 1
                    }, function(response) {
                        if (response.data.data.length > 0) {
                            $scope.company.logoImage = response.data.data[0];
                        };
                    });

                    ajax.get(dataFactory.documentsURL().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'IMAGE',
                        recent: $scope.limit
                    }, function(response) {
                        $scope.company.images = response.data.data;
                    });

                    ajax.get(dataFactory.documentsURL().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'VIDEO',
                        recent: $scope.limit
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
                    return fileUpload.uploadFileToUrl($scope.newLogo.file, {id : companyId}, 'company-logo').then(function(response) {
                        return ajax.create(dataFactory.documentsURL().save,
                            {
                                ownerId: $scope.user.accountId,
                                documentUrl: response.file.name,
                                documentName: 'company-logo',
                                parentType: 'ORGANIZATION',
                                parentId: companyId,
                                docClass: 'LOGO'
                            }, function(response) {
                                if (response.status === 200) {
                                    toastModel.showToast('success', 'Logo uploaded successfully');
                                }
                            });
                    });
                }
            };

            var deleteLogo = function(){
                return ajax.delete(dataFactory.documentsURL($scope.companyLogoId).delete, {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Logo successfully deleted');
                    }else{
                        toastModel.showToast('error', 'Unable to delete logo');
                    }
                });
            };

            var deleteImage = function(imageId){
                return ajax.delete(dataFactory.documentsURL(imageId).delete, {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Image successfully deleted');
                    } else {
                        toastModel.showToast('error', 'Unable to delete image');
                    }
                });
            };

            var deleteVideo = function(videoId){
                return ajax.delete(dataFactory.documentsURL(videoId).delete, {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Video successfully deleted');
                    }else{
                        toastModel.showToast('error', 'Unable to delete video');
                    }
                });
            };

            var uploadImage = function(image, companyId){
                fileUpload.uploadFileToUrl(image.file, {id : companyId}, 'company-image').then(function(response) {
                    ajax.create(dataFactory.documentsURL().save,
                        {
                            ownerId: $scope.user.accountId,
                            documentUrl: response.file.name,
                            documentName: image.title,
                            parentType: 'ORGANIZATION',
                            parentId: companyId,
                            docClass: 'IMAGE'
                        }, function(response) {
                            if (response.status === 200) {
                                toastModel.showToast('success', 'Image uploaded successfully');
                            }
                        });
                });
            };

            var uploadVideo = function(video, companyId){
                return fileUpload.uploadFileToUrl(video.file, {id : companyId}, 'company-video').then(function(response) {
                    return ajax.create(dataFactory.documentsURL().save,
                        {
                            ownerId: $scope.user.accountId,
                            documentUrl: response.file.name,
                            documentName: video.title,
                            parentType: 'ORGANIZATION',
                            parentId: companyId,
                            docClass: 'VIDEO'
                        }, function(response) {
                            if (response.status === 200) {
                                toastModel.showToast('success', 'Video uploaded successfully');
                            }
                        });
                    });

            };
            // --------------------------------------------------------------------

            var saveCallback = function(response) {
                if(response.status === 200) {
                    toastModel.showToast('success', 'Organization successfully ' + $scope.action);
                    var companyId = response.data.id;
                    var promises = [];

                    if ($scope.newLogo && $scope.newLogo.length > 0) {
                        promises.push(uploadLogo(companyId));
                        $scope.logoIsDeleted = true;
                    }
                    if ($scope.logoIsDeleted) {
                        promises.push(deleteLogo());
                    }
                    angular.forEach($scope.images, function(image) {
                        promises.push(uploadImage(image, companyId));
                    });

                    angular.forEach($scope.removedImages, function(imageId) {
                        promises.push(deleteImage(imageId));
                    });

                    angular.forEach($scope.videos, function(video) {
                        promises.push(uploadVideo(video, companyId));
                    });

                    angular.forEach($scope.removedVideos, function(videoId) {
                        promises.push(deleteVideo(videoId));
                    });

                    $q.all(promises).then(function() {
                        $window.location.href = '/company-profile.php#/profile/' + response.data.id;
                    });

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
