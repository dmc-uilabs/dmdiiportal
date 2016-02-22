'use strict';

angular.module('dmc.model.previous-page', [
    'ngCookies'
])
    .service('previousPage', ['$cookies', '$location', function($cookies, $location) {

        this.get = function(){
            var previousPage = $cookies.get('previousPage');
            if(previousPage) {
                if (previousPage.indexOf('dashboard.php') != -1) {
                    return {
                        tag : "dashboard",
                        title: "Back to Dashboard",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('community.php') != -1) {
                    return {
                        tag : "community",
                        title: "Back to Community",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('project.php') != -1) {
                    return {
                        tag : "project",
                        title: "Back to Project",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('my-projects.php') != -1) {
                    return {
                        tag : "my-projects",
                        title: "Back to My Projects",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('company-profile.php') != -1) {
                    return {
                        tag : "company",
                        title: "Back to Profile",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('profile.php') != -1) {
                    return {
                        tag : "profile",
                        title: "Back to Profile",
                        url: previousPage
                    };
                } else {
                    return {
                        tag : "dashboard",
                        title: "Back to Dashboard",
                        url: location.origin+'/dashboard.php'
                    };
                }
            }else{
                return {
                    tag : "dashboard",
                    title: "Back to Dashboard",
                    url: location.origin+'/dashboard.php'
                };
            }
        };

        this.save = function(e){
            e.preventDefault();
            $cookies.put('previousPage', $location.$$absUrl);
            window.location = location.origin+$(e.currentTarget).attr("href");
        };
}]);