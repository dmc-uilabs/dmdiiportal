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


            $scope.user = null;
            DMCUserModel.getUserData().then(function(res){
                $scope.user = res;
            });

            $scope.getOrganizations = function() {
                if (!$stateParams.memberId) {
                    ajax.get(dataFactory.companyURL().all, {}, function(response) {
                        $scope.organizations = response.data;
                    });
                    $scope.company = {
                        dmdiiType: {},
                        contacts: [],
                        awards: [],
                        areasOfExpertise: [],
                        sectors: []
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
            // callback for member
            var callbackFunction = function(response){
              $scope.company = response.data;
              $scope.companyType = {
                  tier: $scope.company.dmdiiType.tier,
                  category: $scope.company.dmdiiTypeCategory.id
              }
              $scope.memberLoading = false;
            };

            var responseData = function(){
              var data = {};
              return data;
            };

            $scope.getDMDIIMember = function(){
                if ($stateParams.memberId) {
                    ajax.get(dataFactory.getDMDIIMember($stateParams.memberId).get, responseData(), callbackFunction);
                }
            };
            $scope.getDMDIIMember();

            $scope.changes = {};
            $scope.isDataChanged = false;
            $scope.categories = {
                1: 'Industry Tier ',
                2: 'Academic Tier ',
                3: 'Government'
            }
            $scope.types = [
                {
                    tier: 1,
                    category: 2
                },
                {
                    tier: 2,
                    category: 2
                },
                {
                    tier: 3,
                    category: 2
                },
                {
                    category: 3
                },
                {
                    tier: 1,
                    category: 1
                },
                {
                    tier: 2,
                    category: 1
                },
                {
                    tier: 3,
                    category: 1
                },
                {
                    tier: 4,
                    category: 1
                }
            ]

            $scope.setTier = function() {
                if ($scope.company.dmdiiType) {
                    $scope.company.dmdiiType.tier = $scope.companyType.tier;
                    $scope.company.dmdiiType.dmdiiTypeCategory.id = $scope.companyType.category;
                } else {
                    $scope.company.dmdiiType = {
                        tier: $scope.companyType.tier,
                        dmdiiTypeCategory: {
                            id: $scope.companyType.category
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
                $scope.company.sector.splice(index, 1);
            }

            $scope.addWellTag = function(tag) {
                if (tag && $scope.company.areasOfExpertise.indexOf(tag) === -1) {
                    $scope.company.areasOfExpertise.push(tag);
                }
            }

            $scope.addSeekTag = function(tag) {
                if (tag && $scope.company.sector.indexOf(tag) === -1) {
                    $scope.company.sector.push(tag);
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
                $('#awardName').val('');
                $('#awardDescription').val('');
                $('#awardLink').val('');
            };

            $scope.removeAward = function(index) {
                $scope.company.awards.splice(index, 1);
            };

            //contacts
            $scope.contact = {
                firstName: null,
                lastName: null,
                email: null,
                type: null
            };

            $scope.contactTypes = {
                1: 'primary point of contact',
                2: 'secondary point of contact',
                3: 'executive lead'
            };

            $scope.addContact = function() {
                $scope.company.contacts.push($scope.contact);
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
                ajax.update(dataFactory.saveDMDIIMember($scope.company.id).member, $scope.company, callbackSaveFunction);
            };
            $scope.cancelChanges = function(){
                $location.path('/'+$scope.company.id).search();
            };

            function apply(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

        }]);
