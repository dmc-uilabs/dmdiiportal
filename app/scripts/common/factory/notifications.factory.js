'use strict';

angular.module('dmc.common.notifications',[])
    .factory('notificationsMessages', [
        function(){

        var _getItemDetails = function(item) {
          var type = item.type;
          var action = item.event;
          var linkParams = item.linkParams;
          var displayName = item.createdBy.displayName;
          var _link,
              _actionTitle;

          if (type == 'profile') {
            _link = '/profile.php#/'+linkParams.profileId;
            switch (action) {
              case 'REVIEW_USER':
                _actionTitle = displayName + ' gave you a review.';
              break;
              case 'REPLY_REVIEW':
                _actionTitle = displayName + ' replied to your review.';
              break;
              case 'SUBSCRIBE_SERVICE_TO_YOUR_PROJECT':
                _actionTitle = displayName + ' added your service to a private project.';
              break;
            }
          }

          if (type == 'company') {
            _link = '/company-profile.php#/profile/'+linkParams.companyId;
            switch (action) {
              case 'REVIEW_COMPANY':
                _actionTitle = displayName + ' gave a review to ' + linkParams.companyName + '. ';
              break;
              case 'REPLY_REVIEW':
                _actionTitle = displayName + ' replied to your review of '+ linkParams.companyName + '.';
              break;
            }
          }

          if (type == 'discussion') {
            _link = '/individual-discussion.php#/'+linkParams.discussionId;
            switch (action) {
              case 'NEW_DISCUSSION':
                _actionTitle = displayName + ' posted a new discussion.';
              break;
              case 'REPLY_DISCUSSION':
                _actionTitle = displayName + ' made a comment.';
              break;
              case 'ANNOUNCEMENT_DMC':
                _actionTitle = 'DMC announcement.';
              break;
              case 'ANNOUNCEMENT_SYSTEM':
                _actionTitle = 'DMC system update.';
              break;
            }
          }

          if (type == 'community') {
            _link = '/community.php#/home';
            switch (action) {
              case 'EVENT_DMC':
                _actionTitle = linkParams.eventTitle + ' was announced.';
              break;
            }
          }

          if (type == 'service') {
            _link = '/project.php#/'+ linkParams.projectId + '/services/' + linkParams.serviceId + '/detail'
            switch (action) {
              case 'SERVICE_ERROR':
                _actionTitle = linkParams.serviceTitle + ' Failed to connect.';
              break;
              case 'SERVICE_FINISH':
                _actionTitle = linkParams.serviceTitle + ' Completed.';
              break;
              case 'SUBSCRIBE_SERVICE_TO_YOUR_PROJECT':
                _actionTitle = linkParams.serviceTitle + ' was added to ' + linkParams.projectTitle + ' .';
              break;
              case 'UNSUBSCRIBE_SERVICE_TO_YOUR_PROJECT':
                _actionTitle = linkParams.serviceTitle + ' was removed from ' + linkParams.projectTitle + ' .';
              break;
              case 'UPDATE_SERVICE':
                _actionTitle = linkParams.serviceTitle + ' was updated.';
              break;
            }
          }

          if (type == 'marketplace') {
            _link = '/service-marketplace.php#/'+linkParams.serviceId;
            switch (action) {
              case 'FAVORITED_YOUR_SERVICE':
                _actionTitle = displayName + ' has favorited your service.';
              break;
              case 'FAVORITED_SERVICE':
                _actionTitle = linkParams.serviceTitle + ' was favorited by '+ displayName;
              break;
               case 'SERVICE_SHARED':
                _actionTitle = linkParams.serviceTitle + ' was shared by '+ displayName;
              break;
              case 'REVIEW_SERVICE':
                _actionTitle = linkParams.serviceTitle + ' was reviewed by ' + displayName + '.';
              break;
              case 'REPLY_REVIEW':
                _actionTitle = displayName + ' replied to your review of ' + linkParams.serviceTitle + '.';
              break;
            }
          }

          if (type == 'project') {
            _link = '/project.php#/' + linkParams.projectId + '/home'
            switch (action) {
              case 'ACCEPT_INVITATION':
                _actionTitle = displayName + ' accepted your invitation to ' + linkParams.projectTitle + '.';
              break;
              case 'UPDATE_PROJECT':
                _actionTitle = linkParams.projectTitle + ' was updated.';
              break;
              case 'SUBSCRIBE_YOUR_SERVICE_TO_PROJECT':
                _actionTitle = displayName + ' added your service to ' + linkParams.projectTitle + '.';
              break;
            }
          }

          if (type == 'task') {
            _link = '/project.php#/' + linkParams.projectId + '/home?showTask=' + linkParams.taskId;
            switch (action) {
              case 'TASK_ASSIGN':
                _actionTitle = displayName + ' assigned you a task.';
              break;
              case 'TASK_DUE':
                _actionTitle = 'An assigned task in ' + linkParams.projectTitle +' is due soon.';
              break;
              case 'TASK_UPDATE':
                _actionTitle = 'A task was updated.';
              break;
            }
          }

          return {
            title: _actionTitle,
            link: _link
          }

        }

        return {
            getLinkDetails: _getItemDetails
        }

        }
    ]
);
