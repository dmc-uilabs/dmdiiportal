angular.module('dmc.project')
    .controller('EditProjectCtrl',[
        "$scope",
        "$rootScope",
        "$stateParams",
        "$mdDialog",
        "dataFactory",
        "ajax",
        "projectModel",
        "projectData",
        function ($scope,
                  $rootScope,
                  $stateParams,
                  $mdDialog,
                  dataFactory,
                  ajax,
                  projectModel,
                  projectData) {
            var projectCtrl = this;
            projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
            projectCtrl.projectData = projectData;

            $scope.projectData = projectData;

            $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

            $scope.data = {
                secondLocked : true,
                thirdLocked : true,
                fourthLocked : true
            };

            $scope.invitees = [];

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            var currentMembers = [];

            $scope.getMembers = function () {
                ajax.get(dataFactory.projectMembers(projectCtrl.currentProjectId), {}, function (response) {
                    var profileIds = $.map(response.data, function (x) {
                        return x.profileId;
                    });
                    currentMembers = $.map(response.data, function (x) {
                        return {
                            id : x.id,
                            profileId : x.profileId
                        };
                    });
                    $scope.invitees = response.data;
                    if(profileIds.length > 0) {
                        ajax.get(dataFactory.profiles().all, {
                            id: profileIds
                        }, function (res) {
                            $scope.invitees = res.data;
                            //isFollowed($scope.members);
                            apply();
                        });
                    }
                });
            };

            $scope.getMembers();

            var newProject = {};
            var setProjectDetails = function(data) {
                newProject = $.extend(true, newProject, data);
            };

            $scope.updateProject = function(data) {
                if(newProject.dueDate){
                    newProject.dueDate = Date.parse(newProject.dueDate);
                }else{
                    newProject.dueDate = Date.parse(new Date());
                }
                projectModel.update_project(projectCtrl.currentProjectId,newProject, data, currentMembers, function(data){
                    document.location.href = "project.php#/"+projectCtrl.currentProjectId+"/home";
                });
            };

            $("md-tabs").on("click","md-tab-item",function(){
                $scope.enableNext($(this).index()+2);
            });

            $scope.goToNextTab = function(number, obj){
                $(window).scrollTop(0);
                if (obj) {
                    setProjectDetails(obj);
                }
                $scope.selectedIndex = number-1;
                if(number == 2){
                    $scope.data.thirdLocked = false;
                }else if(number == 3){
                    $scope.data.fourthLocked = false;
                }
            };

            $scope.disableEnable = function(number,val){
                var v = (val ? false : true);
                switch(number){
                    case 2 :
                        $scope.data.secondLocked = v;
                        break;
                    case 3 :
                        $scope.data.thirdLocked = v;
                        break;
                    case 4 :
                        $scope.data.fourthLocked = v;
                        break;
                }
            };

        }
    ]
)