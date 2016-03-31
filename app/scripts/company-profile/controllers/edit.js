'use strict';

angular.module('dmc.company-profile')
    .controller('EditCompanyProfileController', [
        "$stateParams",
        "$scope",
        "ajax",
        "dataFactory",
        "companyData",
        "$location",
        "toastModel",
        "questionToastModel",
        "fileUpload",
        function ($stateParams,
                  $scope,
                  ajax,
                  dataFactory,
                  companyData,
                  $location,
                  toastModel,
                  questionToastModel,
                  fileUpload) {

            $scope.company = companyData;

            $scope.changes = {};

            $scope.isDataChanged = false;


            // logo drop box --------------------------------------------

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

            $scope.uploadLogo = function(){
                if($scope.newLogo){
                    fileUpload.uploadFileToUrl($scope.newLogo.file,{id : $scope.company.id},'company-logo',callbackUploadPicture);
                    $scope.cancelChangingLogo();
                }
            };

            $scope.deleteLogo = function(ev){
                questionToastModel.show({
                    question : "Do you want to delete the logo?",
                    buttons: {
                        ok: function(){
                            ajax.update(dataFactory.updateCompanyProfile($scope.company.id),{
                                logoImage: null
                            },function(response){
                                $scope.company.logoImage = null;
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                            });
                        },
                        cancel: function(){}
                    }
                },ev);
            };

            var callbackUploadPicture = function(data){
                if(!data.error) {
                    $scope.company.logoImage = data.file.name;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    toastModel.showToast('success', 'Image successfully added');
                }else{
                    toastModel.showToast('error', 'Unable add image');
                }
            };
            // --------------------------------------------------------------------

            var updateDataChangedStatus = function(){
                var isChange = false;
                for(var key in $scope.changes){
                    if(key != 'removedImages' && key != 'removedSkillsImages') {
                        if ($scope.changes[key] != $scope.company[key]) {
                            isChange = true;
                            break;
                        }
                    }else{
                        if($.type($scope.changes.removedImages) == 'array' && $scope.changes.removedImages.length > 0){
                            isChange = true;
                            break;
                        }
                        if($.type($scope.changes.removedSkillsImages) == 'array' && $scope.changes.removedSkillsImages.length > 0){
                            isChange = true;
                            break;
                        }
                    }
                }

                // if changed images
                if($scope.company.images && $.type($scope.company.images) == 'array') {
                    for (var index in $scope.company.images) {
                        if($scope.company.images[index].title != $scope.company.images[index].changedTitle){
                            isChange = true;
                            break;
                        }
                    }
                }
                // if changed skills images
                if($scope.company.skillsImages && $.type($scope.company.skillsImages) == 'array') {
                    for (var index in $scope.company.skillsImages) {
                        if($scope.company.skillsImages[index].title != $scope.company.skillsImages[index].changedTitle){
                            isChange = true;
                            break;
                        }
                    }
                }
                // if changed videos
                if($scope.company.videos && $.type($scope.company.videos) == 'array') {
                    for (var index in $scope.company.videos) {
                        if($scope.company.videos[index].hide || $scope.company.videos[index].title != $scope.company.videos[index].changedTitle || $scope.company.videos[index].link != $scope.company.videos[index].changedLink){
                            isChange = true;
                            break;
                        }
                    }
                }
                // if changed contacts
                if($scope.company.contacts && $.type($scope.company.contacts) == 'array') {
                    for (var index in $scope.company.contacts) {
                        if($scope.company.contacts[index].hide ||
                            $scope.company.contacts[index].type != $scope.company.contacts[index].changedType ||
                            $scope.company.contacts[index].name != $scope.company.contacts[index].changedName ||
                            $scope.company.contacts[index].title != $scope.company.contacts[index].changedTitle ||
                            $scope.company.contacts[index].phoneNumber != $scope.company.contacts[index].changedPhoneNumber ||
                            $scope.company.contacts[index].email != $scope.company.contacts[index].changedEmail){
                            isChange = true;
                            break;
                        }
                    }
                }
                $scope.isDataChanged = isChange;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

            $scope.changedValue = function(name){
                updateDataChangedStatus();
            };

            $scope.saveChanges = function(){
                if($scope.isDataChanged){
                    var changedData = {};
                    for(var key in $scope.changes){
                        if(key != 'removedImages' && key != 'removedSkillsImages') {
                            if ($scope.changes[key] != $scope.company[key]) {
                                changedData[key] = $scope.changes[key];
                            }
                        }else{
                            if(key == 'removedImages') {
                                if ($scope.changes.removedImages && $.type($scope.changes.removedImages) == 'array') {
                                    removeImages();
                                }
                            }else if(key == 'removedSkillsImages'){
                                if ($scope.changes.removedSkillsImages && $.type($scope.changes.removedSkillsImages) == 'array') {
                                    removeSkillsImages();
                                }
                            }
                        }
                    }
                    if(Object.keys(changedData).length > 0) {
                        ajax.update(dataFactory.updateCompanyProfile($scope.company.id),changedData,
                            function (data) {
                                $location.path('/'+$scope.company.id).search();
                                toastModel.showToast("success", "Data successfully updated.");
                            }, function () {
                                toastModel.showToast("error", "Error. The problem on the server (update data).");
                            }
                        );
                    }

                    // save changed images
                    if($scope.company.images && $.type($scope.company.images) == 'array' && $scope.company.images.length > 0){
                        for(var index in $scope.company.images){
                            if(!$scope.company.images[index].hide){
                                if($scope.company.images[index].title != $scope.company.images[index].changedTitle){
                                    ajax.update(dataFactory.updateCompanyImage($scope.company.images[index].id),{
                                            title : $scope.company.images[index].changedTitle
                                        },
                                        function (response) {
                                            var data = response.data ? response.data : response;
                                            for(var i in $scope.company.images){
                                                if($scope.company.images[i].id == data.id){
                                                    $scope.company.images[i].title = $scope.company.images[i].changedTitle;
                                                    break;
                                                }
                                            }
                                            updateDataChangedStatus();
                                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                                        }, function () {
                                            toastModel.showToast("error", "Error. The problem on the server (update image).");
                                        }
                                    );
                                }
                            }
                        }
                    }

                    // save changed skills images
                    if($scope.company.skillsImages && $.type($scope.company.skillsImages) == 'array' && $scope.company.skillsImages.length > 0){
                        for(var index in $scope.company.skillsImages){
                            if(!$scope.company.skillsImages[index].hide){
                                if($scope.company.skillsImages[index].title != $scope.company.skillsImages[index].changedTitle){
                                    ajax.update(dataFactory.updateCompanySkillsImage($scope.company.skillsImages[index].id),{
                                            title : $scope.company.skillsImages[index].changedTitle
                                        },
                                        function (data) {
                                            var data = response.data ? response.data : response;
                                            for(var i in $scope.company.skillsImages){
                                                if($scope.company.skillsImages[i].id == data.id){
                                                    $scope.company.skillsImages[i].title = $scope.company.skillsImages[i].changedTitle;
                                                    break;
                                                }
                                            }
                                            updateDataChangedStatus();
                                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                                        }, function () {
                                            toastModel.showToast("error", "Error. The problem on the server (update image).");
                                        }
                                    );
                                }
                            }
                        }
                    }

                    // save changed videos
                    if($scope.company.videos && $.type($scope.company.videos) == 'array' && $scope.company.videos.length > 0){
                        for(var index in $scope.company.videos){
                            if(!$scope.company.videos[index].hide) {
                                if ($scope.company.videos[index].title != $scope.company.videos[index].changedTitle || $scope.company.videos[index].link != $scope.company.videos[index].changedLink) {
                                    var updatedData = {};
                                    if ($scope.company.videos[index].title != $scope.company.videos[index].changedTitle) updatedData.title = $scope.company.videos[index].changedTitle;
                                    if ($scope.company.videos[index].link != $scope.company.videos[index].changedLink) updatedData.link = $scope.company.videos[index].changedLink;
                                    updateVideo($scope.company.videos[index],updatedData);
                                }
                            }else{
                                deleteVideo($scope.company.videos[index]);
                            }
                        }
                    }

                    // save changed contacts
                    if($scope.company.contacts && $.type($scope.company.contacts) == 'array' && $scope.company.contacts.length > 0){
                        for(var index in $scope.company.contacts){
                            var c = $scope.company.contacts[index];
                            if(!c.hide) {
                                if (c.type != c.changedType ||
                                    c.name != c.changedName ||
                                    c.title != c.changedTitle ||
                                    c.phoneNumber != c.changedPhoneNumber ||
                                    c.email != c.changedEmail) {
                                    var updatedData = {};
                                    if (c.type != c.changedType) updatedData.type = c.changedType;
                                    if (c.name != c.changedName) updatedData.name = c.changedName;
                                    if (c.title != c.changedTitle) updatedData.title = c.changedTitle;
                                    if (c.phoneNumber != c.changedPhoneNumber) updatedData.phoneNumber = c.changedPhoneNumber;
                                    if (c.email != c.changedEmail) updatedData.email = c.changedEmail;
                                    if(c.changedType != null && ((c.changedEmail != null && c.changedEmail.length > 0) || (c.changedPhoneNumber != null && c.changedPhoneNumber.length > 0))){
                                        updateContact(c,updatedData);
                                    }else{
                                        c.changedType = c.type;
                                        c.changedName = c.name;
                                        c.changedTitle = c.title;
                                        c.changedPhoneNumber = c.phoneNumber;
                                        c.changedEmail = c.email;
                                        updateDataChangedStatus();
                                    }
                                }
                            }else{
                                deleteContact(c);
                            }
                        }
                    }
                }
            };

            // function for update contact
            var updateContact = function(contact,updatedData){
                ajax.update(dataFactory.updateCompanyContact(contact.id), updatedData,
                    function (response) {
                        var data = response.data ? response.data : response;
                        for (var i in $scope.company.contacts) {
                            if ($scope.company.contacts[i].id == contact.id) {
                                $scope.company.contacts[i].type = $scope.company.contacts[i].changedType;
                                $scope.company.contacts[i].name = $scope.company.contacts[i].changedName;
                                $scope.company.contacts[i].title = $scope.company.contacts[i].changedTitle;
                                $scope.company.contacts[i].phoneNumber = $scope.company.contacts[i].changedPhoneNumber;
                                $scope.company.contacts[i].email = $scope.company.contacts[i].changedEmail;
                                break;
                            }
                        }
                        updateDataChangedStatus();
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }, function () {
                        toastModel.showToast("error", "Error. The problem on the server (update contact).");
                    }
                );
            };


            // function for delete contact
            var deleteContact = function(contact){
                ajax.delete(dataFactory.deleteCompanyContact(contact.id),{},
                    function(response){
                        var data = response.data ? response.data : response;
                        for(var index in $scope.company.contacts){
                            if($scope.company.contacts[index].id == contact.id){
                                $scope.company.contacts.splice(index,1);
                                break;
                            }
                        }
                        updateDataChangedStatus();
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        toastModel.showToast("error", "Error. The problem on the server (delete contact).");
                    }
                );
            };

            // function for update video
            var updateVideo = function(video,updatedData){
                ajax.update(dataFactory.updateCompanyVideo(video.id), updatedData,
                    function (response) {
                        var data = response.data ? response.data : response;
                        for (var i in $scope.company.videos) {
                            if ($scope.company.videos[i].id == video.id) {
                                $scope.company.videos[i].title = $scope.company.videos[i].changedTitle;
                                $scope.company.videos[i].link = $scope.company.videos[i].changedLink;
                                break;
                            }
                        }
                        updateDataChangedStatus();
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }, function () {
                        toastModel.showToast("error", "Error. The problem on the server (update video).");
                    }
                );
            };

            // function for delete video
            var deleteVideo = function(video){
                ajax.delete(dataFactory.deleteCompanyVideo(video.id),{},
                    function(response){
                        var data = response.data ? response.data : response;
                        for(var i in $scope.company.videos){
                            if($scope.company.videos[i].id == video.id){
                                $scope.company.videos.splice(i,1);
                                break;
                            }
                        }
                        updateDataChangedStatus();
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        toastModel.showToast("error", "Error. The problem on the server (delete video).");
                    }
                );
            };

            // function for delete array of images
            var removeImages = function(){
                if($scope.changes.removedImages.length > 0){
                    ajax.on(dataFactory.removeCompanyImages(),{
                            ids : $scope.changes.removedImages
                        },
                        function (data) {
                            for ( var index = 0; index < $scope.company.images.length; index++) {
                                if($scope.changes.removedImages.indexOf($scope.company.images[index].id) != -1){
                                    $scope.company.images.splice(index,1);
                                }
                            }
                            $scope.changes.removedImages = [];
                            updateDataChangedStatus();
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        }, function () {
                            toastModel.showToast("error", "Error. The problem on the server (remove images).");
                        }, "POST"
                    );
                }
            };

            // function for delete array of skills images
            var removeSkillsImages = function(){
                if($scope.changes.removedSkillsImages.length > 0){
                    ajax.on(dataFactory.removeCompanySkillsImages(),{
                            ids : $scope.changes.removedSkillsImages
                        },
                        function (data) {
                            for ( var index = 0; index < $scope.company.skillsImages.length; index++) {
                                if($scope.changes.removedSkillsImages.indexOf($scope.company.skillsImages[index].id) != -1){
                                    $scope.company.skillsImages.splice(index,1);
                                }
                            }
                            $scope.changes.removedSkillsImages = [];
                            updateDataChangedStatus();
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        }, function () {
                            toastModel.showToast("error", "Error. The problem on the server (remove images).");
                        }, "POST"
                    );
                }
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
                $location.path($scope.company.id+"/edit/"+key);
                getCurrentSection();
            };

            $scope.cancelChanges = function(){
                $location.path('/'+$scope.company.id).search();
            };

        }]);
