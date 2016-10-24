'use strict';

angular.module('dmc.widgets.documents',[
		'dmc.ajax',
		'dmc.data',
		'DropZone',
		'ui.select'
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
					ajax.get(dataFactory.documentsURL().getList, {
							parentType: 'PROJECT',
							parentId: $scope.projectId,
							docClass: 'SUPPORT',
							recent: 5
					}, function(response) {
							$scope.documents = response.data.data||[];
							$scope.total = $scope.documents.length;
							if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
					});

					/*
					ajax.get(dataFactory.getProjectDocuments($scope.projectId),{
						sort : $scope.sort,
						order : $scope.order,
						limit : 5,
						offset : 0
					},function(response){
						$scope.documents = response.data;
						$scope.total = response.data.length;
						if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
					});
					*/
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
					ajax.get(dataFactory.documentsURL().getList, {
							parentType: 'PROJECT',
							parentId: $scope.projectId,
							docClass: 'SUPPORT',
							recent: 5
					}, function(response) {
							$scope.documents = response.data.data||[];
							$scope.total = $scope.documents.length;
							if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
					});
				};

				// get all requirement documents (first request)
				$scope.getDocuments();
			}
		};
	}]).
	directive('uiWidgetUploadDocuments', ['$parse', function ($parse) {
		return {
			restrict: 'EA',
			templateUrl: 'templates/components/ui-widgets/upload-documents.html',
			scope: {
                source : "=",
				widgetTitle: "=",
				projectId: "=",
                widgetType: "=",
				autoUpload: "=",
                serviceId: "=",
				product: "=",
				allowTagging: "=",
				fileLimit: "=",
				accessLevel: "="
			},
			controller: function($scope, $element, $attrs, dataFactory, ajax) {
        $scope.documentDropZone;
				$scope.autoProcessQueue = ($scope.autoUpload != null ? $scope.autoUpload : true);

				if(!$scope.source) $scope.source = [];

        var requestData = {
						_sort : 'name',
						_order : 'DESC'
        };

				if($scope.projectId){
						ajax.get(dataFactory.documentsURL().getList, {
								parentType: 'PROJECT',
								parentId: $scope.projectId,
								docClass: 'SUPPORT',
								recent: 5
							}, function(response) {
								$scope.source = response.data.data||[];
								apply();
						});
				}
				// else if($scope.serviceId){
								//     ajax.get(dataFactory.getServiceDocuments($scope.serviceId), requestData,
								//         function(response){
								//             $scope.source = response.data;
								//             apply();
								//         }
								//     );
								// }

				$scope.tags = [];

				var callbackTagFunction = function(response) {
					$scope.tags = response.data
				}

				var getTags = function(){
					ajax.get(dataFactory.getDocumentTags(), null, callbackTagFunction);
				}
				getTags();

				$scope.removeFile = function(item){
					if(item.file._removeLink){
						item.file._removeLink.click();
					}

					for(var i in $scope.source) {
						if ($scope.source[i].id == item.id) {
							$scope.source[i].deleted = true;
							break;
						}
					}

				};

				$scope.confirmDeleteFile = function(item){
					item.delete = true;
				};

				$scope.cancelConfirm = function(item){
					item.delete = false;
				};

				$scope.editFile = function(item){
					item.oldTitle = item.title;
					item.editing = true;
                    apply();
				};

				$scope.cancelEdit = function(item){
					item.editing = false;
					item.title = item.oldTitle;
                    apply();
				};

				$scope.saveEdit = function(item){
					if(item.title.trim().length == 0) item.title = item.oldTitle;
					item.editing = false;
					if(item.file.title){
						item.file.title = item.title;
					}
				};

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

				$scope.dropzoneConfig = {
					'options': { // passed into the Dropzone constructor
						'url': dataFactory.getDocumentUpload($scope.projectId),
						'autoProcessQueue': $scope.autoProcessQueue,
						'maxFilesize': 10,
						'addRemoveLinks': true,
						'maxFiles': $scope.fileLimit,
						'init' : function() {
							$scope.documentDropZone = this;
							this.on('addedfile', function(file) {
								if($scope.autoProcessQueue == false) {
									var file_ = file;
									var title = file_.name.substring(0,file_.name.lastIndexOf('.'));
									file_.title = title;
									$scope.source.push({
										id : file_.id,
										title : title,
										file : file_,
										editing : false,
										type : file_.name.substring(file_.name.lastIndexOf('.'),file_.name.length),
										accessLevel: file_.accessLevel
									});
                                    $scope.$apply();
								}
							});
							this.on('removedfile', function (file) {
								for(var i in $scope.source) {
									if ($scope.source[i].id == file.id) {
										$scope.source.splice(i, 1);
										break;
									}
								}
                                apply();
							});
						}
					},
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							var title = file.name.substring(0,file.name.lastIndexOf('.'));
							formData.append('projectId',$scope.projectId);
							formData.append('title',title);
						},
						'success': function (file, response) {
							var data = jQuery.parseJSON(response);
							if(data.error == null) {
								var file_ = file;
								var title = file_.name.substring(0,file_.name.lastIndexOf('.'));
								file_.id = data.result.id;
								file_.title = title;
								$scope.source.push({
									id: data.result.id,
									title: title,
									projectId: data.result.projectId,
									file : file_,
									editing : false,
									type : file_.name.substring(file_.name.lastIndexOf('.'),file_.name.length),
									accessLevel: file_.accessLevel
								});
                                apply();
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
			scope:{
                documentsType : "=",
                typeId : "="
            },
			templateUrl: 'templates/components/ui-widgets/documents-folder.html',
			controller: function($scope, $element, $attrs, dataFactory, ajax) {
				$scope.documents = [];
				$scope.total = 0;
				$scope.sort = 'title';
				$scope.order = 'DESC';
				$scope.folder = [];
				$scope.indexfolder = [];
				$scope.folderName = '';

                // function for get all requirement documents
                $scope.serviceDocumentId = 0;
                $scope.getDocuments = function() {
                    var url = null;
                    var requestData = {
                        _order : $scope.order,
                        _sort : ($scope.sort[0] == '-' ? $scope.sort.substring(1, $scope.sort.length) : $scope.sort)
                    };
                    if($scope.documentsType == "service"){
                        url = dataFactory.getServiceDocuments($scope.typeId);
                        requestData["service-documentId"] = $scope.serviceDocumentId;
                    }else if($scope.documentsType == "project"){
                        url = dataFactory.documentsURL().getList;
                        requestData = {
														parentType: 'PROJECT',
														parentId: $scope.typeId,
														docClass: 'SUPPORT',
														recent: 5
													};
                    }
                    ajax.get(url, requestData,
                        function (response) {
                            $scope.documents = response.data.data||[];
                            $scope.total = $scope.documents.length;
                            $scope.folder = $scope.documents;
                            for(var i in $scope.folder){
                                $scope.folder[i].modifedFormat = $scope.folder[i].modifed;
                                $scope.folder[i].modifed = Date.parse($scope.folder[i].modifed);
                            }
                            apply();
                        }
                    );
                };
                $scope.getDocuments();

                $scope.onOrderChange = function (order) {
                    $scope.sort = order;
                    $scope.order = ($scope.order == 'DESC' ? 'ASC' : 'DESC');
                    $scope.getDocuments();
                };

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

				$scope.openFolder = function(item, index){
					$scope.indexfolder.push({id: item.id, title: item.title});
                    $scope.serviceDocumentId = item.id;
                    $scope.getDocuments();
				};

				$scope.exitFolder = function(id,index){
                    $scope.indexfolder.splice(index+1,$scope.indexfolder.length);
                    $scope.serviceDocumentId = id;
                    $scope.getDocuments();
				};

			}
		};
	}]);
