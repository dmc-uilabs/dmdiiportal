angular.module('dmc.widgets.uploadModal',[
    'dmc.ajax',
    'dmc.data',
    'dmc.model.toast-model',
    'dmc.configs.ngmaterial',
    'dmc.model.fileUpload',
    'ngMaterial',
    'flow'
])
.directive('dmcUploadImageModal', function() {
    return {
        restrict: 'A',
        scope: {
        	images: '=',
        	cancelFunction: '='
        },
		controller: ['$scope', '$element', '$attrs', '$mdDialog',
		function($scope, $element, $attrs, $mdDialog) {

			$scope.newImages = [];
			$scope.removedImages = [];
			
        	$element.on("click", function(ev){
                $mdDialog.show({
                    controller: "UploadController",
                    templateUrl: "templates/components/ui-widgets/upload-image-modal.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,

                    locals: {
                        images: $scope.images,
                        newImages: $scope.newImages,
                        removedImages: $scope.removedImages
                    },
                    clickOutsideToClose:true
                })
                .then(function() {
                }, function() {
                	if($scope.cancelFunction){
	                	$scope.cancelFunction($scope.newImages, $scope.removedImages);
	                }	
                });
        	})
        }]
	}
})
.controller("UploadController",['images', 'newImages', 'removedImages', '$scope', '$mdDialog', 'fileUpload', 
	function(images, newImages, removedImages,  $scope, $mdDialog, fileUpload){
	$scope.images = images;
	$scope.file = null;
	$scope.newImages = newImages;
	$scope.removedImages = removedImages;

	$scope.cancel = function(){
		$mdDialog.cancel();
	}


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
    };

    $scope.uploadFile = function(flow){
        $scope.file = flow.files[0].file;
        fileUpload.uploadFileToUrl($scope.file,{},'service',function(data){
        	flow.files = [];
        	$scope.newImages.push(data.result);
        	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
		});
    };

    $scope.cancelFile = function(flow){
        flow.files = [];
    };

    $scope.deleteImage = function(index, id){
    	$scope.removedImages.push(id);
    	$scope.images.splice(index, 1);
    }
    $scope.deleteNewImage = function(index){
    	$scope.newImages.splice(index, 1);
    }
}]);