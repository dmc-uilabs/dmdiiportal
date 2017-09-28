'use strict';
/**
* dmc.dashboard Module
*
* Dashboard
*/
angular.module('dmc.dashboard')
    .controller("DashboardController",[
        "$scope",
        "mobileFactory",
        "$cookieStore",
        "toastModel",
        function(
            $scope,
            mobileFactory,
            $cookieStore,
            toastModel) {

            $scope.isMobile = mobileFactory.any();
    
            $scope.filters = {
                private: false,
                public: false
            };

            if($cookieStore.get("toast")){
			    toastModel.showToast("success", $cookieStore.get("toast"));
			    $cookieStore.remove("toast");
		    }

        }
    ]
);
