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

            // callback for member
            var callbackFunction = function(response){
              $scope.company = response.data;
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

            //areas of expertise and sector tags
            $scope.searchArea = null;
            $scope.searchSector = null;
            $scope.areasOfExpertiseTags = [
                {name: "computers"},
                {name: "cars"},
                {name: "Turbines"}
            ]
            $scope.sectorTags = [
                {name: "private"},
                {name: "public"}
            ]
            $scope.selectedArea = null;
            $scope.selectedSector = null;

            $scope.queryAreaSearch = function(query) {
                var results = query ? $scope.areasOfExpertiseTags.filter( createFilterFor(query) ) : $scope.areasOfExpertiseTags;
                var deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            }
            $scope.removeArea = function(index) {
                $scope.company.areasOfExpertise.splice(index, 1);
            }

            $scope.addArea = function(area) {
                if (area && $scope.company.areasOfExpertise.indexOf(area) === -1) {
                    $scope.company.areasOfExpertise.push(area);
                }
            }

            $scope.querySectorSearch = function(query) {
                var results = query ? $scope.sectorTags.filter( createFilterFor(query) ) : $scope.sectorTags;
                var deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            }

            $scope.removeSector = function(index) {
                $scope.company.sector.splice(index, 1);
            }

            $scope.addSector = function(sector) {
                if (sector && $scope.company.sector.indexOf(sector) === -1) {
                    $scope.company.sector.push(sector);
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
