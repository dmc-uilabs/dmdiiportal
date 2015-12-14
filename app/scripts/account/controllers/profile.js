'use strict';
angular.module('dmc.account')
    .controller('ProfileAccountCtr', [ '$stateParams', '$state', "$scope", "$cookies", "location",'fileUpload', function ($stateParams, $state, $scope, $cookies, location,fileUpload) {
        $scope.accountId = $stateParams.accountId;
        $scope.page = $state.current.name.split('.')[1];
        $scope.title = pageTitles[$scope.page];

        var userBasics = $cookies.getObject('userBasics');

        var callback = function(success,data){
            if(success == true) {
                $scope.profile.dataLocation = data;
                $scope.profile.location = $scope.profile.dataLocation.city + ", " + $scope.profile.dataLocation.region;
            }
        };

        $scope.getLocation = function(container){
            location.get(callback);
        };

        $scope.profile = {
            image : 'images/avatar-fpo.jpg',
            skills : [
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
            ],
            location : (userBasics.location ? userBasics.location : null)
        };

        if(userBasics.firstName != null && userBasics.lastName != null) {
            $scope.profile.displayName = userBasics.firstName + " " + userBasics.lastName;
        }

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
            console.log(data);
            $scope.profile.image = data.file.name;
        };

        $scope.uploadFile = function(flow){
            $scope.file = flow.files[0].file;
            $scope.cancelChangePicture(flow);
            fileUpload.uploadFileToUrl($scope.file,$scope.accountId,callbackUploadPicture);
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

        $scope.addedNewFile = function(file,event,flow){
            flow.files.shift();
        };
}]).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]).service('fileUpload', ['$http','dataFactory', function ($http,dataFactory) {
        this.uploadFileToUrl = function(file, accountId,callbackUploadPicture){
            var fd = new FormData();
            fd.append('file', file);
            fd.append('id',accountId);
            $http.post(dataFactory.uploadAccountPictureUrl(), fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(data){
                callbackUploadPicture(data);
            }).error(function(data){
                callbackUploadPicture(data);
            });
        }
    }]);