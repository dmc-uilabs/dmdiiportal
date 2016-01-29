'use strict';

angular.module('dmc.community')
    .controller(
        'HomeCommunityCtr', [
            '$stateParams', '$state', "$scope", "ajax", "$location","dataFactory","toastModel", "$mdDialog",
            function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel, $mdDialog) {

                $scope.peoples = [
                    {
                        id : 1,
                        name : "People"
                    },{
                        id : 2,
                        name : "Organizations"
                    },{
                        id : 3,
                        name : "Discussions"
                    }
                ];

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
                            // locals: {
                            //     products: $scope.allServices
                            // },
                            clickOutsideToClose:true
                        })
                        .then(function() {
                        }, function() {
                        });
                }
            }
        ]
    )
    .controller(
        "ComposeDiscussionController", [
            '$scope', 'ajax', 'dataFactory', '$mdDialog', "$mdToast", "toastModel",  
            function ($scope, ajax, dataFactory, $mdDialog, $mdToast, toastModel) {
                
                $scope.NewDiscussion = {
                    subject: "",
                    tags: [
                        "Metal", 
                        "Dashboard",
                        "Dashboard",
                        "Metal", 
                        "Dashboard", 
                        "Dashboard",
                        "Metal", 
                        "Dashboard", 
                        "Dashboard"
                    ],
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio."
                }


                $scope.cancel = function(){
                    $scope.NewDiscussion = {
                        subject: "",
                        tags: [],
                        message: ""
                    }
                }

                $scope.addTag = function(inputTag){
                    if(!inputTag)return;
                    $scope.NewDiscussion.tags.push(inputTag);
                    this.inputTag = null;
                }

                //remove tag
                $scope.deleteTag = function(index){
                    $scope.NewDiscussion.tags.splice(index,1);
                }

                $scope.save = function(message, subject){    
                ajax.on(dataFactory.getLastDiscussionId(), {
                    "_limit" : 1,
                    "_order" : "DESC",
                    "_sort" : "id"
                }, function(data){
                    var lastId = (data.length == 0 ? 1 : parseInt(data[0].id)+1);
                    
                    ajax.on(
                        dataFactory.addDiscussion(),
                        {
                            "id": lastId,
                            "title": $scope.NewDiscussion.subject,
                            "comments": { 
                                            "link": "/individual-discussion/" + lastId + "/individual-discussion-comment",
                                            "totalItems": 0
                                          }
                        },
                        function(data){
                            toastModel.showToast("success", "Discussion created");
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },
                        function(){
                            toastModel.showToast("error", "Fail add discussion");
                        }, "POST"
                    );
                }, function(){
                    toastModel.showToast("error", "Unable get last id");
                },"GET");

                    $mdDialog.hide();
                }
            }       
        ]
    );