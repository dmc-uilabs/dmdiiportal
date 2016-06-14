'use strict';

angular.module('dmc.resources')
    .controller('ResourcesCtr', ['$stateParams', '$state', "$scope", "ajax", "$location","dataFactory","toastModel", function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel) {


        $scope.featureLab= {
          title: "UILabs",
          image:"https://pbs.twimg.com/profile_images/453633401438740480/ovdYuKUO_400x400.png",
          description: "UI LABS is a first-of-its-kind innovation accelerator, addressing problems too big for any one organization to solve on its own. The challenges we are addressing in manufacturing and smart cities are at the intersection of digital convergence: computing, big data, and the Internet of Things (IOT)."
        }



        //Functions

        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };



        //Change the featured lab
        $scope.changeFeature = function(labNum){
            ajax.get(dataFactory.getResourceLab(labNum), {
                }, function(response){
                    $scope.featureLab = response.data;
                    apply();
                }
            );
        };//END Change Feature



        //END Controller
    }]
);
