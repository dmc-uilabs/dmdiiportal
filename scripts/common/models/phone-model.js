'use strict';

angular.module('dmc.phone-format',[]).directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var target, position; // Capture initial position
            var prevVal;
            var chars = '()- ext';

            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                var old_ = $element.val();
                var up = false;
                if(value.length > prevVal.length){
                    position++;
                    up = true;
                }else{
                    position--;
                }
                target.value = $filter('tel')(value, false);
                if(up){
                    if(getCountZ(target.value,position) - getCountZ(old_,position) > 0){
                        position+=getCountZ(target.value,position) - getCountZ(old_,position);
                    }else if(chars.indexOf(target.value[position-1])!=-1){
                        for(var i=position-1;i<target.value.length;i++){
                            if(chars.indexOf(target.value[i]) != -1){
                                position++;
                            }else{
                                break;
                            }
                        }
                    }
                }

                target.selectionEnd = position;
            };

            function getCountZ(value,p){
                var count = 0;
                var p_ = (p<14 ? p : value.length);
                for(var i=0;i<=p_;i++){
                    if(chars.indexOf(value[i]) != -1) count++;
                }
                return count;
            }

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,20);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event){
                prevVal = event.target.value.replace(/[^0-9]/g, '');
                target = event.target;
                position = target.selectionStart;

                var key = event.keyCode;

                if(key == 36){
                    position = 0;
                }else if(key == 35){
                    position = event.target.value.length+1;
                }
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly

            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });

        }

    };
}).filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }
        //console.info("v",value)

        var country, city, number, ext;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
            case 4:
                city = value;
                break;

            default:
                if(value[0] == "1"){
                    city = value.slice(1, 4);
                    number = value.slice(4);
                }else{
                    city = value.slice(0, 3);
                    number = value.slice(3);
                }
        }

        if(number){
            if(number.length>7){
                number = number.slice(0, 3) + '-' + number.slice(3,7) + ' ext ' + number.slice(7);
            }else if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }
            if(value[0] == "1"){
                return ("1(" + city + ")" + number).trim();
            }else{
                return ("(" + city + ")" + number).trim();
            }
        } else{
            return city;
        }

    };
});