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
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, companyProfileModel, fileUpload ) {
                $element.addClass("tab-overview");

                // get company images
                var callbackImages = function(data){
                    $scope.source.images = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
                companyProfileModel.getImages($scope.source.id, callbackImages);

                // get company videos
                var callbackVideos = function(data){
                    $scope.source.videos = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
                companyProfileModel.getVideos($scope.source.id, callbackVideos);


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
                    ajax.get(dataFactory.getLastCompanyVideoId(),{
                            "_order" : "DESC",
                            "_limit" : 1,
                            "_sort" : "id"
                        },
                        function(response){
                            var data = response.data ? response.data : response;
                            var lastId = (data.length == 0 ? 1 : data[0].id+1);
                            newVideo.id = lastId;
                            newVideo.companyId = $scope.source.id;
                            ajax.create(dataFactory.addCompanyVideo(),newVideo,
                                function(response){
                                    var data = response.data ? response.data : response;
                                    if(!$scope.source.videos) $scope.source.videos = [];
                                    $scope.source.videos.unshift(data);
                                    $scope.cancelAddVideo();
                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                                },function(){
                                    toastModel.showToast("error", "Error. The problem on the server (add video).");
                                }
                            );
                        },function(){
                            toastModel.showToast("error", "Error. The problem on the server (get last video id).");
                        }
                    );
                };

                // delete video
                $scope.deleteVideo = function(video){
                    video.hide = true;
                    $scope.changedValue('video');
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
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
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        toastModel.showToast('success', 'Image successfully added');
                    }else{
                        toastModel.showToast('error', 'Unable add image');
                    }
                };

                $scope.deleteImage = function(img){
                    if(!$scope.changes.removedImages) $scope.changes.removedImages = [];
                    $scope.changes.removedImages.push(img.id);
                    img.hide = true;
                    $scope.changedValue('image');
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        };
    }]);