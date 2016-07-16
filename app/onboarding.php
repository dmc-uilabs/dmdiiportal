<!doctype html>
<html class="no-js" lang="">
<head>
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Onboarding</title>
<!--  <base href="/">-->

</head>
<body ng-app="dmc.onboarding">

<!--[if lt IE 10]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
<![endif]-->

<!-- Top Header -->
<div dmc-top-header></div>
<div ui-view></div>
<dmc-footer></dmc-footer>

<?php include 'build-vendor.php' ?>

<!-- build:js scripts/onboarding/index.js -->
<script src="scripts/socket/socket.io.js"></script>
<script src="scripts/configs/ngMaterial-config.js"></script>
<script src="scripts/common/header/header.js"></script>
<script src="scripts/common/factory/notifications.factory.js"></script>
<script src="scripts/common/footer/footer.js"></script>
<script src="scripts/common/factory/location.factory.js"></script>
<script src="scripts/components/ui-widgets/stars.directive.js"></script>
<script src="scripts/components/ui-widgets/review.directive.js"></script>
<script src="scripts/common/factory/socket.factory.js"></script>
<script src="scripts/common/factory/ajax.factory.js"></script>
<script src="scripts/common/factory/data.factory.js"></script>
<script src="scripts/common/models/file-upload.js"></script>
<script src="scripts/common/models/profile-model.js"></script>
<script src="scripts/common/models/user-model.js"></script>
<script src="scripts/common/models/toast-model.js"></script>
<script src="scripts/common/models/phone-model.js"></script>
<script src="scripts/common/models/question-toast-model.js"></script>
<script src="scripts/common/models/previous-page.js"></script>

<script src="scripts/onboarding/onboarding.js"></script>
<script src="scripts/onboarding/controllers/onboarding.js"></script>
<script src="scripts/onboarding/controllers/home.js"></script>
<script src="scripts/onboarding/controllers/profile.js"></script>
<script src="scripts/onboarding/controllers/account.js"></script>
<script src="scripts/onboarding/controllers/company.js"></script>
<script src="scripts/onboarding/controllers/storefront.js"></script>
<script src="scripts/onboarding/controllers/basic-informations.js"></script>
<script src="scripts/onboarding/controllers/terms-conditions.js"></script>
<!-- endbuild -->
<script type="text/javascript">
        <?php
          echo('window.givenName = "'.$_SERVER['AJP_givenName'].'";');
        ?>
        window.apiUrl = '';
    </script>
</body>
</html>
