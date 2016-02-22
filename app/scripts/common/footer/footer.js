'use strict';
/**
* dmc.common.footer Module
*
* Global Footer
*/
angular.module('dmc.common.footer', ['ngSanitize'])
    .directive('dmcFooter', ['$compile',function($compile) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                type: '='
            },
            templateUrl: 'templates/common/footer/footer-tpl.html',
            controller: function($scope,$element){
                $scope.trigger = null;
                /*jQuery.ajax(
                    {
                        url: "https://digitalmfgcommons.atlassian.net/s/bf0c41c863302dcce20ac6329ce3dc12-T/en_US-1lpod1/71001/b6b48b2829824b869586ac216d119363/2.0.9/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=0db26db8",
                        type: "get",
                        cache: true,
                        dataType: "script",
                        success: function(){
                            var feedbackInterval = setInterval(function(){
                                if($("#atlwdg-trigger").size() > 0) {
                                    //$scope.trigger = $("#atlwdg-trigger");
                                    $element.find("#feedback-button").html($compile($("#atlwdg-trigger").empty().append("<span>Feedback</span>").addClass("feedback-trigger link-button md-button md-default-theme"))($scope));
                                    clearInterval(feedbackInterval);
                                }
                            },500);
                        }
                    }
                );
                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };*/
            }
        };
    }]
);
