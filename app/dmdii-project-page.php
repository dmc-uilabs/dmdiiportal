<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DMDII Project Page</title>

  </head>
  <body ng-app="dmc.dmdiiProj">
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header members-only="true" active-page="'members&dmdiiProjPage'"></div>

    <div ui-view></div>

    <dmc-footer></dmc-footer>

    <?php include 'build-vendor-rh.php' ?>

    <!-- build:js scripts/dmdii-project-page/index.js -->
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/components/ui-widgets/tasks.directive.js"></script>
    <script src="scripts/components/ui-widgets/services.directive.js"></script>
    <script src="scripts/components/ui-widgets/components.directive.js"></script>
    <script src="scripts/components/ui-widgets/discussions.directive.js"></script>
    <script src="scripts/components/ui-widgets/documents.directive.js"></script>
    <script src="scripts/components/ui-widgets/questions.directive.js"></script>
    <script src="scripts/components/ui-widgets/submissions.directive.js"></script>
    <script src="scripts/components/ui-widgets/invited-users.directive.js"></script>
    <script src="scripts/components/ui-widgets/stars.directive.js"></script>
    <script src="scripts/components/ui-widgets/review.directive.js"></script>
    <script src="scripts/components/ui-widgets/tabs.directive.js"></script>
    <script src="scripts/components/ui-widgets/interfaces.directive.js"></script>
    <script src="scripts/components/ui-widgets/project-tags.directive.js"></script>
    <script src="scripts/components/sub-nav-menu/sub-nav-menu.directive.js"></script>
    <script src="scripts/components/dropzone/dropzone.directive.js"></script>
    <script src="scripts/components/documents/document-info.js"></script>
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
	  <script src="scripts/components/carousel/carousel.js"></script>
    <script src="scripts/components/product-card/product-card.js"></script>
    <script src="scripts/components/products-card/products-card.js"></script>
    <script src="scripts/common/models/project-model.js"></script>
    <script src="scripts/common/models/task-model.js"></script>
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
    <script src="scripts/common/models/services.model.js"></script>
    <script src="scripts/common/models/dome-model.js"></script>
    <script src="scripts/common/models/member-model.js"></script>
    <script src="scripts/components/compare/compare.js"></script>
    <script src="scripts/components/product-card-buttons/product-card-buttons.js"></script>
    <script src="scripts/common/models/previous-page.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>
    <script src="scripts/components/add-project/add-project.directive.js"></script>
    <script src="scripts/components/members-card/members-card.js"></script>
    <script src="scripts/components/ui-widgets/stars.directive.js"></script>
    <script src="scripts/community/controllers/compose-discussion.js"></script>
    <script src="scripts/components/ui-widgets/rich-text.directive.js"></script>
	  <script src="scripts/common/factory/notifications.factory.js"></script>
    <script src="scripts/dmdii-project-page/dmdii-project-page.js"></script>
	  <script src="scripts/dmdii-project-page/dmdii-project-page.controller.js"></script>

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
