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

        	$element.on('click', function(ev){
                $mdDialog.show({
                    controller: 'UploadController',
                    templateUrl: 'templates/components/ui-widgets/upload-image-modal.html',
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
.controller('UploadController',['images', 'newImages', 'removedImages', '$scope', '$mdDialog', 'fileUpload', 'dataFactory',
	function(images, newImages, removedImages,  $scope, $mdDialog, fileUpload, dataFactory){
	$scope.images = images;
	$scope.file = null;
	$scope.newImages = newImages;
	$scope.removedImages = removedImages;
    $scope.imagesToAdd = [];
	$scope.cancel = function(){
		$mdDialog.cancel();
	}

    $scope.uploadFile = function(){
        angular.forEach($scope.imagesToAdd, function(image) {
            fileUpload.uploadFileToUrl(image.file, {},'service').then(function(data){
                $scope.newImages.push(data.result);
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            });
        });
    };

    $scope.deleteImage = function(index, id){
    	$scope.removedImages.push(id);
    	$scope.images.splice(index, 1);
    }
    $scope.deleteNewImage = function(index){
    	$scope.newImages.splice(index, 1);
    }
}]);
