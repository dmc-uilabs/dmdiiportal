'use strict';
angular.module('rfpInvite', [
        'ngMaterial',
        'dmc.ajax',
        'dmc.data',
        'ngMdIcons',
        'dmc.widgets.documents',
        'dmc.compare'
    ]).directive('rfpTabs', ['$parse', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/rfp-invite/rfp-invite.html',
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
                $scope.goToNextTab = function(number){
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
                $scope.invitees = [{
                    id : 1,
                    name : "Wade Goodwin",
                    avatar : "/images/logo-wyiv.png",
                    company : "WYIV Co.",
                    rating : 3.8,
                    description : "Big Business, too expensive",
                    skills : ['skill', 'skill', 'skill'],
                    projects : {
                        total : 30,
                        completed : 20
                    },
                    memberFor : '2 years',
                    isCompare : false,
                    isInvite : true,
                    isShow : true
                },{
                    id : 2,
                    name : "Belinda Cole",
                    avatar : "/images/logo-rjc.png",
                    company : "RCJ Co.",
                    rating : 4.8,
                    description : "Big Business, low quality",
                    skills : ['skill', 'skill', 'skill', 'skill'],
                    projects : {
                        total : 45,
                        completed : 30
                    },
                    memberFor : '5 years',
                    isCompare : false,
                    isInvite : true,
                    isShow : true
                }];

            }
        };
    }])
    .directive('rfpTabOne', function () {
        return {
            templateUrl: 'templates/components/rfp-invite/rfp-tab-one.html',
            scope : {
              goToTab : '=',
              disableEnableTab : '='
            },
            controller: function ($scope) {
                $scope.$watch('form.$valid', function(current, old){
                    $scope.disableEnableTab(2,current);
                });
            }
        }
    })
    .directive('rfpTabTwo', function () {
        return {
            templateUrl: 'templates/components/rfp-invite/rfp-tab-two.html',
            scope : {
                goToTab : '=',
                disableEnableTab : '='
            },
            controller: function ($scope,$compile,ajax,dataFactory) {
                $scope.isSelected = false;
                $scope.services = [];
                $scope.sort = 'status';
                $scope.order = 'DESC';
                $scope.getServices = function(){
                    ajax.on(dataFactory.getUrlAllServices(null),{
                        sort : 0,
                        order : 0,
                        limit : 5,
                        offset : 20
                    },function(data){
                        $scope.services = data.result;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    },function(){
                        alert("Ajax faild: getServices");
                    });
                };
                $scope.getServices();

                $scope.changeItem = function(item){

                };

                $scope.onOrderChange = function(){

                };

                $(".tableServices").on("click",".table-line",function(ev){
                    var item = null;
                    var id = parseInt($(this).find(".idService").val());
                    for(var i in $scope.services) {
                        if ($scope.services[i].id === id) {
                            $scope.services[i].select = true;
                            item = $scope.services[i];
                            break;
                        }
                    }
                    for(var i in $scope.services){
                        if($scope.services[i].select && $scope.services[i].id !== item.id){
                            $scope.services[i].select = false;
                        }
                    }
                    $(this).parents(".tableServices").find(".opened").removeClass('opened');
                    $("#inputs-outputs").remove();
                    if(item.select) {
                        $scope.isSelected = true;
                        var tr = $(this);
                        tr.addClass('opened');
                        $($compile('<tr id="inputs-outputs" inputs-outputs total-outputs="'+item.specificationsData.output+'" total-inputs="'+item.specificationsData.input+'" service-name="\'' + item.title + '\'"></tr>')($scope)).insertAfter(this);
                    }else{
                        $scope.isSelected = false;
                    }
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                });

                $scope.selectModel = function(ev,item,select){

                };
            }
        }
    })
    .directive('rfpTabThree', function () {
        return {
            templateUrl: 'templates/components/rfp-invite/rfp-tab-three.html',
            scope : {
                goToTab : '=',
                disableEnableTab : '=',
                invitees : '='
            },
            controller: function ($scope) {
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

                $scope.foundMembers = [{
                    id : 1,
                    name : "Wade Goodwin",
                    avatar : "/images/logo-wyiv.png",
                    company : "WYIV Co.",
                    rating : 3.8,
                    description : "High Quality, World Class Electrical and Industrial Components",
                    skills : ['skill', 'skill', 'skill'],
                    projects : {
                        total : 30,
                        completed : 20
                    },
                    memberFor : '2 years',
                    isCompare : false,
                    isInvite : true,
                    isShow : true
                },{
                    id : 2,
                    name : "Belinda Cole",
                    avatar : "/images/logo-rjc.png",
                    company : "RCJ Co.",
                    rating : 4.8,
                    description : "Cost Effective Solutions for Industrial Needs",
                    skills : ['skill', 'skill', 'skill', 'skill'],
                    projects : {
                        total : 45,
                        completed : 30
                    },
                    memberFor : '5 years',
                    isCompare : false,
                    isInvite : true,
                    isShow : true
                },{
                    id : 3,
                    name : "Andrew Bailey",
                    avatar : "/images/logo-sam.png",
                    company : "SAM",
                    rating : 7.8,
                    description : "Privately owned custom design and manufacturing firm",
                    skills : ['electrical engineers', 'power engineers', 'material scientists'],
                    projects : {
                        total : 10,
                        completed : 8
                    },
                    memberFor : '1 year',
                    isCompare : false,
                    isInvite : false,
                    isShow : false
                },{
                    id : 4,
                    name : "Pete Copeland",
                    avatar : "/images/logo_mrscy.png",
                    company : "MRSCY Co.",
                    rating : 7.8,
                    description : "End-2-End Manufacturing and Services",
                    skills : ['skill'],
                    projects : {
                        total : 10,
                        completed : 8
                    },
                    memberFor : '1 year',
                    isCompare : false,
                    isInvite : false,
                    isShow : true
                },{
                    id : 5,
                    name : "Deanna Ferguson",
                    avatar : "/images/logo_gmm.png",
                    company : "GMM Co.",
                    rating : 7.8,
                    description : "Full Service Provider for Electrical Industry",
                    skills : ['skill'],
                    projects : {
                        total : 10,
                        completed : 8
                    },
                    memberFor : '1 year',
                    isCompare : false,
                    isInvite : false,
                    isShow : true
                },{
                    id : 6,
                    name : "Jeremy Ruiz",
                    avatar : "/images/logo_jng.png",
                    company : "JNG Co.",
                    rating : 7.8,
                    description : "Customer Centric Product Design and Fulfillment",
                    skills : ['skill'],
                    projects : {
                        total : 10,
                        completed : 8
                    },
                    memberFor : '1 year',
                    isCompare : false,
                    isInvite : false,
                    isShow : true
                },{
                    id : 7,
                    name : "Janet Chandler",
                    avatar : "/images/logo-lcz.png",
                    company : "LCZ Co.",
                    rating : 7.8,
                    description : "Transformer Product design",
                    skills : ['Power engineer'],
                    projects : {
                        total : 10,
                        completed : 8
                    },
                    memberFor : '1 year',
                    isCompare : false,
                    isInvite : false,
                    isShow : true
                }];

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
    .directive('rfpTabFour', function () {
        return {
            templateUrl: 'templates/components/rfp-invite/rfp-tab-four.html',
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
    .directive('dmcSelectedInvitees', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/components/rfp-invite/selected-invitees-tpl.html',
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
            templateUrl: 'templates/components/rfp-invite/member-card-tpl.html',
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



