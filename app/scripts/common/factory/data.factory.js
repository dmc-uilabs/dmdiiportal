'use strict';

angular.module('dmc.data',[])
    .factory('dataFactory', function ($window) {
        var baseServer = $window.apiUrl ? $window.apiUrl : '/static/?p=';
        var urlSocketServer = 'http://localhost:8080/';
        var appendId = function(id){
            return ($window.apiUrl && id ? '/'+id : '');
        };
        var webServiceUrl = function(action, projectId){
            var wsurl;
            if ($window.apiUrl && projectId) {
                wsurl = '/projects/' + projectId + '/' + action;
            } else {
                wsurl = '/'+action;
            }
            return wsurl;
        }
        return {
             get_result: function(data) {
                var obj = {};
                if ($window.apiUrl) {
                    if (data.length > 1) {
                        obj.result = data;
                    }
                    obj.count = data.length;
                } else {
                    obj = data;
                }
                return obj;
            },
            get_request_obj: function(source){
                var obj = {}
                if ($window.apiUrl) {
                    obj = _.transform(source, function(result, value, key) {
                      if (value){
                        result['_'+key] = value;
                      }
                    });
                } else {
                    obj = source;
                }
                return obj;
            },
            url_php_server: function(){
                return baseServer;
            },
            url_socket_server: function(){
                return urlSocketServer;
            },
            getUrlAllServices: function(id){
                // return baseServer+'/services'+appendId(id);
                return baseServer+webServiceUrl('services', id);
            },
            getUrlChangeService: function(id){
                return baseServer+'/change_service'+appendId(id);
            },
            getUrlAllTasks: function(id){
                // return baseServer+'/tasks'+appendId(id);
                return baseServer+webServiceUrl('tasks', id);
            },
            getUrlChangeTask: function(id){
                return baseServer+'/change_tasks'+appendId(id);
            },
            getUrlAllDiscussions: function(id){
                // return baseServer+'/discussions'+appendId(id);
                return baseServer+webServiceUrl('discussions', id);
            },
            getUrlAllProjects: function(){
                return baseServer+'/projects';
            },
            getUrlAllComponents: function(id){
                return baseServer+'/components'+appendId(id);
            },
            getUrlAllProducts: function(){
                return baseServer+'/products';
            },
            getUrlAddToProject: function(id){
                return baseServer+'/add_to_project'+appendId(id);
            },
            getUrlRemoveFromProject: function(id){
                return baseServer+'/remove_from_project'+appendId(id);
            },
            getUrlAllDocuments: function(id){
                return baseServer+'/documents'+appendId(id);
            },
            getDocumentUpload: function(id){
                return baseServer+'/upload'+appendId(id);
            },
            getUrlCreateTask: function(id){
                return baseServer+'/create_task'+appendId(id);
            },
            getUrlCreateDiscussion: function(id){
                return baseServer+'/create_discussion'+appendId(id);
            },
            getProduct: function(){
                return baseServer+'/product';
            },
            getProductReview: function(){
              return baseServer+'/get_product_review';
            },
            addProductReview: function(){
                return baseServer+'/add_product_review';
            },
            addLikeDislike: function(){
                return baseServer+'/add_like_dislike';
            },
            editProduct: function(){
                return baseServer+'/edit_product';
            },
            uploadAccountPictureUrl : function(){
                return baseServer+'/upp';
            },
            uploadCompanyPictureUrl : function(){
                return baseServer+'/ucp';
            },
            uploadProfilePictureUrl: function(){
                return baseServer+'/uprpic';
            },
            getAccountUrl: function(id){
                return baseServer+'/get_account'+appendId(id);
            },
            getCompanyUrl: function(id){
                return baseServer+'/get_company'+appendId(id);
            },
            addFeaturedCompany: function(){
                return baseServer+'/add_featured_company';
            },
            removeFeaturedCompany: function(){
                return baseServer+'/remove_featured_company';
            },
            getFeaturesCompany: function(){
                return baseServer+'/get_featured_company';
            },
            saveCompanyChanges : function(){
                return baseServer+'/save_company_changes';
            },
            followCompany : function(){
                return baseServer+'/follow_company';
            },
            addProductToFavorite: function() {
                return baseServer + '/add_product_to_favorite';
            },
            updateAccount: function(id){
                return baseServer+'/update_account'+appendId(id);
            },
            getProfile: function(){
                return baseServer+'/profile';
            },
            editProfile: function(){
                return baseServer+'/edit_profile';
            },
            getProfileReview: function(){
                return baseServer+'/get_profile_review';
            },
            addProfileReview: function(){
                return baseServer+'/add_profile_review';
            },
            updateFeaturesPosition: function(){
                return baseServer+'/update_features_position';
            },
            addNewServer: function(){
                return baseServer+'/add_new_server';
            },
            getServers: function(){
                return baseServer+'/get_servers';
            },
            saveChangeServer: function(){
                return baseServer+'/save_change_server';
            },
            deleteServer: function(){
                return baseServer+'/delete_server';
            }
        };
    }
);