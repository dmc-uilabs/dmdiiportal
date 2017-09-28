'use strict';

angular.module('dmc.company.onboarding')
.controller('co-onboardingController', ['$scope', 'companyOnboardingModel',
    function($scope, companyOnboardingModel){

}])

.controller('co-homeController', ['$scope', 'companyOnboardingModel', 'userData', 'DMCUserModel', '$location', '$rootScope', '$cookies', '$mdDialog',
    function($scope, companyOnboardingModel, userData, DMCUserModel, $location, $rootScope, $cookies, $mdDialog){
      $cookies.put('fromDMDIISignup',true);

}])

.controller('co-companyinfoController', ['$scope', 'companyOnboardingModel', '$window', '$location', '$anchorScroll', 'ajax', 'dataFactory', '$rootScope', '$mdDialog',
    function($scope, companyOnboardingModel, $window, $location, $anchorScroll, ajax, dataFactory, $rootScope, $mdDialog){
      $anchorScroll();

      $scope.linkToPage = function(){
        $window.location.href = '/onboarding.php';
      }

      $scope.company = companyOnboardingModel.get_companyInfo();
      if (angular.equals($scope.company, {})){
          ajax.get(dataFactory.payment().organizations, {}, function(response){
            if (response.data.id != null){
              if (response.data.isPaid == false){
                transResponse(response.data);
                // console.log($scope.company);
                companyOnboardingModel.save_companyInfo($scope.company);
                // $location.path('/pay');
              }

              else{
                alert("You already have a Tier3 Membership organization database, will redirect to dashboard");
                $window.location.href = '/onboarding.php';
                // $('#orgExist').modal('show').
                // $('#orgExist').on('hidden.bs.modal', function (e) {
                //   $window.location.href = '/onboarding.php';
                // });

              }
            }
          });
      }

      function transResponse(data){
        $scope.company.name = data.name;
        $scope.company.id = data.id;
        $scope.company.naicsCode = data.naicsCode;
        $scope.company.firstAddress = {};
        $scope.company.firstAddress.line1 = data.address.streetAddress1;
        $scope.company.firstAddress.line2 = data.address.streetAddress2;
        $scope.company.firstAddress.city = data.address.city;
        $scope.company.firstAddress.state = data.address.state;
        $scope.company.firstAddress.zipcode = data.address.zip;

        var jsonType = angular.fromJson(data.dmdiiMembershipInfo);
        // console.log(jsonType);
        $scope.company.main = jsonType.mainPointContact;
        $scope.company.finance = jsonType.financePointContact;
        if ($scope.company.finance != null)
          $scope.company.financialContact = true;
        $scope.company.legal = jsonType.legalPointContact;
        if ($scope.company.legal != null)
          $scope.company.legalContact = true;
        $scope.company.secondAddress = jsonType.secondAddress;
        if ($scope.company.secondAddress != null)
          $scope.company.subCompany = true;
        $scope.company.selectedAnnualRevenue = null;
        $scope.company.selectedEmployeeSize = null;
        $scope.company.type = null;
        $scope.company.startUp = jsonType.startUp;
        $scope.company.duns = jsonType.dunsCode;
      }

      $scope.company.selectedEmployeeSize = null;
      $scope.company.selectedAnnualRevenue = null;

      $scope.orgType = [
        { selection : 'Public Company', selected : false },
        { selection : 'Educational', selected : false },
        { selection : 'Self Employed', selected : false },
        { selection : 'Government Agency', selected : false },
        { selection : 'Non Profit', selected : false },
        { selection : 'Self Owned', selected : false },
        { selection : 'Privately Held', selected : false },
        { selection : 'Partnership', selected : false }
      ];


      $scope.employeeSize = [
        {
          name: 'Self-employed',
          value: 'Self-employed'
        },
        {
          name: '1-10 employees',
          value: '1-10 employees'
        },
        {
          name: '11-50 employees',
          value: '11-50 employees'
        },
        {
          name: '51-200 employees',
          value: '51-200 employees'
        },
        {
          name: '501-1000 employees',
          value: '501-1000 employees'
        },
        {
          name: '1001-5000 employees',
          value: '1001-5000 employees'
        },
        {
          name: '5001-10,000 employees',
          value: '5001-10,000 employees'
        },
        {
          name: '10,000+ employees',
          value: '10,000+ employees'
        }
      ];

      $scope.annualRevenue = [
        {
          name: '0-25M',
          value: '0-25M'
        },
        {
          name: '26M-50M',
          value: '26M-50M'
        },
        {
          name: '51M-100M',
          value: '51M-100M'
        },
        {
          name: '101M-250M',
          value: '101M-250M'
        },
        {
          name: '251M-500M',
          value: '251M-500M'
        },
        {
          name: '501M-1B',
          value: '501M-1B'
        },
        {
          name: '2B-10B',
          value: '2B-10B'
        },
        {
          name: '11B+',
          value: '11B+'
        }
      ];

      $scope.isOptionsRequired = function(){
        return !$scope.orgType.some(function(options){
          return options.selected;
        });
      };



      $scope.companyinfo = {};

      $scope.save = function(company) {
        var type = [];

        $scope.orgType.forEach(function(element) {
            if (element.selected == true)
              type.push(element.selection);
        });

        if (!company.subCompany){
            company.secondAddress = null;
        }

        if (!company.financialContact){
            company.finance = null;
        }

        if (!company.legalContact){
            company.legal = null;
        }

        company.selectedEmployeeSize = company.selectedEmployeeSize.value;
        company.selectedAnnualRevenue = company.selectedAnnualRevenue.value;
        $scope.companyinfo = angular.copy(company);
        $scope.companyinfo.type = type;
        if ($scope.company.id)
          $scope.companyinfo.id = $scope.company.id;

        companyOnboardingModel.save_companyInfo($scope.companyinfo);
        $location.path('/pay');
      };

      $scope.showModalTermsConditions = function(){
  			$mdDialog.show({
  			    controller: 'TermsConditionsController',
  			    templateUrl: 'templates/onboarding/terms-conditions.html',
  			    parent: angular.element(document.body),
  			    clickOutsideToClose: false
  		    })
  		    .then(function() {
  		    }, function() {
  		    });
  		}

      if ($rootScope.isLogged && !$rootScope.userData.termsConditions) {
        $scope.showModalTermsConditions();
      }

}])

