'use strict';
angular.module('dmc.add_project.directive', [
        'ngMaterial',
        'dmc.ajax',
        'dmc.data',
        'dmc.model.project',
        'dmc.model.member',
        'ngMdIcons',
        'dmc.widgets.documents',
        'dmc.compare'
    ]).directive('addProjectTabs', ['$parse', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/ap-index.html',
            scope: {
                columns: "=",
                widgetTitle: "=",
                widgetStyle: "=",
                projectId: "="
            },
            controller: function ($scope) {
                // Specify a list of font-icons with ligatures and color overrides
                var iconData = [
                    {name: 'accessibility', color: "#777"},
                    {name: 'question_answer', color: "rgb(89, 226, 168)"}
                ];
                $scope.fonts = [].concat(iconData);
                // Create a set of sizes...
                $scope.sizes = [
                    {size: "md-18", padding: 0}
                ];

                $scope.data = {
                    secondLocked : true,
                    thirdLocked : true,
                    fourthLocked : true
                };
                $scope.selectedIndex = 0;
                var newProject = {}
                var setProjectDetails = function(data) {
                    newProject = $.extend(true, newProject, data);
                }
                $scope.createNewProject = function(data) {

                }
                $scope.goToNextTab = function(number, obj){
                    if (obj) {
                        setProjectDetails(obj);
                    }
                    $scope.selectedIndex = number-1;
                    if(number == 2){
                        $scope.data.thirdLocked = false;
                    }else if(number == 3){
                        $scope.data.fourthLocked = false;
                    }
                };

                $scope.disableEnable = function(number,val){
                    var v = (val ? false : true);
                    switch(number){
                        case 2 :
                            $scope.data.secondLocked = v;
                            break;
                        case 3 :
                            $scope.data.thirdLocked = v;
                            break;
                        case 4 :
                            $scope.data.fourthLocked = v;
                            break;
                    }
                };

                $("md-tabs").on("click","md-tab-item",function(){
                    $scope.enableNext($(this).index()+2);
                });

                $scope.enableNext = function(number){
                    switch(number){
                        case 3 :
                            $scope.data.thirdLocked = false;
                            break;
                        case 4 :
                            $scope.data.fourthLocked = false;
                            break;
                    }
                };

                // Invitees
                $scope.subject = "Pat has invited you to join the project.";
                $scope.message = "We seek a power transformer with improved heat losses relative to a standard iron core transformer. Cost and time to delivery are also critical. The attached documents give detailed specs and the attached Evaluator Service encompasses how we will value the trade-offs among heat loss, cost, and delivery time.";
                $scope.invitees = [];
                // $scope.invitees = [{
                //     id : 1,
                //     name : "Wade Goodwin",
                //     avatar : "/images/logo-wyiv.png",
                //     company : "WYIV Co.",
                //     rating : 3.8,
                //     description : "Big Business, too expensive",
                //     skills : ['skill', 'skill', 'skill'],
                //     projects : {
                //         total : 30,
                //         completed : 20
                //     },
                //     memberFor : '2 years',
                //     isCompare : false,
                //     isInvite : true,
                //     isShow : true
                // },{
                //     id : 2,
                //     name : "Belinda Cole",
                //     avatar : "/images/logo-rjc.png",
                //     company : "RCJ Co.",
                //     rating : 4.8,
                //     description : "Big Business, low quality",
                //     skills : ['skill', 'skill', 'skill', 'skill'],
                //     projects : {
                //         total : 45,
                //         completed : 30
                //     },
                //     memberFor : '5 years',
                //     isCompare : false,
                //     isInvite : true,
                //     isShow : true
                // }];

            }
        };
    }])
    .directive('apTabOne', function () {
        return {
            templateUrl: 'templates/components/add-project/ap-tab-one.html',
            scope : {
              goToTab : '=',
              disableEnableTab : '=',
              // user input is save on this object
              projectDetails: '='
            },
            controller: function ($scope) {
                $scope.$watch('form.$valid', function(current, old){
                    $scope.disableEnableTab(2,current);
                });
            }
        }
    })
    .directive('apTabTwo', function (DMCMemberModel) {
        return {
            templateUrl: 'templates/components/add-project/ap-tab-two.html',
            scope : {
                goToTab : '=',
                disableEnableTab : '=',
                invitees : '=',
                submitProjectDetails: '=',
                projectDetails: '='
            },
            controller: function ($scope) {

                DMCMemberModel.getMembers().then(
                    function(data){
                         $scope.foundMembers = data;
                    },
                    function(data){

                    }
                )

                $scope.compare = [];

                $scope.members = [];
                $scope.members.push({
                    val : 1,
                    name : 'Member 1'
                });
                $scope.members.push({
                    val : 2,
                    name : 'Member 2'
                });

                $scope.$watchCollection('invitees',function(newArray,oldArray){
                    for(var i in $scope.foundMembers){
                        var found = false;
                        for(var j in newArray){
                            if($scope.foundMembers[i].id == newArray[j].id){
                                found = true;
                                break;
                            }
                        }
                        $scope.foundMembers[i].isInvite = found;
                    }
                });

                $scope.$watchCollection('compare',function(newArray,oldArray){
                    for(var i in $scope.foundMembers){
                        var found = false;
                        for(var j in newArray){
                            if($scope.foundMembers[i].id == newArray[j].id){
                                found = true;
                                break;
                            }
                        }
                        $scope.foundMembers[i].isCompare = found;
                    }
                });

                $scope.compareMember = function(item){
                    var found = false;
                    for(var i in $scope.compare){
                        if($scope.compare[i].id === item.id) {
                            $scope.compare.splice(i, 1);
                            found = true;
                            break;
                        }
                    }
                    if(!found) $scope.compare.push(item);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                var prevMember;
                var getRandomMember = function(notUse){
                    var min = 1;
                    var max = 7;
                    var random;
                    while((random = Math.floor(Math.random() * (max - min + 1)) + min) == notUse || random == prevMember){
                        random = Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                    return random;
                };

                $scope.searchMembers = function(){
                    if($scope.searchText && $scope.searchText.trim().length > 0){
                        for(var i in $scope.foundMembers){
                            $scope.foundMembers[i].isShow = ($scope.foundMembers[i].id == 3 ? true : false);
                            $scope.foundMembers[i].isCompare = false;
                            $scope.compare = [];
                        }
                        var second = 7;
                        for(var i in $scope.foundMembers){
                            if($scope.foundMembers[i].id == second) {
                                $scope.foundMembers[i].isShow = true;
                                // $scope.foundMembers[i].isCompare = false;
                                // $scope.compareMember($scope.foundMembers[i]);
                                break;
                            }
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }else{
                        for(var i in $scope.foundMembers){
                            $scope.foundMembers[i].isShow = ($scope.foundMembers[i].id == 3 ? false : true);
                            $scope.compare = [];
                            $scope.foundMembers[i].isCompare = false;
                        }
                    }
                };

                // $scope.foundMembers = [{
                //     id : 1,
                //     name : "Wade Goodwin",
                //     avatar : "/images/logo-wyiv.png",
                //     company : "WYIV Co.",
                //     rating : 3.8,
                //     description : "High Quality, World Class Electrical and Industrial Components",
                //     skills : ['skill', 'skill', 'skill'],
                //     projects : {
                //         total : 30,
                //         completed : 20
                //     },
                //     memberFor : '2 years',
                //     isCompare : false,
                //     isInvite : true,
                //     isShow : true
                // },{
                //     id : 2,
                //     name : "Belinda Cole",
                //     avatar : "/images/logo-rjc.png",
                //     company : "RCJ Co.",
                //     rating : 4.8,
                //     description : "Cost Effective Solutions for Industrial Needs",
                //     skills : ['skill', 'skill', 'skill', 'skill'],
                //     projects : {
                //         total : 45,
                //         completed : 30
                //     },
                //     memberFor : '5 years',
                //     isCompare : false,
                //     isInvite : true,
                //     isShow : true
                // },{
                //     id : 3,
                //     name : "Andrew Bailey",
                //     avatar : "/images/logo-sam.png",
                //     company : "SAM",
                //     rating : 7.8,
                //     description : "Privately owned custom design and manufacturing firm",
                //     skills : ['electrical engineers', 'power engineers', 'material scientists'],
                //     projects : {
                //         total : 10,
                //         completed : 8
                //     },
                //     memberFor : '1 year',
                //     isCompare : false,
                //     isInvite : false,
                //     isShow : false
                // },{
                //     id : 4,
                //     name : "Pete Copeland",
                //     avatar : "/images/logo_mrscy.png",
                //     company : "MRSCY Co.",
                //     rating : 7.8,
                //     description : "End-2-End Manufacturing and Services",
                //     skills : ['skill'],
                //     projects : {
                //         total : 10,
                //         completed : 8
                //     },
                //     memberFor : '1 year',
                //     isCompare : false,
                //     isInvite : false,
                //     isShow : true
                // },{
                //     id : 5,
                //     name : "Deanna Ferguson",
                //     avatar : "/images/logo_gmm.png",
                //     company : "GMM Co.",
                //     rating : 7.8,
                //     description : "Full Service Provider for Electrical Industry",
                //     skills : ['skill'],
                //     projects : {
                //         total : 10,
                //         completed : 8
                //     },
                //     memberFor : '1 year',
                //     isCompare : false,
                //     isInvite : false,
                //     isShow : true
                // },{
                //     id : 6,
                //     name : "Jeremy Ruiz",
                //     avatar : "/images/logo_jng.png",
                //     company : "JNG Co.",
                //     rating : 7.8,
                //     description : "Customer Centric Product Design and Fulfillment",
                //     skills : ['skill'],
                //     projects : {
                //         total : 10,
                //         completed : 8
                //     },
                //     memberFor : '1 year',
                //     isCompare : false,
                //     isInvite : false,
                //     isShow : true
                // },{
                //     id : 7,
                //     name : "Janet Chandler",
                //     avatar : "/images/logo-lcz.png",
                //     company : "LCZ Co.",
                //     rating : 7.8,
                //     description : "Transformer Product design",
                //     skills : ['Power engineer'],
                //     projects : {
                //         total : 10,
                //         completed : 8
                //     },
                //     memberFor : '1 year',
                //     isCompare : false,
                //     isInvite : false,
                //     isShow : true
                // }];

                $scope.addToInvitation = function(item){
                    var found = false;
                    for(var i in $scope.invitees){
                        if($scope.invitees[i].id === item.id) {
                            $scope.invitees.splice(i, 1);
                            found = true;
                            break;
                        }
                    }
                    if(!found) $scope.invitees.push(item);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        }
    })
    .directive('apTabThree', function () {
        return {
            templateUrl: 'templates/components/add-project/ap-tab-three.html',
            scope : {
                goToTab : '=',
                disableEnableTab : '=',
                invitees : '=',
                subject: '=',
                message: '='
            },
            controller: function ($scope) {
                $scope.$watchCollection(
                    "invitees",
                    function( newValue, oldValue ) {

                    }
                );
            }
        }
    })
    .directive('inputsOutputs', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/inputs-outputs-tpl.html',
            scope : {
                serviceName: '=',
                totalInputs: '=',
                totalOutputs: '='
            },
            controller: function ($scope) {
                $scope.inputs = new Array($scope.totalInputs);
                $scope.outputs = new Array($scope.totalOutputs);
            }
        }
    }).directive('dmcSelectedInvitees', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/selected-invitees-tpl.html',
            scope:{
                invitees: '='
            },
            controller: function ($scope) {

                $scope.removeInvite = function(item){
                    for(var i in $scope.invitees){
                        if($scope.invitees[i].id === item.id){
                            $scope.invitees.splice(i,1);
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                            break;
                        }
                    }
                };



                $scope.clear = function(){
                    $scope.invitees = [];
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        }
    }).directive('dmcMemberCard', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/add-project/member-card-tpl.html',
            scope:{
                compareMember: '=',
                cardSource: '=',
                inviteMember: '='
            },
            controller: function ($scope) {
                $scope.addToInvitation = function(){
                    $scope.inviteMember($scope.cardSource);
                    $scope.cardSource.isInvite = ($scope.cardSource.isInvite ? false : true);
                };

                $scope.addToCompare = function(){
                    $scope.compareMember($scope.cardSource);
                    $scope.cardSource.isCompare = ($scope.cardSource.isCompare ? false : true);
                };
            }
        }
    });

