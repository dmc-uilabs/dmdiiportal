angular.module('dmc.onboarding')
.controller('StorefrontController', 
	['$scope', '$rootScope', '$state', 'ajax', 'dataFactory', 'fileUpload',
	function ($scope, $rootScope, $state, ajax, dataFactory, fileUpload) {
		if($state.current.name == "onboarding.storefront"){
			$state.go($scope.storefront[0].state);
		}
        $scope.activePage = $state;

        $scope.file = null;

//upload file
        $scope.prevPicture = null;
        $scope.pictureDragEnter = function(flow){
            $scope.prevPicture = flow.files[0];
            flow.files = [];
        };

        $scope.pictureDragLeave = function(flow){
            if(flow.files.length == 0 && $scope.prevPicture != null) {
                flow.files = [$scope.prevPicture];
                $scope.prevPicture = null;
            }
        };

        $scope.addedNewFile = function(file,event,flow){
            flow.files.shift();
            $scope.file = flow;
        };

        $scope.removePicture = function(flow){
            flow.files = [];
            $scope.file = null;
        };


        $scope.next = function(index){
            if(index == 0 && $scope.file){
                fileUpload.uploadFileToUrl(
                    $scope.file.files[0].file,
                    {id: $scope.userData.companyId},
                    'company', 
                    function(data){
                        $scope.file = null;
                        if(data.file && data.file.name){
                            $scope.storefront[0].data.featureImage.thumbnail = data.file.name;
                            $scope.storefront[0].data.featureImage.large = data.file.name;
                        }
                        $scope.saveStorefront($scope.storefront[index].data, function(){
                            $(window).scrollTop(0);
                            $state.go('^' + $scope.storefront[index+1].state);
                        });
                    }
                );
            }else{
                $scope.saveStorefront($scope.storefront[index].data, function(){
                    $(window).scrollTop(0);
                    $state.go('^' + $scope.storefront[index+1].state);
                });
            }
        }

        $scope.finish = function(index){
            if($scope.file){
                fileUpload.uploadFileToUrl(
                    $scope.file.files[0].file,
                    {id: $scope.userData.companyId},
                    'company', 
                    function(data){
                        $scope.file = null;
                        if(data.file && data.file.name){
                            $scope.storefront[2].data.logoImage = data.file.name;
                        }
                        $scope.saveStorefront($scope.storefront[index].data, function(){
                            $scope.saveFinish('storefront');
                            $(window).scrollTop(0);
                            $state.go('^.^.home');
                        });
                    }
                );   
            }else{
                $scope.saveStorefront($scope.storefront[index].data, function(){
                    $scope.saveFinish('storefront');
                    $(window).scrollTop(0);
                    $state.go('^.^.home');
                });
            }                     
        }
}]);