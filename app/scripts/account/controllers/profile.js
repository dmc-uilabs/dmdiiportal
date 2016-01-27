'use strict';
angular.module('dmc.account')
    .controller('ProfileAccountCtr', [ '$stateParams', '$state', "$scope", "location","$location",'fileUpload','accountData','AccountModel','toastModel', function ($stateParams, $state, $scope, location,$location,fileUpload,accountData,AccountModel,toastModel) {
        $scope.accountData = accountData;
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

        $scope.profile = $.extend(true,{},accountData);

        if($scope.profile.displayName == null || $scope.profile.displayName.length == 0) $scope.profile.displayName = $scope.profile.firstName + ' ' + $scope.profile.lastName;

        $scope.blurDisplayName = function(){
            if($scope.profile.displayName == null || $scope.profile.displayName.trim().length == 0){
                $scope.profile.displayName = $scope.profile.displayName = $scope.profile.firstName + ' ' + $scope.profile.lastName;
            }
        };

        var callback = function(success,data){
            if(success == true) {
                $scope.profile.dataLocation = data;
                $scope.profile.location = $scope.profile.dataLocation.city + ", " + $scope.profile.dataLocation.region;
                $scope.profile.timezone = $scope.profile.dataLocation.timezone;
                $scope.changeValue('location',$scope.profile.location);
                $scope.changeValue('timezone',$scope.profile.timezone);
            }
        };

        $scope.getLocation = function(container){
            location.get(callback);
        };

        $scope.changeValue = function(name,value){
            if(!$scope.changedValues) $scope.changedValues = {};
            $scope.changedValues[name] = value;
        };

        $scope.cancelChanges = function(){
            for(var item in $scope.changedValues){
                $scope.profile[item] = $scope.accountData[item];
            }
            $scope.changedValues = null;
        };

        $scope.saveChanges = function(){
            AccountModel.update($scope.profile);
            $scope.changedValues = null;
        };

        $scope.$on('$locationChangeStart', function (event, next, current) {
            if ($scope.changedValues && current.match("\/profile")) {
                var answer = confirm("You have not saved changes! Are you sure you want to leave this page?");
                if (!answer) {
                    event.preventDefault();
                }
            }
        });


        $scope.profile.skills = [
            {
                id : 1,
                name : 'AngularJS'
            },{
                id : 2,
                name : 'Java'
            },{
                id : 3,
                name : 'jQuery'
            },{
                id : 4,
                name : 'CSS3'
            },{
                id : 5,
                name : 'Ruby on Rails'
            }
        ];

        $scope.deleteSkill = function(id){
            for(var s=0;s<$scope.profile.skills.length;s++){
                if(parseInt($scope.profile.skills[s].id) == parseInt(id)){
                    $scope.profile.skills.splice(s,1);
                    break;
                }
            }
        };

        $scope.keyPress = function($event){
            if($event.which === 13) $scope.addSkill($scope.newSkill);
        };

        $scope.addSkill = function(name){
            var max = 0;
            for(var s=0;s<$scope.profile.skills.length;s++) {
                if(max < $scope.profile.skills[s].id) max = $scope.profile.skills[s].id;
            }
            $scope.profile.skills.push({
                id : max+1,
                name : name
            });
            $scope.newSkill = null;
        };

        $scope.isChangingPicture = false;

        $scope.changePicture = function(){
            $scope.isChangingPicture = true;
        };

        var callbackUploadPicture = function(data){
            if(!data.error){
                if ($scope.profile.featureImage.large) {
                    toastModel.showToast('success', 'Picture successfully changed');
                } else {
                    toastModel.showToast('success', 'Picture successfully uploaded');
                }
                $scope.profile.featureImage.large = data.file.name;
                $scope.profile.featureImage.thumbnail = data.file.name;
            }else{
                toastModel.showToast('error', 'Unable upload picture');
            }
        };

        $scope.uploadFile = function(flow){
            $scope.file = flow.files[0].file;
            $scope.cancelChangePicture(flow);
            fileUpload.uploadFileToUrl($scope.file,{id : $scope.accountId},'account',callbackUploadPicture);
        };

        $scope.cancelChangePicture = function(flow){
            flow.files = [];
            $scope.isChangingPicture = false;
        };

        $scope.prevPicture = null;
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

        $scope.removePicture = function(flow){
            flow.files = [];
        };

        $scope.addedNewFile = function(file,event,flow){
            flow.files.shift();
        };



        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
}]);