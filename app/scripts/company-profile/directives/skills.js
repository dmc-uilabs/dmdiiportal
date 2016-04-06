'use strict';
angular.module('dmc.company-profile').
    directive('tabSkills', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-skills.html',
            scope: {
                source : "=",
                changedValue : "=",
                changes : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, toastModel, companyProfileModel,fileUpload,questionToastModel) {
                $element.addClass("tab-skills");

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

                // get company images
                var callbackImages = function(data){
                    $scope.source.skillsImages = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
                companyProfileModel.getSkillsImages($scope.source.id, callbackImages);

                // get company skills
                var callbackSkills = function(data){
                    $scope.source.skills = data;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
                companyProfileModel.getSkills($scope.source.id, callbackSkills);

                // add new skill
                $scope.sendSkill = function(){
                    var requestData = {
                        companyId : $scope.source.id,
                        name : $scope.newSkill
                    };
                    if(!$scope.source.skills) $scope.source.skills = [];
                    $scope.source.skills.unshift(requestData);
                    $scope.newSkill = null;
                    $scope.changedValue('skill');
                    apply();
                };

                // delete skill
                $scope.deleteSkill = function(skill,ev){
                    questionToastModel.show({
                        question : "Do you want to delete skill?",
                        buttons: {
                            ok: function(){
                                if(!skill.id){
                                    skill.id = -1;
                                    for(var i in $scope.source.skills){
                                        if($scope.source.skills[i].id == -1){
                                            $scope.source.skills.splice(i,1);
                                            break;
                                        }
                                    }
                                }else{
                                    skill.removed = true;
                                }
                                $scope.changedValue('skill');
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
                        fileUpload.uploadFileToUrl($scope.newAddedImage.file,{id : $scope.source.id, title : newImage.title},'company-profile-skill',callbackUploadPicture);
                        $scope.cancelAddImage();
                    }
                };

                var callbackUploadPicture = function(data){
                    if(!data.error) {
                        $scope.source.skillsImages.unshift(data.result);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
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
                                if(!$scope.changes.removedSkillsImages) $scope.changes.removedSkillsImages = [];
                                $scope.changes.removedSkillsImages.push(img.id);
                                img.hide = true;
                                $scope.changedValue('image');
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };
            }
        };
    }]);