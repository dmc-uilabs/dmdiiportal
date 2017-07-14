<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Add Project</title>

</head>
<body ng-app="dmc.add_project">
    <!--[if lt IE 10]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <!-- Top Header -->
    <div dmc-top-header active-page="'project'"></div>

    <div class="container add-project">
        <div class="content-panel" add-project-tabs=""></div>
    </div>

    <!-- Footer -->
    <dmc-footer></dmc-footer>

    <?php include 'build-vendor.php' ?>

    <!-- build:js scripts/add_project/index.js -->
    <script src="scripts/socket/socket.io.js"></script>
    <script src="scripts/configs/ngMaterial-config.js"></script>
    <script src="scripts/common/header/header.js"></script>
    <script src="scripts/common/factory/notifications.factory.js"></script>
    <script src="scripts/common/footer/footer.js"></script>
    <script src="scripts/common/factory/ajax.factory.js"></script>
    <script src="scripts/common/factory/data.factory.js"></script>
    <script src="scripts/components/ui-widgets/documents.directive.js"></script>
    <script src="scripts/components/ui-widgets/rich-text.directive.js"></script>
    <script src="scripts/components/dropzone/dropzone.directive.js"></script>
    <script src="scripts/add_members/add-members.js"></script>
    <script src="scripts/add_project/add_project.js"></script>
    <script src="scripts/components/add-project/add-project.directive.js"></script>
    <script src="scripts/components/product-card/product-card.js"></script>
    <script src="scripts/components/compare/compare.js"></script>
    <script src="scripts/common/models/user-model.js"></script>
    <script src="scripts/common/models/previous-page.js"></script>
    <script src="scripts/common/models/project-model.js"></script>
    <script src="scripts/common/models/question-toast-model.js"></script>
    <script src="scripts/common/models/member-model.js"></script>
    <script src="scripts/common/models/toast-model.js"></script>
    <script src="scripts/components/members-card/members-card.js"></script>
    <script src="scripts/components/ui-widgets/stars.directive.js"></script>
    <script src="scripts/common/models/file-upload.js"></script>
    <script src="scripts/components/product-card-buttons/product-card-buttons.js"></script>
    <script src="scripts/components/workspace-header/workspace-header.directive.js"></script>
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