.controller('co-payController', ['$scope', 'companyOnboardingModel', '$location', '$anchorScroll', '$window', 'dataFactory', 'ajax', 'storageService',
    function($scope, companyOnboardingModel, $location, $anchorScroll, $window, dataFactory, ajax, storageService){
      $anchorScroll();
      $scope.isDisabled = false;

      $scope.company = companyOnboardingModel.get_companyInfo();
      if(angular.equals($scope.company, {}) || $scope.company.selectedEmployeeSize == null){
          var haveStored = storageService.get('companyinfoCache');
          if (haveStored){
              $scope.company = JSON.parse(haveStored);
          }

          else{
              $location.path('/companyinfo');
          }
      }
      else{
          storageService.set('companyinfoCache', JSON.stringify($scope.company));
      }

      // if (angular.equals($scope.company, {}) || $scope.company.selectedEmployeeSize == null){
      //         $location.path('/companyinfo');
      // }

      $scope.back = function(){
        companyOnboardingModel.save_companyInfo($scope.company);
        $location.path('/companyinfo');
      }

      $scope.scroll = function(id){
        $scope.payment = true;
        var div = document.getElementById(id);
        $('body').animate({
          scrollTop: document.body.scrollHeight
        }, 1200);
      }

      //== Stripe ==
      // Create a Stripe client
      var stripe = Stripe('pk_test_xQ5iVIgTvkehDjRgvaj3kbRC');

      // Create an instance of Elements
      var elements = stripe.elements();

      // Custom styling can be passed to options when creating an Element.
      // (Note that this demo uses a wider set of styles than the guide below.)
      var style = {
        base: {
          color: '#32325d',
          lineHeight: '24px',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      };

      // Create an instance of the card Element
      var card = elements.create('card', {style: style});

      // Add an instance of the card Element into the `card-element` <div>
      card.mount('#card-element');

      // Handle real-time validation errors from the card Element.
      card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });

      // Handle form submission
      var form = document.getElementById('payment-form');
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        $scope.disableButton();
        // changeButton();

        stripe.createToken(card).then(function(result) {
          if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            // Send the token to your server
            stripeTokenHandler(result.token);
          }
        });
      });

      $scope.enableButton = function(){
        $scope.isDisabled = false;
      }

      $scope.disableButton = function(){
        $scope.isDisabled = true;
      }

      function stripeTokenHandler(token) {

          var jsoninfo = companyInfotoJson(token);
          storageService.remove('companyinfoCache');

          if (!jsoninfo.id){
            ajax.get(dataFactory.payment().organizations, {}, function(response){
              if (response.data.name != null){
                if (response.data.isPaid == false){
                  jsoninfo.organizationModel.id = response.data.id;
                  // console.log("jsoninfo.id", jsoninfo.organizationModel.id);
                }

                else{
                  alert("You already have a Tier3 Membership organization database, will redirect to dashboard");
                  $window.location.href = '/onboarding.php';
                  // $('#orgExist').modal('show');
                }
              }
            }).then(function(){
              // console.log("jsoninfo", jsoninfo.organizationModel.id);
              if (!jsoninfo.organizationModel.id)
                jsoninfo.organizationModel.id = null;
              $scope.submitOrgPayment(jsoninfo);
            });
          }
          else {
              $scope.submitOrgPayment(jsoninfo);
          }

      }

      $scope.submitOrgPayment = function(info){
          ajax.create(dataFactory.payment().pay, info, function successCallback(response) {
            if (response.data.status == "succeeded"){
              alert("Successful payment! Redirect to dashboard");
              // $window.location.href = '/onboarding.php';
              $window.location.href = '/marketplace.php';
              // $('#successPay').modal('show');
              // console.log("success");
            }
            else if (response.data.status == "failed"){
              alert(response.data.reason);
            }
          }, function errorCallback(response) {
            alert("Oops, something went wrong, please contact us");
            // $scope.body = "Oops, something went wrong, please contact us for more information";
            // $('#failedPay').modal('show');
          }).then(function(){
              $scope.enableButton();
              // $scope.flag = false;
          });
      }

      $scope.linkToPage = function(){
        $window.location.href = '/onboarding.php';
      }

      function companyInfotoJson(token){

          $scope.dmdiiMembershipInfo = {
            mainPointContact: $scope.company.main,
            financePointContact: $scope.company.finance,
            legalPointContact: $scope.company.legal,
            secondAddress: $scope.company.secondAddress,
            annualRevenue: $scope.company.selectedAnnualRevenue,
            employeeSize: $scope.company.selectedEmployeeSize,
            startUp: $scope.company.startUp,
            dunsCode: $scope.company.duns
          };

          var MembershipInfo = JSON.stringify($scope.dmdiiMembershipInfo);

          $scope.payment = {
            stripeToken: token.id,
            organizationModel:{
              name:$scope.company.name,
              id: $scope.company.id ? $scope.company.id : null,
              location:null,
              description:null,
              division:null,
              industry:null,
              naicsCode:$scope.company.naicsCode,
              email:null,
              phone:null,
              website:null,
              socialMediaLinkedin:null,
              socialMediaTwitter:null,
              socialMediaInthenews:null,
              perferedCommMethod:null,
              productionCapabilities:null,
              address:{
                streetAddress1:$scope.company.firstAddress.line1,
                streetAddress2:($scope.company.firstAddress.line2?$scope.company.firstAddress.line2:null),
                city:$scope.company.firstAddress.city,
                state:$scope.company.firstAddress.state,
                country:"US",
                zip:$scope.company.firstAddress.zipcode,
              },
              reasonJoining:null,
              featureImage:null,
              dmdiiMembershipInfo:MembershipInfo,
              awards:null,
              contacts:null,
              areasOfExpertise:null,
              desiredAreasOfExpertise:null,
              postCollaboration:null,
              upcomingProjectInterests:null,
              pastProjects:null
            }
          };

          // var jsoninfo = angular.toJson($scope.payment);
          // // console.log(jsoninfo);
          return $scope.payment;

      }

}])
