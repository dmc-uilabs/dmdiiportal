angular.module('dmc.company-profile').directive('tabTdp', ['$parse', '$sce', function ($parse, $sce) {
    return {
        restrict: 'A',
        templateUrl: 'templates/company-profile/tabs/tab-tdp.html',
        scope: true,
        bindToController: {
            source: '=',
            removedFiles: '='
        },
        controller: TabCompanyTdpController,
        controllerAs: '$ctrl'
    };
    
    function TabCompanyTdpController($scope, $element, $attrs, dataFactory, ajax, toastModel, companyProfileModel, fileUpload, questionToastModel) {
        $element.addClass('tab-overview');
        
        var vm = this;
        
        vm.accessLevels = {
            'Public': 'PUBLIC',
            'Members': 'MEMBER',
            'Admins': 'ADMIN'
        };
        
        // image drop box
        vm.prevFile = null;
        vm.newAddedFile = null;
        
        vm.addNewFile = function () {
            vm.isAddingFile = true;
        };
        
        vm.cancelAddFile = function () {
            vm.isAddingFile = false;
        };
        
        vm.deleteFile = function (file, ev) {
            questionToastModel.show({
                question: 'Do you want to delete this File?',
                buttons: {
                    ok: function () {
                        if (!vm.removedFiles) {
                            vm.removedFiles = [];
                        }
                        vm.removedFiles.push(img.id);
                        file.hide = true;
                        apply();
                    },
                    cancel: function () {
                    }
                }
            }, ev);
        };
        
        function apply() {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        }
    }
}]);