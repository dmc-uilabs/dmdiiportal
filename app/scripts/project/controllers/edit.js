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
            $scope.projectData.dueDate=projectData.origDueDate;


            $scope.addMembersWp = function(ev){
              $mdDialog.show({
                  controller: 'AddMembersController',
                  templateUrl:'templates/components/add-project/ap-tab-two.html',
                  parent: angular.element(document.body),
                  locals:{dataToPass: $scope.invitees},
                  targetEvent: ev,
                  fullscreen:true,
                  clickOutsideToClose:true
              }).then(function(invitees){
                $scope.invitees= invitees;
                // $scope.invitees.map(function(a) {
                //   var newMember = a.displayName;
                //   if ($scope.currentMembers.indexOf(newMember)==-1){
                //     $scope.currentMembers.push(newMember);
                //   }
                // });
              })

            }


            if ($scope.projectData.isPublic) {
                $scope.projectData.type = 'public';
                if ($scope.projectData.requiresAdminApprovalToJoin) {
                    $scope.projectData.approvalOption = 'admin';
                } else {
                    $scope.projectData.approvalOption = 'all';
                }
            } else {
                $scope.projectData.type = 'private';
            }
            $rootScope.$on('$stateChangeStart', $mdDialog.cancel);


            $scope.projectState = "EDIT WORKSPACE";
            $scope.editState = true;


            $scope.addTag = function(newTag){
                $scope.projectData.tags.push({
                    name : newTag
                });
                $scope.newTag = null;
            };

            $scope.deleteTag = function(index,tag){
                if(tag.id > 0){
                    tag.deleted = true;
                }else{
                    $scope.projectData.tags.splice(index,1);
                }
            };

            $scope.invitees = [];
            $scope.documents = [];
            // $scope.currentMembers = [];
            var currentMembersId=[];

            function apply() {
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
            }

            // get project members
            $scope.getMembers = function () {
                ajax.get(dataFactory.projectMembers(projectCtrl.currentProjectId), {}, function (response) {
                    var profileIds = $.map(response.data, function (x) {
                        return x.profileId;
                    });
                    currentMembersId = $.map(response.data, function (x) {
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
                            // $scope.invitees.map(function(a) {
                            //   var newMember = a.displayName;
                            //   if ($scope.currentMembers.indexOf(newMember)==-1){
                            //     $scope.currentMembers.push(newMember);
                            //   }
                            // });
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

            $scope.updateProject = function(details) {

                setProjectDetails(details);

                var new_invitees=$scope.invitees;
                $scope.goSaveProject = true;
                $(window).unbind('beforeunload');

                if(newProject.dueDate){
                    newProject.dueDate = Date.parse(newProject.dueDate);
                }else{
                    newProject.dueDate = Date.parse(new Date());
                }
                newProject.documents = $scope.documents;


                projectModel.update_project(projectCtrl.currentProjectId, projectCtrl.projectData.directoryId, newProject, new_invitees, currentMembersId, function(data){
                    document.location.href = 'project.php#/'+projectCtrl.currentProjectId+'/home';
                });
            };

            $('md-tabs').on('click','md-tab-item',function(){
                $scope.enableNext($(this).index()+2);
            });



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
                    document.location.href = 'all-projects.php';
                });
            }

        }
    ]
)
