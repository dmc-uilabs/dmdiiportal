angular.module('dmc.utilities', [])
    .service('contentMetaDataService', ['$http', 'dataFactory', function ($http, dataFactory) {
    
        function bindMetaDataToContent(content, staticJSON) {
            if (Array.isArray(content)) {
                for (var contentIndex = 0; contentIndex < content.length; contentIndex++) {
                    for (var i = 0; i < staticJSON.length; i++) {
                        if (content[contentIndex].id === staticJSON[i].id) {
                            content[contentIndex].description = staticJSON[i].description;
                            content[contentIndex].img = staticJSON[i].img;
                            break;
                        }
                    }
                }
            } else {
                for (var i = 0; i < staticJSON.length; i++) {
                    if (content.id === staticJSON[i].id) {
                        content.longDescription = staticJSON[i].longDescription;
                        content.shortDescription = staticJSON[i].shortDescription;
                        content.img = staticJSON[i].img;
                        break;
                    }
                }
            }
            
            return content;
            
        }
        
        return {
            getDocumentsWithMetaData: function (documents) {
                return $http.get(dataFactory.getStaticJSON('static-document-metadata.json')).then(function (response) {
                    console.log(bindMetaDataToContent(documents, response.data));
                    return bindMetaDataToContent(documents, response.data);
                });
            },
            
            getVideosWithMetaData: function (videos) {
                $http.get(dataFactory.getStaticJSON('static-video-metadata.json')).then(function (response) {
                    return bindMetaDataToContent(videos, response.data);
                });
            }
        };
        
    }]);