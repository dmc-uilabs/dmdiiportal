angular.module('dmc.onboarding')
.controller('CompanyController',
	['$scope', '$rootScope', '$state', 'ajax', 'dataFactory', 'fileUpload','questionToastModel',
	function ($scope, $rootScope, $state, ajax, dataFactory, fileUpload, questionToastModel) {
		if($state.current.name == 'onboarding.company'){
			$state.go($scope.company[0].state);
		}
        $scope.activePage = $state;

        $scope.isAddingContact = false;
        $scope.isAddingVideo = false;
        $scope.isAddingImage = false;
        $scope.isAddingSkillsImage = false;
        $scope.file = null;

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

        $scope.states = [
            'AL|Alabama',
            'AK|Alaska',
            'AZ|Arizona',
            'AR|Arkansas',
            'CA|California',
            'CO|Colorado',
            'CT|Connecticut',
            'DE|Delaware',
            'FL|Florida',
            'GA|Georgia',
            'HI|Hawaii',
            'ID|Idaho',
            'IL|Illinois',
            'IN|Indiana',
            'IA|Iowa',
            'KS|Kansas',
            'KY|Kentucky',
            'LA|Louisiana',
            'ME|Maine',
            'MD|Maryland',
            'MA|Massachusetts',
            'MI|Michigan',
            'MN|Minnesota',
            'MS|Mississippi',
            'MO|Missouri',
            'MT|Montana',
            'NE|Nebraska',
            'NV|Nevada',
            'NH|New Hampshire',
            'NJ|New Jersey',
            'NM|New Mexico',
            'NY|New York',
            'NC|North Carolina',
            'ND|North Dakota',
            'OH|Ohio',
            'OK|Oklahoma',
            'OR|Oregon',
            'PA|Pennsylvania',
            'RI|Rhode Island',
            'SC|South Carolina',
            'SD|South Dakota',
            'TN|Tennessee',
            'TX|Texas',
            'UT|Utah',
            'VT|Vermont',
            'VA|Virginia',
            'WA|Washington',
            'WV|West Virginia',
            'WI|Wisconsin',
            'WY|Wyoming'
        ];

        $scope.categoriesTiers = [
            {
                id : 1,
                title : 'Tier 4 Academic / Nonprofit'
            }
        ];

        $scope.states = $.map($scope.states, function( n,index ) {
            var name = n.split('|');
            return {
                id : index+1,
                abbr : name[0],
                name : name[1]
            }
        });

        $scope.preferredMethods = [
            {
                id : 1,
                name : 'Email'
            }, {
                id : 2,
                name : 'Phone'
            }
        ];

        $scope.deleteCover = function(){
            $scope.company[1].data.featureImage.thumbnail = '';
            $scope.company[1].data.featureImage.large = '';
        }

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

//upload file;
		$scope.logo = [];
        $scope.removePicture = function(flow){
            $scope.logo = [];
        };

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

//SkillsImage
        $scope.addNewSkillsImage = function(){
            $scope.isAddingSkillsImage = true;
        };

        $scope.cancelAddSkillsImage = function(){
            $scope.isAddingSkillsImage = false;
        };

        $scope.saveSkillsImage = function(newImage){
            /*fileUpload.uploadFileToUrl(
                $scope.file.files[0].file,
                {
                    id : 1,
                    title : newImage.title
                },
                'company-profile',
                callbackUploadPicture
            );*/
            $scope.cancelAddSkillsImage();
        };

        $scope.deleteSkillsImage = function(index){
            ajax.delete(
                dataFactory.deleteCompanySkillsImage($scope.company[5].data.skillsImages[index].id),
                {},
                function(response){
                    $scope.company[5].data.skillsImages.splice(index, 1);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

//images
        $scope.addNewImage = function(){
            $scope.isAddingImage = true;
        };

        $scope.cancelAddImage = function(){
            $scope.isAddingImage = false;
        };

        $scope.saveImage = function(newImage){
            /*fileUpload.uploadFileToUrl(
                $scope.file.files[0].file,
                {
                    id : 1,
                    title : newImage.title
                },
                'company-profile',
                callbackUploadPicture
            );*/
            $scope.cancelAddImage();
        };

        $scope.deleteImage = function(index){
            ajax.delete(
                dataFactory.deleteCompanyImage($scope.company[4].data.images[index].id),
                {},
                function(response){
                    $scope.company[4].data.images.splice(index, 1);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }
            );
        };

        $scope.scrollTop = function(){
        	$(window).scrollTop(0);
        }

        $scope.next = function(index){
            $scope.company[index].done = true;
            switch(index){
                case 1:
                    if($scope.file){
                        fileUpload.uploadFileToUrl(
                            $scope.file.files[0].file,
                            {id: $scope.userData.companyId},
                            'company',
                            function(data){
                                $scope.file = null;
                                if(data.file && data.file.name){
                                    $scope.company[1].data.featureImage.thumbnail = data.file.name;
                                    $scope.company[1].data.featureImage.large = data.file.name;
                                }
                                $scope.saveCompany($scope.company[index].data, function(){
                                    $(window).scrollTop(0);
                                    $state.go('^' + $scope.company[index+1].state);
                                });
                            }
                        );
                    }else{
                        $scope.saveCompany($scope.company[index].data, function(){
                            $(window).scrollTop(0);
                            $state.go('^' + $scope.company[index+1].state);
                        });
                    };
                    break;
                case 4:
                    for(var i in $scope.company[4].data.images){
                        delete $scope.company[4].data.images[i]['$$hashKey'];
                        ajax.update(
                            dataFactory.updateCompanyImage($scope.company[4].data.images[i].id),
                            $scope.company[4].data.images[i],
                            function(response){}
                        );
                    };
                    for(var i in $scope.company[4].data.videos){
                        delete $scope.company[4].data.videos[i]['$$hashKey'];
                        ajax.update(
                            dataFactory.updateCompanyVideo($scope.company[4].data.videos[i].id),
                            $scope.company[4].data.videos[i],
                            function(response){}
                        );
                    };
                    $scope.saveCompany({}, function(){
                        $(window).scrollTop(0);
                        $state.go('^' + $scope.company[index+1].state);
                    });
                    break;
                case 5:
                    for(var i in $scope.company[5].data.skillsImages){
                        delete $scope.company[5].data.skillsImages[i]['$$hashKey'];
                        ajax.update(
                            dataFactory.updateCompanySkillsImage($scope.company[5].data.skillsImages[i].id),
                            $scope.company[5].data.skillsImages[i],
                            function(response){}
                        );
                    };
                    $scope.saveCompany(
                        {
                            technicalExpertise: $scope.company[5].data.technicalExpertise,
                            toolsSoftwareEquipmentMachines: $scope.company[5].data.toolsSoftwareEquipmentMachines
                        },
                        function(){
                        $(window).scrollTop(0);
                        $state.go('^' + $scope.company[index+1].state);
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
