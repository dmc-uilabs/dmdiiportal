'use strict';

angular.module('dmc.resources')
    .controller('ResourcesCtr', ['$stateParams', '$state', "$scope", "ajax", "$location","dataFactory","toastModel", function ($stateParams, $state, $scope, ajax, $location, dataFactory, toastModel) {

      //Data Objects
        $scope.featureLab= {
          id: 1,
          title: "UILabs",
          image:"http://www.sme.org/uploadedImages/Publications/ME_Magazine/2015/January/Web-only_Content/UI%20Labs%20logo.png",
          description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam",
          dateCreated: "#",
          link: "#",
          contact: "#",
          highlighted: true
        };

        $scope.featureBay = {
          id: 5,
          title: "Welding and Fabrication",
          image: "http://goreenterprisespr.com/yahoo_site_admin/assets/images/Machine_shop_2008_021.100135939_std.JPG",
          description: " Quisque cursus eu tellus sed blandit. Vestibulum sit amet urna quis tortor sollicitudin varius. Nunc ut pharetra mi. Pellentesque placerat elit in turpis rhoncus, eu sollicitudin ex varius. Pellentesque ut magna ultricies, pretium sem eget, accumsan sapien. Vivamus vel luctus urna. Curabitur id auctor nibh, id ullamcorper elit. Nullam volutpat augue eu consequat commodo. ",
          dateCreated: "#",
          link: "#",
          contact: "#",
          highlighted: true
        };

        $scope.bays ={
          one: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIdyuW4lg2prvSc3w0Q-AnE5ylxWwjP4TC5G9XhMr-68uR32M8OQ",
          two: "https://cdn1.iconfinder.com/data/icons/modern-latin-alphabet-lowercase-and-uppercase-lett/154/keyboard-two-number-key-512.png",
          three:"https://cdn1.iconfinder.com/data/icons/modern-latin-alphabet-lowercase-and-uppercase-lett/154/keyboard-number-three-key-512.png",
          four: "https://cdn1.iconfinder.com/data/icons/modern-latin-alphabet-lowercase-and-uppercase-lett/154/keyboard-four-number-key-512.png",
          five: "https://cdn1.iconfinder.com/data/icons/modern-latin-alphabet-lowercase-and-uppercase-lett/154/keyboard-five-number-key-512.png",
          six: "https://cdn1.iconfinder.com/data/icons/modern-latin-alphabet-lowercase-and-uppercase-lett/154/keyboard-six-number-key-512.png",
          seven:"https://cdn1.iconfinder.com/data/icons/modern-latin-alphabet-lowercase-and-uppercase-lett/154/keyboard-seven-number-key-512.png",
          eight:"https://cdn1.iconfinder.com/data/icons/modern-latin-alphabet-lowercase-and-uppercase-lett/154/keyboard-eight-number-key-512.png"
        };

        $scope.machines = [
          {
            id: 1,
            title: "Highlights NHX 6300",
            image: "http://www.indiantradebird.com/admin/members/2698/images/0_dd40af72.jpg",
            description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
            dateCreated: "#",
            link: "#",
            contact: "#",
            highlighted: true
          },
          {
            id: 2,
            title: "Highlights NZH 2000",
            image: "http://www.hongfatmachine.com/uploadfiles/upLoadImages/2012458490.jpg",
            description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
            dateCreated: "#",
            link: "#",
            contact: "#",
            highlighted: true
          },
          {
            id: 3,
            title: "ST-30",
            image: "http://www.uvcuringindia.com/prd/mechanical-flat-screen-printing-machines.jpg",
            description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
            dateCreated: "#",
            link: "#",
            contact: "#",
            highlighted: true
          }
        ];
        $scope.fellows = [];
        $scope.currentProjects = [];
        $scope.upcomingProjects = [];
        $scope.jobs = [];
        $scope.courses = [];
        $scope.assessments = [];


        //Functions
        var apply = function(){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };

        $scope.changeLab = function(LabNum){
          ajax.get(dataFactory.getResourceLab(LabNum), {
              }, function(response){
                console.log(response.data);//testing
                $scope.featureLab = response.data;
                apply();
              }
          );
        };

        $scope.changeMachines = function(BayNum){
          ajax.get(dataFactory.getMachines(BayNum), {
              }, function(response){
                $scope.machines = response.data.machines;
                apply();
              }
          );
        };
        $scope.changeBay = function(BayNum){
          ajax.get(dataFactory.getResourceBay(BayNum), {
              }, function(response){
                $scope.featureBay = response.data;
                $scope.changeMachines(BayNum);
                apply();
              }
          );
        };

        $scope.getFellows = function(){
            ajax.get(dataFactory.getFellows(), {
                },
                function(response){
                    $scope.fellows = response.data;
                    apply();
                }
            );
        };

        $scope.getCurrentProjects = function(){
            ajax.get(dataFactory.getCurrentProj(), {
                },
                function(response){
                    $scope.currentProjects = response.data;
                    apply();
                }
            );
        };

        $scope.getUpcomingProjects = function(){
            ajax.get(dataFactory.getUpcomingProj(), {
                },
                function(response){
                    $scope.upcomingProjects = response.data;
                    apply();
                }
            );
        };

        $scope.getCourses = function(){
            ajax.get(dataFactory.getCourse(), {
                },
                function(response){
                    $scope.courses = response.data;
                    apply();
                }
            );
        };

        $scope.getJobs = function(){
            ajax.get(dataFactory.getJob(), {
                },
                function(response){
                    $scope.jobs = response.data;
                    apply();
                }
            );
        };

        $scope.getAssessments = function(){
            ajax.get(dataFactory.getAssessment(), {
                },
                function(response){
                    $scope.assessments = response.data;
                    apply();
                }
            );
        };


        //Run Functions
        $scope.getFellows();
        $scope.getCurrentProjects();
        $scope.getUpcomingProjects();
        $scope.getCourses();
        $scope.getJobs();
        $scope.getAssessments();





        //END Controller
    }]
);
