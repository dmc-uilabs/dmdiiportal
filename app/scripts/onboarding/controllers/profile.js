angular.module('dmc.onboarding')
.controller('ProfileController',
	['$scope', '$state', 'location', 'fileUpload',
	function ($scope, $state, location, fileUpload) {
		if($state.current.name == 'onboarding.profile'){
			$state.go($scope.profile[0].state);
		}
        $scope.activePage = $state;
        $scope.file = null;

//upload file
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
            $scope.file = flow;
        };

        $scope.removePicture = function(flow){
            flow.files = [];
            $scope.file = null;
        };

//get location
        $scope.getLocation = function () {
            location.get(callback);
        };

        var callback = function (success, data) {
            if (success) {
                $scope.profile[0].data.location = data.city + ', ' + data.region;
            }
        };

        //add skill to profile
        $scope.addSkill = function (inputSkill) {
            if (!inputSkill)return;
            $scope.profile[2].data.skills.push(inputSkill);
            this.inputSkill = null;
        }

        //remove skill
        $scope.deleteSkill = function (index) {
            $scope.isChange = true;
            $scope.profile[2].data.skills.splice(index, 1);
        }

        $scope.deleteImage = function(){
            $scope.profile[1].data.image = '';
        }

        $scope.next = function(index){
            $scope.storefront[index].done = true;
            if(index == 1 && $scope.file){
                fileUpload.uploadFileToUrl($scope.file.files[0].file, {id:$scope.userData.profileId }, 'profile', function(data){
					ajax.create(dataFactory.documentsURL().save, {
                        documentUrl: response.file.name,
                        documentName: response.key,
                        ownerId: $scope.profile.id,
                        parentType: 'USER',
                        parentId: $scope.profile.id,
                        accessLevel: $scope.documents[i].accessLevel
	            	}, function() {
						$(window).scrollTop(0);
						$state.go('^' + $scope.profile[index+1].state);
					});
				});
            }else{
                $scope.saveProfile($scope.profile[index].data, function(){
                    $(window).scrollTop(0);
                    $state.go('^' + $scope.profile[index+1].state);
                });
            }
        }

        $scope.finish = function(index){
            $scope.saveProfile($scope.profile[index].data, function(){
                $scope.saveFinish('profile');
                $(window).scrollTop(0);
                $state.go('^.^.home');
            });
        }
}]);
