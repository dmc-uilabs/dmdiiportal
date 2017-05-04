angular.module('dmc.project')
.controller('projectServicesDetailCtrl', ['serviceData', 'serviceModel', '$scope', '$stateParams', 'projectData', 'ajax', 'dataFactory', '$state', '$mdDialog',
	function (serviceData, serviceModel ,$scope, $stateParams, projectData, ajax, dataFactory, $state, $mdDialog) {

	$scope.projectData = projectData;
	$scope.service = serviceData;
	$scope.followFlag = false;
    $scope.selectedTab = 0;

	$scope.history = {
		leftColumn: {
			title: 'Project',
			viewAllLink: '',
			list:[]
		},
		rightColumn: {
			title: 'Marketplace',
			viewAllLink: '',
			list:[]
		}
	}

    serviceModel.get_service_hystory(
        {
            'period': 'today',
            'section': 'project'
        },
        function(data){
            for(var i in data){
                data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
                switch(data[i].type){
                    case 'completed':
                    case 'successful_runs':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'added':
                        data[i].icon = 'images/ic_group_add_black_24px.svg';
                        break;
                    case 'rated':
                        data[i].icon = 'images/ic_star_black_24px.svg';
                        break;
                    case 'worked':
                        data[i].icon = 'images/icon_project.svg';
                        break;
                    case 'favorited':
                        data[i].icon = 'images/ic_favorite_black_24px.svg';
                        break;
                    case 'shared':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'discussion':
                        data[i].icon = 'images/ic_forum_black_24px.svg';
                        break;
                    case 'edited':
                        data[i].icon = 'images/ic_create_black_24px.svg';
                        break;
                    case 'unavailable_runs':
                        data[i].icon = 'images/ic_block_black_24px.svg';
                        break;
                    case 'incomplete_runs':
                        data[i].icon = 'images/ic_file_download_black_24px.svg';
                        break;
                }
            }
            $scope.history.leftColumn.list = data;
        }
    );
    serviceModel.get_service_hystory(
        {
            'period': 'today',
            'section': 'marketplace'
        },
        function(data){
            for(var i in data){
                data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
                switch(data[i].type){
                    case 'completed':
                    case 'successful_runs':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'added':
                        data[i].icon = 'images/ic_group_add_black_24px.svg';
                        break;
                    case 'rated':
                        data[i].icon = 'images/ic_star_black_24px.svg';
                        break;
                    case 'worked':
                        data[i].icon = 'images/icon_project.svg';
                        break;
                    case 'favorited':
                        data[i].icon = 'images/ic_favorite_black_24px.svg';
                        break;
                    case 'shared':
                        data[i].icon = 'images/ic_done_all_black_24px.svg';
                        break;
                    case 'discussion':
                        data[i].icon = 'images/ic_forum_black_24px.svg';
                        break;
                    case 'edited':
                        data[i].icon = 'images/ic_create_black_24px.svg';
                        break;
                    case 'unavailable_runs':
                        data[i].icon = 'images/ic_block_black_24px.svg';
                        break;
                    case 'incomplete_runs':
                        data[i].icon = 'images/ic_file_download_black_24px.svg';
                        break;
                }
            }
            $scope.history.rightColumn.list = data;
        }
    );

	if (!angular.isDefined($scope.service.ownerName)) {
		ajax.get(dataFactory.userAccount($scope.service.owner).get, {}, function(response) {
			$scope.service.ownerName = response.data.displayName;
		});
	}

    $scope.getHistory = function(type, time){
        var period = '';
        var params = {'section': 'project'};
        if(time == 'today'){
            period = 'today';
        }else if (time == 'week'){
            period = ['today','week'];
        }else{
            period = ['today','week','all'];
        };

        params['period'] = period;

        if(type != 'runs_by_users'){
            params['type'] = type;
        };

        serviceModel.get_service_hystory(
            params,
            function(data){
                for(var i in data){
                    data[i].date = moment(data[i].date).format('MM/DD/YYYY hh:mm A');
                    if(data[i].type == 'successful_runs'){
                        data[i].icon = 'done_all';
                    }else if(data[i].type == 'unavailable_runs'){
                        data[i].icon = 'block';
                    }else if(data[i].type == 'incomplete_runs'){
                        data[i].icon = 'file_upload';
                    };
                }
                $scope.history.leftColumn.list = data;
                $scope.selectedTab = 1;
                apply();
            }
        );
    }

    $scope.share = function(ev){
      $mdDialog.show({
          controller: 'ShareProductCtrl',
          templateUrl: 'templates/components/product-card/share-product.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
              serviceId : $stateParams.ServiceId
          }
      }).then(function() {
      }, function() {
      });
  };

    var apply = function(){
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
    };


	$scope.delete = function(){
    var deleteServiceItem = $.extend(true, {}, $scope.service.__serviceData);
    deleteServiceItem.projectId = 0;
    deleteServiceItem.currentStatus = {};
    ajax.update(dataFactory.services($scope.service.id).update, deleteServiceItem,
                    function(response){
                        $state.go('project.services')
                    }
                );
	}

	$scope.follow = function(){
		$scope.followFlag = !$scope.followFlag;
	}

	//Search products
	$scope.search = function(text){
		window.location.href = '/marketplace.php#/search/services?text=' + text;
	}

	$scope.getDocuments = function() {

		// ajax.get(dataFactory.documentsUrl().getList, {parentType: 'SERVICE',
		//     																					parentId: $scope.service.parent ? $scope.service.parent : $scope.service.id,
		//     																					docClass: 'IMAGE',
		//     																					recent: 5},
		// 		function(response){
		// 			$scope.service.service_images = response.data.data;
		// 		}
		// 	);

		ajax.get(dataFactory.documentsUrl().getList, {parentType: 'SERVICE',
		    																					parentId: $scope.service.parent ? $scope.service.parent : $scope.service.id,
		    																					docClass: 'SUPPORT',
		    																					recent: 5},
				function(response){
					$scope.service.service_docs = response.data.data;
				}
			);


	}

}])
