angular.module('dmc.project')
    .controller('PublishServiceMarketplaceCtrl',[
        "$rootScope",
        "$scope",
        "$state",
        "$stateParams",
        "$mdDialog",
        "projectData",
        "serviceData",
        "$timeout",
        "ajax",
        "$http",
        "toastModel",
        "dataFactory",
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
                  toastModel,
                  dataFactory) {
            var projectCtrl = this;
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;

            $scope.serviceData = serviceData;
            $scope.currentPage = 1;
            $scope.isDisabledFirstPage = true;
            $scope.isDisabledSecondPage = true;

            // First Page
            $scope.publishService = {
                name : $scope.serviceData.title,
                description : $scope.serviceData.description,
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
                $scope.isDisabledFirstPage = ($scope.publishService.name && $scope.publishService.description ? false : true);
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
                ajax.get(dataFactory.getAuthors(),{},
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
                // documents
                //for(var i in $scope.publishService2.documents){
                //    fd.append('file[' + i + ']', $scope.publishService2.documents[i].file);
                //}
                ajax.update(dataFactory.services($scope.serviceData.id).update,{
                    title : $scope.publishService.name,
                    description : $scope.publishService.description,
                    published: true
                },function(response){

                    // specifications
                    if(!$scope.serviceData.specifications){
                        saveSpecifications();
                    }else{
                        updateSpecifications();
                    }

                    // tags
                    if($scope.publishService.tags && $scope.publishService.tags.length > 0) updateTags();
                    if(deletedTags.length > 0) deleteTags();

                    // authors
                    if($scope.publishService2.authors && $scope.publishService2.authors.length > 0) updateAuthors();
                    if(deletedAuthors.length > 0) deleteAuthors();

                    // documents
                    if($scope.publishService2.documents && $scope.publishService2.documents.length > 0) updateDocuments();
                    if(deletedDocuments.length > 0) deleteDocuments();
                    toastModel.showToast("success", "Publish service successfully created!");
                    window.location = location.origin+'/service-marketplace.php#/'+$scope.serviceData.id;
                });
            };

            function updateDocuments(){
                console.log($scope.publishService2.documents);
            }

            function deleteDocuments(){
                console.log(deletedDocuments);
            }

            function deleteAuthors(){
                for(var i in deletedAuthors){
                    ajax.delete(dataFactory.services(deletedAuthors[i]).remove_authors, {}, function () {});
                }
            }

            function updateAuthors(){
                for(var i in $scope.publishService2.authors){
                    if(!$scope.publishService2.authors[i].serviceId){
                        ajax.create(dataFactory.services().add_authors, {
                            "serviceId": $scope.serviceData.id,
                            "display_name": $scope.publishService2.authors[i].display_name,
                            "jobTitle": $scope.publishService2.authors[i].jobTitle,
                            "avatar": $scope.publishService2.authors[i].avatar,
                            "company": $scope.publishService2.authors[i].company
                        }, function () {});
                    }
                }
            }

            function deleteTags(){
                for(var i in deletedTags){
                    ajax.delete(dataFactory.services(deletedTags[i]).remove_tags, {}, function () {});
                }
            }

            function updateTags(){
                for(var i in $scope.publishService.tags){
                    if(!$scope.publishService.tags[i].id) {
                        ajax.create(dataFactory.services().add_tags,{
                            serviceId : $scope.serviceData.id,
                            name : $scope.publishService.tags[i].name
                        },function(){});
                    }
                }
            }

            function saveSpecifications(){
                ajax.create(dataFactory.services().add_specifications,{
                    "serviceId": $scope.serviceData.id,
                    "input": $scope.publishService.inputs,
                    "output": $scope.publishService.outputs,
                    "usageStats": {
                        "added": 0,
                        "members": 0
                    },
                    "runStats": {
                        "success": 0,
                        "fail": 0
                    },
                    "special": $scope.publishService.specifications
                },function(response){});
            }

            function updateSpecifications(){
                ajax.update(dataFactory.services($scope.serviceData.specifications.id).update_specifications,{
                    "input": $scope.publishService.inputs,
                    "output": $scope.publishService.outputs,
                    "special": $scope.publishService.specifications
                },function(response){});
            }

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

        }
    ]
);