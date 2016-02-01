angular.module('dmc.profile')
    .controller('profileEditController', function ($rootScope, profileModel, profileData, $state, $stateParams, $scope, ajax, dataFactory, $mdDialog, fileUpload, $location, $anchorScroll, $mdToast, toastModel, $timeout, $q, location) {

        $scope.profile = profileData;  //profile
        $scope.isChangingPicture = false;  //change profile photo
        $scope.prevPicture = null;  //
        $scope.file = '';  //file picture
        $scope.save = false;

        console.info($rootScope);
        console.info($state);


        $scope.$on('$stateChangeStart', function (event, next) {
            if(!$scope.save){
                var answer = confirm("Are you sure you want to leave this page without saving?");
                if (!answer) {
                    event.preventDefault();
                }
            }
        });

        $(window).bind('beforeunload', function () {
            if($state.current.name == "edit")
                return "Are you sure you want to leave this page without saving?";
        });

        //Edit profile
        $scope.editPage = function () {
            $scope.editFlag = true;
            // auto focus for edit Display Name
            $timeout(function () {
                $("#editDisplayNameProfile").focus();
            });
        }

        //add skill to profile
        $scope.addSkill = function (inputSkill) {
            if (!inputSkill)return;
            $scope.profile.skills.push(inputSkill);
            this.inputSkill = null;
        }

        //remove skill
        $scope.deleteSkill = function (index) {
            $scope.profile.skills.splice(index, 1);
        }

        //save edit profile
        $scope.saveEdit = function () {
            profileModel.edit_profile($scope.profile.id,
                {
                    displayName: $scope.profile.displayName,
                    jobTitle: $scope.profile.jobTitle,
                    location: $scope.profile.location,
                    skills: $scope.profile.skills,
                    description: $scope.profile.description
                },
                function(data){
                    console.info(data);
                }
            );
            if ($scope.file != '') {
                fileUpload.uploadFileToUrl($scope.file.files[0].file, {id: $scope.profile.id}, 'profile', callbackUploadPicture);
            }
            $scope.save = true;
            $scope.isChangingPicture = false;
            $state.go("profile",{profileId: $scope.profile.id})
        }

//upload profile photo
        //button "Change photo"
        $scope.changePicture = function () {
            $scope.isChangingPicture = true;
        };

        $scope.removePicture = function (flow) {
            flow.files = [];
        };

        //cancel Change photo
        $scope.cancelChangePicture = function (flow) {
            flow.files = [];
            $scope.isChangingPicture = false;
        };

        //success upload photo
        var callbackUploadPicture = function (data) {
            $scope.profile.image = data.file.name;
        };

        //Drag & Drop enter
        $scope.pictureDragEnter = function (flow) {
            $scope.prevPicture = flow.files[0];
            flow.files = [];
        };

        //Drag & Drop leave
        $scope.pictureDragLeave = function (flow) {
            if (flow.files.length == 0 && $scope.prevPicture != null) {
                flow.files = [$scope.prevPicture];
                $scope.prevPicture = null;
            }
        };

        //file added
        $scope.addedNewFile = function (file, event, flow) {
            flow.files.shift();
            $scope.file = flow;
        };

    });


