'use strict';

angular.module('dmc.socket',[
        'dmc.data'
]).factory("socketFactory",function ($rootScope,dataFactory) {
        //var socket = io.connect(dataFactory.url_socket_server());
        return {
            //on: function (eventName, callback) {
            //    socket.on(eventName, function () {
            //        var args = arguments;
            //        $rootScope.$apply(function () {
            //            callback.apply(socket, args);
            //        });
            //    });
            //},
            //emit: function (eventName, data, callback) {
            //    socket.emit(eventName, data, function () {
            //        var args = arguments;
            //        $rootScope.$apply(function () {
            //            if (callback) callback.apply(socket, args);
            //        });
            //    })
            //},
            //updated: function(){
            //    return {
            //        services : "updated:services",
            //        tasks : "updated:tasks",
            //        discussions : "updated:discussions",
            //        projects : "updated:projects",
            //        components : "updated:components"
            //    }
            //}
        };
    }
);
