angular.module('dmc.project')
    .controller('PublishServiceMarketplaceCtrl',[
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$mdDialog',
        'projectData',
        'serviceData',
        '$timeout',
        'ajax',
        '$http',
        '$q',
        'fileUpload',
        'toastModel',
        'dataFactory',
        function ($rootScope,
                  $scope,
                  $state,
                  $stateParams,
                  $mdDialog,
                  projectData,
                  serviceData,
                  $timeout,
                  ajax,
                  $http,
                  $q,
                  fileUpload,
                  toastModel,
                  dataFactory) {
            var projectCtrl = this;
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;

            $scope.serviceData = serviceData;
            $scope.currentPage = 1;
            $scope.isDisabledFirstPage = true;
            $scope.isDisabledSecondPage = true;

            $scope.serviceTypes = [
                {
                    tag : 'analytical',
                    name : 'Analytical'
                }, {
                    tag: 'data',
                    name : 'Data'
                },{
                    tag : 'solid',
                    name : 'Solid'
                }
            ];

            // First Page
            $scope.publishService = {
                name : $scope.serviceData.title,
                description : $scope.serviceData.description,
                serviceType : $scope.serviceData.serviceType,
                inputs : $scope.serviceData.specifications ? $scope.serviceData.specifications.input : 0,
                outputs : $scope.serviceData.specifications ? $scope.serviceData.specifications.output : 0,
                specifications : $scope.serviceData.specifications ? $scope.serviceData.specifications.special : [],
                tags : $scope.serviceData.service_tags
            };

            $scope.newSpecification = {};
            var specifications = loadAllSpecifications();
            $scope.newSpecification.querySearch = querySearch;

            function querySearch (query) {
                return query ? specifications.filter( createFilterFor(query) ) : specifications;
            }

            function loadAllSpecifications() {
                return [
                    {
                        value : 'height',
                        display : 'Height'
                    },{
                        value : 'width',
                        display : 'Width'
                    },{
                        value : 'weight',
                        display : 'Weight'
                    }
                ];
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(s) {
                    return (angular.lowercase(s.value).indexOf(lowercaseQuery) > -1);
                };
            }

            $scope.addSpecification = function(){
                var name = $scope.newSpecification.selectedItem ? $scope.newSpecification.selectedItem.display : $scope.newSpecification.searchText;
                $scope.publishService.specifications.unshift({
                    name : name,
                    data : null
                });
                $scope.newSpecification.selectedItem = null;
                $scope.newSpecification.searchText = null;
                $scope.changedInput();
            };

            $scope.deleteSpecification = function(index,id){
                $scope.publishService.specifications.splice(index,1);
                $scope.changedInput();
            };

            $scope.addTag = function(){
                $scope.publishService.tags.unshift({
                    name : $scope.newTag
                });
                $scope.newTag = null;
                $scope.changedInput();
            };

            var deletedTags = [];
            $scope.deleteTag = function(index,id){
                if(id && deletedTags.indexOf(id) == -1) deletedTags.push(id);
                $scope.publishService.tags.splice(index,1);
                $scope.changedInput();
            };

            $scope.changedInput = function(){
                $scope.isDisabledFirstPage = ($scope.publishService.name && $scope.publishService.description && $scope.publishService.serviceType ? false : true);
            };
            $scope.changedInput();

            $scope.nextPage = function(){
                $scope.currentPage++;
            };

            // Second Page

            $scope.publishService2 = {
                authors : $scope.serviceData.service_authors,
                documents : []
            };

            $scope.newAuthor = {};
            $scope.newAuthor.authors = searchAuthor;

            var allAuthors = [];

            function searchAuthor(query){
                return (query ? allAuthors.filter( createFilterForAuthors(query) ) : allAuthors);
            }

            function loadAllAuthors() {
                ajax.get(dataFactory.services($scope.serviceData.id).get_authors, {},
                    function(response){
                        allAuthors = response.data;
                        searchAuthor(null);
                    }
                );
            }
            loadAllAuthors();

            function createFilterForAuthors(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(s) {
                    return (angular.lowercase(s.display_name).indexOf(lowercaseQuery) > -1);
                };
            }

            $scope.addAuthor = function(){
                if($scope.newAuthor.selectedItem) {
                    $scope.publishService2.authors.unshift($scope.newAuthor.selectedItem);
                    $scope.newAuthor.selectedItem = null;
                    $scope.newAuthor.searchText = null;
                    $scope.changedInput2();
                }
            };

            $scope.changedInput2 = function(){
                $scope.isDisabledSecondPage = ($scope.publishService2.authors.length > 0 ? false : true);
            };
            $scope.changedInput2();

            var deletedAuthors = [];
            $scope.deleteAuthor = function(index,id){
                if(id && deletedAuthors.indexOf(id) == -1) deletedAuthors.push(id);
                $scope.publishService2.authors.splice(index,1);
                $scope.changedInput2();
            };

            $scope.backPage = function(){
                $scope.currentPage--;
            };

            var deletedDocuments = [];
            $scope.finish = function(){
                var promises = [];
                var updateService = $scope.serviceData.__serviceData;
                updateService.title = $scope.publishService.name;
                updateService.description = $scope.publishService.description;
                updateService.serviceType = $scope.publishService.serviceType;
                updateService.published = true;
                ajax.update(dataFactory.services($scope.serviceData.id).update, updateService, function(response){
                    // specifications
                    if(!$scope.serviceData.specifications){
                        promises.push(saveSpecifications());
                    }else{
                        promises.push(updateSpecifications());
                    }

                    // tags
                    if($scope.publishService.tags && $scope.publishService.tags.length > 0) {
                        angular.forEach($scope.publishService.tags, function(tag) {
                            promises.push(updateTags(tag));
                        });
                    }
                    if(deletedTags.length > 0) {
                        angular.forEach(deletedTags, function(tag) {
                            promises.push(deleteTags(tag));
                        });
                    }

                    // authors
                    if($scope.publishService2.authors && $scope.publishService2.authors.length > 0) {
                        angular.forEach($scope.publishService2.authors, function(author) {
                            promises.push(updateAuthors(author));
                        });
                    }

                    if(deletedAuthors.length > 0) {
                        angular.forEach(deletedAuthors, function(author) {
                            promises.push(deleteAuthors(author));
                        });
                    }

                    // documents
                    if($scope.publishService2.documents && $scope.publishService2.documents.length > 0) {
                        angular.forEach($scope.publishService2.documents, function(doc) {
                            promises.push(uploadDocuments(doc));
                        });
                    }

                    if(deletedDocuments.length > 0) {
                        angular.forEach(deletedDocuments, function(doc) {
                            promises.push(deleteDocuments(doc));
                        });
                    }

                    $q.all(promises).then(function(response) {
                        toastModel.showToast('success', 'Publish service successfully created!');
                        window.location = location.origin+'/service-marketplace.php#/'+$scope.serviceData.id;
                    });
                });
            };

            function uploadDocuments(doc){
                if (doc.tags) {
                    doc.tags.push({tagName: $scope.serviceData.title + ' documents'});
                    angular.forEach(doc.tags, function(tag, index) {
                        if (!angular.isObject(tag)) {
                            doc.tags[index] = {tagName: tag};
                        };
                    });
                } else {
                    doc.tags = [{tagName: $scope.serviceData.title + ' documents'}];
                }
                return fileUpload.uploadFileToUrl(doc.file, {id : $scope.serviceData.id}, 'service-doc').then(function(response) {
                    return ajax.create(dataFactory.documentsUrl().save,
                        {
                            ownerId: $scope.$root.userData.accountId,
                            documentUrl: response.file.name,
                            documentName: doc.title + doc.type,
                            parentType: 'SERVICE',
                            parentId: $scope.serviceData.id,
                            docClass: 'SUPPORT',
                            tags: doc.tags,
                            accessLevel: 'MEMBER'
                        });
                    });
            }

            function deleteDocuments(docId){
                return ajax.delete(dataFactory.documentsUrl(docId).delete, {});
            }

            function deleteAuthors(author){
                return ajax.delete(dataFactory.services(author).remove_authors, {});
            }


            function updateAuthors(author){
                if(!author.serviceId){
                    return ajax.create(dataFactory.services().add_authors, {
                        'serviceId': $scope.serviceData.id,
                        'display_name': author.display_name,
                        'jobTitle': author.jobTitle,
                        'avatar': author.avatar,
                        'company': author.company
                    });
                }
            }

            function deleteTags(tag){
                return ajax.delete(dataFactory.services(tag).remove_tags, {});
            }

            function updateTags(tag){
                if(!tag.id) {
                    ajax.create(dataFactory.services().add_tags,{
                        serviceId : $scope.serviceData.id,
                        name : tag.name
                    },function(){});
                }
            }

            function saveSpecifications(){
                return ajax.create(dataFactory.services($scope.serviceData.id).add_specifications,{
                    'serviceId': $scope.serviceData.id,
                    'input': $scope.publishService.inputs,
                    'output': $scope.publishService.outputs,
                    'usageStats': {
                        'added': 0,
                        'members': 0
                    },
                    'runStats': {
                        'success': 0,
                        'fail': 0
                    },
                    'special': $scope.publishService.specifications
                });
            }

            function updateSpecifications(){
                return ajax.update(dataFactory.services($scope.serviceData.specifications.id).update_specifications,{
                    'input': $scope.publishService.inputs,
                    'output': $scope.publishService.outputs,
                    'special': $scope.publishService.specifications
                });
            }

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

        }
    ]
);
