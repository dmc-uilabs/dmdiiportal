<link rel="apple-touch-icon" href="apple-touch-icon.png">
<!-- Place favicon.ico in the root directory -->

<!-- build:css styles/vendor.css -->
<!-- bower:css -->
<link rel="stylesheet" href="/bower_components/angular-carousel/angular-carousel.css" />
<link rel="stylesheet" href="/bower_components/angular-clndr/angular-clndr.css" />
<link rel="stylesheet" href="/bower_components/angular-datepicker/dist/angular-datepicker.css" />
<link rel="stylesheet" href="/styles/https-angular-horizontal-timeline.css" />
<link rel="stylesheet" href="/bower_components/angular-material/angular-material.css" />
<link rel="stylesheet" href="/bower_components/angular-material-data-table/dist/md-data-table.min.css" />
<link rel="stylesheet" href="/bower_components/dropzone/dist/min/dropzone.min.css" />
<link rel="stylesheet" href="/bower_components/md-data-table/dist/md-data-table-style.css" />
<link rel="stylesheet" href="/bower_components/angular-ui-select/dist/select.min.css" />
<link rel="stylesheet" href="/bower_components/select2/select2.css" />
<link rel="stylesheet" href="/bower_components/medium-editor/dist/css/medium-editor.min.css" />
<link rel="stylesheet" href="/bower_components/medium-editor/dist/css/themes/beagle.css" />
<link rel="stylesheet" href="/bower_components/angular-tree-control/css/tree-control-attribute.css" />
<!-- endbower -->
<!-- endbuild -->

<!-- build:css styles/main.css -->
<!-- <link rel="stylesheet" href="styles/main.css"> -->
<!-- endbuild -->

<?php
    $requested_page = $_SERVER['REQUEST_URI'];
    if (
          (strpos($requested_page, 'member-directory') ||
          strpos($requested_page, 'dmdii-projects') ||
          strpos($requested_page, 'dmdii-project-page')
        )
        && !strpos($requested_page, 'edit-dmdii-project-page')
      )
    {
      echo '<link rel="stylesheet" href="styles/main-rh.css">';
    } else {
      echo '<link rel="stylesheet" href="styles/main.css">';
    }
?>

<!-- build:js scripts/vendor/modernizr.js -->
<script src="/bower_components/modernizr/modernizr.js"></script>
<!-- endbuild -->

<!-- build:js scripts/vendor.js -->
<!-- bower:js -->
<script src="/bower_components/jquery/dist/jquery.js"></script>
<script src="/bower_components/angular/angular.js"></script>
<script src="/bower_components/hammerjs/hammer.js"></script>
<script src="/bower_components/d3/d3.min.js"></script>
<script src="/bower_components/topojson/topojson.min.js"></script>
<script src="/bower_components/datamaps/dist/datamaps.all.min.js"></script>
<script src="/bower_components/angular-datamaps/dist/angular-datamaps.min.js"></script>
<script src="/bower_components/angular-carousel/angular-carousel.js"></script>
<script src="/bower_components/angular-cookies/angular-cookies.js"></script>
<script src="/bower_components/moment/moment.js"></script>
<script src="/bower_components/clndr/clndr.min.js"></script>
<script src="/bower_components/angular-moment/angular-moment.js"></script>
<script src="/bower_components/moment-timezone/builds/moment-timezone-with-data.min.js"></script>
<script src="/bower_components/moment-range/lib/moment-range.min.js"></script>
<script src="/bower_components/angular-datepicker/dist/angular-datepicker.js"></script>
<script src="/bower_components/angular-ui-select/dist/select.min.js"></script>
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
<!-- <script src="/bower_components/angular-uuid4/angular-uuid4.js"></script> -->
<script src="/bower_components/md-data-table/dist/md-data-table.js"></script>
<script src="/bower_components/md-data-table/dist/md-data-table-templates.js"></script>
<script src="/bower_components/ng-timeago/ngtimeago.js"></script>
<script src="/bower_components/ui-autocomplete/autocomplete.js"></script>
<script src="/bower_components/angular-ui-sortable/sortable.min.js"></script>
<script src="/bower_components/ng-autofocus/dist/ng-autofocus.js"></script>
<script src="/bower_components/angular-route/angular-route.min.js"></script>
<script src="/bower_components/angular-clndr/angular-clndr.js"></script>
<script src="/scripts/components/ui-widgets/angular-horizontal-timeline.js"></script>
<script src="/bower_components/aws-sdk/dist/aws-sdk.min.js"></script>
<script src="/bower_components/medium-editor/dist/js/medium-editor.min.js"></script>
<script src="/bower_components/angular-medium-editor/dist/angular-medium-editor.min.js"></script>
<script src="/bower_components/to-markdown/dist/to-markdown.js"></script>
<script src="/bower_components/showdown/dist/showdown.min.js"></script>
<script src="/bower_components/ng-showdown/dist/ng-showdown.min.js"></script>
<script src="/bower_components/handlebars/handlebars.min.js"></script>
<script src="/bower_components/angulartics/dist/angulartics.min.js"></script>
<script src="/bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js"></script>
<script src="/bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js"></script>
<script src="/scripts/common/analytics/analytics.js"></script>
<script src="/bower_components/angular-tree-control/angular-tree-control.js"></script>
<script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- endbower -->
<!-- endbuild -->
