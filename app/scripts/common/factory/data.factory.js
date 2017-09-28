'use strict';

angular.module('dmc.data', [])
  .factory('dataFactory', function($window, $location) {
    var baseServer = $window.apiUrl ? $window.apiUrl : '/static/?p=';
    var baseServerStatic = $window.apiUrl ? $window.apiUrl.substring(0, $window.apiUrl.length - 5) + '/static' : '/static';
    var localhost = ($location.$$absUrl.indexOf('http://localhost') != -1 || $location.$$absUrl.indexOf(':9000') != -1 ? 'http://localhost:3000/' : '');
    //localhost = $window.apiUrl ? $window.apiUrl + '/' : localhost;
    localhost = 'http://localhost:3000/';
    console.log('localhost ' + localhost)
    var urlSocketServer = 'http://localhost:3000/';
    var appendId = function(id) {
      return ($window.apiUrl && id ? '/' + id : '');
    };
    var webServiceUrl = function(path, action, id) {
      var wsurl;
      if ($window.apiUrl && id) {
        wsurl = '/' + path + '/' + id;
        wsurl += action ? '/' + action : '';
      } else {
        wsurl = '/' + action;
      }
      return wsurl;
    };

    var convertParams = function(params) {
      return $.map(params, function(item, key) {
        return key + '=' + item;
      }).join('&');
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
      get_request_obj: function(source) {
        var obj = {}
        if ($window.apiUrl) {
          obj = _.transform(source, function(result, value, key) {
            if (value && key != 'projectId' && key != 'profileId' && key != 'companyId') {
              result['_' + key] = value;
            }
          });
        } else {
          obj = source;
        }
        return obj;
      },
      url_php_server: function() {
        return baseServer;
      },
      url_socket_server: function() {
        return urlSocketServer;
      },
      getUrlAllServices: function(id) {
        // return baseServer+'/services'+appendId(id);
        return baseServer + webServiceUrl('projects', 'services', id);
      },
      getUrlChangeService: function(id) {
        return baseServer + '/change_service' + appendId(id);
      },
      getStaticJSON: function(id) {
        return baseServerStatic + '/staticJSON.php?title=' + id;
      },
      getUrlAllTasks: function(id) {
        // return baseServer+'/tasks'+appendId(id);
        return baseServer + webServiceUrl('projects', 'tasks', id);
      },
      getUrlChangeTask: function(id) {
        return baseServer + '/change_tasks' + appendId(id);
      },
      getUrlAllDiscussions: function(id) {
        // return baseServer+'/discussions'+appendId(id);
        return baseServer + webServiceUrl('projects', 'all-discussions', id);
      },
      getUrlAllProjects: function(id) {
        return baseServer + '/projects';
      },
      getWorspaceByName: function(name) {
        return localhost + 'searchworkspace/' + name;
      },
      getUrlAllComponents: function(id) {
        return baseServer + webServiceUrl('projects', 'components', id);
      },
      getUrlAllProducts: function() {
        return baseServer + '/products';
      },
      getUrlAddToProject: function(id) {
        return baseServer + '/add_to_project' + appendId(id);
      },
      getUrlRemoveFromProject: function(id) {
        return baseServer + '/remove_from_project' + appendId(id);
      },
      getUrlAllDocuments: function(id) {
        return baseServer + '/documents' + appendId(id);
      },
      getDocumentUpload: function(id) {
        return baseServer + '/upload' + appendId(id);
      },
      documentUpload: function() {
        return baseServer + '/upload';
      },
      getUrlCreateTask: function(id) {
        var url = baseServer + '/create_task' + appendId(id);
        if (window.apiUrl) {
          url = baseServer + '/tasks/create';
        }
        return url
      },
      getProduct: function() {
        return baseServer + '/product';
      },
      getProductReview: function() {
        return baseServer + '/get_product_review';
      },
      addProductReview: function() {
        return baseServer + '/add_product_review';
      },
      addLikeDislike: function() {
        return baseServer + '/add_like_dislike';
      },
      editProduct: function() {
        return baseServer + '/edit_product';
      },
      uploadAccountPictureUrl: function() {
        return baseServer + '/upp';
      },
      uploadCompanyPictureUrl: function() {
        return baseServer + '/ucp';
      },
      uploadCompanyLogoUrl: function() {
        return baseServer + '/ucl';
      },
      uploadCompanyProfileImageUrl: function() {
        return baseServer + '/uci';
      },
      uploadCompanyProfileSkillImageUrl: function() {
        return baseServer + '/ucsi';
      },
      uploadProfilePictureUrl: function() {
        return baseServer + '/uprpic';
      },
      removeCompanyImages: function() {
        return baseServer + '/remove_company_images';
      },
      removeCompanySkillsImages: function() {
        return baseServer + '/remove_company_skills_images';
      },
      getAccountUrl: function(id) {
        return baseServer + '/get_account' + appendId(id);
      },
      getCompanyUrl: function(id) {
        var idString = $window.apiUrl ? '' : '&id=' + id;
        return baseServer + '/companies' + appendId(id) + idString;
      },
      getCompanyShortUrl: function(id){
          return baseServer+'/companies/short';
      },
      getCompanyReviewUrl: function(id) {
        // return baseServer+'/get_review_company';
        return baseServer + webServiceUrl('companies', 'company_reviews', id);
      },
      addCompanyReviewUrl: function() {
        return baseServer + '/add_review_company';
      },
      getFeaturesCompany: function(id) {
        // return baseServer+'/company_featured';
        return baseServer + webServiceUrl('companies', 'company_featured', id);
      },
      saveCompanyChanges: function() {
        return baseServer + '/save_company_changes';
      },
      addProductToFavorite: function() {
        return baseServer + '/add_product_to_favorite';
      },
      getProfile: function(id) {
        return baseServer + '/profiles' + appendId(id);
      },
      editProfile: function() {
        return baseServer + '/edit_profile';
      },
      getProfileReview: function(id) {
        return baseServer + webServiceUrl('profiles', 'profile_reviews', id);
      },
      addProfileReview: function() {
        return baseServer + '/add_profile_review';
      },
      updateFeaturesPosition: function() {
        return baseServer + '/update_features_position';
      },
      addDiscussionLikeDislike: function() {
        return baseServer + '/add_discussion_like_dislike';
      },
      logoutUrl: function(custom) {
        var home = $window.location.origin;
        return home + '/Shibboleth.sso/Logout?return=' + (custom || home);
      },



      // direct requests
      shareService: function() {
        return localhost + 'shared-services';
      },
      deleteService: function(id) {
        return localhost + 'services/' + id;
      },
      followDiscussion: function() {
        return localhost + 'follow_discussions';
      },
      isUserFollowedDiscussion: function(id) {
        return localhost + 'accounts/' + id + '/follow_discussions';
      },
      unfollowDiscussion: function(id) {
        return localhost + 'follow_discussions/' + id;
      },
      getChildren: function() {
        return localhost + 'getChildren';
      },
      getModel: function() {
        return localhost + 'getModel';
      },
      runModel: function() {
        return localhost + 'model_run';
      },
      runModelWithFile: function() {
        return localhost + 'model_run_file';
      },
      pollModel: function(id) {
        return localhost + 'model_poll/' + id;
      },
      updateServiceStatus: function(id) {
        return localhost + 'service_runs/' + id;
      },
      cancelServiceRun: function(id) {
        return localhost + 'service_runs/cancel_run/' + id;
      },
      getServiceRun: function(id) {
        return localhost + 'service_runs/' + id;
      },
      runService: function() {
        return localhost + 'service_runs';
      },
      getServiceStatus: function(id) {
        return localhost + 'services/' + id + '/service_runs';
      },
      createPublishService: function() {
        return localhost + 'publish-services';
      },
      getFollowCompanies: function(id) {
        return localhost + 'accounts/' + id + '/following_companies';
      },
      getFollowCompanyServices: function() {
        return localhost + 'follow-company-services';
      },
      getServiceDocuments: function(id) {
        return localhost + 'service/' + id + '/service_documents';
      },
      getProjectDocuments: function(id) {
        return localhost + 'projects/' + id + '/project_documents';
      },
      addProjectDocument: function() {
        return localhost + 'project_documents';
      },
      updateProjectDocument: function(id) {
        return localhost + 'project_documents/' + id;
      },
      deleteProjectDocument: function(id) {
        return localhost + 'project_documents/' + id;
      },
      addServiceToProject: function(id) {
        return localhost + 'services/' + id;
      },
      getMembersUrl: function(id) {
        return localhost + 'members';
      },
      getMembersToProject: function() {
        return localhost + 'projects_members';
      },
      createMembersToProject: function() {
        return localhost + 'projects_members';
      },
      acceptProject: function(projectId, memberId) {
        return localhost + 'projects/' + projectId + '/accept/' + memberId;
      },
      declineProject: function(projectId, memberId) {
        return localhost + 'projects/' + projectId + '/reject/' + memberId;
      },
      getProjectMembers: function(id) {
        return localhost + 'projects_members';
      },
      getMembersToProjectById: function(id) {
        return localhost + 'projects_members/' + id;
      },
      updateMembersToProject: function(id) {
        return localhost + 'projects_members/' + id;
      },
      inviteToProject: function(pid, uid) {
        return localhost + 'project/' + pid + '/invite/' + uid;
      },
      removeMembersToProject: function(id) {
        return localhost + 'projects_members/' + id;
      },
      joinProject: function() {
        return localhost + 'projects_join_requests';
      },
      joinProjectRequests: function(id) {
        return localhost + 'projects/' + id + '/joinApprovalRequests';
      },
      manageJoinRequests: function(id) {
        return {
          accept: localhost + 'projectJoinApprovalRequests/' + id + '?action=approve',
          decline: localhost + 'projectJoinApprovalRequests/' + id + '?action=decline'
        };
      },
      getProjectsJoinRequests: function() {
        return localhost + 'projects_join_requests';
      },
      getProjectJoinRequests: function(id) {
        return localhost + 'projects/' + id + '/projects_join_requests';
      },
      deleteProjectJoinRequests: function(id) {
        return localhost + 'projects_join_requests/' + id;
      },
      updateProjectJoinRequests: function(id) {
        return localhost + 'projects_join_requests/' + id;
      },
      addCompanyJoinRequest: function() {
        return localhost + 'companies_join_requests';
      },
      cancelCompanyJoinRequest: function(id) {
        return localhost + 'companies_join_requests/' + id;
      },
      getProfileCompanyJoinRequest: function(id) {
        return localhost + 'profiles/' + id + '/companies_join_requests';
      },
      addSuggestJoinCompany: function() {
        return localhost + 'suggest_join_companies';
      },
      cancelSuggestJoinCompany: function(id) {
        return localhost + 'suggest_join_companies/' + id;
      },
      getSuggestJoinCompany: function(id) {
        return localhost + 'companies/' + id + '/suggest_join_companies';
      },
      followMember: function(id) {
        return localhost + 'following_members' + (id ? '/' + id : '');
      },
      getAccountFollowedMembers: function(id) {
        return localhost + 'accounts/' + id + '/following_members';
      },
      projectMembers: function(id) {
        return localhost + 'projects/' + id + '/projects_members';
      },
      deleteProjectMember: function(id) {
        return localhost + 'projects_members/' + id;
      },
      deleteProject: function(id) {
        return localhost + 'projects/' + id;
      },
      getCreateProject: function() {
        return localhost + 'projects/create';
      },
      getProjects: function(type) {
        return localhost + (type == 'all-projects' ? 'projects/all' : 'projects');
      },
      getPublicProjects: function() {
        return localhost + 'projects/public';
      },
      getMyProjects: function() {
        return localhost + 'projects/my-projects';
      },
      getProject: function(id) {
        return localhost + 'projects/' + id;
      },
      updateProject: function(id) {
        return localhost + 'projects/' + id;
      },
      addProjectTag: function() {
        return localhost + 'projects_tags';
      },
      getProjectsTags: function() {
        return localhost + 'projects_tags';
      },
      deleteProjectTag: function(id) {
        return localhost + 'projects_tags/' + id;
      },
      getProjectTags: function(id) {
        return localhost + 'projects/' + id + '/projects_tags/';
      },
      getAssignUsers: function() {
        return localhost + 'assign_users';
      },
      createTask: function() {
        return localhost + 'tasks/create';
      },
      updateTask: function(id) {
        return localhost + 'tasks/' + id;
      },
      getMyServices: function() {
        return localhost + 'my-services';
      },
      getMyTasks: function() {
        return localhost + 'my-tasks';
      },
      getTasks: function(projectId) {
        if (projectId) {
          return localhost + 'projects/' + projectId + '/tasks';
        } else {
          return localhost + 'tasks';
        }
      },
      getTask: function(id) {
        return localhost + 'tasks/' + id;
      },
      deleteTask: function(id) {
        return localhost + 'tasks/' + id;
      },
      followCompany: function() {
        return localhost + 'company/follow';
      },
      unfollowCompany: function(id) {
        return localhost + 'company/unfollow/' + id;
      },
      getRelatedArticles: function(id) {
        return localhost + 'faq_articles';
      },
      getFAQArticle: function(id) {
        return localhost + 'faq_articles/' + id;
      },
      getFAQSubcategories: function() {
        return localhost + 'faq_subcategories';
      },
      getFAQCategories: function() {
        return localhost + 'faq_categories';
      },
      getEvents: function() {
        return localhost + 'events';
      },
      getAnnouncements: function() {
        return localhost + 'announcements';
      },
      getAnnouncementsComments: function(id) {
        return localhost + 'announcements/' + id + '/announcement_comments';
      },
      updateCompanyFeaturedPosition: function(id) {
        return localhost + 'company_featured/' + id + '/position';
      },
      addCompanyFeatured: function() {
        return localhost + 'company_featured/add';
      },
      removeCompanyFeatured: function(id) {
        return localhost + 'company_featured/' + id;
      },
      getCompanyFeatured: function(id) {
        return localhost + 'companies/' + id + '/company_featured';
      },
      getCompanyServices: function(id) {
        return localhost + 'companies/' + id + '/company_services';
      },
      getCompanyComponents: function(id) {
        return localhost + 'companies/' + id + '/company_components';
      },
      getNewCompanyServices: function(id) {
        return localhost + 'companies/' + id + '/new';
      },
      createStorefrontMessage: function() {
        return localhost + 'messages';
      },
      userRole: function() {
        return localhost + 'userRole';
      },
      updateUser: function() {
        return localhost + 'user';
      },
      generateToken: function(id) {
        return localhost + 'user/createtoken?userId=' + id;
      },
      emailToken: function(id, token) {
        return localhost + 'users/' + id + '/email?token=' + token;
      },
      validateToken: function(id, token) {
        return localhost + 'users/' + id + '?action=verify'
      },
      unverify: function(id) {
        return localhost + 'users/' + id + '?action=unverify';
      },
      declineMember: function(id) {
        return localhost + 'users/' + id + '?action=decline';
      },
      uploadApplication: function() {
        return localhost + 'appSubmission';
      },
      getApplicationNames: function() {
        return localhost + 'appSubmission/appName';
      },
      getDmdiiMemberTags: function() {
        return localhost + 'tags/dmdiiMember';
      },
      getOrgTags: function() {
        return localhost + 'tags/organization';
      },
      getUsersByOrganization: function(id) {
        return localhost + 'user/organization/' + id
        //add paged and filtered
      },
      changeUserOrganization: function(id) {
        return localhost + 'users/' + id + '/organizations';
      },
      getOrganizationList: function() {
        return localhost + 'organizations';
      },
      getOrganization: function(id) {
        return localhost + 'organizations/' + id;
      },
      updateOrganization: function(id) {
        return localhost + 'organizations/' + id;
      },
      createOrganization: function(id) {
        return localhost + 'organizations/';
      },
      deleteOrganization: function(id) {
        return localhost + 'organizations/' + id;
      },
      getDocument: function() {
        return {
          byType: localhost + 'documents/organization'
        }
      },
      getDMDIIMember: function(id) {
        return {
          get: localhost + 'dmdiiMember/' + id,
          all: localhost + 'dmdiiMember',
          full: localhost + 'dmdiiMember/all',
          search: localhost + 'dmdiiMember/search',
          map: localhost + 'dmdiiMember/mapEntry'
        }
      },
      dmdiiMemberNewsUrl: function(id) {
        return {
          get: localhost + 'dmdiiMember/news',
          save: localhost + 'dmdiiMember/news',
          delete: localhost + 'dmdiiMember/news/' + id
        }
      },
      dmdiiMemberEventUrl: function(id) {
        return {
          get: localhost + 'dmdiiMember/events',
          save: localhost + 'dmdiiMember/events',
          delete: localhost + 'dmdiiMember/events/' + id
        }
      },
      getDMDIIMemberProjects: function() {
        return {
          prime: localhost + 'dmdiiprojects/member',
          contributing: localhost + 'contributingCompanies'
        }
      },
      saveDMDIIMember: function() {
        return {
          member: localhost + 'dmdiiMember/save'
        }
      },
      getDMDIIProject: function(id) {
        return {
          get: localhost + 'dmdiiProject/' + id,
          all: localhost + 'dmdiiprojects',
          delete: localhost + 'dmdiiProjects/' + id,
          active: localhost + 'dmdiiprojects/member/active',
          contributors: localhost + 'dmdiiproject/contributingcompanies',
          search: localhost + 'dmdiiprojects/search'
        }
      },
      getDMDIIEvents: function(id) {
        return {
          get: localhost + 'dmdiievent/' + id,
          all: localhost + 'dmdiievents'
        }
      },
      saveDMDIIProject: function() {
        return {
          project: localhost + 'dmdiiProject/save'
        }
      },
      dmdiiProjectUpdateUrl: function(id) {
        return {
          get: localhost + 'dmdiiProjectUpdate',
          save: localhost + 'dmdiiProjectUpdate',
          delete: localhost + 'dmdiiProjectUpdate/' + id
        }
      },
      dmdiiProjectEventUrl: function(id) {
        return {
          get: localhost + 'dmdiiProject/events',
          save: localhost + 'dmdiiProject/events',
          delete: localhost + 'dmdiiProject/events/' + id
        }
      },
      dmdiiProjectNewsUrl: function(id) {
        return {
          get: localhost + 'dmdiiProject/news',
          save: localhost + 'dmdiiProject/news',
          delete: localhost + 'dmdiiProject/news/' + id
        };
      },
      quicklinkUrl: function(id) {
        return {
          get: localhost + 'dmdiiquicklink',
          save: localhost + 'dmdiiquicklink',
          delete: localhost + 'dmdiiquicklink/' + id
        };
      },
      payment: function(){
        return {
          pay: localhost + 'payment',
          organizations: localhost + 'organizations/user'
        };
      },
      getDMDIIDocuments: function(id) {
        return {
          all: localhost + 'dmdiidocuments',
          single: localhost + 'dmdiidocument/' + id,
          project: localhost + 'dmdiidocuments/dmdiiProjectId',
          overview: localhost + 'staticdocument/1',
          status: localhost + 'staticdocument/2',
          projectDocument: localhost + 'dmdiidocument/filetype'
        };
      },
      saveDMDIIDocument: function() {
        return localhost + 'dmdiidocument';
      },
      deleteDMDIIDocument: function(id) {
        return localhost + 'dmdiidocument/' + id;
      },
      documentsUrl: function(id, user, internal, email, url) {
        return {
          getSingle: localhost + 'documents/' + id,
          getList: localhost + 'documents',
          getListIds: localhost + 'documents?ids=' + id,
          download: localhost + 'documents/' + id + '/download',
          save: localhost + 'documents',
          update: localhost + 'documents/' + id,
          delete: localhost + 'documents/' + id,
          versioned: localhost + 'documents/versions/' + id,
          s_versioned: localhost + 'documents/s_versions/' + id,
          // share: localhost + 'documents/'+id+'/user/'+userid
          share: localhost + 'documents/' + id + '/share?user=' + user + '&internal=' + internal + '&email=' + email,
          accept: localhost + 'documents/' + id + '/accept',
          shareWs: localhost + 'documents/' + id + '/shareWs?ws=' + user,
          // saveSr: localhost + 'documents/' + id + '/saveSr?url=' + user
          saveSr: localhost + 'documents/' + id + '/saveSr'
        }
      },
      directoriesUrl: function(id) {
        var endpoint = 'directories/';
        return {
          get: localhost + endpoint + id,
          list: localhost + endpoint,
          save: localhost + endpoint,
          update: localhost + endpoint + id,
          delete: localhost + endpoint + id,
          files: localhost + 'documents/' + endpoint + id,
          s_files: localhost + 'documents/' + 's_' + endpoint + id
        }
      },
      getApplicationTags: function() {
        return localhost + 'applicationTag'
      },
      getDmdiiDocumentTags: function() {
        return localhost + 'dmdiidocuments/getAllTags';
      },
      getDocumentTags: function() {
        return localhost + 'documents/tags';
      },
      createDocumentTag: function() {
        return localhost + 'dmdiidocuments/saveDocumentTag';
      },
      getNonDmdiiMembers: function() {
        return localhost + 'organization/nonMember';
      },
      // companies ------------------
      companyURL: function(id) {
        var name = 'companies';
        return {
          get: localhost + name + '/' + id,
          update: localhost + name + '/' + id,
          delete: localhost + name + '/' + id,
          create: localhost + name,
          all: localhost + name,
	        short : localhost+name+'/short',
          reviews: localhost + name + '/' + id + '/company_reviews?reviewId=0',
          addReviews: localhost + 'company_reviews',
          get_review: localhost + 'company_reviews/' + id,
          update_review: localhost + 'company_reviews/' + id,
          getReply: localhost + 'company_reviews?reviewId=' + id,
          getHelpful: localhost + 'company_reviews_helpful',
          addHelpful: localhost + 'company_reviews_helpful',
          updateHelpful: localhost + 'company_reviews_helpful/' + id,
          getFlagged: localhost + 'company_reviews_flagged',
          addFlagged: localhost + 'company_reviews_flagged',
          history: localhost + name + '/' + id + '/company_history',
          profiles: localhost + name + '/' + id + '/profiles',
          get_removed_members: localhost + name + '/' + id + '/removed_company_members',
          remove_member: localhost + 'removed_company_members',
          remove_member_from_removed: localhost + 'removed_company_members/' + id,
          get_member_requests: localhost + name + '/' + id + '/companies_join_requests',
          approve_member: localhost + 'companies_join_requests/' + id,
          decline_member: localhost + 'companies_join_requests/' + id,
          add_contact_method: localhost + 'company_contact_methods',
          get_contact_methods: localhost + name + '/' + id + '/company_contact_methods',
          update_contact_method: localhost + 'company_contact_methods/' + id,
          delete_contact_method: localhost + 'company_contact_methods/' + id
        }
      },
      // ---------------------------
      updateAccount: function(id) {
        return localhost + 'accounts/' + id;
      },
      getAccount: function(id) {
        return localhost + 'accounts/' + id;
      },
      // servers ------------------
      serverURL: function(id) {
        var name = 'account_servers';
        return {
          get: localhost + name + '/' + id,
          update: localhost + name + '/' + id,
          delete: localhost + name + '/' + id,
          create: localhost + name,
          all: localhost + name
        }
      },
      getAccountServersUrl: function(id) {
        return localhost + 'accounts/' + id + '/account_servers';
      },
      getServerSecureUrl: function(id) {
        return localhost + 'accounts/' + id + '/servers';
      },
      // ---------------------------
      getServices: function(projectId) {
        if (projectId) {
          return localhost + 'projects/' + projectId + '/services';
        } else {
          return localhost + 'services';
        }
      },
      getComponents: function() {
        return localhost + 'components';
      },
      getMarketPopularServices: function() {
        return localhost + 'market/popular_services';
      },
      getMarketNewServices: function() {
        return localhost + 'market/new_services';
      },
      getMarketServices: function() {
        return localhost + 'market/new_services';
      },
      getMarketComponents: function() {
        return localhost + 'market/components';
      },
      getMarketPlaceServices: function() {
          return localhost + 'market/services';
      },
      getServicesTags: function() {
        return localhost + 'service_tags';
      },
      getDefaultServices: function() {
        return localhost + 'defaultServices';
      },
      getDefaultService: function(parentId) {
        return localhost + 'defaultServices/' + parentId;
      },
      userFavorites: function(contentId, contentType) {
          var name = 'userFavorites';
          return {
              get: localhost + name + ((contentType != null) ? '?contentType=' + contentType : ''),
              create: localhost + name + '?contentId=' + contentId + '&contentType=' + contentType,
              delete: localhost + name + '?contentId=' + contentId + '&contentType=' + contentType,
          };
      },
      /// profiles -----------------
      profiles: function(id) {
        var name = 'profiles';
        return {
          get: localhost + name + '/' + id,
          update: localhost + name + '/' + id,
          reviews: localhost + name + '/' + id + '/profile_reviews?reviewId=0',
          get_review: localhost + 'profile_reviews/' + id,
          addReviews: localhost + 'profile_reviews',
          update_review: localhost + 'profile_reviews/' + id,
          getReply: localhost + 'profile_reviews?reviewId=' + id,
          getHelpful: localhost + 'profile_reviews_helpful',
          addHelpful: localhost + 'profile_reviews_helpful',
          updateHelpful: localhost + 'profile_reviews_helpful/' + id,
          getFlagged: localhost + 'profile_reviews_flagged',
          addFlagged: localhost + 'profile_reviews_flagged',
          history: localhost + name + '/' + id + '/profile_history',
          all: localhost + name
        }
      },
      getRecentUpdates: function() {
        return localhost + 'recent_updates';
      },
      // ---------------------------


      /// components -----------------
      components: function(type, id) {
        var name = type;
        return {
          get: localhost + name + '/' + id,
          update: localhost + name + '/' + id,
          all: localhost + name,
          getReply: localhost + 'product_reviews?reviewId=' + id,
          get_review: localhost + 'product_reviews/' + id,
          update_review: localhost + 'product_reviews/' + id,
          reviews: localhost + 'product/' + id + '/product_reviews?productType=' + type + '&reviewId=0',
          addReviews: localhost + 'product_reviews',
          getHelpful: localhost + 'product_reviews_helpful',
          addHelpful: localhost + 'product_reviews_helpful',
          updateHelpful: localhost + 'product_reviews_helpful/' + id,
          getFlagged: localhost + 'product_reviews_flagged',
          addFlagged: localhost + 'product_reviews_flagged',
          get_included: localhost + 'included-services',
          remove_included: localhost + 'included-services/' + id,
          add_included: localhost + 'included-services',
          get_tags: localhost + 'service_tags',
          add_tags: localhost + 'service_tags',
          get_images: localhost + name + '/' + id + '/service_images',
          add_images: localhost + 'service_images',
          remove_images: localhost + 'service_images/' + id,
          remove_tags: localhost + 'service_tags/' + id,
          edit_specifications: localhost + 'specifications/' + id,
          get_array_specifications: localhost + 'array_specifications',
          add_array_specifications: localhost + 'array_specifications'
        }
      },
      // ---------------------------

      /// services -----------------
      services: function(id) {
        var name = 'services';
        return {
          get: localhost + name + '/' + id,
          getArray: localhost + name + "?id=" + id,
          add: localhost + name,
          get_for_project: localhost + 'projects/' + id + '/' + name,
          update: localhost + name + '/' + id,
          all: localhost + name,
          getReply: localhost + 'product_reviews?reviewId=' + id,
          reviews: localhost + 'product/' + id + '/product_reviews?reviewId=0',
          get_review: localhost + 'product_reviews/' + id,
          update_review: localhost + 'product_reviews/' + id,
          addReviews: localhost + 'product_reviews',
          getHelpful: localhost + 'product_reviews_helpful',
          addHelpful: localhost + 'product_reviews_helpful',
          updateHelpful: localhost + 'product_reviews_helpful/' + id,
          getFlagged: localhost + 'product_reviews_flagged',
          addFlagged: localhost + 'product_reviews_flagged',
          get_authors: localhost + 'services/' + id + '/service_authors',
          remove_authors: localhost + 'service_authors/' + id,
          add_authors: localhost + 'service_authors',
          get_tags: localhost + name + '/' + id + '/service_tags',
          add_tags: localhost + 'service_tags',
          remove_tags: localhost + 'service_tags/' + id,
          update_tag: localhost + 'service_tags/' + id,
          get_history: localhost + name + '/' + id + '/services_history',
          get_run_history: localhost + 'service_runs' + '?serviceId=' + id,
          get_servers: localhost + 'account_servers',
          add_servers: localhost + 'services_servers',
          get_array_specifications: localhost + 'array_specifications',
          add_array_specifications: localhost + 'array_specifications',
          get_specifications: localhost + name + '/' + id + '/specifications',
          add_specifications: localhost + 'service/' + id + '/specifications',
          update_specifications: localhost + '/specifications/' + id,
          get_statistics: localhost + name + '/' + id + '/services_statistic',
          add_interface: localhost + 'dome-interfaces',
          get_interface: localhost + name + '/' + id + '/dome-interfaces',
          update_interface: localhost + 'dome-interfaces/' + id,
          get_position_inputs: localhost + name + '/' + id + '/input-positions',
          update_position_inputs: localhost + 'input-positions/' + id,
          add_position_inputs: localhost + 'input-positions'
        }
      },
      // ---------------------------

      uploadServiceImageUrl: function() {
        return baseServer + '/uploadServiceImage';
      },

      getFavoriteProducts: function() {
        return localhost + 'favorite_products';
      },
      deactivateAccount: function(id) {
        return localhost + 'accounts' + (id ? '/' + id : '');
      },
      getDiscussions: function(projectId, dataTypeWidget) {
        if (!projectId && !dataTypeWidget) {
          return localhost + 'individual-discussions';
        } else {
          if (projectId) {
            if (dataTypeWidget) {
              switch (dataTypeWidget) {
                case 'following':
                  return localhost + 'projects/' + projectId + '/following_discussions';
                default:
                  return localhost + 'projects/' + projectId + '/individual-discussions';
              }
            } else {
              return localhost + 'projects/' + projectId + '/individual-discussion';
            }
          } else if (dataTypeWidget) {
            switch (dataTypeWidget) {
              case 'following':
                return localhost + 'following_discussions';
              case 'popular':
                return localhost + 'popular_discussions';
              case 'follow-people':
                return localhost + 'follow_people_discussions';
              default:
                return localhost + 'individual-discussion';
            }
          }
        }
      },
      deleteCompanyLogo: function(id) {
        return localhost + 'companies' + (id ? '/' + id : '');
      },
      saveChangedDiscussionComment: function(id) {
        return localhost + 'individual-discussion-comments' + (id ? '/' + id : '');
      },
      addDiscussionTag: function() {
        return localhost + 'individual-discussion-tags';
      },
      getLastDiscussionTagId: function() {
        return localhost + 'individual-discussion-tags';
      },
      getDiscussionTags: function(id) {
        return localhost + 'individual-discussion/' + id + '/individual-discussion-tags'
      },
      deleteDiscussionTag: function(id) {
        return localhost + 'individual-discussion-tags' + (id ? '/' + id : '');
      },
      deleteDiscussionComment: function(id) {
        return localhost + 'individual-discussion-comments' + (id ? '/' + id : '');
      },
      getDiscussionComments: function(id) {
        return localhost + 'individual-discussion/' + id + '/individual-discussion-comments?commentId=0';
      },
      ///
      getDiscussionsReply: function(id) {
        return localhost + 'individual-discussion-comments?commentId=' + id;
      },
      getDiscussionCommentsHelpful: function() {
        return localhost + 'individual-discussion-comments-helpful';
      },
      addDiscussionCommentsHelpful: function() {
        return localhost + 'individual-discussion-comments-helpful';
      },
      updateDiscussionCommentsHelpful: function(id) {
        return localhost + 'individual-discussion-comments-helpful/' + id;
      },
      getDiscussionCommentsFlagged: function() {
        return localhost + 'individual-discussion-comments-flagged';
      },
      addDiscussionCommentsFlagged: function() {
        return localhost + 'individual-discussion-comments-flagged';
      },
      ///
      getIndividualDiscussion: function(id) {
        return localhost + 'individual-discussion' + (id ? '/' + id : '');
      },
      getIndividualDiscussions: function() {
        return localhost + 'individual-discussion';
      },
      addCommentIndividualDiscussion: function() {
        return localhost + 'individual-discussion-comments'
      },
      getLastDiscussionCommentId: function() {
        return localhost + 'individual-discussion-comments'
      },
      getLastDiscussionId: function() {
        return localhost + 'individual-discussion'
      },
      addDiscussion: function() {
        return localhost + 'individual-discussion'
      },
      /*
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
      */
      getCompanyMembers: function(id) {
        return localhost + 'companies/' + id + '/company_members'
      },
      getCompanyKeyContacts: function(id) {
        return localhost + 'companies/' + id + '/company_key_contacts'
      },
      addCompanySkill: function() {
        return localhost + 'company_skills'
      },
      getLastCompanySkillId: function() {
        return localhost + 'company_skills'
      },
      deleteCompanySkill: function(id) {
        return localhost + 'company_skills/' + id;
      },
      getLastCompanyContactId: function() {
        return localhost + 'company_key_contacts'
      },
      addCompanyContact: function() {
        return localhost + 'company_key_contacts'
      },
      updateCompany: function(id) {
        return localhost + 'companies/' + id;
      },
      updateCompanyProfile: function(id) {
        return localhost + 'companies/' + id;
      },
      getLastCompanyVideoId: function() {
        return localhost + 'company_videos';
      },
      addCompanyVideo: function() {
        return localhost + 'company_videos';
      },
      deleteCompanyVideo: function(id) {
        return localhost + 'company_videos/' + id;
      },
      deleteCompanyContact: function(id) {
        return localhost + 'company_key_contacts/' + id;
      },
      updateCompanyImage: function(id) {
        return localhost + 'company_images/' + id;
      },
      deleteCompanyImage: function(id) {
        return localhost + 'company_images/' + id;
      },
      updateCompanySkillsImage: function(id) {
        return localhost + 'company_skill_images/' + id;
      },
      deleteCompanySkillsImage: function(id) {
        return localhost + 'company_skill_images/' + id;
      },
      updateCompanyVideo: function(id) {
        return localhost + 'company_videos/' + id;
      },
      updateCompanyContact: function(id) {
        return localhost + 'company_key_contacts/' + id;
      },
      getService: function(id) {
        return localhost + 'services' + (id ? '/' + id : '');
      },
      getFavorites: function() {
        return localhost + 'favorite_products';
      },
      getFavoriteService: function(id) {
        return localhost + 'accounts/' + id + '/favorite_products';
      },
      getFavorite: function() {
        return localhost + 'favorite_products';
      },
      addFavorite: function() {
        return localhost + 'favorite_products';
      },
      deleteFavorite: function(id) {
        return localhost + 'favorite_products/' + id;
      },
      getUserList: function() {
        return localhost + 'users';
      },
      getUserUrl: function() {
        return localhost + 'user';
      },
      userAccount: function(id) {
        return {
          get: localhost + 'user/' + id
        }
      },
      getUserName: function(id) {
        return localhost + 'user/' + id + '/userName';
      },
      getOnboardingBasicInfoUrl: function() {
        return localhost + 'user-basic-information'
      },
      getUserAcceptTermsAndConditionsUrl: function() {
        return localhost + 'user-accept-terms-and-conditions'
      },
      getAccountNotificationCategoryItems: function() {
        return localhost + 'account-notification-category-items';
      },
      getAccountNotifications: function() {
        return localhost + 'account-notification-categories';
      },
      getUserAccountNotifications: function(account_id) {
        return localhost + 'accounts/' + account_id + '/account-notification-settings';
      },
      updateUserAccountNotification: function(id) {
        return localhost + 'account-notification-settings/' + id;
      },
      markNotificationRead: function(id, notification_id) {
        return localhost + 'users/' + id + '/notifications/' + notification_id + '?action=markNotificationRead';
      },
      markAllNotificationsRead: function(id) {
        return localhost + 'users/' + id + '/notifications?action=markAllRead';
      },
      requestVerification: function() {
        return localhost + 'notifications?action=requestVerification';
      },
      getNotificationsUser: function() {
        return localhost + 'notifications-user';
      },
      getNotificationsStatisticUser: function() {
        return localhost + 'notifications-user-statistic';
      },
      getNotificationsPm: function() {
        return localhost + 'notifications-pm';
      },
      addNotificationsPm: function() {
        return localhost + 'notifications-pm';
      },
      getNotificationsStatisticPm: function() {
        return localhost + 'notifications-pm-statistic';
      },
      //RESOURCES
      getAllResourceLabs: function() {
        return localhost + 'resource/lab';
      },
      getResourceLab: function(id) {
        return localhost + 'resource/lab/' + id;
      },

      getAllResourceBays: function() {
        return localhost + 'resource/bay/';
      },
      getResourceBay: function(id) {
        return localhost + 'resource/bay/' + id;
      },


      getAllBayMachines: function(id) {
        return localhost + 'resource/machine/' + id;
      },



      getResourceProject: function(id) {
        return localhost + 'resource/project/' + id;
      },

      getAllResourceProjects: function() {
        return localhost + 'resource/project';
      },


      getAllCourses: function() {
        return localhost + 'resource/course';
      },
      getCourse: function(id) {
        return localhost + 'resource/course/' + id;
      },


      getAllJobs: function() {
        return localhost + 'resource/job';
      },

      getJob: function(id) {
        return localhost + 'resource/job/' + id;
      },


      getAllAssessments: function() {
        return localhost + 'resource/assessment';
      },

      getAssessment: function(id) {
        return localhost + 'resource/assessment/' + id;
      },

      //END RESOURCES

      searchMarketplace: function(text) {
        if ($window.apiUrl) {
          return localhost + 'searchServices/' + text;
        } else {
          return localhost + 'searchServices';
        }
      },

      searchMembers: function(text) {
        console.log('data.factory.searchMembers: text=' + text);
        return localhost + 'searchMembers/' + text;
      },

      markReadNotifications: function() {
        return localhost + 'mark-read-notifications';
      },
      clearNotification: function(id) {
        return localhost + 'clear-notification/' + id;
      },
      compare: function(id, type) {
        // type - services, members
        var name = 'compare_' + type;
        return {
          userCompares: localhost + 'profiles/' + id + '/' + name,
          get: localhost + name + '/' + id,
          delete: localhost + name + '/' + id,
          add: localhost + name
        }
      },
      getDateFormat: function() {
        return 'YYYY-MM-DD';
      },
      getTimeFormat: function() {
        return 'hh:mm:ss A';
      },
      getDateAndTimeFormat: function() {
        return this.getDateFormat() + ' ' + this.getTimeFormat();
      },
      // TODO -- make this a REST endpoint
      getDocAccessLevels: function() {
        return {
          'All Members': 'ALL_MEMBERS',
          'Project Participants': 'PROJECT_PARTICIPANTS',
          'Project Participants and Upper Tier Members': 'PROJECT_PARTICIPANTS_AND_UPPER_TIER_MEMBERS',
          'Project Participants VIPS': 'PROJECT_PARTICIPANT_VIPS',
          'Choose Organizations': 'ORG'
        }
      },
      getMyVPC: function() {
        return localhost + 'organizations/myVPC'
      }
    };
  })
