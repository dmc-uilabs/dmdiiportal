angular.module('dmc.profile')
    .controller('profileEditController', function ($rootScope, profileModel, profileData, $state, $stateParams, $scope, ajax, dataFactory, $mdDialog, fileUpload, $location, $anchorScroll, $mdToast, toastModel, $timeout, $q, location, questionToastModel) {

        $scope.profile = profileData;  //profile
        $scope.isChangingPicture = false;  //change profile photo
        $scope.file = [];  //file picture
        $scope.save = false;
        $scope.isChange = false;
        $scope.changes = {};
        $scope.changesSkills = $scope.profile.skills.length;
        $scope.companies = [];

        if ($scope.profile && $scope.profile.roles && $scope.profile.roles[$scope.profile.companyId]) {
            $scope.role = response.data.roles[$scope.profile.companyId];
            $scope.isVerified = true;
        } else {
            $scope.role = null;
            $scope.isVerified = false;
        }

        if(!$scope.isVerified){
            loadCompanies();
        }

        var profileImageDoc = {};
        var removeImageFlag = false;

        ajax.get(dataFactory.documentsUrl().getList, { page: 0, pageSize: 1, parentType: 'USER', parentId: $scope.profile.id, docClass: 'IMAGE'}, function(response) {
            if (response.data && response.data.data && response.data.data.length > 0) {
                profileImageDoc = response.data.data[0];
            }
        });

        function loadCompanies(){
            ajax.get(dataFactory.companyURL().all,{
                _order: 'ASC',
                _sort: 'name'
            },function(response){
                $scope.companies = response.data;
                apply();
            });
        }

        $scope.$on('$stateChangeStart', function (event, next) {
            if(!$scope.save && $scope.isChange){
                var answer = confirm('Are you sure you want to leave this page without saving?');
                if (!answer) {
                    event.preventDefault();
                }
            }
        });

        $(window).bind('beforeunload', function () {
            if($state.current.name == 'edit' && $scope.isChange)
                return 'Are you sure you want to leave this page without saving?';
        });

        $scope.resendNotification = function() {
            ajax.create(dataFactory.requestVerification(), {})
        }

        function apply(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        $scope.change = function(){
            $scope.isChange = false;
            for(var key in $scope.changes){
                if($scope.changes[key] != $scope.profile[key]){
                    $scope.isChange = true;
                    return;
                }
            }
            if($scope.file){
                $scope.isChange = true;
                return;
            };
            if($scope.profile.skills.length != $scope.changesSkills){
                $scope.isChange = true;
                return;
            }
        };

        //Edit profile
        $scope.editPage = function () {
            $scope.editFlag = true;
            // auto focus for edit Display Name
            $timeout(function () {
                $('#editDisplayNameProfile').focus();
            });
        };

        //add skill to profile
        $scope.addSkill = function (inputSkill) {
            if (!inputSkill)return;

            if (!angular.isObject(inputSkill)) {
                inputSkill = {
                    skillName: inputSkill,
                    experienceLevel: 1
                }
            }
            $scope.isChange = true;
            $scope.profile.skills.push(inputSkill);
            this.inputSkill = null;
        };

        //remove skill
        $scope.deleteSkill = function (index,ev) {
            questionToastModel.show({
                question : 'Do you want to delete the skill?',
                buttons: {
                    ok: function(){
                        $scope.isChange = true;
                        $scope.profile.skills.splice(index, 1);
                    },
                    cancel: function(){}
                }
            },ev);
        };
        var saveImage = function(image) {
            return fileUpload.uploadFileToUrl(image, {id: $scope.profile.id}, 'profile').then(function(response) {
                var doc = {
                    documentUrl: response.file.name,
                    documentName: response.key,
                    ownerId: $scope.$root.userData.accountId,
                    parentType: 'USER',
                    docClass: 'IMAGE',
                    parentId: $scope.profile.id,
                    tags: [{tag_name: $scope.profile.displayName + ' profile-picture'}],
                    accessLevel: 'PUBLIC'
                }

                return ajax.create(dataFactory.documentsUrl().save, doc);
            });
        }

        var removeImage = function() {
            return ajax.delete(dataFactory.documentsUrl(profileImageDoc.id).delete, {});
        }
        //save edit profile
        $scope.saveEdit = function () {
            var promises = [];
            if ($scope.file && $scope.file.length > 0) {
                promises.push(saveImage($scope.file[0].file));
                removeImageFlag = true;
            }

            if (removeImageFlag === true) {
                promises.push(removeImage());
            }

            $q.all(promises).then(function(response) {
                profileModel.edit_profile($scope.profile.id,
                    {
                        displayName: $scope.profile.displayName,
                        title: $scope.profile.title,
                        address: $scope.profile.address,
                        skills: $scope.profile.skills,
                        aboutMe: $scope.profile.aboutMe
                    },
                    function(data){
                        $scope.save = true;
                        $scope.isChangingPicture = false;
                        $state.go('profile',{profileId: $scope.profile.id})
                    }
                );
            })
        };

        $scope.cancelEdit = function(){
            $scope.save = true;
            $scope.isChangingPicture = false;
            $state.go('profile',{profileId: $scope.profile.id})
        };

        $scope.removeMainPicture = function(ev){
            questionToastModel.show({
                question : 'Do you want to delete the picture?',
                buttons: {
                    ok: function(){
                        $scope.isChange = true;
                        removeImageFlag = true;
                        $scope.profile.image = '';
                        apply();
                    },
                    cancel: function(){}
                }
            },ev);
        };

//upload profile photo
        //button 'Change photo'
        $scope.changePicture = function () {
            $scope.isChangingPicture = true;
        };


        $scope.getLocation = function () {
            location.get(callback);
        };

        var callback = function (success, data) {
            if (success) {
                $scope.isChange = true;
                $scope.profile.address = data.city + ', ' + data.region;
            }
        };

    });
