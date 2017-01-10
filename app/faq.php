<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FAQ</title>
    <!-- Start of Async Drift Code -->
<script>
!function() {
  var t;
  if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0,
  t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ],
  t.factory = function(e) {
    return function() {
      var n;
      return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;
    };
  }, t.methods.forEach(function(e) {
    t[e] = t.factory(e);
  }), t.load = function(t) {
    var e, n, o, i;
    e = 3e5, i = Math.ceil(new Date() / e) * e, o = document.createElement("script"),
    o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + i + "/" + t + ".js",
    n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(o, n);
  });
}();
drift.SNIPPET_VERSION = '0.3.1';
drift.load('gxcig6fevkrs');
</script>
<!-- End of Async Drift Code -->
  </head>
  <body ng-app="dmc.faq" class="faq-body">
    <!--[if lt IE 10]>
      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Top Header -->
    <div dmc-top-header active-page="'faq'"></div>

    <div ui-view></div>

    <dmc-footer></dmc-footer>

    <?php include 'build-vendor.php' ?>

    <!-- build:js scripts/faq/index.js -->
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
    <script src="scripts/faq/faq.js"></script>
    <script src="scripts/faq/controllers/general.js"></script>
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
