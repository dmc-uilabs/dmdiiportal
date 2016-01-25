'use strict';

angular.module('dmc.widgets.documents',[
		'dmc.ajax',
		'dmc.data',
		'DropZone'
	]).
	directive('uiWidgetDocuments', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			templateUrl: 'templates/components/ui-widgets/documents.html',
			scope: {
				widgetTitle: "=",
				projectId: "="
			},
			link: function (scope, iElement, iAttrs) {
			},
			controller: function($scope, $element, $attrs, dataFactory, ajax) {
				$scope.documents = [];
				$scope.total = 0;
				$scope.sort = 'name';
				$scope.order = 'DESC';

				// function for get all requirement documents
				$scope.getDocuments = function(){
					ajax.on(dataFactory.getUrlAllDocuments($scope.projectId),{
						projectId : $scope.projectId,
						sort : $scope.sort,
						order : $scope.order,
						limit : 5,
						offset : 0
					},function(data){
						$scope.documents = data.result;
						$scope.total = data.count;
						if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
					},function(){
						alert("Ajax faild: getDocuments");
					});
				};

				// get all requirement documents (first request)
				$scope.getDocuments();
			}
		};
	}]).
	directive('uiWidgetDocumentsProduct', ['$parse', function ($parse) {
		return {
			restrict: 'E',
			scope:{},
			templateUrl: 'templates/components/ui-widgets/documentsProduct.html',
			controller: function($scope, $element, $attrs, dataFactory, ajax) {
				$scope.documents = [];
				$scope.total = 0;
				$scope.sort = 'name';
				$scope.order = 'DESC';

				// function for get all requirement documents
				$scope.getDocuments = function(){
					ajax.on(dataFactory.getUrlAllDocuments($scope.projectId),{
						projectId : 5,
						sort : $scope.sort,
						order : $scope.order,
						limit : 5,
						offset : 0
					},function(data){
						$scope.documents = data.result;
						$scope.total = data.count;
						if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
					},function(){
						alert("Ajax faild: getDocuments");
					});
				};

				// get all requirement documents (first request)
				$scope.getDocuments();
			}
		};
	}]).
	directive('uiWidgetUploadDocuments', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			templateUrl: 'templates/components/ui-widgets/upload-documents.html',
			scope: {
				widgetTitle: "=",
				projectId: "=",
				autoUpload: "=",
				product: "="
			},
			link: function (scope, iElement, iAttrs) {

			},
			controller: function($scope, $element, $attrs, dataFactory, ajax) {
				$scope.autoProcessQueue = ($scope.autoUpload != null ? $scope.autoUpload : true);
				$scope.documents = [];
				if($scope.product){
					ajax.on(dataFactory.getUrlAllDocuments($scope.projectId),{
						projectId : 5,
						sort : 'name',
						order : 'DESC',
						limit : 5,
						offset : 0
					},function(data){
						$scope.documents = data.result;
						if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
					},function(){
						alert("Ajax faild: getDocuments");
					});
				}
				$scope.documentDropZone;

				$scope.removeFile = function(item){
					if(item.file._removeLink){
						item.file._removeLink.click();
					}else{
						for(var i in $scope.documents) {
							if ($scope.documents[i].id == item.id) {
								$scope.documents.splice(i, 1);
								break;
							}
						}
					}
				};

				$scope.confirmDeleteFile = function(item){
					item.delete = true;
				}

				$scope.cancelConfirm = function(item){
					item.delete = false;
				}

				$scope.editFile = function(item){
					item.oldTitle = item.title;
					item.editing = true;
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				};

				$scope.cancelEdit = function(item){
					item.editing = false;
					item.title = item.oldTitle;
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				};

				$scope.saveEdit = function(item){
					if(item.title.trim().length == 0) item.title = item.oldTitle;
					item.editing = false;
					if(item.file.title){
						item.file.title = item.title;
					}
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
				};

				$scope.dropzoneConfig = {
					'options': { // passed into the Dropzone constructor
						'url': dataFactory.getDocumentUpload($scope.projectId),
						'autoProcessQueue': $scope.autoProcessQueue,
						'maxFilesize': 10,
						'addRemoveLinks': true,
						'init' : function() {
							$scope.documentDropZone = this;
							this.on("addedfile", function(file) {
								if($scope.autoProcessQueue == false) {
									var file_ = file;
									var title = file_.name.substring(0,file_.name.lastIndexOf('.'));
									file_.id = $scope.documents.length + 1;
									file_.title = title;
									$scope.documents.push({
										id : file_.id,
										title : title,
										file : file_,
										editing : false,
										type : file_.name.substring(file_.name.lastIndexOf('.'),file_.name.length)
									});
								}
							});
							this.on('removedfile', function (file) {
								for(var i in $scope.documents) {
									if ($scope.documents[i].id == file.id) {
										$scope.documents.splice(i, 1);
										break;
									}
								}
							});
						}
					},
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							var title = file.name.substring(0,file.name.lastIndexOf('.'));
							formData.append('projectId',$scope.projectId);
							formData.append('title',title);
							console.log(file);
							console.log(xhr);
							console.log(formData);
						},
						'success': function (file, response) {
							var data = jQuery.parseJSON(response);
							if(data.error == null) {
								var file_ = file;
								var title = file_.name.substring(0,file_.name.lastIndexOf('.'));
								file_.id = data.result.id;
								file_.title = title;
								$scope.documents.push({
									id: data.result.id,
									title: title,
									projectId: data.result.projectId,
									file : file_,
									editing : false,
									type : file_.name.substring(file_.name.lastIndexOf('.'),file_.name.length)
								});
								if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
							}else{
								console.error(data.error);
							}
						}
					}
				};

			}
		};
	}]).
	directive('uiWidgetDocumentsFolder', ['$parse', function ($parse) {
		return {
			restrict: 'E',
			scope:{},
			templateUrl: 'templates/components/ui-widgets/documents-folder.html',
			controller: function($scope, $element, $attrs, dataFactory, ajax) {
				$scope.documents = [];
				$scope.total = 0;
				$scope.sort = 'name';
				$scope.order = 'DESC';
				$scope.folder = [];
				$scope.indexfolder = [];
				$scope.folderName = '';

				// function for get all requirement documents
					ajax.on(dataFactory.getUrlAllDocuments($scope.projectId),{
						projectId : 5,
						sort : $scope.sort,
						order : $scope.order,
						limit : 5,
						offset : 0
					},function(data){
						//this need delete
						for(var i in data.result){
							data.result[i].modifed = moment(data.result[i].modifed).format('MM/DD/YYYY, h:mm A');
						}
						$scope.documents.push({
							file: false,
							title: "Example Folder",
				      owner: "Bob Smith",
				      size: "100MB",
				      modifed: moment("11/11/2015 12:00").format('MM/DD/YYYY, h:mm A'),
							content: [
								data.result[0], 
								data.result[0], 
								data.result[0],
								{
									file: false,
									title: "Example Folder",
						      owner: "Bob Smith",
						      size: "100MB",
						      modifed: moment("11/11/2015 12:00").format('MM/DD/YYYY, h:mm A'),
									content: [
										data.result[0], 
										data.result[0], 
										data.result[0],
										data.result[0],
										data.result[0],
									]
								},
								data.result[0],
								data.result[0],
								{
									file: false,
									title: "Example Folder2",
						      owner: "Bob Smith",
						      size: "100MB",
						      modifed: moment("11/11/2015 12:00").format('MM/DD/YYYY, h:mm A'),
									content: [
										{
											file: false,
											title: "Example Folder3",
								      owner: "Bob Smith",
								      size: "100MB",
								      modifed: moment("11/11/2015 12:00").format('MM/DD/YYYY, h:mm A'),
											content: [
												data.result[0], 
												data.result[0], 
												data.result[0],
												data.result[0],
												data.result[0],
											]
										},
										data.result[0], 
										data.result[0],
									]
								},
							]
						});
						$scope.documents.push(data.result[0]);
						$scope.documents.push(data.result[1]);
						$scope.documents.push(data.result[2]);
						$scope.documents.push(data.result[0]);
						$scope.documents.push(data.result[1]);
						$scope.documents.push(data.result[2]);
						$scope.documents.push(data.result[0]);
						$scope.documents.push(data.result[1]);
						$scope.total = $scope.documents.length;
						$scope.folder = $scope.documents;
						//end delete

						//$scope.documents = data.result;
						//$scope.total = data.count*2;
						if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
					},function(){
						alert("Ajax faild: getDocuments");
					});

				$scope.openFolder = function(item, index){
					$scope.folder = item.content;
					$scope.indexfolder.push({index: index, title: item.title});
				}

				$scope.exitFolder = function(index){
						console.info("index",index);
					$scope.indexfolder = $scope.indexfolder.slice(0, index+1);
						console.info("indexfolder",$scope.indexfolder);
					$scope.folder = $scope.documents;
					for(var i in $scope.indexfolder){
						//console.info("i",i);

						//console.info('folder',$scope.folder[$scope.indexfolder[i].index]);
						$scope.folder = $scope.folder[$scope.indexfolder[i].index].content;
					}
				}

			}
		};
	}]);