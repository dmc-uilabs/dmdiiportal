'use strict';

angular.module('dmc.edit-member')
    .controller('DMCEditMemberPageController', [
        '$stateParams',
        '$scope',
        '$q',
        '$timeout',
        '$showdown',
        'ajax',
        'dataFactory',
        '$location',
        'toastModel',
        'questionToastModel',
        'DMCUserModel',
        '$window',
        'fileUpload',
        function ($stateParams,
                $scope,
                $q,
                $timeout,
                $showdown,
                ajax,
                dataFactory,
                $location,
                toastModel,
                questionToastModel,
                DMCUserModel,
                $window,
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

            $scope.date = {};

            $scope.descriptionLimit = 5000;
            $scope.isSaved = false;
            $scope.fieldName = 'Description';
            $scope.isValid = false;

            $scope.company = {
                dmdiiType: {
                    dmdiiTypeCategory: {}
                },
                contacts: [],
                organization: {
                    description: ''
                }
            };

            $scope.$on('isValid', function (event, data) {
                $scope.isValid = data;
            });

            var getOrganizations = function() {
                if (!$stateParams.memberId) {

                    ajax.get(dataFactory.getNonDmdiiMembers(), {}, function(response) {
                        $scope.organizations = response.data;
                    });

                } else {
                    return;
                }
            };
            getOrganizations();

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

                $scope.company.organization.description = $showdown.makeHtml($scope.company.organization.description);
                var startDate = $scope.company.startDate.split('-');
                $scope.date.start = new Date(startDate[1] + '-' + startDate[2] + '-' + startDate[0]);

                var expireDate = $scope.company.expireDate.split('-');
                $scope.date.expire = new Date(expireDate[1] + '-' + expireDate[2] + '-' + expireDate[0]);

                ajax.get(dataFactory.documentsURL().getList, {
                    parentType: 'ORGANIZATION',
                    parentId: $scope.company.organization.id,
                    docClass: 'LOGO',
                    recent: 1
                }, function(response) {
                    if (response.data.data.length > 0) {
                        $scope.company.organization.logoImage = response.data.data[0];
                    };
                });

                $scope.companyTier = {
                    data: {
                        id: $scope.company.dmdiiType.id,
                        tier: $scope.company.dmdiiType.tier || undefined,
                        category: $scope.company.dmdiiType.dmdiiTypeCategory.id,
                        categoryString: $scope.company.dmdiiType.dmdiiTypeCategory.category
                    }
                }
                $scope.memberLoading = false;
            };

            var responseData = function(){
              var data = {};
              return data;
            };

            var getDMDIIMember = function(){
                if ($stateParams.memberId) {
                    $scope.title = 'Edit Member';
                    $scope.action = 'Edited';

                    ajax.get(dataFactory.getDMDIIMember($stateParams.memberId).get, responseData(), callbackFunction);
                } else {
                    $scope.title = 'Create Member';
                    $scope.action = 'Created';
                }
            };
            getDMDIIMember();

            $scope.companyTier = {};
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

            $scope.setTier = function() {
                if ($scope.company.dmdiiType) {
                    $scope.company.dmdiiType.id = $scope.companyTier.data.id;

                    $scope.company.dmdiiType.tier = $scope.companyTier.data.tier || undefined;
                    $scope.company.dmdiiType.dmdiiTypeCategory.id = $scope.companyTier.data.category;
                    $scope.company.dmdiiType.dmdiiTypeCategory.category = $scope.companyTier.data.categoryString;

                } else {
                    $scope.company.dmdiiType = {
                        id: $scope.companyTier.data.id,
                        tier: $scope.companyTier.data.tier,
                        dmdiiTypeCategory: {
                            id: $scope.companyTier.data.category,
                            category: $scope.companyTier.data.categoryString

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
                $scope.company.organization.areasOfExpertise.splice(index, 1);
            }

            $scope.removeSeekTag = function(index) {
                $scope.company.organization.desiredAreasOfExpertise.splice(index, 1);
            }

            $scope.addWellTag = function(tag) {
                if (tag && $scope.company.organization.areasOfExpertise.indexOf(tag) === -1) {
                    $scope.company.organization.areasOfExpertise.push(tag);
                }
            }

            $scope.addSeekTag = function(tag) {
                if (tag && $scope.company.organization.desiredAreasOfExpertise.indexOf(tag) === -1) {
                    $scope.company.organization.desiredAreasOfExpertise.push(tag);
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
                $scope.company.organization.awards.push($scope.award);
                $scope.award = {};
                $('#awardName').val('');
                $('#awardDescription').val('');
                $('#awardLink').val('');
            };

            $scope.removeAward = function(index) {
                $scope.company.organization.awards.splice(index, 1);
            };

            //contacts
            $scope.contact = {
                firstName: null,
                lastName: null,
                email: null,
                contactType: null
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
                $scope.newLogo = null;
            };

            $scope.addedNewFile = function(file,event,flow){
                $scope.newLogo = file;
                flow.files.shift();
            };

            $scope.removeLogo = function() {
                $scope.logoIsDeleted = true;
                $scope.companyLogoId = $scope.company.organization.logoImage.id;
                delete $scope.company.organization.logoImage;
            };

            $scope.removeAddedLogo = function() {
                $scope.newLogo = undefined;
                $scope.newLogoUri = undefined;
            };

            $scope.saveLogo = function() {
                $scope.cancelChangingLogo();
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    $scope.newLogoUri = event.target.result;
                };
                fileReader.readAsDataURL($scope.newLogo.file);
            };

            var uploadLogo = function(companyId){
                if($scope.newLogo){
                    fileUpload.uploadFileToUrl($scope.newLogo.file, {id : companyId}, 'company-logo', function(response) {
                        ajax.create(dataFactory.documentsURL().save,
                            {
                                organizationId: companyId,
                                ownerId: $scope.userData.accountId,
                                documentUrl: response.file.name,
                                documentName: 'company-logo',
                                parentType: 'ORGANIZATION',
                                parentId: companyId,
                                docClass: 'LOGO'
                            }, function(response) {
                                console.log(response)
                                if (response.status === 200) {
                                    toastModel.showToast('success', 'Logo uploaded successfully');
                                }
                            });
                    });
                }
            };

            var deleteLogo = function(){
                ajax.delete(dataFactory.documentsURL($scope.companyLogoId), {}, function(response) {
                    if(response.status === 200) {
                        toastModel.showToast('success', 'Logo successfully deleted');
                    }else{
                        toastModel.showToast('error', 'Unable to delete logo');
                    }
                });
            };

            // --------------------------------------------------------------------

            var callbackSaveFunction = function(response) {
                if (response.status === 200) {
                    toastModel.showToast('success', 'Member Successfully ' + $scope.action + '!');
                    var companyId = response.data.id;

                    if ($scope.newLogo) {
                        uploadLogo(companyId);
                    };

                    $timeout(function() {
                        $window.location.href = '/member-page.php#/' + response.data.id;
                    }, 1000);
                } else {
                    toastModel.showToast('error', 'Organization could not be ' + $scope.action);
                }
            }

            var convertToMarkdown = function(input) {
                var escaped = toMarkdown(input);
                return escaped;
            };

            $scope.$watch('company.organization.description', function() {
                console.log($scope.company)
            })
            $scope.saveChanges = function() {
                $scope.isSaved = true;
console.log($scope.isValid, $scope.isSaved)
                if (!$scope.isValid) {
                    return;
                }

                $scope.setTier();

                var date = new Date($scope.date.start);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10) ? '0' + month : month;
                var day = date.getDate();
                day = (day < 10) ? '0' + day : day;

                $scope.company.startDate = year + '-' + month + '-' + day;

                var date = new Date($scope.date.expire);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10) ? '0' + month : month;
                var day = date.getDate();
                day = (day < 10) ? '0' + day : day;

                $scope.company.expireDate = year + '-' + month + '-' + day;

                delete $scope.company.organization.logoImage;

                $scope.company.organization.description = convertToMarkdown($scope.company.organization.description);

                ajax.create(dataFactory.saveDMDIIMember().member, $scope.company, callbackSaveFunction);
            };

            $scope.cancelChanges = function(){
                if ($scope.company && $scope.company.id) {
                    $window.location.href = '/member-page.php#/' + $scope.company.id;
                } else {
                    $window.location.href = '/member-directory.php#/';
                }
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
