angular.module('dmc.project')
    .controller('EditProjectCtrl',[
        '$scope',
        '$rootScope',
        '$stateParams',
        '$mdDialog',
        'dataFactory',
        'ajax',
        'projectModel',
        'questionToastModel',
        'toastModel',
        'projectData',
        function ($scope,
                  $rootScope,
                  $stateParams,
                  $mdDialog,
                  dataFactory,
                  ajax,
                  projectModel,
                  questionToastModel,
                  toastModel,
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
            $scope.documents = [];
            var currentMembers = [];

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            // get project members
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
                            apply();
                        });
                    }
                });
            };
            $scope.getMembers();

            // get project documents
            $scope.getDocuments = function(){
              /*
                ajax.get(dataFactory.documentsUrl().getList, {
                    parentType: 'PROJECT',
                    parentId: projectCtrl.currentProjectId,
                    docClass: 'SUPPORT',
                    recent: 20
                }, function(response) {
                    $scope.documents = $.map(response.data.data||[], function(proj){
                      proj.title = proj.documentName;
                      return proj;
                    });
                    apply();
                });

                ajax.get(dataFactory.getProjectDocuments(projectCtrl.currentProjectId),{
                    'project-documentId' : 0
                },function(response){
                    $scope.documents = response.data;
                    apply();
                });
                */
            };
            $scope.getDocuments();

            var newProject = {};
            var setProjectDetails = function(data) {
                newProject = $.extend(true, newProject, data);
            };

            $scope.goSaveProject = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if(!$scope.goSaveProject) {
                    event.preventDefault();
                    questionToastModel.show({
                        question: 'Are you sure you want to leave this page?',
                        buttons: {
                            ok: function(){
                                $(window).unbind('beforeunload');
                                $scope.goSaveProject = true;
                                window.location = next;
                            },
                            cancel: function(){}
                        }
                    }, event);
                }
            });

            $(window).unbind('beforeunload');
            $(window).bind('beforeunload', function(){
                return '';
            });

            $scope.updateProject = function(data) {
                $scope.goSaveProject = true;
                $(window).unbind('beforeunload');

                if(newProject.dueDate){
                    newProject.dueDate = Date.parse(newProject.dueDate);
                }else{
                    newProject.dueDate = Date.parse(new Date());
                }
                newProject.documents = $scope.documents;
                projectModel.update_project(projectCtrl.currentProjectId, projectCtrl.projectData.directoryId, newProject, data, currentMembers, function(data){
                    document.location.href = 'project.php#/'+projectCtrl.currentProjectId+'/home';
                });
            };

            $('md-tabs').on('click','md-tab-item',function(){
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

            $scope.deleteProject = function(ev){
                questionToastModel.show({
                    question : 'Do you want to delete the project?',
                    buttons: {
                        ok: function(){
                            deleteProject();
                        },
                        cancel: function(){}
                    }
                },ev);
            };

            function deleteProject(){
                ajax.delete(dataFactory.deleteProject(projectCtrl.currentProjectId),{},function(){
                    toastModel.showToast('success','Project successfully deleted');
                    document.location.href = 'my-projects.php';
                });
            }

        }
    ]
)
