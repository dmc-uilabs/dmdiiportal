angular.module('dmc.project')
    .controller('PublishServiceMarketplaceCtrl',[
        "$rootScope",
        "$scope",
        "$state",
        "$stateParams",
        "$mdDialog",
        "projectData",
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
                  $timeout,
                  ajax,
                  $http,
                  toastModel,
                  dataFactory) {
            var projectCtrl = this;
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;

            $scope.currentPage = 1;
            $scope.isDisabledFirstPage = true;
            $scope.isDisabledSecondPage = true;

            // First Page
            $scope.publishService = {
                name : null,
                description : null,
                inputs : null,
                outputs : null,
                specifications : [],
                tags : []
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

            $scope.deleteSpecification = function(index){
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

            $scope.deleteTag = function(index){
                $scope.publishService.tags.splice(index,1);
                $scope.changedInput();
            };

            $scope.changedInput = function(){
                var disabled = false;
                for(var item in $scope.publishService){
                    if($.type($scope.publishService[item]) == "array"){
                        if($scope.publishService[item].length == 0){
                            disabled = true;
                            break;
                        }
                    }else{
                        if(!$scope.publishService[item]){
                            disabled = true;
                            break;
                        }
                    }
                }
                $scope.isDisabledFirstPage = disabled;
            };

            $scope.nextPage = function(){
                $scope.currentPage++;
            };

            // Second Page

            $scope.publishService2 = {
                authors : [],
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
                var disabled = false;
                for(var item in $scope.publishService2){
                    if(item != "documents" && $scope.publishService2[item].length == 0){
                        disabled = true;
                        break;
                    }
                }
                $scope.isDisabledSecondPage = disabled;
            };

            $scope.deleteAuthor = function(index){
                $scope.publishService2.authors.splice(index,1);
            };

            $scope.backPage = function(){
                $scope.currentPage--;
            };

            $scope.finish = function(){
                var fd = new FormData();
                fd.append('name', $scope.publishService.name);
                fd.append('description', $scope.publishService.description);
                fd.append('inputs', $scope.publishService.inputs);
                fd.append('outputs', $scope.publishService.outputs);
                // tags
                for(var i in $scope.publishService.tags){
                    for(var key in $scope.publishService.tags[i]){
                        fd.append('tags['+i+']['+key+']', $scope.publishService.tags[i][key]);
                    }
                }
                // specifications
                for(var i in $scope.publishService.specifications){
                    for(var key in $scope.publishService.specifications[i]) {
                        fd.append('specifications[' + i + ']['+key+']', $scope.publishService.specifications[i][key]);
                    }
                }
                // documents
                for(var i in $scope.publishService2.documents){
                    fd.append('file[' + i + ']', $scope.publishService2.documents[i].file);
                }
                // authors
                for(var i in $scope.publishService2.authors) {
                    for(var key in $scope.publishService2.authors[i]) {
                        fd.append('author[' + i + ']['+key+']', $scope.publishService2.authors[i][key]);
                    }
                }
                $http.post(dataFactory.createPublishService(), fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function (data) {
                    toastModel.showToast("success", "Publish service successfully created!");
                    $state.go('project.publish-service-marketplace', $stateParams, {reload: true});
                }).error(function (data) {
                    toastModel.showToast("error", data.statusText);
                });
            };

            var apply = function(){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            };

        }
    ]
);