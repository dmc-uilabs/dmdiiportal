<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Search</title>

  </head>
  <body ng-app="dmc.search">
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header active-page="'community'"></div>

    <div ui-view></div>

    <dmc-footer></dmc-footer>

    <?php include 'build-vendor.php' ?>

    <!-- build:js scripts/search/index.js -->
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/community/community.js"></script>
    <script src="scripts/community/controllers/compose-discussion.js"></script>
    <script src="scripts/components/ui-widgets/rich-text.directive.js"></script>
    <script src="scripts/community/directives/discussions.js"></script>
    <script src="scripts/community/directives/dmc-announcements.js"></script>
    <script src="scripts/community/directives/dmc-events.js"></script>
    <script src="scripts/community/directives/dmc-recent-updates.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/common/factory/notifications.factory.js"></script>
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
    <script src="scripts/common/models/previous-page.js"></script>
    <script src="scripts/components/tree-menu/tree-menu.js"></script>
    <script src="scripts/common/models/project-model.js"></script>
    <script src="scripts/common/models/member-model.js"></script>
    <script src="scripts/components/ui-widgets/stars.directive.js"></script>
    <script src="scripts/components/ui-widgets/review.directive.js"></script>
    <script src="scripts/components/ui-widgets/tabs.directive.js"></script>
    <script src="scripts/components/ui-widgets/documents.directive.js"></script>
    <script src="scripts/components/dropzone/dropzone.directive.js"></script>
    <script src="scripts/components/compare/compare.js"></script>
    <script src="scripts/common/models/company-model.js"></script>
    <script src="scripts/components/product-card/product-card.js"></script>
    <script src="scripts/components/add-project/add-project.directive.js"></script>
    <script src="scripts/components/members-card/members-card.js"></script>
    <script src="scripts/company-profile/company-profile.js"></script>
    <script src="scripts/components/contacts-card/contacts-card.js"></script>
    <script src="scripts/common/factory/location.factory.js"></script>
    <script src="scripts/common/models/file-upload.js"></script>
    <script src="scripts/common/models/account-model.js"></script>
    <script src="scripts/common/models/phone-model.js"></script>
    <script src="scripts/common/models/zipcode-model.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>

    <script src="scripts/search/search.js"></script>
    <script src="scripts/search/search.controller.js"></script>


    <!-- endbuild -->
    <script type="text/javascript">
        <?php
            if (isset($_SERVER['AJP_givenName'])) {
                echo('window.givenName = "'.$_SERVER['AJP_givenName'].'";');
            } else {
                echo('window.givenName = "";');
            }
        ?>
        window.apiUrl = '';
    </script>
  </body>
</html>
