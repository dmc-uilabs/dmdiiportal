<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Digital Manufacturing Commons</title>

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
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:css styles/main.css -->
    <link rel="stylesheet" href="styles/main.css">
    <!-- endbuild -->

    <!-- build:js scripts/vendor/modernizr.js -->
    <script src="/bower_components/modernizr/modernizr.js"></script>
    <!-- endbuild -->
    <script>
        paceOptions = {
            ajax: true, // enabled
            document: true, // enabled
            eventLag: false, // disabled
            elements: {
                selectors: ['body']
            }
        }
      </script>
      <script src="scripts/pace/pace.min.js"></script>
  </head>
  <body ng-app="dmc" ng-controller="DMCController">
    <!--[if lt IE 10]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header active-page="page"></div>

    <ui-view></ui-view>

    <!-- Footer -->
    <dmc-footer type="page"></dmc-footer>

    <!-- build:js scripts/vendor.js -->
    <!-- bower:js -->
    <script src="/bower_components/jquery/dist/jquery.js"></script>
    <script src="/bower_components/angular/angular.js"></script>
    <script src="/bower_components/hammerjs/hammer.js"></script>
    <script src="/bower_components/angular-carousel/angular-carousel.js"></script>
    <script src="/bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="/bower_components/moment/moment.js"></script>
    <script src="/bower_components/angular-moment/angular-moment.js"></script>
    <script src="/bower_components/angular-datepicker/dist/angular-datepicker.js"></script>
    <script src="/bower_components/angular-aria/angular-aria.js"></script>
    <script src="/bower_components/angular-material/angular-material.js"></script>
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
    <script src="/bower_components/angular-animate/angular-animate.js"></script>
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:js scripts/home/index.js -->
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/components/rfp-invite/rfp-invite.directive.js"></script>
    <script src="scripts/components/ui-widgets/tasks.directive.js"></script>
    <script src="scripts/components/ui-widgets/services.directive.js"></script>
    <script src="scripts/components/ui-widgets/components.directive.js"></script>
    <script src="scripts/components/ui-widgets/discussions.directive.js"></script>
    <script src="scripts/components/ui-widgets/documents.directive.js"></script>
    <script src="scripts/components/ui-widgets/questions.directive.js"></script>
    <script src="scripts/components/ui-widgets/submissions.directive.js"></script>
    <script src="scripts/components/ui-widgets/invited-users.directive.js"></script>
    <script src="scripts/components/ui-widgets/projects.directive.js"></script>
    <script src="scripts/components/ui-widgets/stars.directive.js"></script>
    <script src="scripts/components/sub-nav-menu/sub-nav-menu.directive.js"></script>
    <script src="scripts/components/dropzone/dropzone.directive.js"></script>
    <script src="scripts/components/tree-menu/tree-menu.js"></script>
    <script src="scripts/components/product-card/product-card.js"></script>
    <script src="scripts/components/products-card/products-card.js"></script>
    <script src="scripts/components/carousel/carousel.js"></script>
    <script src="scripts/components/compare/compare.js"></script>
    <script src="scripts/components/dropzone/dropzone.directive.js"></script>
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/common/factory/mobile.factory.js"></script>
    <script src="scripts/common/models/project-model.js"></script>

    <!--  Main  -->
    <script src="scripts/main.js"></script>
    <!--  Pages  -->
    <script src="scripts/home/home.js"></script>
    <script src="scripts/dashboard/dashboard.js"></script>
    <script src="scripts/marketplace/marketplace.js"></script>
    <script src="scripts/my_projects/my_projects.js"></script>
    <script src="scripts/invite-challenge/invite-challenge.js"></script>
    <script src="scripts/product/product.js"></script>
    <script src="scripts/project/project.js"></script>
    <script src="scripts/project/controllers/id-locator.js"></script>
    <script src="scripts/project/controllers/discussions.js"></script>
    <script src="scripts/project/controllers/documents.js"></script>
    <script src="scripts/project/controllers/home.js"></script>
    <script src="scripts/project/controllers/tasks.js"></script>
    <script src="scripts/project/controllers/team.js"></script>
    <script src="scripts/project/controllers/workspace.js"></script>
    <script src="scripts/project/controllers/rfp-home.js"></script>
    <script src="scripts/project/controllers/rfp-submissions.js"></script>
    <script src="scripts/project/controllers/rfp-documents.js"></script>
    <script src="scripts/project/controllers/rfp-questions.js"></script>
    <script src="scripts/project/controllers/rfp-people-invited.js"></script>
    <!-- endbuild -->
    <script type="text/javascript">
        window.apiUrl = '';
    </script>
  </body>
</html>
