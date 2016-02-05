angular.module('dmc.project')
.controller('PublishServiceMarketplaceCtrl',
    function ($rootScope,$scope, $stateParams,$mdDialog, projectData, $timeout) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $scope.publishService = {
            name : null,
            description : null,
            inputs : null,
            outputs : null,
            specifications : [],
            tags : []
        };

        $scope.publishService2 = {
            authors : []
        };

        $scope.isDisabledFirstPage = true;
        $scope.currentPage = 2;

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
                return (s.value.indexOf(lowercaseQuery) === 0);
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

    });