<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>View All</title>

  </head>
  <body ng-app="dmc.view-all">
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header active-page="'all'"></div>

    <div ui-view></div>

    <dmc-footer></dmc-footer>

    <?php include 'build-vendor.php' ?>

    <!-- build:js scripts/all/index.js -->
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/factory/notifications.factory.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
    <script src="scripts/common/models/previous-page.js"></script>
    <script src="scripts/common/models/project-model.js"></script>
    <script src="scripts/common/models/task-model.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>
    <script src="scripts/components/ui-widgets/tasks.directive.js"></script>
    <script src="scripts/components/select-project/select-project.controller.js"></script>

    <script src="scripts/all/all.js"></script>
    <script src="scripts/all/tasks.controller.js"></script>
    <script src="scripts/all/services.controller.js"></script>
    <script src="scripts/all/discussions.controller.js"></script>
    <script src="scripts/all/user-services.controller.js"></script>
    <script src="scripts/all/user-tasks.controller.js"></script>
    <script src="scripts/all/user-discussions.controller.js"></script>
    <script src="scripts/all/run-services.controller.js"></script>
    <script src="scripts/all/invitations.controller.js"></script>
    <script src="scripts/all/announcements.controller.js"></script>
    <script src="scripts/all/history-profile.controller.js"></script>
    <script src="scripts/all/history-company.controller.js"></script>
    <script src="scripts/all/history-service.controller.js"></script>

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
