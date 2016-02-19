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
                        title: "Back to Dashboard",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('community.php') != -1) {
                    return {
                        title: "Back to Community",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('project.php') != -1) {
                    return {
                        title: "Back to Project",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('my-projects.php') != -1) {
                    return {
                        title: "Back to My Projects",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('company-profile.php') != -1) {
                    return {
                        title: "Back to Company",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('profile.php') != -1) {
                    return {
                        title: "Back to Profile",
                        url: previousPage
                    };
                } else {
                    return {
                        title: "Back to Dashboard",
                        url: location.origin+'/dashboard.php'
                    };
                }
            }else{
                return {
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