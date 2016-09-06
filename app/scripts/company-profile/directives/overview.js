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
                imgs: "=",
                videos: "=",
                removedImages: "=",
                removedVideos: "=",
                limit: "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, companyProfileModel, fileUpload, questionToastModel) {
                $element.addClass("tab-overview");

                $scope.isAddingVideo = false;

                // open form for add video
                $scope.addNewVideo = function(){
                    $scope.isAddingVideo = true;
                };

                // close form for add video
                $scope.cancelAddVideo = function(){
                    $scope.isAddingVideo = false;
                };

                $scope.videoStrings = [];
                // save new video
                $scope.saveVideo = function(newVideo){
                    newVideo.companyId = $scope.source.id;
                    if(!$scope.videos) {
                        $scope.videos = [];
                    }
                    $scope.videos.unshift({file: $scope.newAddedVideo.file, title: newVideo.title});
                    $scope.videos.splice($scope.limit);

                    $scope.cancelAddVideo();
                    apply();
                };


                // delete video
                $scope.deleteVideo = function(video, ev){
                    questionToastModel.show({
                        question : "Do you want to delete this video?",
                        buttons: {
                            ok: function(){
                                if(!$scope.removedVideos) {
                                    $scope.removedVideos = [];
                                }
                                $scope.removedVideos.push(video.id);
                                video.hide = true;
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };

                $scope.deleteVideoToAdd = function(index, ev) {
                    questionToastModel.show({
                        question : "Do you want to cancel adding this video?",
                        buttons: {
                            ok: function(){
                                $scope.videos.splice(index);
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                }

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

                $scope.addedNewVideo = function(file,event,flow){
                    console.log(file, event, flow)
                    $scope.newAddedVideo = file;
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
                    if(newImage && $scope.newAddedImage.file) {
                        $scope.imgs.unshift({ file: $scope.newAddedImage.file, title: newImage.title});
                        $scope.imgs.splice($scope.limit);

                        $scope.cancelAddImage();

                        $scope.imageStrings = [];
                        angular.forEach($scope.imgs, function(fileObject, i){
                            var fileReader = new FileReader();
                            fileReader.onload = function (event) {
                                var uri = event.target.result;
                                $scope.imageStrings[i] = uri;
                                $scope.imageStrings.splice($scope.limit);
                            };
                            fileReader.readAsDataURL(fileObject.file);
                        });
                        // fileUpload.uploadFileToUrl($scope.newAddedImage.file,{id : $scope.source.id, title : newImage.title},'company-profile',callbackUploadPicture);
                        $scope.cancelAddImage();
                    }
                };

                $scope.deleteImage = function(img, ev){
                    questionToastModel.show({
                        question : "Do you want to delete this image?",
                        buttons: {
                            ok: function(){
                                if(!$scope.removedImages) {
                                    $scope.removedImages = [];
                                }
                                $scope.removedImages.push(img.id);
                                img.hide = true;
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };

                $scope.deleteImageToAdd = function(index, ev){
                    questionToastModel.show({
                        question : "Do you want to cancel adding this image?",
                        buttons: {
                            ok: function(){
                                $scope.imageStrings.splice(index, 1);
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
