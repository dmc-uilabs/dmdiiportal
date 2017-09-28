'use strict';

angular.module('dmc.model.toast-model', [])
    .service('toastModel', ['$mdToast', function ($mdToast) {

        var last = {
            bottom: false,
            top: true,
            left: true,
            right: false
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

        this.showToast = function(success,text){
            $mdToast.show(
                $mdToast.simple()
                    .content(text)
                    .position(getToastPosition())
                    .theme(success+"-toast")
                    .hideDelay(3000)
            );
        };

    }]);
