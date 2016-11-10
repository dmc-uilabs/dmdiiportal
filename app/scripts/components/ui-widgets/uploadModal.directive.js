angular.module('dmc.widgets.uploadModal',[
    'dmc.ajax',
    'dmc.data',
    'dmc.model.toast-model',
    'dmc.configs.ngmaterial',
    'dmc.model.fileUpload',
    'ngMaterial'
])
.directive('dmcUploadImageModal', function() {
    return {
        restrict: 'A',
        scope: {
        	images: '=',
            serviceId: '=',
            newImages: '=',
            removedImages: '='
        },
		controller: ['$scope', '$element', '$attrs', '$mdDialog',
		function($scope, $element, $attrs, $mdDialog) {

        	$element.on('click', function(ev){
                $mdDialog.show({
                    controller: 'UploadController',
                    templateUrl: 'templates/components/ui-widgets/upload-image-modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        images: $scope.images,
                        newImages: $scope.newImages,
                        removedImages: $scope.removedImages,
                        serviceId: $scope.serviceId
                    },
                    clickOutsideToClose:true
                });
        	});
        }]
	}
})
.controller('UploadController',['images', 'newImages', 'removedImages', 'serviceId', '$scope', 'ajax', '$mdDialog', 'fileUpload', 'dataFactory',
	function(images, newImages, removedImages, serviceId, $scope, ajax, $mdDialog, fileUpload, dataFactory){
	$scope.images = images;
	$scope.file = null;
	$scope.newImages = newImages;
	$scope.removedImages = removedImages;

	$scope.cancel = function(){
        $scope.newImages = [];
		$mdDialog.cancel();
	}

    $scope.uploadFile = function(){
        $mdDialog.hide();
    };

    $scope.deleteImage = function(index, id){
    	$scope.removedImages.push(id);
    	$scope.images.splice(index, 1);
    }
    $scope.deleteNewImage = function(index){
    	$scope.newImages.splice(index, 1);
    }
}]);
