'use strict';

angular.module('dmc.data',[])
    .factory('dataFactory', function ($window,$location) {
        var baseServer = $window.apiUrl ? $window.apiUrl : '/static/?p=';
        var localhost = ($location.$$absUrl.indexOf("http://localhost") != -1  || $location.$$absUrl.indexOf(':9000') != -1 ? "http://localhost:3000/" : "http://ge-dmc-01.thecreativeadvantage.net:3000/");
        localhost = $window.apiUrl ? $window.apiUrl + '/' : localhost;
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
                      if (value && key != "projectId" && key != "profileId" && key != "companyId"){
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
                    url = baseServer+'/tasks/create';
                }
                return url
            },
            getUrlCreateDiscussion: function(id){
                var url = baseServer+'/create_discussion'+appendId(id);
                if (window.apiUrl) {
                    url = baseServer+'/discussions/create';
                }
                return url
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
                var idString = $window.apiUrl ? '' : '&id='+id;
                return baseServer+'/companies'+appendId(id)+idString;
            },
            getCompanyReviewUrl: function(id){
                // return baseServer+'/get_review_company';
                return baseServer+webServiceUrl('companies', 'company_reviews', id);;
            },
            addCompanyReviewUrl: function(){
                return baseServer+'/add_review_company';
            },
            getFeaturesCompany: function(id){
                // return baseServer+'/company_featured';
                return baseServer+webServiceUrl('companies', 'company_featured', id);
            },
            saveCompanyChanges : function(){
                return baseServer+'/save_company_changes';
            },
            addProductToFavorite: function() {
                return baseServer + '/add_product_to_favorite';
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
            addDiscussionLikeDislike: function(){
                return baseServer+'/add_discussion_like_dislike';
            },



            // direct requests
            followDiscussion: function(){
                return localhost + 'follow_discussions';
            },
            isUserFollowedDiscussion: function(id){
                return localhost + 'accounts/'+id+'/follow_discussions';
            },
            unfollowDiscussion: function(id){
                return localhost + 'follow_discussions/'+id;
            },
            getChildren: function(){
                return localhost + 'getChildren';
            },
            getModel: function(){
                return localhost + 'getModel';
            },
            runModel: function(){
                return localhost + 'runModel';
            },
            updateServiceStatus: function(id){
                return localhost + 'service_runs/'+id;
            },
            getServiceRun: function(id){
                return localhost + 'service_runs/'+id;
            },
            runService: function(){
                return localhost + 'service_runs';
            },
            getServiceStatus: function(id){
                return localhost + 'services/'+id+'/service_runs';
            },
            createPublishService: function(){
                return localhost + 'publish-services';
            },
            getAuthors: function(){
                return localhost + 'authors';
            },
            getFollowCompanies: function(id){
                return localhost+'accounts/'+id+'/following_companies';
            },
            getFollowCompanyServices: function(){
                return localhost+'follow-company-services';
            },
            getServiceDocuments: function(id){
                return localhost+'service/'+id+'/service-documents';
            },
            getProjectDocuments: function(id){
                return localhost+'projects/'+id+'/project-documents';
            },
            addServiceToProject: function(id){
                return localhost+'services/'+id;
            },
            getMembersUrl: function() {
                return localhost+'members';
            },
            createMembersToProject: function() {
                return localhost+'projects_members';
            },
            followMember: function(id){
                return localhost + 'following_members'+( id ? '/'+id : '');
            },
            getAccountFollowedMembers: function(id){
                return localhost + 'accounts/'+id+'/following_members';
            },
            projectMembers: function(id){
                return localhost + 'projects/'+id+'/projects_members';
            },
            deleteProjectMember: function(id){
                return localhost + 'projects_members/'+id;
            },
            getCreateProject: function() {
                return localhost+'projects';
            },
            getProjects: function(){
                return localhost+'projects';
            },
            getProject: function(id){
                return localhost+'projects/'+id;
            },
            createDiscussion: function(id){
                return localhost+'discussions/create';
            },
            getAssignUsers: function(){
                return localhost+'assign_users';
            },
            createTask: function(){
                return localhost+'tasks/create';
            },
            updateTask: function(id){
                return localhost+'tasks/'+id;
            },
            getMyServices: function(){
                return localhost+'my-services';
            },
            getMyTasks: function(){
                return localhost+'my-tasks';
            },
            getTasks: function(projectId){
                if(projectId){
                    return localhost+'projects/'+projectId+'/tasks';
                }else{
                    return localhost+'tasks';
                }
            },
            followCompany : function(){
                return localhost+'company/follow';
            },
            unfollowCompany : function(id){
                return localhost+'company/unfollow/'+id;
            },
            getRelatedArticles: function(id){
                return localhost+'faq_articles';
            },
            getFAQArticle: function(id){
                return localhost+'faq_articles/'+id;
            },
            getFAQSubcategories: function(){
                return localhost+'faq_subcategories';
            },
            getFAQCategories: function(){
                return localhost+'faq_categories';
            },
            getEvents: function(){
                return localhost+'events';
            },
            getAnnouncements: function(){
                return localhost+'announcements';
            },
            updateCompanyFeaturedPosition: function(id){
                return localhost+'company_featured/'+id+'/position';
            },
            addCompanyFeatured: function(){
                return localhost+'company_featured/add';
            },
            removeCompanyFeatured: function(id){
                return localhost+'company_featured/'+id;
            },
            getCompanyFeatured: function(id){
                return localhost+'companies/'+id+'/company_featured';
            },
            getCompanyServices: function(id){
                return localhost+'companies/'+id+'/company_services';
            },
            getCompanyComponents: function(id){
                return localhost+'companies/'+id+'/company_components';
            },
            getNewCompanyServices: function(id){
                return localhost+'companies/'+id+'/new';
            },
            createStorefrontMessage: function(){
                return localhost+'messages';
            },
            // companies ------------------
            companyURL: function(id){
                var name = 'companies';
                return {
                    get : localhost+name+'/'+id,
                    update : localhost+name+'/'+id,
                    delete : localhost+name+'/'+id,
                    create : localhost+name,
                    all : localhost+name,
                    reviews : localhost + name +'/' + id + '/company_reviews',
                    addReviews : localhost + 'company_reviews',
                    history : localhost + name +'/' + id + '/company_history'
                }
            },
            // ---------------------------
            updateAccount: function(id){
                return localhost+'accounts/'+id;
            },
            getAccount: function(id){
                return localhost+'accounts/'+id;
            },
            // servers ------------------
            serverURL : function(id){
                var name = 'account_servers';
                return {
                    get : localhost+name+'/'+id,
                    update : localhost+name+'/'+id,
                    delete : localhost+name+'/'+id,
                    create : localhost+name,
                    all : localhost+name
                }
            },
            getAccountServersUrl: function(id){
                return localhost+'accounts/'+id+'/account_servers';
            },
            // ---------------------------
            getServices: function(projectId){
                if(projectId){
                    return localhost+'projects/'+projectId+'/services';
                }else{
                    return localhost+'services';
                }
            },
            getComponents: function(){
                return localhost+'components';
            },
            getMarketPopularServices : function(){
                return localhost+'market/popular_services';
            },
            getMarketNewServices : function(){
                return localhost+'market/new_services';
            },
            getMarketServices : function(){
                 return localhost+'market/services';
            },
            getMarketComponents : function(){
                 return localhost+'market/components';
            },
            /// profiles -----------------
            profiles : function(id) {
                var name = 'profiles';
                return {
                    get : localhost + name + '/' + id,
                    update : localhost + name + '/' + id,
                    reviews : localhost + name +'/' + id + '/profile_reviews',
                    addReviews : localhost + 'profile_reviews',
                    history : localhost + name +'/' + id + '/company_history',
                    all : localhost + name
                }
            },
            // ---------------------------


            /// components -----------------
            components : function(type, id) {
                var name = type;
                return {
                    get : localhost + name + '/' + id,
                    update : localhost + name + '/' + id,
                    all: localhost + name,
                    getReply : localhost + 'review/' + id + '/product_reviews?_sort=id&_order=ASC',
                    reviews : localhost + 'product/' + id + '/product_reviews?productType=' + type + '&reviewId=0',
                    addReviews : localhost + 'product_reviews',
                    get_included : localhost + 'included-services',
                    remove_included : localhost + 'included-services/' + id,
                    add_included : localhost + 'included-services',
                    get_tags : localhost + 'service_tags',
                    add_tags : localhost + 'service_tags',
                    get_images : localhost + name + '/' + id + '/service_images',
                    add_images : localhost + 'service_images',
                    remove_images : localhost + 'service_images/' + id,
                    remove_tags : localhost + 'service_tags/' + id,
                    edit_specifications: localhost + 'specifications/' + id,
                    get_array_specifications: localhost + 'array_specifications',
                    add_array_specifications: localhost + 'array_specifications'
                }
            },
            // ---------------------------

            /// services -----------------
            services : function(id) {
                var name = "services";
                return {
                    get : localhost + name + '/' + id,
                    add : localhost + name,
                    get_for_project : localhost + 'projects/' + id + '/' + name,
                    update : localhost + name + '/' + id,
                    all: localhost + name,
                    getReply : localhost + 'review/' + id + '/product_reviews?_sort=id&_order=ASC',
                    reviews : localhost + 'product/' + id + '/product_reviews?reviewId=0',
                    addReviews : localhost + 'product_reviews',
                    get_authors : localhost + name + '/' + id + '/service_authors',
                    remove_authors : localhost + 'service_authors/' + id,
                    get_tags : localhost + name + '/' + id + '/service_tags',
                    add_tags : localhost + 'service_tags',
                    remove_tags : localhost + 'service_tags/' + id,
                    get_history : localhost + name + '/' + id + '/services_history',
                    get_run_history : localhost + name + '/' + id + '/service_runs',
                    get_interfaces : localhost + 'services_interface',
                    get_servers : localhost + 'account_servers',
                    add_servers : localhost + 'services_servers',
                    get_images : localhost + name + '/' + id + '/service_images',
                    add_images : localhost + 'service_images',
                    remove_images : localhost + 'service_images/' + id,
                    get_array_specifications: localhost + 'array_specifications',
                    add_array_specifications: localhost + 'array_specifications',
                    get_specifications: localhost + name + '/' + id + '/specifications',
                    edit_specifications: localhost + 'specifications/' + id,
                    get_inputs_outputs: localhost + name + '/' + id + '/service_input_output',
                    get_statistics: localhost + name + '/' + id + '/services_statistic',
                    add_interface: localhost + 'dome-interfaces',
                    get_interface: localhost + name + '/' + id + '/dome-interfaces'
                }
            },
            // ---------------------------

            getFavoriteProducts: function(){
                return localhost+'favorite_products';
            },
            deactivateAccount : function(id){
                return localhost+'accounts'+(id ? '/'+id : '');
            },
            getAllDiscussions: function(projectId){
                if(projectId) {
                    return localhost + 'projects/' + projectId + '/all-discussions';
                }else{
                    return localhost + 'all-discussions';
                }
            },
            getDiscussions : function(projectId,dataTypeWidget){
                if(!projectId && !dataTypeWidget) {
                    return localhost + 'discussions';
                }else{
                    if(projectId){
                        if(dataTypeWidget){
                            switch(dataTypeWidget){
                                case 'following':
                                    return localhost + 'projects/' + projectId + '/following_discussions';
                                default:
                                    return localhost + 'projects/' + projectId + '/discussions';
                            }
                        }else{
                            return localhost + 'projects/'+projectId+'/discussions';
                        }
                    }else if(dataTypeWidget){
                        switch(dataTypeWidget){
                            case 'following':
                                return localhost + 'following_discussions';
                            case 'popular':
                                return localhost + 'popular_discussions';
                            case 'follow-people':
                                return localhost + 'follow_people_discussions';
                            default:
                                return localhost + 'discussions';
                        }
                    }
                }
            },
            deleteCompanyLogo : function(id){
                return localhost+'companies'+(id ? '/'+id : '');
            },
            saveChangedDiscussionComment : function(id){
                return localhost+'individual-discussion-comments'+(id ? '/'+id : '');
            },
            addDiscussionTag : function(){
                return localhost+'individual-discussion-tags';
            },
            getLastDiscussionTagId : function(){
                return localhost+'individual-discussion-tags';
            },
            getDiscussionTags : function(id){
                return localhost+'individual-discussion/'+id+'/individual-discussion-tags'
            },
            deleteDiscussionTag : function(id){
                return localhost+'individual-discussion-tags'+(id ? '/'+id : '');
            },
            deleteDiscussionComment : function(id){
                return localhost+'individual-discussion-comments'+(id ? '/'+id : '');
            },
            getDiscussionComments : function(id){
                return localhost+'individual-discussion/'+id+'/individual-discussion-comments';
            },
            getIndividualDiscussion: function(id){
                return localhost+'individual-discussion'+(id ? '/'+id : '');
            },
            getIndividualDiscussions: function(){
                return localhost+'individual-discussion';
            },
            addCommentIndividualDiscussion: function(){
                return localhost+'individual-discussion-comments'
            },
            getLastDiscussionCommentId : function(){
                return localhost+'individual-discussion-comments'
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
            getCompanyMembers : function(id){
                return localhost+'companies/'+id+'/company_members'
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
            updateCompany: function(id){
                return localhost+'companies/'+id;
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
            },
            getService: function(id){
                return localhost+'services'+(id ? '/'+id : '');
            },
            getFavorites: function(){
                return localhost+'favorite_products';
            },
            getFavoriteService: function(id){
                return localhost+'account/'+id+'/favorite_products';
            },
            getFavorite: function(){
                return localhost+'favorite_products';
            },
            addFavorite: function(){
                return localhost+'favorite_products';
            },
            deleteFavorite: function(id){
                return localhost+'favorite_products/'+id;
            },
            getUserUrl: function(){
                return localhost+'user';
            },
            getAccountNotifications: function(){
                return localhost+'account-notification-categories';
            },
            getUserAccountNotifications: function(account_id){
                return localhost+'accounts/'+account_id+'/account-notification-settings';
            },
            updateUserAccountNotification: function(id){
                return localhost+'account-notification-settings/'+id;
            },
            getNotifications: function(){
                return localhost+'notifications';
            },
            getNotificationsStatistic: function(){
                return localhost+'notifications-statistic';
            }
        };
    }
)