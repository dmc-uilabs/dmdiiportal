
angular.module('dmc.myfavorites')
    .controller('myfavoritesCtrl', ['$scope', '$http', 'dataFactory', function ($scope, $http, dataFactory) {
        
        var favoriteAppIds= [];
        var favoriteDocIds= [];
        $scope.favoriteApps = [];
        $scope.favoriteDocs = [];
        $scope.serviceMap = [];
        
        $scope.getFavoriteApps = function() {
            $http.get(dataFactory.userFavorites(null, "1").get).then(function (response) {
                favoriteAppIds = [];
                if (response.data.length > 0) {
                    response.data.forEach(function (userFavorite) {
                        favoriteAppIds.push(userFavorite.contentId);
                    }, function (message) {
                        console.log(message);
                    });
    
                    $http.get(dataFactory.services(favoriteAppIds.toString()).getArray).then(function (response) {
                        $scope.serviceMap = [];
                        $scope.favoriteApps = [];
                        if (Array.isArray(response.data)) {
                            response.data.forEach(function (service) {
                                if (service.parent) {
                                    $scope.serviceMap[service.parent] = {
                                        'serviceId': service.id,
                                        'workspaceId': service.projectId
                                    };
                                }
                            });
                            $scope.favoriteApps = response.data;
                        } else {
                            if (response.data.parent) {
                                $scope.serviceMap[response.data.parent] = {
                                    'serviceId': response.data.id,
                                    'workspaceId': response.data.projectId
                                };
                            }
                            $scope.favoriteApps.push(response.data);
                        }
                    });
                }
            });
        };
        
        $scope.getFavoriteDocuments = function() {
            favoriteDocIds = [];
            $http.get(dataFactory.userFavorites(null, "2").get).then(function (response) {
                if (response.data.length > 0) {
                    response.data.forEach(function (userFavorite) {
                        favoriteDocIds.push(userFavorite.contentId);
                    }, function (message) {
                        console.log(message);
                    });
    
                    $http.get(dataFactory.documentsUrl(favoriteDocIds.toString()).getListIds).then(function (response) {
                        $scope.favoriteDocs = [];
                        if (Array.isArray(response.data.data)) {
                            $scope.favoriteDocs = response.data.data;
                        } else {
                            $scope.favoriteDocs.push(response.data.data);
                        }
                    });
                }
            });
        };
    
        $scope.getFavoriteApps();
        
    }]);
