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

	$scope.runHistory = [
		{
			runDate: '10/15/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Success',
		},
		{
			runDate: '12/15/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '12:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '12:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '09:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '09:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/09/2015',
			runTimeService: '09:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:22 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:35 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:35 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:35 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:35 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
		{
			runDate: '10/19/2015',
			runTimeService: '11:35 AM',
			runBy: 'Forge Admin',
			runTime: 3.0,
			results: 'Fail',
		},
		{
			runDate: '12/10/2015',
			runTimeService: '11:35 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Success',
		},
		{
			runDate: '12/11/2015',
			runTimeService: '11:35 AM',
			runBy: 'Forge Admin',
			runTime: 2.9,
			results: 'Fail',
		},
	];

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
}])
