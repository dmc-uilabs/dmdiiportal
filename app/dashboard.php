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
  </head>
  <body ng-app="dmc.dashboard" ng-controller="DashboardCtr">
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header show-notification="true" active-page="'dashboard'"></div>

    <div class="container container-dashboard" layout-padding layout="row">
      <div class="content-column" layout="column" flex>
        <div class="content-panel content-panel-dashboard" style="display:none" ng-if="isMobile == null">
              <div class="content-panel-header">
                  <md-toolbar>
                      <div class="md-toolbar-tools widget-toolbar-title">
                          <h2>MARKET PLACE STATS</h2>
                          <span flex></span>
                          <md-button href="/" md-no-ink class="view-all-button">View statistics</md-button>
                      </div>
                  </md-toolbar>
              </div>
              <div class="content-panel-body">
                  <md-content class="md-padding">
                      <md-tabs md-dynamic-height md-border-bottom>
                          <md-tab label="Overview">
                              <md-content class="md-padding">
                                  <img ng-src="/images/top-products.jpg" alt=""/>
                              </md-content>
                          </md-tab>
                          <md-tab label="Views">
                              <md-content class="md-padding">
                                  <img ng-src="/images/top-products.jpg" alt=""/>
                              </md-content>
                          </md-tab>
                          <md-tab label="Added">
                              <md-content class="md-padding">
                                  <img ng-src="/images/top-products.jpg" alt=""/>
                              </md-content>
                          </md-tab>
                      </md-tabs>
                  </md-content>
              </div>
          </div>
        <div class="content-panel content-panel-dashboard" ui-widget-services columns="['name','project','start','status']" widget-style="'full'" widget-title="'SERVICES'" start-at-offset="14"></div>
        <div class="content-panel content-panel-dashboard" ui-widget-projects widget-title="'RECENT PROJECTS'" show-image="true"></div>
      </div>

      <div class="content-column" layout="column" flex>
        <div class="content-panel content-panel-dashboard" style="display:none" ng-if="isMobile == null">
              <div class="content-panel-header">
                  <md-toolbar>
                      <div class="md-toolbar-tools widget-toolbar-title">
                          <h2>MY CONNECTIONS</h2>
                          <span flex></span>
                          <md-button href="/" md-no-ink class="view-all-button">View connections</md-button>
                      </div>
                  </md-toolbar>
              </div>
              <div class="content-panel-body">
                  <md-content class="md-padding">
                      <img ng-src="/images/my-connections.jpg" alt=""/>
                  </md-content>
              </div>
          </div>
        <div class="content-panel content-panel-dashboard" ui-widget-tasks columns="['title','project','dueDate','priority']" widget-title="'MY TASKS'"></div>
        <div class="content-panel content-panel-dashboard" >
          <div class="content-panel-header">
           <md-toolbar>
              <div class="md-toolbar-tools widget-toolbar-title">
                <h2>FOLLOWING</h2>
                <span flex></span>
                <md-button href="/" md-no-ink class="view-all-button view-all-link">View All (5)</md-button>
              </div>
            </md-toolbar>
          </div>
          <div class="content-panel-body">
            <md-content class="md-padding">
              <md-list>
                    <md-list-item class="md-2-line" ng-repeat="item in [1,2]">
                      <div class="md-list-item-text">
                        <h3><a class="member-text" href="/individual-discussion.php">Run services on clutch plates and pressure plates components</a></h3>
                        <h4>9 minutes</h4>
                      </div>
                      <div class="md-secondary md-list-item-inner user-info">
                        <a class="member-name" href="/profile.php">Janet Perkins</a>
                        <a href="/profile.php"><img alt="Janet Perkins" class="md-avatar" src="images/avatar-fpo.jpg"></a>
                      </div>
                    </md-list-item>

                  </md-list>
            </md-content>
          </div>
        </div>
      </div>
    </div>

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


    <!-- build:js scripts/dashboard/index.js -->
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/components/ui-widgets/tasks.directive.js"></script>
    <script src="scripts/components/ui-widgets/services.directive.js"></script>
    <script src="scripts/components/ui-widgets/projects.directive.js"></script>
    <script src="scripts/components/ui-widgets/discussions.directive.js"></script>
    <script src="scripts/common/models/task-model.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/common/factory/socket.factory.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/common/factory/mobile.factory.js"></script>
    <script src="scripts/dashboard/dashboard.js"></script>
    <!-- endbuild -->
    <script type="text/javascript">
        <?php
          echo('window.givenName = "'.$_SERVER['givenName'].'";');
        ?>
        window.apiUrl = '';
    </script>
  </body>
</html>
