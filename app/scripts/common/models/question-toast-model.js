'use strict';

var userData = {
    buttons : [],
    question : null
};
angular.module('dmc.model.question-toast-model', [])
    .service('questionToastModel', ['$mdToast', function ($mdToast) {

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        var toastPosition = angular.extend({},last);

        var getToastPosition = function() {
            sanitizePosition();
            return Object.keys(toastPosition)
                .filter(function(pos) { return toastPosition[pos]; })
                .join(' ');
        };

        function sanitizePosition() {
            var current = toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }

        this.show = function(data,doc,delay){
            userData = data;
            $mdToast.show({
                controller: 'QuestionToastCtrl',
                templateUrl: 'templates/common/models/question-toast-template.html',
                hideDelay: (delay ? delay : 6000),
                parent : doc,
                position: getToastPosition()
            }).then(function(response) {
                for(var button in data.buttons){
                    if(response == button){
                        data.buttons[button].action();
                    }
                }
            });
        };

    }]).controller('QuestionToastCtrl', ['$scope','$mdToast',function($scope, $mdToast) {
        $scope.buttons = userData.buttons;
        $scope.question = userData.question;
        $scope.action = function(key) {
            $mdToast.hide(key);
        };
    }]);