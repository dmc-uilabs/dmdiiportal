'use strict';

angular.module('dmc.data',[])
    .factory('dataFactory', function ($window,$location) {
        var baseServer = $window.apiUrl ? $window.apiUrl : '/static/?p=';
        var localhost = ($location.$$absUrl.indexOf("http://localhost") != -1 ? "http://localhost:3000/" : "http://ge-dmc-01.thecreativeadvantage.net:3000/");
        var urlSocketServer = 'http://localhost:8080/';
        var appendId = function(id){
            return ($window.apiUrl && id ? '/'+id : '');
        };
        var webServiceUrl = function(path, action, id){
            var wsurl;
            if ($window.apiUrl && id) {
                wsurl = '/'+path+'/' + id;
                wsurl += action ? '/' + action : '';
            } else {
                wsurl = '/'+action;
            }
            return wsurl;
        };

        var convertParams = function(params){
            return $.map(params,function(item,key){
               return key+'='+item;
            }).join("&");
        };

        return {
             get_result: function(data) {
                var obj = {};
                if ($window.apiUrl) {
                    if (data.length >= 1) {
                        obj.result = data;
                        obj.count = data.length;
                    } else {
                        obj.result = data;
                    }
                } else {
                    obj = data;
                }
                return obj;
            },
            get_request_obj: function(source){
                var obj = {}
                if ($window.apiUrl) {
                    obj = _.transform(source, function(result, value, key) {
                      if (value && key != "projectId" && key != "profileId"){
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
                return baseServer+webServiceUrl('projects', 'services', id);
            },
            getUrlChangeService: function(id){
                return baseServer+'/change_service'+appendId(id);
            },
            getUrlAllTasks: function(id){
                // return baseServer+'/tasks'+appendId(id);
                return baseServer+webServiceUrl('projects', 'tasks', id);
            },
            getUrlChangeTask: function(id){
                return baseServer+'/change_tasks'+appendId(id);
            },
            getUrlAllDiscussions: function(id){
                // return baseServer+'/discussions'+appendId(id);
                return baseServer+webServiceUrl('projects', 'discussions', id);
            },
            getUrlAllProjects: function(id){
                return baseServer+'/projects';
            },
            getUrlAllComponents: function(id){
                return baseServer+webServiceUrl('projects', 'components', id);
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
                var url = baseServer+'/create_task'+appendId(id);
                if (window.apiUrl) {
                    url = baseServer+'/tasks';
                }
                return url
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
            uploadCompanyLogoUrl : function(){
                return baseServer+'/ucl';
            },
            uploadCompanyProfileImageUrl: function(){
                return baseServer+'/uci';
            },
            uploadCompanyProfileSkillImageUrl: function(){
                return baseServer+'/ucsi';
            },
            uploadProfilePictureUrl: function(){
                return baseServer+'/uprpic';
            },
            removeCompanyImages : function(){
                return baseServer+'/remove_company_images';
            },
            removeCompanySkillsImages : function(){
                return baseServer+'/remove_company_skills_images';
            },
            getAccountUrl: function(id){
                return baseServer+'/get_account'+appendId(id);
            },
            getCompanyUrl: function(id){
                return baseServer+'/get_company'+appendId(id);
            },
            getCompanyReviewUrl: function(){
                return baseServer+'/get_review_company';
            },
            addCompanyReviewUrl: function(){
                return baseServer+'/add_review_company';
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
            getProfile: function(id){
                return baseServer+'/profiles'+appendId(id);
            },
            editProfile: function(){
                return baseServer+'/edit_profile';
            },
            getProfileReview: function(id){
                return baseServer+webServiceUrl('profiles', 'profile_reviews', id);
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
            saveChangeServer: function(){
                return baseServer+'/save_change_server';
            },
            deleteServer: function(){
                return baseServer+'/delete_server';
            },
            getFAQCategories: function(){
                return baseServer+'/get_faq_categories';
            },
            getFAQCategory: function(id){
                return baseServer+'/get_faq_category'+appendId(id);
            },
            getFAQArticle: function(id){
                return baseServer+'/get_faq_article'+appendId(id);
            },
            getEvents: function(){
                return baseServer+'/get_events';
            },
            getAnnouncements: function(){
                return baseServer+'/get_announcements';
            },
            addDiscussionLikeDislike: function(){
                return baseServer+'/add_discussion_like_dislike';
            },
            sendStorefrontMessage: function(){
                return baseServer+'/ssm';
            },



            // direct requests
            getFavoriteProducts: function(){
                return localhost+'favorite_products';
            },
            getServers: function(){
                return localhost+'account_servers';
            },
            deactivateAccount : function(id){
                return localhost+'accounts'+(id ? '/'+id : '');
            },
            getDiscussions : function(){
                return localhost+'discussions';
            },
            deleteCompanyLogo : function(id){
                return localhost+'companies'+(id ? '/'+id : '');
            },
            saveChangedDiscussionComment : function(id){
                return localhost+'individual-discussion-comment'+(id ? '/'+id : '');
            },
            addDiscussionTag : function(){
                return localhost+'individual-discussion-tags';
            },
            getLastDiscussionTagId : function(){
                return localhost+'individual-discussion-tags';
            },
            getDiscussionTags : function(){
                return localhost+'individual-discussion-tags';
            },
            deleteDiscussionTag : function(id){
                return localhost+'individual-discussion-tags'+(id ? '/'+id : '');
            },
            deleteDiscussionComment : function(id){
                return localhost+'individual-discussion-comment'+(id ? '/'+id : '');
            },
            getDiscussionComments : function(link){
                var link_ = link.substring(1,link.length);
                return localhost+link_;
            },
            getIndividualDiscussion: function(id){
                return localhost+'individual-discussion'+(id ? '/'+id : '');
            },
            getIndividualDiscussions: function(){
                return localhost+'individual-discussion';
            },
            addCommentIndividualDiscussion: function(){
                return localhost+'individual-discussion-comment'
            },
            getLastDiscussionCommentId : function(){
                return localhost+'individual-discussion-comment'
            },
            getLastDiscussionId : function(){
                return localhost+'individual-discussion'
            },
            addDiscussion : function(){
                return localhost+'individual-discussion'
            },
            getCompanyImages : function(id){
                return localhost+'companies/'+id+'/company_images'
            },
            getCompanySkillsImages: function(id){
                return localhost+'companies/'+id+'/company_skill_images'
            },
            getCompanyVideos : function(id){
                return localhost+'companies/'+id+'/company_videos'
            },
            getCompanySkills : function(id){
                return localhost+'companies/'+id+'/company_skills'
            },
            getCompanyKeyContacts : function(id){
                return localhost+'companies/'+id+'/company_key_contacts'
            },
            addCompanySkill: function(){
                return localhost+'company_skills'
            },
            getLastCompanySkillId : function(){
                return localhost+'company_skills'
            },
            deleteCompanySkill : function(id){
                return localhost+'company_skills/'+id;
            },
            getLastCompanyContactId : function(){
                return localhost+'company_key_contacts'
            },
            addCompanyContact : function(){
                return localhost+'company_key_contacts'
            },
            updateCompanyProfile: function(id){
                return localhost+'companies/'+id;
            },
            getLastCompanyVideoId: function(){
                return localhost+'company_videos';
            },
            addCompanyVideo: function(){
                return localhost+'company_videos';
            },
            deleteCompanyVideo: function(id){
                return localhost+'company_videos/'+id;
            },
            deleteCompanyContact: function(id){
                return localhost+'company_key_contacts/'+id;
            },
            updateCompanyImage: function(id){
                return localhost+'company_images/'+id;
            },
            updateCompanySkillsImage: function(id){
                return localhost+'company_skill_images/'+id;
            },
            updateCompanyVideo: function(id){
                return localhost+'company_videos/'+id;
            },
            updateCompanyContact: function(id){
                return localhost+'company_key_contacts/'+id;
            }
        };
    }
);