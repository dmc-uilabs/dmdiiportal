angular.module('dmc.onboarding')
.controller('ProfileController',
	['$scope', '$state', '$q', 'ajax', 'dataFactory', 'location', 'fileUpload',
	function ($scope, $state, $q, ajax, dataFactory, location, fileUpload) {
		if($state.current.name == 'onboarding.profile'){
			$state.go($scope.profile[0].state);
		}
        $scope.activePage = $state;
        $scope.newImage = [];
		var currentImage = {};
		var deleteCurrentImage = false;
		ajax.get(dataFactory.documentsURL().getList, { parentType: 'USER', parentId: $scope.userData.accountId, docClass: 'IMAGE', recent: 1}, function(response) {
			if (response.data && response.data.data && response.data.data.length) {
				currentImage = response.data.data[0];
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
			if (currentImage && currentImage.id && $scope.profile[1].data.image) {
				$scope.profile[1].data.image = '';
				deleteCurrentImage = true;
			}
		}

		var uploadImage = function() {
			return fileUpload.uploadFileToUrl($scope.newImage[0].file, {id:$scope.userData.profileId }, 'profile').then(function(data){
				return ajax.create(dataFactory.documentsURL().save, {
					documentUrl: data.file.name,
					documentName: data.key,
					ownerId: $scope.userData.profileId,
					parentType: 'USER',
					parentId: $scope.userData.profileId,
					docClass: 'IMAGE'
				});
			});
		};

        var deleteImage = function(imageId) {
			return ajax.delete(dataFactory.documentsURL(imageId).delete, {});
        };

        $scope.next = function(index){
            $scope.storefront[index].done = true;
            if(index == 1 && $scope.file){
                fileUpload.uploadFileToUrl($scope.file.files[0].file, {id:$scope.userData.profileId }, 'profile', function(data){
					ajax.create(dataFactory.documentsUrl().save, {
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
			};
		}

        $scope.finish = function(index){
            $scope.saveProfile($scope.profile[index].data, function(){
                $scope.saveFinish('profile');
                $(window).scrollTop(0);
                $state.go('^.^.home');
            });
        }
}]);
