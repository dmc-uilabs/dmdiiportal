'use strict';
angular.module('dmc.component.members-card', [
		'dmc.widgets.stars',
])
.directive('dmcMembersCard', function(){
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {
			cardSource: '=',
		},
		templateUrl: 'templates/components/members-card/members-card.html',
		controller: function($scope, $mdDialog){
            $scope.showMembers = function(id, ev){
                console.info('index', id);
                $(window).scrollTop();
                  $mdDialog.show({
                      controller: "showMembers",
                      templateUrl: "templates/components/members-card/show-members.html",
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      locals: {
                          "id" : id
                      }
                  }).then(function() {
                      $(window).scrollTop();
                  }, function() {
                      $(window).scrollTop();
                  });
            }
		}
	}
})
.directive('dmcAddMembersCard', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/components/members-card/add-members-card.html',
        scope:{
            compareMember: '=',
            cardSource: '=',
            inviteMember: '=',
            favoriteMember: '='
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

            $scope.addToFavorite = function(){
                $scope.favoriteMember($scope.cardSource);
                $scope.cardSource.favorite = ($scope.cardSource.favorite ? false : true);
            };

        }
    }
})
.controller('showMembers', ['ajax', 'dataFactory', '$scope', '$mdDialog', 'id', function(ajax, dataFactory, $scope, $mdDialog, id){
    console.info('showMembers', id);
    $scope.profile = [];
    
    $scope.history = {
        leftColumn: {
            title: "Public",
            viewAllLink: "/all.php#/history/profile/"+id+"/public",
            list: []
        },
        rightColumn: {
            title: "Mutual",
            viewAllLink: "/all.php#/history/profile/"+id+"/mutual",
            list:[]
        }
    }

    // get profile history
    ajax.get(dataFactory.profiles(id).history, 
        {
            "_limit": 3,
            "section": "public"
        }, 
        function(response){
            var data = response.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.leftColumn.list = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
    );

    // get Profile history
    ajax.get(dataFactory.profiles(id).history, 
        {
            "_limit": 3,
            "section": "mutual"
        }, 
        function(response){
            var data = response.data;
            for(var i in data){
                data[i].date = moment(data[i].date).format("MM/DD/YYYY h:mm A");
                switch(data[i].type){
                    case "completed":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;
                    case "added":
                        data[i].icon = "images/ic_group_add_black_24px.svg";
                        break;
                    case "rated":
                        data[i].icon = "images/ic_star_black_24px.svg";
                        break;
                    case "worked":
                        data[i].icon = "images/icon_project.svg";
                        break;  
                    case "favorited":
                        data[i].icon = "images/ic_favorite_black_24px.svg";
                        break;   
                    case "shared":
                        data[i].icon = "images/ic_done_all_black_24px.svg";
                        break;   
                    case "discussion":
                        data[i].icon = "images/ic_forum_black_24px.svg";
                        break;                                  
                }
            }
            $scope.history.rightColumn.list = data;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
    );

    ajax.get(dataFactory.profiles(id).get,{},function(response){
        var profile = response.data;
        $scope.profile = profile;
    })
    $scope.cancel = function(){
        $mdDialog.hide();
    }

}]).controller('showCompany', ['ajax', 'dataFactory', '$scope', '$mdDialog', 'id', function(ajax, dataFactory, $scope, $mdDialog, id){
        console.info('showCompany', id);
        $scope.company = [];

        ajax.get(dataFactory.companyURL(id).get,{},function(response){
            var company = response.data;
            $scope.company = company;
        });

        $scope.cancel = function(){
            $mdDialog.hide();
        }

    }])
    .directive('shareMembersCard', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/components/members-card/share-members-card.html',
            scope:{
                cardSource: '=',
                favoriteMember: '=',
                share: '='
            },
            controller: function ($scope) {
            }
        }
    });
