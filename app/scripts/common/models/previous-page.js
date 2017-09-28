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
                } else if (previousPage.indexOf('all-projects.php') != -1) {
                    return {
                        tag : "all-projects",
                        title: "Back to All Projects",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('my-projects.php') != -1) {
                    return {
                        tag : "my-projects",
                        title: "Back to My Projects",
                        url: previousPage
                    };
                } else if (previousPage.indexOf('project.php') != -1) {
                    return {
                        tag : "project",
                        title: "Back to Project",
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
                } else if (previousPage.indexOf('service-marketplace.php') != -1) {
                    return {
                        tag : "service-marketplace",
                        title: "Back to Service",
                        url: previousPage
                    };

                }else if (previousPage.indexOf('marketplace.php') != -1) {
                    var subPage = previousPage.indexOf('marketplace.php#/search') != -1 ? "search" : "home";
                    return {
                        tag : "marketplace",
                        subPage : subPage,
                        title: subPage == "search" ? "RETURN TO MARKETPLACE SEARCH" : "BACK TO MARKETPLACE HOME",
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

        this.set = function(url){
            $cookies.put('previousPage', url);
        }
}]);