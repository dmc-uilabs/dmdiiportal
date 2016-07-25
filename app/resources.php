<!doctype html>
<html class="no-js" lang="">
<head>
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resources</title>
<!--  <base href="/">-->
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  <!-- Place favicon.ico in the root directory -->

  <!-- build:css styles/vendor.css -->
  <!-- bower:css -->
  <link rel="stylesheet" href="/bower_components/angular-carousel/angular-carousel.css" />
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
<body ng-app="dmc.resources">

<!--[if lt IE 10]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
<![endif]-->

<!-- Top Header -->
<div dmc-top-header active-page="'resources'"></div>
<div ui-view> </div>
<dmc-footer></dmc-footer>

<?php include 'build-vendor.php' ?>

<!-- build:js scripts/faq/index.js -->


<!-- build:js scripts/resource/index.js -->
<script src="scripts/configs/ngMaterial-config.js"></script>
<script src="scripts/common/header/header.js"></script>
<script src="scripts/common/factory/notifications.factory.js"></script>
<script src="scripts/common/footer/footer.js"></script>
<script src="scripts/common/factory/socket.factory.js"></script>
<script src="scripts/common/factory/ajax.factory.js"></script>
<script src="scripts/common/factory/data.factory.js"></script>
<script src="scripts/common/factory/location.factory.js"></script>
<script src="scripts/common/models/company-model.js"></script>
<script src="scripts/components/tree-menu/tree-menu.js"></script>
<script src="scripts/components/tree-menu/products-filter.js"></script>
<script src="scripts/components/product-card/product-card.js"></script>
<script src="scripts/components/products-card/products-card.js"></script>
<script src="scripts/components/carousel/carousel.js"></script>
<script src="scripts/components/compare/compare.js"></script>
<script src="scripts/common/models/file-upload.js"></script>
<script src="scripts/common/models/question-toast-model.js"></script>
<script src="scripts/common/models/file-model.js"></script>
<script src="scripts/common/models/toast-model.js"></script>
<script src="scripts/common/models/user-model.js"></script>
<script src="scripts/resources/resources.js"></script>
<script src="scripts/resources/controllers/home.js"></script>


<!-- endbuild -->
<script type="text/javascript">
        <?php
          echo('window.givenName = "'.$_SERVER['AJP_givenName'].'";');
        ?>
        window.apiUrl = '';
    </script>
</body>
</html>
