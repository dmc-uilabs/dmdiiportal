'use strict';

angular.module('dmc.termsCond')
    .controller('termsCondCtr', ['$stateParams', '$state', '$scope', 'ajax', '$location','dataFactory','toastModel', function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel) {

      //Data Objects
    

        //Functions
        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };






        //END Controller
    }]
);
