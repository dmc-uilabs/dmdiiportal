<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>mdangular</title>

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
</head>
<body ng-app="dmc.my_projects" ng-controller="DMCMyProjectsController" id="my-projects-page">
    <!--[if lt IE 10]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header active-page="'project&my-projects'"></div>

    <div class="page-header" layout-padding>
      <md-toolbar>
        <div class="md-toolbar-tools my-projects-title" layout="row" layout-align="space-between center">
            <h1 flex="33">My Projects</h1>
            <md-button class="md-raised btn-add-project">Add Project</md-button>
            <!-- fill up the space between left and right area -->
            <div laout="column" flex="33">
                <div layout="row" layout-align="end center">
                    <md-input-container>
                        <label>Sort</label>
                        <md-select ng-model="sortModel" ng-change="selectItemDropDown('sort')" md-container-class="margin-dropdown">
                            <md-option ng-repeat="sort in sortList track by $index" ng-value="$index">{{sort.name}}</md-option>
                        </md-select>
                    </md-input-container>
                    <md-input-container>
                        <label>Filter</label>
                        <md-select ng-model="filterModel" ng-change="selectItemDropDown('filter')" md-container-class="margin-dropdown">
                            <md-option ng-repeat="filter in filterList track by $index" ng-value="$index">{{filter.name}}</md-option>
                        </md-select>
                    </md-input-container>
                </div>
            </div>
        </div>
      </md-toolbar>
    </div>

    <div class="container my-projects-container" layout="row" layout-padding>
        <div class="content-panel" id="myProjectsList" ui-widget-projects widget-title="null" widget-show-all-blocks="true"></div>
    </div>

    <!-- Footer -->
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

    <!-- build:js scripts/my-projects/index.js -->
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/components/ui-widgets/tasks.directive.js"></script>
    <script src="scripts/components/ui-widgets/services.directive.js"></script>
    <script src="scripts/components/ui-widgets/discussions.directive.js"></script>
    <script src="scripts/components/ui-widgets/projects.directive.js"></script>
    <script src="scripts/components/rfp-invite/rfp-invite.directive.js"></script>
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/my_projects/my_projects.js"></script>
    <!-- endbuild -->
    <script type="text/javascript">
        <?php
          echo('window.givenName = "'.$_SERVER['givenName'].'";');
        ?>
        window.apiUrl = '';
    </script>
  </body>
</html>
