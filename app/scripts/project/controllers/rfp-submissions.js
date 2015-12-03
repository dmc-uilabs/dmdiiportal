angular.module('dmc')
.controller('RfpSubmissionsCtrl',
    function ($scope,$compile,$rootScope, $stateParams,$mdDialog, projectData) {
        var projectCtrl = this;
        projectCtrl.currentProjectId = angular.isDefined($stateParams.projectId) ? $stateParams.projectId : 1;
        projectCtrl.projectData = projectData;

        $rootScope.$on('$stateChangeStart', $mdDialog.cancel);

        $scope.compare = [];
        $scope.submissions = [{
            id : 1,
            title : "SAM",
            date : moment(new Date("15 Sep 2015 15:12:48")).format("MM/DD/YY HH:mm:ss A"),
            success : 97,
            inputs : 2,
            select : false,
            letter: "We propose to develop and deliver a low heat loss Transformer based on our novel material. It will meet all of the environmental and Compliance requirements in your specification. The attached document summarizes Performance relative to an iron core transformer. Please let us know how you would like to proceed."
        },{
            id : 2,
            title : "WYIV Co.",
            date : moment(new Date("11 Sep 2015 10:16:11")).format("MM/DD/YY HH:mm:ss A"),
            success : 91,
            inputs : 2,
            select : false,
            letter: "Lorem ipsum dolor sit amet."
        },{
            id : 3,
            title : "RCJ Co.",
            date : moment(new Date("12 Sep 2015 06:55:33")).format("MM/DD/YY HH:mm:ss A"),
            success : 90,
            inputs : 1,
            select : false,
            letter: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
        }];

        $(".tableSubmissions").on("click",".table-line",function(){
            var item = null;
            var id = parseInt($(this).find(".idSubmission").val());
            for(var i in $scope.submissions){
                if($scope.submissions[i].id === id){
                    item = $scope.submissions[i];
                    break;
                }
            }
            $("#inputs-outputs").remove();
            if($(this).hasClass("opened")){
                $(".opened").removeClass("opened");
            }else{
                $(".opened").removeClass("opened");
                $(this).addClass("opened");
                var id = parseInt($(this).find(".idSubmission").val());
                $($compile('<tr id="inputs-outputs" submission-inputs-outputs submission-letter="\'' + item.letter + '\'" total-inputs="'+item.inputs+'" submission-name="\'' + item.title + '\'"></tr>')($scope)).insertAfter($(this));
            }
        });

        $scope.compareSubmission = function(ev,item){
            if(item.select) {
                for(var i in $scope.compare){
                    if($scope.compare[i].id == item.id){
                        $scope.compare.splice(i,1);
                        break;
                    }
                }
            }else{
                $scope.compare.push(item);
            }
        };
    })