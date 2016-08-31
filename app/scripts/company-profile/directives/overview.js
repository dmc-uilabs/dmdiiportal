'use strict';

// Created by Denis Sobko
// 23.01.2016

angular.module('dmc.company-profile').
    directive('tabOverview', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-overview.html',
            scope: {
                source : "=",
                changedValue : "=",
                changes : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, companyProfileModel, fileUpload, questionToastModel) {
                $element.addClass("tab-overview");

                // get company images
                var callbackImages = function(data){
                    $scope.source.images = data;
                    apply();
                };
                if ($scope.source.id) {
                    companyProfileModel.getImages($scope.source.id, callbackImages);
                }

                // get company videos
                var callbackVideos = function(data){
                    $scope.source.videos = data;
                    apply();
                };
                if ($scope.source.id) {
                    companyProfileModel.getVideos($scope.source.id, callbackVideos);
                }


                $scope.isAddingVideo = false;

                // open form for add video
                $scope.addNewVideo = function(){
                    $scope.isAddingVideo = true;
                };

                // close form for add video
                $scope.cancelAddVideo = function(){
                    $scope.isAddingVideo = false;
                };

                // save new video
                $scope.saveVideo = function(newVideo){
                    newVideo.companyId = $scope.source.id;
                    if(!$scope.source.videos) $scope.source.videos = [];
                    $scope.source.videos.unshift(newVideo);
                    $scope.changedValue('video');
                    $scope.cancelAddVideo();
                    apply();
                };

                // delete video
                $scope.deleteVideo = function(video,ev){
                    questionToastModel.show({
                        question : "Do you want to delete video?",
                        buttons: {
                            ok: function(){
                                if(!video.id) {
                                    video.id = -1;
                                    for(var i in $scope.source.videos){
                                        if($scope.source.videos[i].id == -1){
                                            $scope.source.videos.splice(i,1);
                                            break;
                                        }
                                    }
                                }else{
                                    video.hide = true;
                                }
                                $scope.changedValue('video');
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };

                // image drop box
                $scope.prevPicture = null;
                $scope.newAddedImage = null;
                $scope.pictureDragEnter = function(flow){
                    $scope.prevPicture = flow.files[0];
                    flow.files = [];
                };

                $scope.pictureDragLeave = function(flow){
                    if(flow.files.length == 0 && $scope.prevPicture != null) {
                        flow.files = [$scope.prevPicture];
                        $scope.prevPicture = null;
                    }
                };

                $scope.addedNewFile = function(file,event,flow){
                    $scope.newAddedImage = file;
                    flow.files.shift();
                };

                $scope.removePicture = function(flow){
                    flow.files = [];
                    $scope.newAddedImage = null;
                };

                $scope.addNewImage = function(){
                    $scope.isAddingImage = true;
                };

                $scope.cancelAddImage = function(){
                    $scope.isAddingImage = false;
                };

                $scope.saveImage = function(newImage){
                    if(newImage && $scope.newAddedImage){
                        fileUpload.uploadFileToUrl($scope.newAddedImage.file,{id : $scope.source.id, title : newImage.title},'company-profile',callbackUploadPicture);
                        $scope.cancelAddImage();
                    }
                };

                var callbackUploadPicture = function(data){
                    if(!data.error) {
                        $scope.source.images.unshift(data.result);
                        apply();
                        toastModel.showToast('success', 'Image successfully added');
                    }else{
                        toastModel.showToast('error', 'Unable add image');
                    }
                };

                $scope.deleteImage = function(img,ev){
                    questionToastModel.show({
                        question : "Do you want to delete image?",
                        buttons: {
                            ok: function(){
                                if(!$scope.changes.removedImages) $scope.changes.removedImages = [];
                                $scope.changes.removedImages.push(img.id);
                                img.hide = true;
                                $scope.changedValue('image');
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };

                $scope.isAddingAward = false;
                // open form for add award
                $scope.addNewAward = function(){
                    $scope.isAddingAward = true;
                };

                // close form for add award
                $scope.cancelAddAward = function(){
                    $scope.isAddingAward = false;
                };

                // save new award
                $scope.saveAward = function(newAward){
                    if(newAward.description && newAward.name) {
                        if (!$scope.source.awards) $scope.source.awards = [];
                        $scope.source.awards.push(newAward);
                        $scope.cancelAddAward();
                        apply();
                    }
                };

                // delete award
                $scope.deleteAward = function(index){
                    $scope.source.awards.splice(index, 1);
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            }
        };
    }]);
