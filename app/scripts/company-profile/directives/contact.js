'use strict';
angular.module('dmc.company-profile').
    directive('tabContact', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            templateUrl: 'templates/company-profile/tabs/tab-contact.html',
            scope: {
                source : "=",
                changedValue : "=",
                changes : "="
            }, controller: function($scope, $element, $attrs, dataFactory, ajax) {
                $element.addClass("tab-contact");


                // get company contacts
                $scope.getContacts = function(){
                    ajax.get(dataFactory.getCompanyKeyContacts($scope.source.id),{
                            "_order" : "DESC",
                            "_sort" : "id"
                        }, function(response){
                            $scope.source.contacts = response.data;
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        }
                    );
                };
                $scope.getContacts();

                $scope.keyContactTypes = [
                    {
                        id : 1,
                        name : "LEGAL"
                    }, {
                        id : 2,
                        name : "LEGAL 2"
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
                    ajax.get(dataFactory.getLastCompanyContactId(),{
                            "_order" : "DESC",
                            "_limit" : 1,
                            "_sort" : "id"
                        },
                        function(response){
                            var data = response.data ? response.data : response;
                            var lastId = (data.length == 0 ? 1 : data[0].id+1);

                            newContact.id = lastId;
                            newContact.companyId = $scope.source.id;
                            ajax.create(dataFactory.addCompanyContact(),newContact,
                                function(response){
                                    var data = response.data ? response.data : response;
                                    if(!$scope.source.contacts) $scope.source.contacts = [];
                                    $scope.source.contacts.unshift(data);
                                    $scope.cancelAddContact();
                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                                },function(){
                                    toastModel.showToast("error", "Error. The problem on the server (add contact).");
                                }
                            );
                        },function(){
                            toastModel.showToast("error", "Error. The problem on the server (get last contact id).");
                        }
                    );
                };

                // delete contact
                $scope.deleteContact = function(contact){
                    contact.hide = true;
                    $scope.changedValue('contact');
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };
            }
        };
    }]);