<!doctype html>
<html class="no-js" lang="">
<head>
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Notifications</title>
<!--  <base href="/">-->
 
</head>
<body ng-app="dmc.notifications">

<!--[if lt IE 10]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
<![endif]-->

<!-- Top Header -->
<div dmc-top-header active-page="'index'"></div>
<div ui-view></div>
<dmc-footer></dmc-footer>

<?php include 'build-vendor.php' ?>

<!-- build:js scripts/notifications/index.js -->
<script src="scripts/socket/socket.io.js"></script>
<script src="scripts/configs/ngMaterial-config.js"></script>
<script src="scripts/common/header/header.js"></script>
<script src="scripts/common/factory/notifications.factory.js"></script>
<script src="scripts/common/footer/footer.js"></script>
<script src="scripts/common/factory/ajax.factory.js"></script>
<script src="scripts/common/factory/data.factory.js"></script>
<script src="scripts/common/models/question-toast-model.js"></script>
<script src="scripts/common/models/previous-page.js"></script>
<script src="scripts/common/models/toast-model.js"></script>
<script src="scripts/common/models/user-model.js"></script>
<script src="scripts/notifications/notifications.js"></script>
<script src="scripts/notifications/controllers/pm.js"></script>
<script src="scripts/notifications/controllers/user.js"></script>
<!-- endbuild -->
<script type="text/javascript">
        <?php
          echo('window.givenName = "'.$_SERVER['AJP_givenName'].'";');
        ?>
        window.apiUrl = '';
    </script>
</body>
</html>
