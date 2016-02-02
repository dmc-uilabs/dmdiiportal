angular.module('dmc.community')

    .controller(
        "ComposeDiscussionController", [
            '$scope', 'ajax', 'dataFactory', '$mdDialog', "$mdToast", "toastModel",  
            function ($scope, ajax, dataFactory, $mdDialog, $mdToast, toastModel) {
                
                $scope.NewDiscussion = {
                    subject: "",
                    tags: [],
                    message: ""
                }


                $scope.cancel = function(){
                    $scope.NewDiscussion = {
                        subject: "",
                        tags: [],
                        message: ""
                    }
                    $mdDialog.hide();
                }

                $scope.addTag = function(inputTag){
                    if(!inputTag)return;
                    $scope.NewDiscussion.tags.push(inputTag);
                    this.inputTag = null;
                }

                //remove tag
                $scope.deleteTag = function(index){
                    $scope.NewDiscussion.tags.splice(index,1);
                }

                $scope.save = function(message, subject){    
	                ajax.get(
	                	dataFactory.getLastDiscussionId(), 
	                	{
		                    "_limit" : 1,
		                    "_order" : "DESC",
		                    "_sort" : "id"
		                }, 
		                function(response){
	                    	console.info(response)
	                    	var lastId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
	                    
	                    	ajax.create(
		                        dataFactory.addDiscussion(),
		                        {
		                            "id": lastId,
		                            "message": $scope.NewDiscussion.message,
		                            "title": $scope.NewDiscussion.subject,
		                            "comments": { 
			                            "link": "/individual-discussion/" + lastId + "/individual-discussion-comment",
			                            "totalItems": 0
		                          	}
		                        },
		                        function(data){
		                            toastModel.showToast("success", "Discussion created");
                    				$mdDialog.hide();
		                        }
		                    );

	                    	ajax.get(
	                    		dataFactory.getLastDiscussionTagId(), 
	                    		{
				                    "_limit" : 1,
				                    "_order" : "DESC",
				                    "_sort" : "id"
			                	},
			                	function(response){
				                	var lastTagId = (response.data.length == 0 ? 1 : parseInt(response.data[0].id)+1);
			                    	for(var i in $scope.NewDiscussion.tags){
				                    	ajax.create(
					                        dataFactory.addDiscussionTag(),
					                        {
					                            "id": lastTagId,
					                            "name": $scope.NewDiscussion.tags[i],
					                            "individual-discussionId": lastId
					                        },
					                        function(data){}
					                    );
										lastTagId ++;
			                    	}
		                		}
		                	);
		                }, 
	                	function(){
		                    toastModel.showToast("error", "Unable get last id");
		                }
		             );

                }
            }       
        ]
    );