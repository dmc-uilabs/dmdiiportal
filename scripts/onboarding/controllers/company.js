angular.module('dmc.onboarding')
.controller('CompanyController',
	['$scope', '$rootScope', '$state', '$q', 'ajax', 'dataFactory', 'fileUpload','questionToastModel',
	function ($scope, $rootScope, $state, $q, ajax, dataFactory, fileUpload, questionToastModel) {
		if($state.current.name == 'onboarding.company'){
			$state.go($scope.company[0].state);
		}
        $scope.activePage = $state;

        $scope.isAddingContact = false;
        $scope.isAddingVideo = false;
        $scope.isAddingImage = false;

        $scope.contactMethods = [];
        $scope.isAddingContactMethod = false;
        $scope.addNewContactMethod = function(){
            $scope.isAddingContactMethod = true;
        };

        $scope.cancelAddContactMethod = function(){
            $scope.isAddingContactMethod = false;
        };

        $scope.saveContactMethod = function(name){
            var data = {
                name : name,
                companyId : $scope.userData.companyId,
                value : null
            };
            ajax.create(dataFactory.companyURL().add_contact_method,data,function(response){
                response.data.oldValue = response.data.value;
                $scope.contactMethods.push(response.data);
                $scope.cancelAddContactMethod();
                apply();
            });
        };

        function apply(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }

        $scope.deleteContactMethod = function(item,ev,index){
            questionToastModel.show({
                question : 'Do you want to delete the contact method?',
                buttons: {
                    ok: function(){
                        ajax.delete(dataFactory.companyURL(item.id).delete_contact_method,{},function(response){
                            $scope.contactMethods.splice(index,1);
                            apply();
                        });
                    },
                    cancel: function(){}
                }
            },ev);
        };

        function loadContactMethods(){
            ajax.get(dataFactory.companyURL($scope.userData.companyId).get_contact_methods,{},function(response){
                $scope.contactMethods = response.data;
                apply();
            });
        }
        loadContactMethods();

        $scope.keyContactTypes = [
            {
                id : 1,
                name : 'LEGAL'
            }, {
                id : 2,
                name : 'LEGAL 2'
            }
        ];


				var getStates = function() {
						ajax.get(dataFactory.getStaticJSON('states.json'), {}, function(response){

								$scope.states = $.map(response.data, function( n,index ) {
										var name = n.split('|');
										return {
												id : index+1,
												abbr : name[0],
												name : name[1]
										}
								});

						});
				}
				getStates();

        $scope.categoriesTiers = [
            {
                id : 1,
                title : 'Tier 4 Academic / Nonprofit'
            }
        ];

        $scope.preferredMethods = [
            {
                id : 1,
                name : 'Email'
            }, {
                id : 2,
                name : 'Phone'
            }
        ];

//skills
        //add skill to profile
        $scope.addSkill = function (inputSkill) {
            ajax.create(
                dataFactory.addCompanySkill(),
                {
                    companyId : $scope.userData.companyId,
                    name : inputSkill
                },
                function(response){
                    $scope.company[5].data.skills.push(response.data);
                    this.inputSkill = null;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        }

        //remove skill
        $scope.deleteSkill = function (index) {
            ajax.delete(
                dataFactory.deleteCompanySkill($scope.company[5].data.skills[index].id),
                {},
                function(response){
                    $scope.company[5].data.skills.splice(index, 1);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        }

//contacts
        // open form for add contact
        $scope.addNewContact = function(){
            $scope.isAddingContact = true;
        };

        // close form for add contact
        $scope.cancelAddContact = function(){
            $scope.isAddingContact = false;
        };

        // save new contact
        $scope.saveContact = function(newContact){
            newContact.companyId = $scope.userData.companyId;
            ajax.create(
                dataFactory.addCompanyContact(),
                newContact,
                function(response){
                    $scope.company[9].data.keyContacts.unshift(response.data);
                    $scope.cancelAddContact();
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

        // delete contact
        $scope.deleteContact = function(index){
            ajax.delete(
                dataFactory.deleteCompanyContact($scope.company[9].data.keyContacts[index].id),
                {},
                function(response){
                    $scope.company[9].data.keyContacts.splice(index,1);
                    $scope.cancelAddContact();
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

//upload feature Image;
		$scope.featureImage = [];

//videos
        // open form for add video
        $scope.addNewVideo = function(){
            $scope.isAddingVideo = true;
        };

        // close form for add video
        $scope.cancelAddVideo = function(){
            $scope.isAddingVideo = false;
        };

        // save new video
        $scope.saveVideo = function(newVideo){
            newVideo.companyId = $scope.userData.companyId;
            ajax.create(
                dataFactory.addCompanyVideo(),
                newVideo,
                function(response){
                    $scope.company[4].data.videos.unshift(response.data);
                    $scope.cancelAddVideo();
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

        // delete video
        $scope.deleteVideo = function(index){
            ajax.delete(
                dataFactory.deleteCompanyVideo($scope.company[4].data.videos[index].id),
                {},
                function(response){
                    $scope.company[4].data.videos.splice(index, 1);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

//images
		$scope.newImages = [];
        $scope.addNewImage = function(){
            $scope.isAddingImage = true;
        };

        $scope.cancelAddImage = function(){
            $scope.isAddingImage = false;
        };

		$scope.removeFeatureImage = function() {
			if ($scope.company[1].data.featureImage && $scope.company[1].data.featureImage.length > 0 && $scope.company[1].data.featureImage[0].documentUrl) {
				var deleteFeatureImage = true;
			}
		}

        var deleteImage = function(imageId){
            ajax.delete(
                dataFactory.documentsUrl(imageId).delete, {}, function(response){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

		var uploadImage = function(image, companyId) {
			return fileUpload.uploadFileToUrl(image.file, {id: companyId}, 'company-image').then(function(data) {
				var image = {
					ownerId: $scope.userData.accountId,
					documentUrl: data.file.name,
					documentName: image.title + image.type,
					parentType: 'ORGANIZATION',
					parentId: companyId,
					docClass: 'IMAGE'
				}
				return ajax.create(dataFactory.documentsUrl().save, doc, function(response) {
						if (response.status === 200) {
							toastModel.showToast('success', 'Image uploaded successfully');
						}
					});
				});
		}

		var uploadFeature = function(companyId) {
			return fileUpload.uploadFileToUrl($scope.featureImage[0].file, {id: companyId}, 'company-feature').then(function(data){
				var feature = {
					ownerId: $scope.userData.accountId,
					documentUrl: data.file.name,
					documentName: $scope.featureImage.title,
					parentType: 'ORGANIZATION',
					parentId: companyId,
					docClass: 'FEATURE_IMAGE'
				}
				return ajax.create(dataFactory.documentsUrl().save, doc, function(response) {
						if (response.status === 200) {
							toastModel.showToast('success', 'Feature image uploaded successfully');
						}
					});
				});
		}

        $scope.scrollTop = function(){
        	$(window).scrollTop(0);
        }

        $scope.next = function(index){
            $scope.company[index].done = true;
            switch(index){
                case 1:
					$scope.saveCompany($scope.company[index].data, function(response){
						var companyId = response.data.id
						if($scope.featureImage.length > 0){
							promises.push(uploadFeature(companyId));
							$scope.removeFeatureImage();
						}

						if (deleteFeatureImage) {
							promises.push(deleteImage($scope.company[1].data.featureImage[0].id))
						}
						$q.all(promises).then(function(responses) {
							$(window).scrollTop(0);
							$state.go('^' + $scope.company[index+1].state);
						});
					});
                    break;
                case 4:
					var promises = [];
                    for(var i in $scope.company[4].data.videos){
                        delete $scope.company[4].data.videos[i]['$$hashKey'];
                        ajax.update(
                            dataFactory.updateCompanyVideo($scope.company[4].data.videos[i].id),
                            $scope.company[4].data.videos[i],
                            function(response){}
                        );
                    };
                    $scope.saveCompany({}, function(response){
						var companyId = response.data.id;
						angular.forEach($scope.newImages, function(image) {
							promises.push(uploadImage(image, companyId));

							$q.all(promises).then(function(response) {
								$(window).scrollTop(0);
								$state.go('^' + $scope.company[index+1].state);
							});
						});
                    });
                    break;
                case 8:
                    for(var i in $scope.contactMethods){
                        if($scope.contactMethods[i].value != $scope.contactMethods[i].oldValue){
                            ajax.update(dataFactory.companyURL($scope.contactMethods[i].id).update_contact_method,{
                                value : $scope.contactMethods[i].value
                            },function(response){});
                        }
                    }
                    $scope.saveCompany({}, function(){
                        $(window).scrollTop(0);
                        $state.go('^' + $scope.company[index+1].state);
                    });
                    break;
                case 9:
                    for(var i in $scope.company[9].data.keyContacts){
                        delete $scope.company[9].data.keyContacts[i]['$$hashKey'];
                        ajax.update(
                            dataFactory.updateCompanyContact($scope.company[9].data.keyContacts[i].id),
                            $scope.company[9].data.keyContacts[i],
                            function(response){}
                        );
                    }



                    $scope.saveCompany({}, function(){
                        $(window).scrollTop(0);
                        $state.go('^' + $scope.company[index+1].state);
                    });
                    break;
                default:
                    $scope.saveCompany($scope.company[index].data, function(){
                        $(window).scrollTop(0);
                        $state.go('^' + $scope.company[index+1].state);
                    });
            };
        }

        $scope.finish = function(index){
            $scope.saveCompany($scope.company[index].data, function(){
                $scope.saveFinish('company');
                $(window).scrollTop(0);
                $state.go('^.^.home');
            });
        }
}]);
