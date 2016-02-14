angular.module('dmc.onboarding')
.controller('CompanyController', 
	['$scope', '$rootScope', '$state', 'ajax', 'dataFactory',
	function ($scope, $rootScope, $state, ajax, dataFactory) {
		if($state.current.name == "onboarding.company"){
			$state.go($scope.company[0].state);
		}
        $scope.activePage = $state;

        $scope.isAddingContact = false;
        $scope.contacts = [];
        $scope.isAddingVideo = false;
        $scope.videos = [];
        $scope.isAddingImage = false;
        $scope.images = [];


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

        //add skill to profile
        $scope.addSkill = function (inputSkill) {
            if (!inputSkill)return;
            $scope.company[5].data.skills.push(inputSkill);
            this.inputSkill = null;
        }

        //remove skill
        $scope.deleteSkill = function (index) {
            $scope.isChange = true;
            $scope.company[5].data.skills.splice(index, 1);
        }

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
            $scope.contacts.unshift(newContact);
            $scope.cancelAddContact();
        };

        // delete contact
        $scope.deleteContact = function(index){
           $scope.contacts.splice(index, 1);
        };    

        $scope.categoriesTiers = [
            {
                id : 1,
                title : "Tier 4 Academic / Nonprofit"
            }
        ];


         // open form for add video
        $scope.addNewVideo = function(){
            $scope.isAddingVideo = true;
        };

        // close form for add video
        $scope.cancelAddVideo = function(){
            $scope.isAddingVideo = false;
        };

        // save new video
        $scope.saveVideo = function(newVideo){
            $scope.videos.unshift(newVideo);
            $scope.cancelAddVideo();
        };

        // delete video
        $scope.deleteVideo = function(index){
            $scope.videos.splice(index, 1);
        };

        
        $scope.addNewImage = function(){
            $scope.isAddingImage = true;
        };

        $scope.cancelAddImage = function(){
            $scope.isAddingImage = false;
        };

        $scope.saveImage = function(newImage){
            if(newImage && $scope.newAddedImage){
                fileUpload.uploadFileToUrl($scope.newAddedImage.file,{id : $scope.source.id, title : newImage.title},'company-profile',callbackUploadPicture);
                $scope.cancelAddImage();
            }
        };

        var callbackUploadPicture = function(data){
            if(!data.error) {
                $scope.source.images.unshift(data.result);
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                toastModel.showToast('success', 'Image successfully added');
            }else{
                toastModel.showToast('error', 'Unable add image');
            }
        };

        $scope.deleteImage = function(img){
            if(!$scope.changes.removedImages) $scope.changes.removedImages = [];
            $scope.changes.removedImages.push(img.id);
            img.hide = true;
            $scope.changedValue('image');
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
        };


        $scope.scrollTop = function(){
        	$(window).scrollTop(0);
        }

        $scope.next = function(index){
        	$scope.company[index].done = true;
        	$(window).scrollTop(0);
        	$state.go('^' + $scope.company[index+1].state);
        }

        $scope.finish = function(index){
        	$scope.company[index].done = true;
        	$(window).scrollTop(0);
        	$state.go('^.^.home');
        }

}]);