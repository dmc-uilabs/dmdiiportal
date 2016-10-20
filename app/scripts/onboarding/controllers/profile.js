angular.module('dmc.onboarding')
.controller('ProfileController',
	['$scope', '$state', '$q', 'ajax', 'dataFactory', 'location', 'fileUpload',
	function ($scope, $state, $q, ajax, dataFactory, location, fileUpload) {
		if($state.current.name == 'onboarding.profile'){
			$state.go($scope.profile[0].state);
		}
        $scope.activePage = $state;
        $scope.newImage = [];

		ajax.get(dataFactory.documentsURL().getList, { parentType: 'USER', parentId: $scope.userData.accountId, docClass: 'IMAGE', recent: 1}, function(response) {
			if (response.data && response.data.data && response.data.data.length) {
				var curLogo = response.data.data[0];
			}
		})

//get location
        $scope.getLocation = function () {
            location.get(callback);
        };

        var callback = function (success, data) {
            if (success) {
                $scope.profile[0].data.address = data.city + ', ' + data.region;
            }
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
            $scope.profile[2].data.skills.push(inputSkill);
            this.inputSkill = null;
        }

        //remove skill
        $scope.deleteSkill = function (index) {
            $scope.isChange = true;
            $scope.profile[2].data.skills.splice(index, 1);
        }

//upload and remove image
		$scope.removeImage = function() {
			if ($scope.profile[1].data.image.length > 0) {
				$scope.profile[1].data.image = '';
				var deleteImage = true;
			}
		}

		var uploadImage = function() {
			return fileUpload.uploadFileToUrl($scope.newImage[0].file, {id:$scope.userData.profileId }, 'profile').then(function(data){
				return ajax.create(dataFactory.documentsURL().save, {
					documentUrl: data.file.name,
					documentName: data.key,
					ownerId: $scope.profile.id,
					parentType: 'USER',
					parentId: $scope.profile.id,
					docClass: 'IMAGE'
				});
			});
		}

        var deleteImage = function(imageId){
			return ajax.delete(dataFactory.documentsURL(imageId).delete, {});
        }

        $scope.next = function(index){
            $scope.profile[index].done = true;
			$scope.saveProfile($scope.profile[index].data, function(){
				if($scope.newImage.length) {
					promises.push(uploadImage());
					removeImage();
				}

				if (deleteImage) {
					promises.push(deleteImage(curImage.id));
				}

				$q.all(promises).then(function() {
					$(window).scrollTop(0);
					$state.go('^' + $scope.profile[index+1].state);
				});
			});
		}

        $scope.finish = function(index){
            $scope.saveProfile($scope.profile[index].data, function(){
                $scope.saveFinish('profile');
                $(window).scrollTop(0);
                $state.go('^.^.home');
            });
        }
}]);
