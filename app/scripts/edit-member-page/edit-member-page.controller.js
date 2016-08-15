'use strict';

angular.module('dmc.edit-member')
    .controller('DMCEditMemberPageController', [
        "$stateParams",
        "$scope",
        "$q",
        "$timeout",
        "ajax",
        "dataFactory",
        "$location",
        "toastModel",
        "questionToastModel",
        "DMCUserModel",
        "fileUpload",
        function ($stateParams,
                $scope,
                $q,
                $timeout,
                ajax,
                dataFactory,
                $location,
                toastModel,
                questionToastModel,
                DMCUserModel,
                fileUpload) {


            $scope.userData = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.userData = res;

                if ($scope.userData.roles && angular.isDefined($scope.userData.roles[$stateParams.memberId])) {
                    $scope.userData.isVerified = true;
                    switch ($scope.userData.roles[$stateParams.memberId]) {
                        case 'ADMIN':
                            $scope.userData.isAdmin = true;
                            break;
                        case 'VIP':
                            $scope.userData.isVIP = true;
                            break;
                        case 'MEMBER':
                            $scope.userData.isMember = true;
                            break;
                    }
                }
            });

            $scope.isChange = {};

            $scope.getOrganizations = function() {
                if (!$stateParams.memberId) {
                    ajax.get(dataFactory.getNonDmdiiMembers(), {}, function(response) {
                        $scope.organizations = response.data;
                    });
                    $scope.company = {
                        dmdiiType: {
                            dmdiiTypeCategory: {}
                        },
                        contacts: [],
                        awards: [],
                        areasOfExpertise: [],
                        desiredAreasOfExpertise: []
                    };
                }
            }
            $scope.getOrganizations();

            $scope.queryOrgSearch = function(query) {
                var results = query ? $scope.organizations.filter( createFilterFor(query) ) : $scope.organizations;
                var deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            }

            $scope.setOrg = function(org) {
                $scope.company.organization = org;
            }

            // callback for member
            var callbackFunction = function(response){
              $scope.company = response.data;
              $scope.company.startDate = new Date($scope.company.startDate);
              $scope.company.expireDate = new Date($scope.company.expireDate);

              $scope.companyTier = {
                  id: $scope.company.dmdiiType.id,
                  tier: $scope.company.dmdiiType.tier || undefined,
                  category: $scope.company.dmdiiType.dmdiiTypeCategory.id,
                  categoryString: $scope.company.dmdiiType.dmdiiTypeCategory.category
              }
              $scope.memberLoading = false;
            };

            var responseData = function(){
              var data = {};
              return data;
            };

            $scope.getDMDIIMember = function(){
                if ($stateParams.memberId) {
                    $scope.title = 'Edit Member';

                    ajax.get(dataFactory.getDMDIIMember($stateParams.memberId).get, responseData(), callbackFunction);
                } else {
                    $scope.title = 'Create Member';
                }
            };
            $scope.getDMDIIMember();

            $scope.changes = {};
            $scope.isDataChanged = false;
            $scope.categories = {
                1: 'Industry Tier ',
                2: 'Academic Tier ',
                3: 'U.S. Government',
                4: 'State And Local Government'
            }
            $scope.types = [
                {
                    id: 4,
                    tier: 1,
                    category: 2,
                    categoryString: 'Academic'
                },
                {
                    id: 5,
                    tier: 2,
                    category: 2,
                    categoryString: 'Academic'
                },
                {
                    id: 6,
                    tier: 3,
                    category: 2,
                    categoryString: 'Academic'
                },
                {
                    id: 7,
                    tier: 4,
                    category: 2,
                    categoryString: 'Academic'
                },
                {
                    id: 1,
                    tier: 1,
                    category: 1,
                    categoryString: 'Industry'
                },
                {
                    id: 2,
                    tier: 2,
                    category: 1,
                    categoryString: 'Industry'
                },
                {
                    id: 3,
                    tier: 3,
                    category: 1,
                    categoryString: 'Industry'
                },
                {
                    id: 9,
                    category: 4,
                    categoryString: 'State And Local Government'
                },
                {
                    id: 8,
                    category: 3,
                    categoryString: 'U.S. Government'
                }
            ]

            $scope.setTier = function(companyTier) {
                console.log(companyTier)
                if ($scope.company.dmdiiType) {
                    $scope.company.dmdiiType.id = companyTier.id;

                    $scope.company.dmdiiType.tier = companyTier.tier || undefined;
                    $scope.company.dmdiiType.dmdiiTypeCategory.id = companyTier.category;
                    $scope.company.dmdiiType.dmdiiTypeCategory.category = companyTier.categoryString;

                } else {
                    $scope.company.dmdiiType = {
                        id: companyTier.id,
                        tier: companyTier.tier,
                        dmdiiTypeCategory: {
                            id: companyTier.category,
                            category: companyTier.categoryString

                        }
                    }
                }
            }

            var tagCallbackFunction = function(response) {
                $scope.dmdiiMemberTags = response.data;
            }

            $scope.getTags = function() {
                ajax.get(dataFactory.getDmdiiMemberTags(), {}, tagCallbackFunction)
            }
            $scope.getTags();
            //areas of expertise and sector tags
            $scope.searchWellTag = null;
            $scope.selectedWellTag = null;

            $scope.searchSeekTag = null;
            $scope.selectedSeekTag = null;


            $scope.queryTagSearch = function(query) {
                var results = query ? $scope.dmdiiMemberTags.filter( createFilterFor(query) ) : $scope.dmdiiMemberTags;
                var deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            }
            $scope.removeWellTag = function(index) {
                $scope.company.areasOfExpertise.splice(index, 1);
            }

            $scope.removeSeekTag = function(index) {
                $scope.company.desiredAreasOfExpertise.splice(index, 1);
            }

            $scope.addWellTag = function(tag) {
                if (tag && $scope.company.areasOfExpertise.indexOf(tag) === -1) {
                    $scope.company.areasOfExpertise.push(tag);
                }
            }

            $scope.addSeekTag = function(tag) {
                if (tag && $scope.company.desiredAreasOfExpertise.indexOf(tag) === -1) {
                    $scope.company.desiredAreasOfExpertise.push(tag);
                }
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(tag) {
                    return (tag.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            };

            //recognitions
            $scope.award = {
                name: null,
                description: null,
                link: null
            };

            $scope.addAward = function() {
                $scope.company.awards.push($scope.award);
                $scope.award = {};
                $('#awardName').val('');
                $('#awardDescription').val('');
                $('#awardLink').val('');
            };

            $scope.removeAward = function(index) {
                console.log(index)
                $scope.company.awards.splice(index, 1);
            };

            //contacts
            $scope.contact = {
                firstName: null,
                lastName: null,
                email: null,
                type: null
            };

            $scope.contactTypes = [
                {
                    id: 1,
                    type: 'primary point of contact'
                },
                {
                    id: 2,
                    type: 'secondary point of contact'
                },
                {
                    id: 3,
                    type: 'executive lead'
                }
            ];

            $scope.addContact = function() {
                $scope.company.contacts.push($scope.contact);
                $scope.contact = {};
                $('#contactFirstName').val('');
                $('#contactLastName').val('');
                $('#contactEmail').val('');
                $('#contactType').val('');
            };

            $scope.removeContact = function(index) {
                $scope.company.contacts.splice(index, 1);
            };

            // logo drop box --------------------------------------------

            $scope.changingLogo = false;
            $scope.changeLogo = function(){
                $scope.changingLogo = true;
            };

            $scope.cancelChangingLogo = function(){
                $scope.changingLogo = false;
            };

            $scope.newLogo = null;
            $scope.pictureDragEnter = function(flow){
                $scope.newLogo = flow.files[0];
                flow.files = [];
            };

            $scope.pictureDragLeave = function(flow){
                //$scope.newLogo = null;
            };

            $scope.addedNewFile = function(file,event,flow){
                $scope.newLogo = file;
                flow.files.shift();
            };

            $scope.removePicture = function(flow){
                flow.files = [];
                $scope.newLogo = null;
            };

            $scope.uploadLogo = function(){
                if($scope.newLogo){
                    fileUpload.uploadFileToUrl($scope.newLogo.file,{id : $scope.company.id},'company-logo',callbackUploadPicture);
                    $scope.cancelChangingLogo();
                }
            };

            $scope.deleteLogo = function(ev){
                questionToastModel.show({
                    question : "Do you want to delete the logo?",
                    buttons: {
                        ok: function(){
                            ajax.update(dataFactory.updateCompanyProfile($scope.company.id),{
                                logoImage: null
                            },function(response){
                                $scope.company.logoImage = null;
                                apply();
                            });
                        },
                        cancel: function(){}
                    }
                },ev);
            };

            var callbackUploadPicture = function(data){
                if(!data.error) {
                    $scope.company.logoImage = data.file.name;
                    apply();
                    toastModel.showToast('success', 'Image successfully added');
                    saveMemeber();
                }else{
                    toastModel.showToast('error', 'Unable add image');
                }
            };
            // --------------------------------------------------------------------

            $scope.changedValue = function(){
                $scope.isDataChanged = isChange;
            };

            var callbackSaveFunction = function(response) {
                $location.path('/'+$scope.company.id).search();
            }

            $scope.saveChanges = function() {
                var date = new Date($scope.company.startDate);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10) ? '0' + month : month;
                var day = date.getDate();

                $scope.company.startDate = year + '-' + month + '-' + day;

                var date = new Date($scope.company.expireDate);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10) ? '0' + month : month;
                var day = date.getDate();

                $scope.company.expireDate = year + '-' + month + '-' + day;


                ajax.create(dataFactory.saveDMDIIMember().member, $scope.company, callbackSaveFunction);
            };
            $scope.cancelChanges = function(){
                $location.path('/'+$scope.company.id).search();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
