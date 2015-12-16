'use strict';
angular.module('dmc.add_members', [
  'dmc.configs.ngmaterial',
  'ngMdIcons',
  'ngtimeago',
  'ui.router',
  'dmc.ajax',
  'dmc.data',
  'dmc.rfpInvite',
  'dmc.widgets.documents',
  'dmc.compare',
  'dmc.common.header',
  'dmc.common.footer',
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
    $stateProvider.state('product', {
      url: '/',
      templateUrl: 'templates/add_members/add-members.html',
      controller: 'AddMembersController'
    });
    $urlRouterProvider.otherwise('/');
  })
  .controller('AddMembersController', function ($scope) {
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
    $scope.invitees = [];

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

    $scope.foundMembers = [
    {
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
    }
    ];

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
  })