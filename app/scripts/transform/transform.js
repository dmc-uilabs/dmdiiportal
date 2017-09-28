'use strict';
angular.module('dmc.transform', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngSanitize',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.toast-model',
    "dmc.ajax",
    "dmc.data",
    "dmc.utilities",
    'dmc.widgets.content'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('transform', {
        template: '<ui-view />'
    }).state('transform.home', {
        url: '/',
        controller: 'TransformController',
        templateUrl: 'templates/transform/transform.html'
    });
    $urlRouterProvider.otherwise('/');
}).controller('TransformController', function ($scope, $element, $location, scrollService, $timeout) {
    $scope.gotoElement = function (eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(eID);

        // call scrollTo
        scrollService.scrollTo(eID);
    };

    // $timeout(function(){
    //   var url = $location.url()
    //   if (url && url != '/') {
    //     url = url.replace('/#','');
    //     $scope.gotoElement(url)
    //   }
    // })

    
    $scope.estimateContentItems = [{
        contentTitle: 'ANA',
        description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.',
        buttonText: 'LAUNCH APP',
        videoSource: 'https://youtu.be/ajJdK30NM1g'
    }];
    
    $scope.cncContentItems = [
        {
            contentTitle: 'Gear Machining Tools',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        },
        {
            contentTitle: 'Haas Program Optimizer',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        }
    ];
    
    $scope.cmmContentItems = [
        {
            contentTitle: 'Zeiss CMM',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        },
        {
            contentTitle: 'Automatic Probe Calibration',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.',
            buttonText: 'LAUNCH APP'
        },
        {
            contentTitle: 'NX CMM 10',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.',
            buttonText: 'LAUNCH APP'
        }
    ];
    
    $scope.getLeanContentItems = [
        {
            contentTitle: 'Lean Manufacturing',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        },
        {
            contentTitle: 'System 100',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        },
        {
            contentTitle: 'Toyota Material Handling',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        }
    ];
    
    $scope.getLeanContentItems = [
        {
            contentTitle: 'Lean Manufacturing',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        },
        {
            contentTitle: 'System 100',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        },
        {
            contentTitle: 'Toyota Material Handling',
            description: 'Etiam non  sem suscipit, pulvinar est non, luctus magna. Proin a placerat enim, eu porta velit.' +
            ' Sed placerat pallentesque lorem, vitae volupat orci suscipit eu. Praesent sceleerisque leo' +
            ' vehicula, pulvinar arcu quis, tincidunt quam.'
        }
    ];
   
});