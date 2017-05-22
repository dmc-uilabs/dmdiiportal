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
            $scope.limit = 5;
            var getCompany = function() {
                ajax.get(dataFactory.getOrganization($stateParams.companyId), {}, function(response) {
                    $scope.company = response.data;

                    $scope.company.description = $showdown.makeHtml($scope.company.description);
                    ajax.get(dataFactory.documentsUrl().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'LOGO',
                        page: 0,
                        pageSize: 1
                    }, function(response) {
                        if (response.data.count > 0) {
                            $scope.company.logoImage = response.data.data[0];
                        };
                    });

                    ajax.get(dataFactory.documentsUrl().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'IMAGE',
                        page: 0,
                        pageSize: $scope.limit,
                    }, function(response) {
                        $scope.company.images = response.data.data;
                    });

                    ajax.get(dataFactory.documentsUrl().getList, {
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'VIDEO',
                        page: 0,
                        pageSize: $scope.limit
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
                if($scope.newLogo.length){
                    fileUpload.uploadFileToUrl($scope.newLogo[0].file, {id : companyId}, 'company-logo', function(response) {
                        ajax.create(dataFactory.documentsUrl().save,
                            {
                                ownerId: $scope.user.accountId,
                                documentUrl: response.file.name,
                                documentName: 'company-logo',
                                parentType: 'ORGANIZATION',
                                parentId: companyId,
                                docClass: 'LOGO',
                                tags: [{tagName: $scope.company.name + ' logo'}],
                                accessLevel: 'PUBLIC'
                            }, function(response) {
                                if (response.status === 200) {
                                    toastModel.showToast('success', 'Logo uploaded successfully');
                                }
                            });
                    });
                }
            };

            var deleteLogo = function(){
                ajax.delete(dataFactory.documentsUrl($scope.companyLogoId).delete, {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Logo successfully deleted');
                    }else{
                        toastModel.showToast('error', 'Unable to delete logo');
                    }
                });
            };

            var deleteImage = function(imageId){
                return ajax.delete(dataFactory.documentsUrl(imageId).delete, {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Image successfully deleted');
                    } else {
                        toastModel.showToast('error', 'Unable to delete image');
                    }
                });
            };

            var deleteVideo = function(videoId){
                return ajax.delete(dataFactory.documentsUrl(videoId).delete, {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Video successfully deleted');
                    }else{
                        toastModel.showToast('error', 'Unable to delete video');
                    }
                });
            };

            var uploadImage = function(image, companyId){
                if (image.tags) {
                    image.tags.push({tagName: $scope.company.name + ' picture'});
                    angular.forEach(image.tags, function(tag, index) {
                        if (!angular.isObject(tag)) {
                            image.tags[index] = {tagName: tag}
                        }
                    });
                } else {
                    image.tags = [{tagName: $scope.company.name + ' picture'}];
                }
                return fileUpload.uploadFileToUrl(image.file, {id : $scope.company.id}, 'company-image').then(function(response) {
                    var doc = {
                        organizationId: companyId,
                        ownerId: $scope.user.accountId,
                        documentUrl: response.file.name,
                        documentName: image.title + image.type,
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'IMAGE',
                        tags: image.tags,
                        vips: image.vips,
                        accessLevel: image.accessLevel
                    }
                    return ajax.create(dataFactory.documentsUrl().save, doc, function(response) {
                            if (response.status === 200) {
                                toastModel.showToast('success', 'Image uploaded successfully');
                            }
                        });
                    });
            };

            var uploadVideo = function(video, companyId){
                if (video.tags) {
                    video.tags.push({tagName: $scope.company.name + ' video'});
                    angular.forEach(video.tags, function(tag, index) {
                        if (!angular.isObject(tag)) {
                            video.tags[index] = {tagName: tag}
                        }
                    });
                } else {
                    video.tags = [{tagName: $scope.company.name + ' video'}];
                }
                return fileUpload.uploadFileToUrl(video.file, {id : $scope.company.id}, 'company-video').then(function(response) {
                    var doc = {
                        ownerId: $scope.user.accountId,
                        documentUrl: response.file.name,
                        documentName: video.title + video.type,
                        parentType: 'ORGANIZATION',
                        parentId: $scope.company.id,
                        docClass: 'VIDEO',
                        tags: video.tags,
                        vips: video.vips,
                        accessLevel: video.accessLevel
                    };
                    return ajax.create(dataFactory.documentsUrl().save, doc, function(response) {
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
    
                if ($scope.company.productionCapabilities && $scope.company.productionCapabilities != '') {
                    if (!isJSON($scope.company.productionCapabilities)) {
                        toastModel.showToast('error', 'TDP is not a valid JSON string.');
                        return;
                    }
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
            
            var isJSON = function(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
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
                },
                tdp : {
                    title : 'TDP'
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
                if($stateParams.companyId) {
                    $location.path('edit/' + $stateParams.companyId + '/' +key);
                    getCurrentSection();
                } else {
                    $location.path('create/' + key);
                    getCurrentSection();
                }
            };

            $scope.cancelChanges = function(){
                $location.path('profile/' + $scope.company.id);
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
