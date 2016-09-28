angular.module('dmc.profile')
    .controller('profileEditController', function ($rootScope, profileModel, profileData, $state, $stateParams, $scope, ajax, dataFactory, $mdDialog, fileUpload, $location, $anchorScroll, $mdToast, toastModel, $timeout, $q, location, questionToastModel) {

        $scope.profile = profileData;  //profile
        $scope.isChangingPicture = false;  //change profile photo
        $scope.prevPicture = null;  //
        $scope.file = '';  //file picture
        $scope.save = false;
        $scope.isChange = false;
        $scope.changes = {};
        $scope.changesSkills = $scope.profile.skills.length;
        $scope.companies = [];

        if(!$scope.profile.companyId){
            loadCompanies();
            getJoinRequest();
        }

        function getJoinRequest(){
            ajax.get(dataFactory.getProfileCompanyJoinRequest($scope.profile.id),{
            },function(response){
                $scope.profile.companyJoinRequest = response.data.length > 0 && response.data[0].id > 0 ? response.data[0] : null;
                if($scope.profile.companyJoinRequest) {
                    $scope.profile.companyId = $scope.profile.companyJoinRequest.companyId;
                }
                apply();
            });
        }

        function loadCompanies(){
            ajax.get(dataFactory.companyURL().all,{
                _order: 'ASC',
                _sort: 'name'
            },function(response){
                $scope.companies = response.data;
                apply();
            });
        }

        $scope.goRequestToJoin = function(companyId){
            ajax.create(dataFactory.addCompanyJoinRequest(), {
                'profileId': $scope.profile.id,
                'companyId': companyId
            },function(response){
                $scope.profile.companyJoinRequest = response.data;
                toastModel.showToast('success', 'Request to join successfully sent');
                apply();
            });
        };

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

        function apply(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        $scope.change = function(){
            console.info('c', $scope.changes)
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

        //save edit profile
        $scope.saveEdit = function () {
            if ($scope.file != '') {
                fileUpload.uploadFileToUrl($scope.file.files[0].file, {id: $scope.profile.id}, 'profile', function(response) {
                    var doc = {
                        documentUrl: response.file.name,
                        documentName: response.key,
                        ownerId: $scope.profile.id,
                        parentType: 'USER',
                        parentId: $scope.profile.id,
                        accessLevel: $scope.documents[i].accessLevel
                    }

                    ajax.create(dataFactory.documentsURL().save, doc, callback);
                });
            }
            profileModel.edit_profile($scope.profile.id,
                {
                    displayName: $scope.profile.displayName,
                    jobTitle: $scope.profile.jobTitle,
                    location: $scope.profile.location,
                    skills: $scope.profile.skills,
                    description: $scope.profile.description
                },
                function(data){
                    $scope.save = true;
                    $scope.isChangingPicture = false;
                    $state.go('profile',{profileId: $scope.profile.id})
                }
            );
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

        $scope.removePicture = function (flow) {
            flow.files = [];
        };

        //cancel Change photo
        $scope.cancelChangePicture = function (flow) {
            flow.files = [];
            $scope.isChangingPicture = false;
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
            $scope.isChange = true;
        };

        $scope.getLocation = function () {
            location.get(callback);
        };

        var callback = function (success, data) {
            if (success) {
                $scope.isChange = true;
                $scope.profile.location = data.city + ', ' + data.region;
            }
        };

    });
