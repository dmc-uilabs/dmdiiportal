<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invite Challenge</title>

</head>
<body ng-app="dmc.add_project">
    <!--[if lt IE 10]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <!-- Top Header -->
    <div dmc-top-header active-page="'invite-challenge'"></div>

    <div class="container invite-challenge-container">
        <div class="content-panel" rfp-tabs=""></div>
    </div>

    <!-- Footer -->
    <dmc-footer></dmc-footer>

    <?php include 'build-vendor.php' ?>

    <!-- build:js scripts/invite-challenge/index.js -->
    <script src="scripts/socket/socket.io.js"></script>
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/factory/notifications.factory.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/components/ui-widgets/documents.directive.js"></script>
    <script src="scripts/components/dropzone/dropzone.directive.js"></script>
    <script src="scripts/components/rfp-invite/rfp-invite.directive.js"></script>
    <script src="scripts/components/product-card/product-card.js"></script>
    <script src="scripts/components/compare/compare.js"></script>
    <script src="scripts/components/add-to-workspace/add-to-workspace.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
    <script src="scripts/invite-challenge/invite-challenge.js"></script>
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/common/models/previous-page.js"></script>
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
