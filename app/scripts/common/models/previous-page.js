'use strict';

angular.module('dmc.model.previous-page', [
    'ngCookies'
])
    .service('previousPage', ['$cookies', '$location', function($cookies, $location) {

        this.get = function(){
            var previousPage = $cookies.get('previousPage');
            if(previousPage.indexOf('dashboard.php') != -1){
                return {
                    title : "Back to the Dashboard",
                    url : previousPage
                };
            }else if(previousPage.indexOf('community.php') != -1){
                return {
                    title : "Back to the Community",
                    url : previousPage
                };
            }else if(previousPage.indexOf('project.php') != -1){
                return {
                    title : "Back to the Project",
                    url : previousPage
                };
            }else if(previousPage.indexOf('my-projects.php') != -1){
                return {
                    title : "Back to the My Projects",
                    url : previousPage
                };
            }else {
                return null;
            }
        };

        this.save = function(e){
            e.preventDefault();
            $cookies.put('previousPage', $location.$$absUrl);
            window.location = location.origin+$(e.currentTarget).attr("href");
        };
}]);