'use strict';

angular.module('dmc.community')
    .controller(
        'HomeCommunityCtr', [
            '$stateParams', '$state', "$scope", "ajax", "$location","dataFactory","toastModel", "$mdDialog",
            function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel, $mdDialog) {

                var getNews= function() {
                    ajax.get(dataFactory.getStaticJSON('news.json'), {}, function(response){
                        $scope.news = response.data;
                    });
                }
                getNews();

                $scope.searchTypes = [
                    {
                        id : 1,
                        name : "Members",
                        tag : "members"
                    },{
                        id : 2,
                        name : "Companies",
                        tag : "companies"
                    },{
                        id : 3,
                        name : "Discussions",
                        tag : "discussions"
                    }
                ];

                $scope.searchTypeModel = null;

                $scope.selectItemDropDown = function(){
                    var item = null;
                    var index = -1;
                    for(var p in $scope.peoples){
                        if($scope.peoples[p].id == $scope.peopleModel){
                            item = $scope.peoples[p];
                            index = p;
                            break;
                        }
                    }
                    if(item && index >= 0) {
                        $scope.peoples.splice(index, 1);
                        $scope.peoples = $scope.peoples.sort(function (a, b) {
                            return a.id - b.id
                        });
                        $scope.peoples.unshift(item);
                    }
                };


                $scope.createDiscussion = function(ev){
                    $(window).scrollTop(0);
                        $mdDialog.show({
                            controller: "ComposeDiscussionController",
                            templateUrl: "templates/individual-discussion/compose-discussion.html",
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                 project_id: null
                            },
                            clickOutsideToClose:true
                        })
                        .then(function() {
                        }, function() {
                        });
                }

                $scope.selectItemDropDown = function(type){
                    $scope.searchTypeModel = type;
                };

                $scope.submit = function(){
                    var link = "search.php#/";
                    link += ($scope.searchTypeModel ? $scope.searchTypeModel : "all");
                    if($scope.searchModel) link += "?text="+decodeURIComponent($scope.searchModel);
                    document.location.href = link;
                };
            }
        ]
    );
