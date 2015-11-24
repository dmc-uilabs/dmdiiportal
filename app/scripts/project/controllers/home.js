angular.module('dmc.project')
.controller('HomeCtrl', [
  '$rootScope',
  '$stateParams',
  '$mdDialog',
  'projectData',
function (
  $rootScope,
  $stateParams,
  $mdDialog,
  projectData
) {
  var vm = this;
  vm.currentProjectId = $stateParams.projectId;
  vm.projectData = projectData;

  // ToDo: Move To Directive
  $rootScope.$on('$stateChangeStart', $mdDialog.cancel)

  vm.showMenu = function (event) {
    $mdDialog.show({
      templateUrl: 'templates/project/subnav-dialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true
    })
  }
}])
