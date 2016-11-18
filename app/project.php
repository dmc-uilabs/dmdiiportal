<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Project</title>

  </head>
  <body ng-app="dmc.project">
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header active-page="'project'"></div>

    <div ui-view></div>

    <dmc-footer></dmc-footer>

    <?php include 'build-vendor.php' ?>

    <!-- build:js scripts/project/index.js -->
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/common/directive/input-fileupload.directive.js"></script>
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
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/components/product-card/product-card.js"></script>
    <script src="scripts/components/products-card/products-card.js"></script>
    <script src="scripts/common/models/project-model.js"></script>
    <script src="scripts/common/models/task-model.js"></script>
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
    <script src="scripts/common/models/file-upload.js"></script>
    <script src="scripts/common/models/services.model.js"></script>
    <script src="scripts/common/models/dome-model.js"></script>
    <script src="scripts/common/models/member-model.js"></script>
    <script src="scripts/components/compare/compare.js"></script>
    <script src="scripts/common/models/previous-page.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>
    <script src="scripts/components/add-project/add-project.directive.js"></script>
    <script src="scripts/components/members-card/members-card.js"></script>
    <script src="scripts/components/ui-widgets/stars.directive.js"></script>
    <script src="scripts/community/controllers/compose-discussion.js"></script>

    <script src="scripts/project/project.js"></script>
    <script src="scripts/project/controllers/id-locator.js"></script>
    <script src="scripts/project/controllers/discussions.js"></script>
    <script src="scripts/project/controllers/documents.js"></script>
    <script src="scripts/project/controllers/home.js"></script>
    <script src="scripts/common/factory/notifications.factory.js"></script>
    <script src="scripts/project/controllers/tasks.js"></script>
    <script src="scripts/project/controllers/task.js"></script>
    <script src="scripts/project/controllers/team.js"></script>
    <script src="scripts/project/controllers/manage-requests.js"></script>

    <script src="scripts/project/controllers/workspace.js"></script>
    <script src="scripts/project/controllers/rfp-home.js"></script>
    <script src="scripts/project/controllers/rfp-submissions.js"></script>
    <script src="scripts/project/controllers/rfp-documents.js"></script>
    <script src="scripts/project/controllers/rfp-questions.js"></script>
    <script src="scripts/project/controllers/rfp-people-invited.js"></script>
    <script src="scripts/project/controllers/services.js"></script>
    <script src="scripts/project/controllers/upload-service.js"></script>
    <script src="scripts/project/controllers/edit-service.js"></script>
    <script src="scripts/project/controllers/run-service.js"></script>
    <script src="scripts/project/controllers/run-history.js"></script>
    <script src="scripts/add_project/add_project.js"></script>
    <script src="scripts/project/controllers/edit.js"></script>
    <script src="scripts/project/controllers/services-detail.js"></script>
    <script src="scripts/project/controllers/publish-service-marketplace.js"></script>

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
