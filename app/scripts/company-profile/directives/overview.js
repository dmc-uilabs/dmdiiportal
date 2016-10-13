'use strict';

// Created by Denis Sobko
// 23.01.2016

angular.module('dmc.company-profile').
    directive('tabOverview', ['$parse', '$sce', function ($parse, $sce) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-overview.html',
            scope: {
                source : '=',
                imgs: '=',
                videos: '=',
                removedImages: '=',
                removedVideos: '=',
                limit: '='
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, companyProfileModel, fileUpload, questionToastModel) {
                $element.addClass('tab-overview');

                $scope.isAddingVideo = false;

                // open form for add video
                $scope.addNewVideo = function(){
                    $scope.isAddingVideo = true;
                };

                // close form for add video
                $scope.cancelAddVideo = function(){
                    $scope.isAddingVideo = false;
                };

                $scope.trustVideoSrc = function(src) {
                    return $sce.trustAsResourceUrl(src);
                };

                // delete video
                $scope.deleteVideo = function(video, ev){
                    questionToastModel.show({
                        question : 'Do you want to delete this video?',
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

                // image drop box
                $scope.prevPicture = null;
                $scope.newAddedImage = null;

                $scope.addNewImage = function(){
                    $scope.isAddingImage = true;
                };

                $scope.cancelAddImage = function(){
                    $scope.isAddingImage = false;
                };

                $scope.deleteImage = function(img, ev){
                    questionToastModel.show({
                        question : 'Do you want to delete this image?',
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
