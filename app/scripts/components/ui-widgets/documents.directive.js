'use strict';

angular.module('dmc.widgets.documents',[
		'dmc.ajax',
		'dmc.data',
		'DropZone',
		'ui.select',
		'treeControl'
	]).
	directive('uiWidgetDocuments', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			templateUrl: 'templates/components/ui-widgets/documents.html',
			scope: {
				widgetTitle: '=',
				projectId: '='
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
					ajax.get(dataFactory.documentsUrl().getList, {
							parentType: 'PROJECT',
							parentId: $scope.projectId,
							docClass: 'SUPPORT',
							recent: 20
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
					ajax.get(dataFactory.documentsUrl().getList, {
							parentType: 'PROJECT',
							parentId: $scope.projectId,
							docClass: 'SUPPORT',
							recent: 20
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
	directive('uiWidgetUploadDocuments', ['$parse', '$q', 'toastModel', function ($parse, $q, toastModel) {
		return {
			restrict: 'EA',
			templateUrl: 'templates/components/ui-widgets/upload-documents.html',
			scope: {
                source : '=',
				widgetTitle: '=',
				projectId: '=',
                widgetType: '=',
				autoUpload: '=',
                serviceId: '=',
				product: '=',
				allowTagging: '=',
				fileLimit: '=',
				accessLevel: '=',
				isDmdii: '=',
				allowVip: '='
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
					ajax.get(dataFactory.documentsUrl().getList, {
							parentType: 'PROJECT',
							parentId: $scope.projectId,
							docClass: 'SUPPORT',
							recent: 20
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
					$scope.tags = response.data;
				}

				var getTags = function(){
					if ($scope.isDmdii) {
						ajax.get(dataFactory.getDmdiiDocumentTags(), null, callbackTagFunction);
					} else {
						ajax.get(dataFactory.getDocumentTags(), null, callbackTagFunction);

					}
				}
				getTags();

				$scope.removeFile = function(item){
					if(item.file._removeLink){
						item.file._removeLink.click();
					}

					for(var i in $scope.source) {
						// if ($scope.source[i].id == item.id) {
						if ($scope.source[i].title == item.title) {
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

				$scope.users = [];
				$scope.selectedVips = {};
				$scope.searchText = '';

				$scope.updateSearchItems = function(text) {
					// var deferred = $q.defer();
					return ajax.get(dataFactory.getUserList(), {
						page: 0,
						pageSize: 500,
						displayName: text
					}).then(function(response) {
						return response.data.content;
					});
				}

				$scope.addVip = function(user, item) {
					if (!item.vips) {
						item.vips = [user];

					} else {
						item.vips.push(user);
					}

					toastModel.showToast('success', user.displayName + ' added to VIP list');
				}

				$scope.removeVip = function($index, item) {
					item.vips.splice($index, 1);
					toastModel.showToast('success', user.displayName + ' removed from VIP list');
				}
$scope.$watchCollection('selectedVips', function() {
	console.log($scope.selectedVips)
})
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
								if ($scope.accessLevel) {
									file.accessLevel = $scope.accessLevel[Object.keys($scope.accessLevel)[0]];
								}

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
										accessLevel: file_.accessLevel,
										vips: $scope.selectedVips[file_.id],
										tags: file_.tags,
										companiesWithAccess: file_.companiesWithAccess
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


				$scope.access = {};
				$scope.access.companies = [];
				$scope.access.queryCompanySearch = queryCompanySearch;

				var getAllCompanies = function() {
						ajax.get(dataFactory.companyURL().all, {}, function(response){
							$scope.access.companies = response.data;
						});
				}

				getAllCompanies();

				var createCompanyFilterFor = function(query) {
					var lowercaseQuery = angular.lowercase(query);
					return function filterFn(item) {
						return (item.name.toLowerCase().indexOf(lowercaseQuery) === 0);
					};
				}

				$scope.removeCompanyFromAccessList = function(companyToRemove){
					companyToRemove.selected = false;
				}

				$scope.access.companiesWithAccess = function(item){
					var companies = item.companies.filter(function(company){
						return company.selected
					})

					item.companiesWithAccess = companies.map(function(company){return company.id})

					return companies
				}

				$scope.addItemCompanyList = function(item) {
					item.companies = JSON.parse(JSON.stringify($scope.access.companies))
				}

				function queryCompanySearch(item, query) {
					var results = query ? item.companies.filter( createCompanyFilterFor(query) ) : []
					return results;
				}

			}
		};
	}])
	.controller('DirCtrl',['dir', '$mdDialog', '$scope', function(dir, $mdDialog, $scope){
			$scope.old=$scope.name=dir.name;
			$scope.action=!dir.name?"Create":"Update";

			$scope.create = function(){
				$mdDialog.hide($scope.name);
			}

			$scope.cancel = function(){
				$mdDialog.cancel();
			}

	}])
	.controller('DirMoveCtrl',['dirs', 'selectedDirs', '$mdDialog', '$scope', function(dirs, selectedDirs, $mdDialog, $scope){
			$scope.directories = dirs;

			$scope.opts = {
				isLeaf:function(){return false;}
			}

			$scope.filter = function(node){
				return !selectedDirs[node.id];
			}

			$scope.move = function(){
				$mdDialog.hide($scope.selectedFolder);
			}

			$scope.cancel = function(){
				$mdDialog.cancel();
			}

	}])
	.controller('DocumentsUploadCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
			$scope.cancel = function(){
		      $mdDialog.cancel();
		  }

		  $scope.uploadDocuments = function(){
		      $mdDialog.hide($scope.documents);
		  }
  }])
	.controller('DocDlCtrl', ['$scope', '$mdDialog', 'file', 'ajax', 'dataFactory', function ($scope, $mdDialog, file, ajax, dataFactory) {
			$scope.file=file;

			ajax.get(dataFactory.documentsUrl(file.baseDocId).versioned, {}, function(response){
				$scope.docs = response.data;
				$scope.currentDoc = response.data.slice(-1)[0];
			});

			$scope.ok = function(){
					$mdDialog.hide();
			}
	}])
	.controller('DocCtrl', ['$scope', '$mdDialog', 'file', 'ajax', 'dataFactory', function ($scope, $mdDialog, file, ajax, dataFactory) {
			$scope.file={};
			angular.copy(file,$scope.file);

			$scope.accessLevels = {
	      'Public': 'PUBLIC',
	      'Members': 'MEMBER',
	      'Admin': 'ADMIN'
			}

			$scope.search = function(query){
				return ajax.get(dataFactory.getUserList(), {
						page: 0,
						pageSize: 500,
						displayName: query
					}).then(function(response) {
						return response.data.content;
					});
			}

			$scope.addTag=function(tag){
				return {tagName:tag};
			}

			$scope.selectVip = function(vip){
				if(vip&&$.grep($scope.file.vips, function(inVip){return vip.id===inVip.id;}).length==0){
					$scope.file.vips.push(vip);
					$scope.query="";
				}
			}

			$scope.clean=function(){
				return angular.equals(file,$scope.file)&&(!$scope.newVersion||!$scope.newVersion.length);
			}

		  $scope.cancel = function(){
		      $mdDialog.cancel();
		  }

		  $scope.save = function(){
					if($scope.newVersion){
						$scope.file.newVersion=$scope.newVersion[0];
					}

					//$scope.file.vipIds=$.map($scope.file.vipIds,function(vip){return vip.id;});
					//$scope.file.tags=$.map($scope.file.tags,function(tag){return {tagName:tag};});

		      $mdDialog.hide($scope.file);
		  }
  }])
	.controller('DocShareCtrl', ['$scope', '$mdDialog', 'file', 'ajax', 'dataFactory', '$http', 'projectId', '$rootScope', function ($scope, $mdDialog, file, ajax, dataFactory, $http, projectId, $rootScope) {
			$scope.file=file;
			$scope.projectId = projectId;
			$scope.shareEmail = '';
      
		    $scope.shareType = '';
		    $scope.shareTypes = {
		        'dmc_member': 'DMC Member',
			    'organization_member' : 'Organization Member',
		        'external': 'Other (Email)'
		    };

			ajax.get(dataFactory.documentsUrl(file.baseDocId).versioned, {}, function(response){
				$scope.docs = response.data;
				$scope.currentDoc = response.data.slice(-1)[0];
			}, function(response) {
				$scope.docs = [{"id":737,"documentName":"testDocumentForSharing.pdf","documentUrl":"https://dmcupfinal.s3.amazonaws.com/PROJECT/105239982616451069408%40google.com/Documents/1493927058--891388-sanitized-testDocumentForSharing.pdf?AWSAccessKeyId=AKIAIZPP46XXRK6PBF6A&Expires=1496605458&Signature=Y9Mf5E3o0QKb7LxC%2FVt%2Fjl%2BAnYw%3D","parentType":"PROJECT","parentId":212,"ownerId":399,"ownerDisplayName":"Clay Taylor","tags":[],"modified":1493927048673,"expires":1496519048673,"docClass":"SUPPORT","accessLevel":"MEMBER","vips":[],"version":0,"directoryId":239,"baseDocId":737,"hasVersions":null}];
                $scope.currentDoc = $scope.docs.slice(-1)[0];
			});

			$scope.search = function(query){
				
				var getUsersUrl = '';
				
				switch ($scope.shareType) {
					case 'organization_member':
						getUsersUrl = dataFactory.getUsersByOrganization($rootScope.userData.companyId);
						break;
					default:
						getUsersUrl = dataFactory.getUserList();
						break;
				}
				
				return ajax.get(getUsersUrl, {
						page: 0,
						pageSize: 500,
						displayName: query
					}).then(function(response) {
						if (response.data.content) {
                            return response.data.content;
                        } else {
							return response.data;
						}
					});
			};

			$scope.share = function(){
					$mdDialog.hide({user:$scope.user, doc:$scope.currentDoc});
			}
	}])
	.filter('date', function() {
    return function(input) {
      return new Date(input).toString();
    };
  })
	.directive('uiWidgetWorkSpace', ['$parse', function ($parse) {
		return {
			restrict: 'E',
			scope:{
                folderId : "=",
                projectId : "="
          	},
			templateUrl: 'templates/components/ui-widgets/documents-workspace.html',
			controller: function($scope, $element, $attrs, dataFactory, ajax, $mdDialog, $q, fileUpload, $rootScope, toastModel) {

				$scope.selectedDirs = {};
				$scope.selectedFiles = {};

				$scope.addDir = function(ev){
					$mdDialog.show({
							controller: 'DirCtrl',
							templateUrl: 'templates/components/ui-widgets/workspace/directory-form.html',
							parent: angular.element(document.body),
							targetEvent: ev,
							locals: {
									dir: {}
							},
							clickOutsideToClose: false
					}).then(function(name){
							ajax.create(dataFactory.directoriesUrl().save
								, {name:name, parent:$scope.currentDir.id, children:[]}
								, function(resp){
										$scope.currentDir.children.push(resp.data);
							});
					});
				}

				$scope.editDir = function(dir,ev){
					$mdDialog.show({
							controller: 'DirCtrl',
							templateUrl: 'templates/components/ui-widgets/workspace/directory-form.html',
							parent: angular.element(document.body),
							targetEvent: ev,
							locals: {
									dir: dir
							},
							clickOutsideToClose: false
					}).then(function(name){
							dir.name=name;
							ajax.create(dataFactory.directoriesUrl().save
								, dir
								, function(resp){
									toastModel.showToast("success", "Folder updated.");
							});
					});
				}

				$scope.moveIt = function(ev){
						$mdDialog.show({
								controller: 'DirMoveCtrl',
								templateUrl: 'templates/components/ui-widgets/workspace/directory-tree.html',
								parent: angular.element(document.body),
								targetEvent: ev,
								locals: {
										dirs: {name:"wrap",id:"wrap",children:[$scope.directories]}
										, selectedDirs: $scope.selectedDirs
								},
								clickOutsideToClose: false
						}).then(function(target){
								//skip moving if they move to same dir
								if(target.id===$scope.currentDir.id)
									return;

								var promises = [];

								promises.concat($.map($scope.selectedDirs, function(v, k){
										var dir = $.grep($scope.currentDir.children, function(dir){return dir.id==k;})[0];
										dir.parent = target.id;
										return ajax.create(dataFactory.directoriesUrl().save, dir, function(resp){});
								}));

								promises.concat($.map($scope.selectedFiles, function(v, k){
									var file = $.grep($scope.dirFiles,function(file){return file.id==k;})[0];
									file.directoryId = target.id;
									return ajax.update(dataFactory.documentsUrl(k).update, file, function(resp){});
								}));

								$q.all(promises).then(function(resps){
										toastModel.showToast("success", "Documents/folders moved to '" + target.name + "'.");
										target.children = target.children.concat($.grep($scope.currentDir.children, function(child){return $scope.selectedDirs[child.id];}));
										$scope.currentDir.children = $.grep($scope.currentDir.children, function(child){return !$scope.selectedDirs[child.id];});
										$scope.dirFiles = $.grep($scope.dirFiles, function(file){return !$scope.selectedFiles[file.id];});
										resetSelection();
								});
						});
				}

				$scope.itemsSelected = function(){
					return kCount($scope.selectedDirs) + kCount($scope.selectedFiles) > 0;
				}

				$scope.allSelected = function(){
					return $scope.itemsSelected() &&
						(kCount($scope.selectedDirs) + kCount($scope.selectedFiles)
						== $scope.currentDir.children.length + $scope.dirFiles.length);
				}

				function kCount(obj){return Object.keys(obj).length;}

				$scope.toggle = function(){
					if($scope.allSelected()){
							resetSelection();
						}
					else{
						$scope.selectedDirs = $scope.currentDir.children.reduce(toggleReducer,{});
						$scope.selectedFiles = $scope.dirFiles.reduce(toggleReducer,{});
					}
				}

				function resetSelection(){
					$scope.selectedDirs={};
					$scope.selectedFiles={};
				}

				function toggleReducer(sel, dir){
					sel[dir.id]=true;
					return sel;
				}

				$scope.addFile = function(ev){
						$mdDialog.show({
								controller: 'DocumentsUploadCtrl as projectCtrl',
	            	templateUrl: 'templates/project/pages/documents-upload.html',
								parent: angular.element(document.body),
								targetEvent: ev,
								clickOutsideToClose: false
						}).then(function(documents){
		            var promises = {};

		            for(var i in documents){
		              (function(doc){
		                promises[doc.title] = fileUpload.uploadFileToUrl(doc.file, {}, doc.title + doc.type).then(function(response) {
		                    var docData = {
		                        parentId:$scope.projectId,
		                        parentType:"PROJECT",
		                        documentUrl: response.file.name,
		                        documentName: doc.title + doc.type,
		                        ownerId: $rootScope.userData.accountId,
		                        docClass: 'SUPPORT',
		                        accessLevel: doc.accessLevel||"MEMBER",
														directoryId: $scope.currentDir.id
		                    };

		                    return ajax.create(dataFactory.documentsUrl().save, docData, function(resp){});
		                });
		              })(documents[i]);
		            }

		            $q.all(promises).then(function(){
										toastModel.showToast("success", "Documents uploaded to '" + $scope.currentDir.name + "'.");
										$scope.changeDir($scope.currentDir.id);
                });
		        });
				}

				$scope.editFile = function(file, ev){
					$mdDialog.show({
							controller: 'DocCtrl',
							templateUrl: 'templates/components/ui-widgets/workspace/doc-form.html',
							parent: angular.element(document.body),
							targetEvent: ev,
							locals: {
									file: file
							},
							clickOutsideToClose: false
					}).then(function(doc){
						var newVersion = doc.newVersion;
						delete doc.newVersion;

						if(newVersion){
								fileUpload.uploadFileToUrl(newVersion.file, {}, newVersion.title + newVersion.type).then(function(response) {
										newVersion = {};
										angular.copy(file,newVersion);
										newVersion.documentUrl=response.file.name;
										return ajax.put(dataFactory.documentsUrl().save, newVersion, function(resp){});
								});
						}

						if(!angular.equals(file,doc)){
								ajax.update(dataFactory.documentsUrl(doc.id).update,doc,function(resp){
									toastModel.showToast("success", "Document updated.");
									$scope.changeDir($scope.currentDir.id);
								});
						}
					});
				}

				$scope.downloadFile = function(file,ev){
						$mdDialog.show({
								controller: 'DocDlCtrl',
								templateUrl: 'templates/components/ui-widgets/workspace/doc-download.html',
								parent: angular.element(document.body),
								targetEvent: ev,
								locals: {
										file: file
								},
								clickOutsideToClose: true
						}).then(function(){
							//handled in modal
						});
				}

				$scope.shareFile = function(file,ev){
						$mdDialog.show({
								controller: 'DocShareCtrl',
								templateUrl: 'templates/components/ui-widgets/workspace/doc-share.html',
								parent: angular.element(document.body),
								targetEvent: ev,
								locals: {
										file: file,
										projectId: $scope.projectId
								},
								clickOutsideToClose: true
						}).then(function(choice){
							ajax.create(dataFactory.documentsUrl(choice.doc.id, choice.user.id).share,{},function(resp){
								toastModel.showToast("success", file.documentName+" shared with "+user.displayName+".");
							});
						});
				}

				$scope.delete = function(ev){
					confirm('Are you sure you want to delete these files/folders?', ev).then(function(){
						var promises = [];

						promises.concat($.map($scope.selectedDirs, function(v, k){
								return ajax.delete(dataFactory.directoriesUrl(k).delete, {}, function(resp){});
						}));

						promises.concat($.map($scope.selectedFiles, function(v, k){
							return ajax.delete(dataFactory.documentsUrl(k).delete, {}, function(resp){});
						}));

						$q.all(promises).then(function(resps){
								toastModel.showToast("success", "Documents/folders deleted.");
								$scope.currentDir.children = $.grep($scope.currentDir.children, function(child){return !$scope.selectedDirs[child.id];});
								$scope.dirFiles = $.grep($scope.dirFiles, function(file){return !$scope.selectedFiles[file.id];});
								resetSelection();
						});
					})
				}

				function confirm(message,ev){
					var confirm = $mdDialog.confirm()
	          .title('Please Confirm')
	          .content(message)
	          .ariaLabel('Confirm')
	          .targetEvent(ev)
	          .ok('Ok')
	          .cancel('Cancel');

				    return $mdDialog.show(confirm)
				}

				function init(){
					if($scope.projectId){
						resetSelection();
						ajax.get(dataFactory.getProject($scope.projectId), {}, function(projResp) {
								$scope.projectHome = projResp.data.directoryId;
								ajax.get(dataFactory.directoriesUrl($scope.projectHome).get, {}, function(dirResp){
									$scope.directories = dirResp.data;
									$scope.changeDir($scope.directoryId||$scope.directories.id);
								}, function (response) {
                                    $scope.directories = {"id":239,"name":"home","parent":null,"children":[]};
                                    $scope.changeDir($scope.directoryId||$scope.directories.id);
								});
						});
					}
					else{
						//component error
					}
				}
				init();

				$scope.changeDir = function(targetId){
					$scope.path = getDirAndPath(targetId, $scope.directories);
					getFiles();
					resetSelection();
				}

				function getDirAndPath(targetId, directory){
					if(directory.id == targetId){
						$scope.currentDir = directory;
						return [{
							name:directory.name,
							id:directory.id
						}];
					}
					else{
						var childPath = [];
						for(var i = 0;i<directory.children.length;i++){
							childPath = getDirAndPath(targetId, directory.children[i]);
							if(childPath.length>0){
								childPath.unshift({
									name:directory.name,
									id:directory.id
								});
								return childPath;
							}
						}
						return childPath;
					}
				}

				function getFiles(){
					ajax.get(dataFactory.directoriesUrl($scope.currentDir.id).files, {}, function(docResp){
						$scope.dirFiles = docResp.data||[];
					}, function(response) {
						$scope.dirFiles = [{"id":737,"documentName":"testDocumentForSharing.pdf","documentUrl":"https://dmcupfinal.s3.amazonaws.com/PROJECT/105239982616451069408%40google.com/Documents/1493927058--891388-sanitized-testDocumentForSharing.pdf?AWSAccessKeyId=AKIAIZPP46XXRK6PBF6A&Expires=1496605458&Signature=Y9Mf5E3o0QKb7LxC%2FVt%2Fjl%2BAnYw%3D","parentType":"PROJECT","parentId":212,"ownerId":399,"ownerDisplayName":"Clay Taylor","tags":[],"modified":1493927048673,"expires":1496519048673,"docClass":"SUPPORT","accessLevel":"MEMBER","vips":[],"version":0,"directoryId":239,"baseDocId":737,"hasVersions":false}];
					});
				}
			}
		};
	}])
	.directive('uiWidgetDocumentsFolder', ['$parse', function ($parse) {
		return {
			restrict: 'E',
			scope:{
                documentsType : '=',
                typeId : '='
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
                    if($scope.documentsType == 'service'){
						url = dataFactory.documentsUrl().getList;
						requestData = {
							parentType: 'SERVICE',
							parentId: $scope.typeId,
							docClass: 'SUPPORT',
							recent: 5
						};
                    }else if($scope.documentsType == 'project'){
                        url = dataFactory.documentsUrl().getList;
                        requestData = {
							parentType: 'PROJECT',
							parentId: $scope.typeId,
							docClass: 'SUPPORT',
							recent: 20
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
