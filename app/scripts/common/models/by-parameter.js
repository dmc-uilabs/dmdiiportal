'use strict';

angular.module('dmc.by-parameter', [])
.service('byParameter', [function() {

        // return item from array by parameter
        this.get = function(array, parameter_name, value) {
            var item = null;
            for(var i=0;i<array.length;i++){
                if(array[i][parameter_name] == value){
                    item = array[i];
                    break;
                }
            }
            return item;
        };

        // delete item from array by parameter
        this.delete = function(array, parameter_name, value){
            for(var i=0;i<array.length;i++){
                if(array[i][parameter_name] == value){
                    array.splice(i,1);
                    break;
                }
            }
            return array;
        };

        // update item from array by parameter
        this.update = function(array, parameter_name, value, update_data){
            var updated_item = null;
            for(var i=0;i<array.length;i++){
                if(array[i][parameter_name] == value){
                    array[i] = update_data;
                    updated_item = array[i];
                    break;
                }
            }
            return updated_item;
        };
    }]);