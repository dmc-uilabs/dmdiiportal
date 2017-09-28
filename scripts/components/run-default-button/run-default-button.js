'use strict';

angular.module('dmc.component.run-default-button', ['dmc.ajax'])
.directive('runDefaultButton', ['ajax', 'dataFactory', '$window', function (ajax, dataFactory, $window) {
    return {
        link: function(scope, element, attr){
          scope.saveToDefaultProject = function(app){

            var updatedItem = $.extend(true, {}, app);
            if (updatedItem.hasOwnProperty('$$hashKey')) {
              delete updatedItem['$$hashKey'];
            }
            var tagsAdded = false;
            var interfacesAdded = false;

            // updatedItem.owner = userData.accountId;
            updatedItem.from = 'marketplace';
            updatedItem.published = false;
            updatedItem.parent = updatedItem.id;
            delete updatedItem.projectId
            delete updatedItem.tags;

            ajax.create(dataFactory.services().add, updatedItem, function (response) {
              var id = response.data.id;
              var projectId = response.data.projectId;

              ajax.get(dataFactory.services(app.id).get_tags, {}, function(response) {
                angular.forEach(response.data, function(tag) {
                  delete tag.id;
                  tag.serviceId = id;
                  ajax.create(dataFactory.services(id).add_tags, tag);
                });
                tagsAdded = true;
                redirectToService(tagsAdded, interfacesAdded, projectId, id);
              });
              ajax.get(dataFactory.services(app.id).get_interface, {}, function(response) {
                angular.forEach(response.data, function(newDomeInterface) {
                  delete newDomeInterface.id;
                  newDomeInterface.serviceId = id;
                  ajax.create(dataFactory.services().add_interface, newDomeInterface);
                });
                interfacesAdded = true;
                redirectToService(tagsAdded, interfacesAdded, projectId, id);
              });
            });
          };

          var redirectToService = function(tagsAdded, interfacesAdded, projectId, serviceId) {
            if (tagsAdded && interfacesAdded) {
              $window.location.href = '/run-app.php#/'+projectId+'/services/'+serviceId+'/runapp';
            }
          }
        }
    };
}]);
