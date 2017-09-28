'use strict';
angular.module('dmc.marketplace', [
    'ngMdIcons',
    'ngAnimate',
    'ngMaterial',
    'ngSanitize',
    'ui.router',
    'md.data.table',
    'dmc.configs.ngmaterial',
    'dmc.common.header',
    'dmc.common.footer',
    'dmc.model.toast-model',
    'angularUtils.directives.dirPagination',
    "dmc.ajax",
    "dmc.data",
    "dmc.utilities",
    "dmc.widgets.content",
    "dmc.widgets.contentPath"
]).config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $stateProvider.state('marketplace', {
        template: '<ui-view />'
    }).state('marketplace.home', {
        url: '/',
        controller: 'marketplaceController',
        templateUrl: 'templates/marketplace/marketplaceII.html'
    });
    $urlRouterProvider.otherwise('/');
}).controller('marketplaceController', ['$scope', '$element', '$location', 'scrollService', '$http','ajax','dataFactory', function ($scope, $element, $location, scrollService, $http, ajax,dataFactory) {




    function getContentStatic(callbackFunction) {
        ajax.get(dataFactory.getStaticJSON('static-marketplace.json'), {}, function(response){
            callbackFunction(response.data);
        });
    }

    var mergeSet = function(existingSet, newSet) {
      newSet.forEach(function(x){
        if (existingSet.indexOf(x) == -1) {
          existingSet.push(x)
        }
      })
      return existingSet;
    }

    getContentStatic(function(resourceMap){
      $scope.allResources = [];
      $scope.resourceMap = resourceMap;
      $scope.addToNodeStack(resourceMap);
      var serviceIdList = [];
      var documentIdList = [];

      traverseContentTree(resourceMap, function(node){
        documentIdList = mergeSet(documentIdList, node.categoryDocuments);
        serviceIdList = mergeSet(serviceIdList, node.categoryServices);
      })

      populateResourceData(dataFactory.getServices(), serviceIdList, "categoryServices");
      populateDocumentData(documentIdList, "categoryDocuments");
    })

    var traverseContentTree = function(node, callback) {
      node.forEach(function(category){
        callback(category)
        if (category.subCategories) {
          traverseContentTree(category.subCategories, callback);
        }
      })
    }


    var populateResourceData = function(endpoint, ids, resourceType) {
      ajax.get(endpoint, {id: ids}, function(response){
          populateResourceDataCallback(response, resourceType);
      });
    }

    var populateDocumentData = function(ids, resourceType) {
      ids.forEach(function(id) {
        ajax.get(dataFactory.documentsUrl(id).getSingle, {}, function(response){
            populateResourceDataCallback({data: [response.data]}, resourceType);
        });
      })
    }

    var populateResourceDataCallback = function(response, resourceType) {

      traverseContentTree($scope.resourceMap, function(node){
        node.contentSet = node.contentSet || [];

        var matchingResources = response.data.filter(function(resource){
          return node[resourceType].indexOf(resource.id) != -1;
        })

        node.contentSet = node.contentSet.concat(matchingResources);

        // Create second list of all assets for all categories
        mergeSet($scope.allResources, response.data)
      })

    }

    $scope.returnToHome = function() {
      $scope.selectedNode = null;
    }

    $scope.moveUpStack = function(targetNode) {
      $scope.nodeStack.forEach(function(node, i){
        if (node == targetNode) {
          $scope.nodeStack.length = i+1
        }
      })
    }

    $scope.clearSearch = function(){
      $scope.searchTerm='';
    }

    $scope.nodeStack = [];

    $scope.addToNodeStack = function(node, selected) {
      var contentNode = {
        resourceGroups: node,
        selectedNode: selected
      }
      $scope.nodeStack.push(contentNode);
    }

    $scope.returnToHome = function() {
      $scope.nodeStack[0].selectedNode = null;
      $scope.nodeStack.length = 1;
    }

    $http.get(dataFactory.getDefaultServices(), {
      }).success(function(response) {
          $scope.serviceMap = {};
          response.forEach(function (service){
            $scope.serviceMap[service.parent] = {'serviceId': service.id, 'workspaceId': service.projectId};
          });
      });


}]);
