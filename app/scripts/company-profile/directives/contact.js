    'use strict';
angular.module('dmc.company-profile').
    directive('tabContact', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-contact.html',
            scope: {
                source : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax, questionToastModel) {
                $element.addClass("tab-contact");

                $scope.isAddingContactMethod = false;

                $scope.keyContactTypes = [
                    {
                        id: 1,
                        type: "ENGINEERING"
                    },
                    {
                        id: 2,
                        type: "LEGAL"
                    },
                    {
                        id: 3,
                        type: "MARKETING"
                    },
                    {
                        id: 4,
                        type: "SOURCING"
                    },
                    {
                        id: 5,
                        type: "SUPPORT"
                    },
                    {
                        id: 6,
                        type: "RESEARCH AND DEVELOPMENT"
                    }
                ];

                $scope.states = [
                    "AL|Alabama",
                    "AK|Alaska",
                    "AZ|Arizona",
                    "AR|Arkansas",
                    "CA|California",
                    "CO|Colorado",
                    "CT|Connecticut",
                    "DE|Delaware",
                    "FL|Florida",
                    "GA|Georgia",
                    "HI|Hawaii",
                    "ID|Idaho",
                    "IL|Illinois",
                    "IN|Indiana",
                    "IA|Iowa",
                    "KS|Kansas",
                    "KY|Kentucky",
                    "LA|Louisiana",
                    "ME|Maine",
                    "MD|Maryland",
                    "MA|Massachusetts",
                    "MI|Michigan",
                    "MN|Minnesota",
                    "MS|Mississippi",
                    "MO|Missouri",
                    "MT|Montana",
                    "NE|Nebraska",
                    "NV|Nevada",
                    "NH|New Hampshire",
                    "NJ|New Jersey",
                    "NM|New Mexico",
                    "NY|New York",
                    "NC|North Carolina",
                    "ND|North Dakota",
                    "OH|Ohio",
                    "OK|Oklahoma",
                    "OR|Oregon",
                    "PA|Pennsylvania",
                    "RI|Rhode Island",
                    "SC|South Carolina",
                    "SD|South Dakota",
                    "TN|Tennessee",
                    "TX|Texas",
                    "UT|Utah",
                    "VT|Vermont",
                    "VA|Virginia",
                    "WA|Washington",
                    "WV|West Virginia",
                    "WI|Wisconsin",
                    "WY|Wyoming"
                ];

                $scope.addNewContactMethod = function(){
                    $scope.isAddingContactMethod = true;
                };

                $scope.cancelAddContactMethod = function(){
                    $scope.isAddingContactMethod = false;
                };

                $scope.saveContactMethod = function(name){
                    var data = {
                        name : name,
                        companyId : $scope.source.id,
                        value : null
                    };
                    $scope.source.contactMethods.push(data);
                    $scope.cancelAddContactMethod();
                    apply();
                };

                $scope.deleteContactMethod = function(item,ev,index){
                    questionToastModel.show({
                        question : "Do you want to delete the contact method?",
                        buttons: {
                            ok: function(){
                                if(item.id) {
                                    item.removed = true;
                                }else{
                                    $scope.source.contactMethods.splice(index,1);
                                }
                                apply();
                            },
                            cancel: function(){}
                        }
                    },ev);
                };

                $scope.states = $.map($scope.states, function( n,index ) {
                    var name = n.split('|');
                    return {
                        id : index+1,
                        abbr : name[0],
                        name : name[1]
                    }
                });

                $scope.preferredMethods = [
                    {
                        id : 1,
                        name : "Email"
                    }, {
                        id : 2,
                        name : "Phone"
                    }
                ];

                // open form for add contact
                $scope.addNewContact = function(){
                    $scope.isAddingContact = true;
                };

                // close form for add contact
                $scope.cancelAddContact = function(){
                    $scope.isAddingContact = false;
                };

                // save new contact
                $scope.saveContact = function(newContact){
                    if((newContact.phoneNumber || newContact.email) && newContact.contactType) {
                        newContact.contactType = {
                            id: newContact.contactType
                        }
                        newContact.companyId = $scope.source.id;
                        if (!$scope.source.contacts) $scope.source.contacts = [];
                        $scope.source.contacts.push(newContact);
                        $scope.cancelAddContact();
                        apply();
                    }
                };

                function apply(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                }

                // delete contact
                $scope.deleteContact = function(index){
                    $scope.source.contacts.splice(index, 1);
                };
            }
        };
    }]);
