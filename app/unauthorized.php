<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Digital Manufacturing Commons</title>

  </head>
  <body ng-app="dmc.unauthorized">
    <!--[if lt IE 10]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header active-page="'unauthorized'"></div>

    <div ui-view></div>

    <!-- Footer -->
    <dmc-footer></dmc-footer>

    <?php include 'build-vendor.php' ?>

    <!-- build:js scripts/unauthorized/index.js -->
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/factory/notifications.factory.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
    <script src="scripts/common/models/previous-page.js"></script>
    <script src="scripts/unauthorized/unauthorized.js"></script>
    <script src="scripts/unauthorized/company.controller.js"></script>
    <script src="scripts/unauthorized/DMDII-member.controller.js"></script>
    <!-- endbuild -->

    <script type="text/javascript">
        <?php
          echo('window.givenName = "'.$_SERVER['AJP_givenName'].'";');
        ?>
        window.apiUrl = '';
    </script>
  </body>
</html>
