'use strict';

angular.module('dmc.widgets.content', [
    'dmc.ajax',
    'dmc.data',
    'dmc.socket',
    'ng-showdown',
    'ngYoutubeEmbed',
    'dmc.component.run-default-button'
]).directive('uiWidgetContent', ['$parse', 'dataFactory', 'toastModel', function ($parse, dataFactory, toastModel) {
    return {
        restrict: 'A',
        templateUrl: '/templates/components/ui-widgets/content-card.html',
        scope: true,
        bindToController: {
            contentItem: '=',
            serviceMap: '='
        },
        controller: UiWidgetContentCardController,
        controllerAs: '$ctrl'
    };

    /**
     * Controller for the uiWidgetContent directive.
     *
     * This directive contains 3 properties or objects:
     * title: String (optional) - any string to be displayed
     * category: String (optional) - any string to be displayed
     * contentItems: Array of objects
     *
     * This directive can display 4 categories of content for the contentItems array:
     *
     * document, video, img, app
     */
    function UiWidgetContentCardController($http, DMCUserModel, $window, ajax) {
        var vm = this;

        // $scope.$watch(function () {
        //     return vm.contentItem;
        // }, function (newValue, oldValue) {
        //     if (newValue !== oldValue) {
        //         vm.categorizedContent = categorizeContent(vm.contentItem);
        //     }
        // }, true);


        var contentImage = function(content) {
          var imgLocation;

          switch(content.contentType) {
              case "document":
                imgLocation = content.contentImage || "/images/Icons_Education.svg";
                break;
              case "app":
                imgLocation = content.featureImage.large || "/images/Icons_Industry.svg";
                break;
              case "static-content":
                imgLocation = content.contentImage || "/images/Icons_Distribute.svg";
                break;
              case "integration":
                imgLocation = content.contentImage || "/images/Icons_Industry.svg";
                break;
              default:
                imgLocation = content.contentImage || "/images/Icons_Globe.svg"
          }
          return imgLocation;
        };

        var categorizeContent = function(contentItem) {

            if (contentItem.documentName) {
                contentItem.contentType = 'document';
            } else if (contentItem.videoSource) {
                contentItem.contentType = 'video';
            } else if (contentItem.imgSource) {
                contentItem.contentType = 'img';
            } else if (contentItem.serviceType || contentItem.type === 'service') {
                contentItem.contentType = 'app';
            }

            contentItem.imgLocation = contentImage(contentItem);

            return contentItem;
        };

        vm.categorizedContent = categorizeContent(vm.contentItem);

        vm.downloadFile = function(id) {
            console.log("download called");
            window.location = dataFactory.documentsUrl(id).download;
        };

        vm.goToIntegration = function ( path ) {
          window.location = path;
        };

        // vm.categorizedContent = categorizeContent(vm.contentItem);
        //
        // vm.downloadFile = function(id) {
        //     window.location = dataFactory.documentsUrl(id).download;
        // };

        vm.redirectToServiceHistory = function(projectId, serviceId) {
          $window.location.href = '/run-app.php#/'+projectId+'/services/'+serviceId+'/run/app-history';
        }
        
        vm.favoriteContent = function() {
            console.log(vm.categorizedContent.id);
            console.log(getContentTypeNumber());
            $http.post(dataFactory.userFavorites(vm.categorizedContent.id, getContentTypeNumber()).create, {})
                .then(function(response) {
                    toggleFavoritedOn();
                }, function(message) {
                    toastModel.showToast('error', 'There was an error favoriting this content.')
            });
        };

        vm.unFavoriteContent = function() {
            $http.delete(dataFactory.userFavorites(vm.categorizedContent.id, getContentTypeNumber()).delete, {})
                .then(function(response) {
                    toggleFavoritedOff();
                }, function(message) {
                    toastModel.showToast('error', 'There was an error unfavoriting this content.')
            });
        };

        var getContentTypeNumber = function() {
            switch(vm.categorizedContent.contentType) {
                case 'app':
                    return 1;
                case 'document':
                    return 2;
                default:
                    return 3;
            }
        };

        var toggleFavoritedOn = function() {
            vm.categorizedContent.favorited = true;
        };

        var toggleFavoritedOff = function() {
            vm.categorizedContent.favorited = false;
        };

    }


}]);
