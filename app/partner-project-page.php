<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DMDII Project Page</title>

    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <!-- Place favicon.ico in the root directory -->

    <!-- build:css styles/vendor.css -->
    <!-- bower:css -->
    <link rel="stylesheet" href="/bower_components/angular-carousel/angular-carousel.css" />
    <link rel="stylesheet" href="/bower_components/angular-datepicker/dist/angular-datepicker.css" />
    <link rel="stylesheet" href="/bower_components/angular-material/angular-material.css" />
    <link rel="stylesheet" href="/bower_components/angular-material-data-table/dist/md-data-table.min.css" />
    <link rel="stylesheet" href="/bower_components/dropzone/dist/min/dropzone.min.css" />
    <link rel="stylesheet" href="/bower_components/md-data-table/dist/md-data-table-style.css" />
    <link rel="stylesheet" href="/bower_components/jquery-ui/themes/ui-lightness/jquery-ui.css" />
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:css styles/main.css -->
    <link rel="stylesheet" href="styles/main.css">
    <!-- endbuild -->

    <!-- build:js scripts/vendor/modernizr.js -->
    <script src="/bower_components/modernizr/modernizr.js"></script>
    <!-- endbuild -->
  </head>
  <body ng-app="dmc.proj">
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header members-only="true" active-page="'members&partnerProjPage'"></div>

    <div ui-view></div>

    <dmc-footer></dmc-footer>

    <!-- build:js scripts/vendor.js -->
    <!-- bower:js -->
    <script src="/bower_components/jquery/dist/jquery.js"></script>
    <script src="/bower_components/angular/angular.js"></script>
    <script src="/bower_components/hammerjs/hammer.js"></script>
    <script src="/bower_components/angular-carousel/angular-carousel.js"></script>
    <script src="/bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="/bower_components/moment/moment.js"></script>
    <script src="/bower_components/angular-moment/angular-moment.js"></script>
    <script src="/bower_components/moment-timezone/builds/moment-timezone-with-data.min.js"></script>
    <script src="/bower_components/angular-datepicker/dist/angular-datepicker.js"></script>
    <script src="/bower_components/angular-animate/angular-animate.js"></script>
    <script src="/bower_components/angular-aria/angular-aria.js"></script>
    <script src="/bower_components/angular-material/angular-material.js"></script>
    <script src="/bower_components/angular-messages/angular-messages.js"></script>
    <script src="/bower_components/ngMask/dist/ngMask.js"></script>
    <script src="/bower_components/angular-material-data-table/dist/md-data-table.min.js"></script>
    <script src="/bower_components/angular-material-icons/angular-material-icons.min.js"></script>
    <script src="/bower_components/angular-recursion/angular-recursion.js"></script>
    <script src="/bower_components/angular-touch/angular-touch.js"></script>
    <script src="/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="/bower_components/angular-websocket/angular-websocket.min.js"></script>
    <script src="/bower_components/angularUtils-pagination/dirPagination.js"></script>
    <script src="/bower_components/dropzone/dist/min/dropzone.min.js"></script>
    <script src="/bower_components/jquery-ui/jquery-ui.js"></script>
    <script src="/bower_components/lodash/lodash.js"></script>
    <script src="/bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="/bower_components/angular-uuid4/angular-uuid4.js"></script>
    <script src="/bower_components/md-data-table/dist/md-data-table.js"></script>
    <script src="/bower_components/md-data-table/dist/md-data-table-templates.js"></script>
    <script src="/bower_components/ng-timeago/ngtimeago.js"></script>
    <script src="/bower_components/ui-autocomplete/autocomplete.js"></script>
    <script src="/bower_components/ng-flow/dist/ng-flow-standalone.min.js"></script>
    <script src="/bower_components/angular-ui-sortable/sortable.min.js"></script>
    <script src="/bower_components/ng-autofocus/dist/ng-autofocus.js"></script>
    <script src="/bower_components/angular-route/angular-route.min.js"></script>
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:js scripts/project/index.js -->
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
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
	<script src="scripts/components/carousel/carousel.js"></script>
    <script src="scripts/components/product-card/product-card.js"></script>
    <script src="scripts/components/products-card/products-card.js"></script>
    <script src="scripts/common/models/project-model.js"></script>
    <script src="scripts/common/models/task-model.js"></script>
    <script src="scripts/common/models/discussion-model.js"></script>
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
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
	<script src="scripts/common/factory/notifications.factory.js"></script>

    <script src="scripts/partner-project-page/partner-project-page.js"></script>
	<script src="scripts/partner-project-page/partner-project-page.controller.js"></script>

    <!-- endbuild -->
    <script type="text/javascript">
        <?php
          echo('window.givenName = "'.$_SERVER['AJP_givenName'].'";');
        ?>
        window.apiUrl = '';
    </script>
  </body>
</html>
