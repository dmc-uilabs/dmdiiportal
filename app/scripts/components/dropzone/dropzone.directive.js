angular.module('DropZone',[])
    .directive('dropzone', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      var config, dropzone;

      config = scope[iAttrs.dropzone];

      // create a Dropzone for the element with the given options
      dropzone = new Dropzone(iElement[0], config.options);
      scope[iAttrs.id] = dropzone;

      // bind the given event handlers
      angular.forEach(config.eventHandlers, function (handler, event) {
        dropzone.on(event, handler);
      });
    }
  };
}]);