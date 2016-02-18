'use strict';
angular.module('dmc.view-all')
    .controller('ViewAllInvitationsController', [
        '$scope',
        '$stateParams',
        '$state',
        '$location',
        'ajax',
        'previousPage',
        'dataFactory',
        'DMCUserModel',
        'toastModel',
        function (  $scope,
                    $stateParams,
                    $state,
                    $location,
                    ajax,
                    previousPage,
                    dataFactory,
                    DMCUserModel,
                    toastModel) {

        	$("title").text("View All Invitations");

        	$scope.userData = DMCUserModel.getUserData();
        	$scope.invitations = []


        	var getProject = function(invitation){
        		ajax.get(dataFactory.getProject(invitation.projectId),{},
        			function(response){
        				invitation["projectTitle"] = response.data.title;
        			}
        		);
        	}

        	var getProfile = function(invitation){
        		ajax.get(dataFactory.profiles(invitation.profileId).get,{},
        			function(response){
        				invitation["profileImage"] = response.data.image;
        			}
        		);
        	}
        	ajax.get(dataFactory.getMembersToProject(), 
	            {
	                "profileId" : $scope.userData.profileId,
	                "accept" : false,
	            }, 
	            function(response){
	            	$scope.invitations = response.data;
	            	for(var i in $scope.invitations){
	            		$scope.invitations[i].date = moment($scope.invitations[i].date).format('MM/DD/YYYY, hh:mm A');
	            		getProfile($scope.invitations[i]);
	            		getProject($scope.invitations[i]);
	            	}

	            }
	        );

			$scope.accept = function(index){
                ajax.get(dataFactory.getMembersToProjectById($scope.invitations[index].id),{},
                    function(response){
                        response.data.accept = true;
                        ajax.update(dataFactory.updateMembersToProject($scope.invitations[index].id),
                            response.data,
                            function(response){
                                toastModel.showToast("success", "You have accepted the invitation from " + $scope.invitations[index].from);
                                $scope.invitations.splice(index, 1);
                            }
                        );
                    }
                )
	            
			}
			$scope.decline = function(index){
	            ajax.delete(dataFactory.removeMembersToProject($scope.invitations[index].id),
	               	{},
	                function(response){
	                	toastModel.showToast("success", "You have declined the invitation from " + $scope.invitations[index].from);
	                	$scope.invitations.splice(index, 1);
	                }
	            );
			}

        }
    ]);