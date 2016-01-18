'use strict';
angular.module('dmc.model.question-toast-model', [])
    .service('questionToastModel', ['$mdDialog', function ($mdDialog) {

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

        this.show = function(data,ev){

            var confirm = $mdDialog.confirm()
                .title(data.question)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .cancel('No')
                .ok('Yes');
            $mdDialog.show(confirm).then(function() {
                data.buttons.ok();
            }, function() {
                data.buttons.cancel();
            });
        };

    }])